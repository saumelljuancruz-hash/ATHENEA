"""Genera la voz en off del reel y la línea de tiempo del video.

Lee voiceover/guion.json y escribe:
  - public/voiceover/voz-en-off.mp3   (audio completo)
  - src/timeline.json                 (inicio/fin de cada pieza, frase y palabra)

Hay tres formas de conseguir la voz:

  # Piper (local, gratis): sintetiza frase por frase y reparte las palabras
  # de cada frase según sus sílabas.
  python scripts/generar_voz.py --model ruta/es_AR-daniela-high.onnx

  # ElevenLabs por API (necesita ELEVENLABS_API_KEY y créditos), frase por frase.
  python scripts/generar_voz.py --elevenlabs-voice dlGxemPxFMTY7iXagmOj

  # Una locución ya hecha (una toma de ElevenLabs o tu voz grabada): se
  # transcribe con faster-whisper y cada palabra del guion se alinea con la
  # palabra transcripta. --tempo la acelera sin cambiar el tono.
  python scripts/generar_voz.py --audio toma.mp3 --tempo 1.05
"""

import argparse
import difflib
import json
import os
import re
import subprocess
import tempfile
import unicodedata
import urllib.request
import wave
from pathlib import Path
from typing import Callable

import numpy as np

FPS = 30
RATE = 44100
LEAD_IN_S = 0.12
SENTENCE_GAP_S = 0.18
PIECE_GAP_S = 0.42
TAIL_S = 1.6

# Cómo se pronuncia cada token que no se lee tal cual está escrito.
SPOKEN = {
    "6": "seis",
    "2": "dos",
    "1.175": "mil ciento setenta y cinco",
    "5": "cinco",
    "44%": "cuarenta y cuatro por ciento",
    "50": "cincuenta",
    "57%": "cincuenta y siete por ciento",
    "@nadietelo.explico": "Nadie Te Lo Explico",
}

PAUSE_WEIGHT = {",": 0.7, ":": 1.0, "…": 1.4}
VOWEL_GROUPS = re.compile(r"[aeiouáéíóúü]+", re.IGNORECASE)
LOWER = re.compile(r"[a-záéíóúñü]")

# Una palabra del guion con su lugar (pieza, frase) y cuándo se dice, en segundos.
Token = dict


def strip_punct(token: str) -> str:
    return token.strip(".,:;…¿?¡!")


def spoken_form(token: str) -> str:
    core = strip_punct(token)
    return SPOKEN.get(core, core.lower())


def syllables(text: str) -> int:
    return max(1, len(VOWEL_GROUPS.findall(text)))


def is_keyword(token: str) -> bool:
    core = strip_punct(token)
    if core.startswith("@"):
        return False
    letters = re.sub(r"[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]", "", core)
    has_digit = any(c.isdigit() for c in core)
    return not LOWER.search(core) and (has_digit or len(letters) >= 2)


def spoken_sentence(text: str) -> str:
    out = []
    for token in text.split():
        core = strip_punct(token)
        out.append(token.replace(core, spoken_form(token)) if core else token)
    return " ".join(out)


def normalize(word: str) -> str:
    plain = unicodedata.normalize("NFD", word.lower())
    return "".join(c for c in plain if c.isalnum() and unicodedata.category(c) != "Mn")


def script_tokens(script: dict) -> list[Token]:
    return [
        {"piece": p, "sentence": s, "text": tok}
        for p, piece in enumerate(script["pieces"])
        for s, sentence in enumerate(piece["sentences"])
        for tok in sentence["text"].split()
    ]


def spread(tokens: list[Token], start: float, end: float) -> None:
    """Reparte [start, end] entre los tokens según sus sílabas y pausas."""
    weights = [syllables(spoken_form(t["text"])) for t in tokens]
    pauses = [PAUSE_WEIGHT.get(t["text"][-1], 0.0) if i < len(tokens) - 1 else 0.0 for i, t in enumerate(tokens)]
    total = sum(weights) + sum(pauses)
    cursor = start
    for t, w, pause in zip(tokens, weights, pauses):
        t["start"] = cursor
        t["end"] = cursor + (end - start) * w / total
        cursor = t["end"] + (end - start) * pause / total


def trim_silence(samples: np.ndarray, rate: int) -> np.ndarray:
    threshold = 0.02 * np.abs(samples).max()
    loud = np.where(np.abs(samples) > threshold)[0]
    if len(loud) == 0:
        return samples
    pad = int(0.03 * rate)
    return samples[max(0, loud[0] - pad) : min(len(samples), loud[-1] + pad)]


def decode(source: str | bytes, rate: int, filters: str | None = None, fmt: str = "s16le") -> np.ndarray:
    cmd = ["ffmpeg", "-loglevel", "error", "-i", "pipe:0" if isinstance(source, bytes) else source]
    if filters:
        cmd += ["-af", filters]
    cmd += ["-f", fmt, "-ac", "1", "-ar", str(rate), "pipe:1"]
    pcm = subprocess.run(cmd, input=source if isinstance(source, bytes) else None, capture_output=True, check=True).stdout
    return np.frombuffer(pcm, dtype=np.int16 if fmt == "s16le" else np.float32)


def piper_synth(model: str, length_scale: float) -> tuple[Callable[[str], np.ndarray], int]:
    from piper import PiperVoice, SynthesisConfig

    voice = PiperVoice.load(model)
    config = SynthesisConfig(length_scale=length_scale, noise_scale=0.6, noise_w_scale=0.7)

    def synth(text: str) -> np.ndarray:
        return np.concatenate([c.audio_int16_array for c in voice.synthesize(text, syn_config=config)])

    return synth, voice.config.sample_rate


def elevenlabs_synth(voice_id: str, model_id: str) -> tuple[Callable[[str], np.ndarray], int]:
    key = os.environ["ELEVENLABS_API_KEY"]

    def synth(text: str) -> np.ndarray:
        request = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            data=json.dumps({"text": text, "model_id": model_id}).encode(),
            headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        )
        with urllib.request.urlopen(request) as response:
            return decode(response.read(), RATE)

    return synth, RATE


def synthesize(script: dict, synth: Callable[[str], np.ndarray], rate: int) -> tuple[np.ndarray, list[Token]]:
    """Sintetiza frase por frase, con silencios entre frases y entre piezas."""
    tokens = script_tokens(script)
    audio: list[np.ndarray] = [np.zeros(int(LEAD_IN_S * rate), dtype=np.int16)]
    t = LEAD_IN_S
    for p, piece in enumerate(script["pieces"]):
        for s, sentence in enumerate(piece["sentences"]):
            samples = trim_silence(synth(spoken_sentence(sentence["text"])), rate)
            duration = len(samples) / rate
            spread([tok for tok in tokens if tok["piece"] == p and tok["sentence"] == s], t, t + duration)
            audio.append(samples)
            t += duration
            gap = SENTENCE_GAP_S if s < len(piece["sentences"]) - 1 else PIECE_GAP_S
            if p < len(script["pieces"]) - 1 or s < len(piece["sentences"]) - 1:
                audio.append(np.zeros(int(gap * rate), dtype=np.int16))
                t += gap
    return np.concatenate(audio), tokens


def align_recording(script: dict, path: str, tempo: float) -> tuple[np.ndarray, int, list[Token]]:
    """Alinea las palabras del guion con una locución ya grabada."""
    from faster_whisper import WhisperModel

    filters = "silenceremove=start_periods=1:start_threshold=-45dB"
    if tempo != 1.0:
        filters += f",atempo={tempo}"
    audio = decode(path, RATE, filters)
    audio = np.concatenate([np.zeros(int(0.05 * RATE), dtype=np.int16), trim_silence(audio, RATE)])

    model = WhisperModel("small", device="cpu", compute_type="int8")
    with tempfile.TemporaryDirectory() as tmp:
        wav_path = Path(tmp) / "voz.wav"
        write_wav(wav_path, audio, RATE)
        pcm16k = decode(str(wav_path), 16000, fmt="f32le")
    segments, _ = model.transcribe(pcm16k, language="es", word_timestamps=True, beam_size=5)
    heard = [(w.word.strip(), w.start, w.end) for seg in segments for w in seg.words]

    tokens = script_tokens(script)
    ours = [normalize(t["text"]) for t in tokens]
    theirs = [normalize(w) for w, _, _ in heard]
    matcher = difflib.SequenceMatcher(None, ours, theirs, autojunk=False)
    for op, i1, i2, j1, j2 in matcher.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                tokens[i1 + k]["start"], tokens[i1 + k]["end"] = heard[j1 + k][1], heard[j1 + k][2]
        elif op == "replace":
            # "100.000" ↔ "100 mil", "KM/H" ↔ "kilómetros por hora", "a saltos" ↔ "asaltos"…
            spread(tokens[i1:i2], heard[j1][1], heard[j2 - 1][2])

    # Las palabras que la transcripción no oyó quedan entre sus vecinas.
    i = 0
    while i < len(tokens):
        if "start" in tokens[i]:
            i += 1
            continue
        j = i
        while j < len(tokens) and "start" not in tokens[j]:
            j += 1
        start = tokens[i - 1]["end"] if i > 0 else 0.0
        end = tokens[j]["start"] if j < len(tokens) else len(audio) / RATE
        spread(tokens[i:j], start, max(end, start + 0.1 * (j - i)))
        i = j
    return audio, RATE, tokens


def write_wav(path: Path, audio: np.ndarray, rate: int) -> None:
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(audio.tobytes())


def write_outputs(root: Path, script: dict, audio: np.ndarray, rate: int, tokens: list[Token]) -> None:
    total_seconds = len(audio) / rate + TAIL_S
    total_frames = round(total_seconds * FPS)

    captions = []
    for i, tok in enumerate(tokens):
        last_in_sentence = i == len(tokens) - 1 or tokens[i + 1]["sentence"] != tok["sentence"] or tokens[i + 1]["piece"] != tok["piece"]
        captions.append(
            {
                "text": (" " if i else "") + tok["text"],
                "startMs": round(tok["start"] * 1000),
                "endMs": round(tok["end"] * 1000),
                "timestampMs": round((tok["start"] + tok["end"]) / 2 * 1000),
                "confidence": None,
                "keyword": is_keyword(tok["text"]),
                "handle": strip_punct(tok["text"]).startswith("@"),
                "pageBreakAfter": last_in_sentence or tok["text"][-1] in ",:…",
            }
        )

    # Cada pieza empieza cuando arranca su primera palabra y dura hasta la siguiente.
    pieces = []
    for p, piece in enumerate(script["pieces"]):
        own = [t for t in tokens if t["piece"] == p]
        start_frame = 0 if p == 0 else round(own[0]["start"] * FPS)
        sentences = []
        for s, sentence in enumerate(piece["sentences"]):
            words = [t for t in own if t["sentence"] == s]
            sentences.append(
                {
                    "text": sentence["text"],
                    "start": round(words[0]["start"] * FPS) - start_frame,
                    "end": round(words[-1]["end"] * FPS) - start_frame,
                }
            )
        pieces.append({"id": piece["id"], "sentences": sentences, "from": start_frame})
    for i, piece in enumerate(pieces):
        end = pieces[i + 1]["from"] if i + 1 < len(pieces) else total_frames
        piece["durationInFrames"] = end - piece["from"]

    out_audio = root / "public" / "voiceover" / "voz-en-off.mp3"
    out_audio.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav_path = Path(tmp) / "voz.wav"
        write_wav(wav_path, audio, rate)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav_path), "-ar", "44100", "-b:a", "192k", str(out_audio)],
            check=True,
        )

    timeline = {"fps": FPS, "durationInFrames": total_frames, "pieces": pieces, "captions": captions}
    (root / "src" / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2) + "\n")
    print(f"Duración total: {total_seconds:.2f} s ({total_frames} frames)")
    for piece in pieces:
        print(f"  {piece['id']:<8} desde {piece['from'] / FPS:6.2f} s  dura {piece['durationInFrames'] / FPS:5.2f} s")


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser()
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--model", help="modelo .onnx de Piper")
    source.add_argument("--elevenlabs-voice", help="voice_id de ElevenLabs")
    source.add_argument("--audio", help="locución ya grabada (mp3, wav…)")
    parser.add_argument("--elevenlabs-model", default="eleven_multilingual_v2")
    parser.add_argument("--length-scale", type=float, default=0.94)
    parser.add_argument("--tempo", type=float, default=1.0, help="velocidad de --audio (1.05 = 5 %% más rápido)")
    args = parser.parse_args()

    script = json.loads((root / "voiceover" / "guion.json").read_text())
    if args.audio:
        audio, rate, tokens = align_recording(script, args.audio, args.tempo)
    else:
        synth, rate = piper_synth(args.model, args.length_scale) if args.model else elevenlabs_synth(args.elevenlabs_voice, args.elevenlabs_model)
        audio, tokens = synthesize(script, synth, rate)
    write_outputs(root, script, audio, rate, tokens)


if __name__ == "__main__":
    main()
