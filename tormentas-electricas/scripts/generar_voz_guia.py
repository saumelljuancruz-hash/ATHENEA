"""Genera la voz en off del reel y la línea de tiempo del video.

Lee voiceover/guion.json, sintetiza cada frase por separado y escribe:
  - public/voiceover/voz-guia.mp3   (audio completo)
  - src/timeline.json               (inicio/fin de cada pieza, frase y palabra)

Las palabras se reparten dentro de cada frase según sus sílabas, así los
subtítulos quedan sincronizados sin necesitar una transcripción.

Uso con Piper (local, gratis):
  python scripts/generar_voz_guia.py --model ruta/es_AR-daniela-high.onnx

Uso con ElevenLabs (necesita ELEVENLABS_API_KEY y créditos):
  python scripts/generar_voz_guia.py --elevenlabs-voice 34RuvBpKQDapycxZnrDJ
"""

import argparse
import json
import os
import re
import subprocess
import tempfile
import urllib.request
import wave
from pathlib import Path
from typing import Callable

import numpy as np

FPS = 30
LEAD_IN_S = 0.12
SENTENCE_GAP_S = 0.18
PIECE_GAP_S = 0.42
TAIL_S = 1.6

# Cómo se pronuncia cada token que no se lee tal cual está escrito.
SPOKEN = {
    "300": "trescientos",
    "15": "quince",
    "100": "cien",
    "KM/H": "kilómetros por hora",
    "100.000": "cien mil",
    "30.000": "treinta mil",
    "@nadietelo.explico": "Nadie Te Lo Explico",
}

PAUSE_WEIGHT = {",": 0.7, ":": 1.0, "…": 1.4}
VOWEL_GROUPS = re.compile(r"[aeiouáéíóúü]+", re.IGNORECASE)
LOWER = re.compile(r"[a-záéíóúñü]")


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


def trim_silence(samples: np.ndarray, rate: int) -> np.ndarray:
    threshold = 0.02 * np.abs(samples).max()
    loud = np.where(np.abs(samples) > threshold)[0]
    if len(loud) == 0:
        return samples
    pad = int(0.03 * rate)
    return samples[max(0, loud[0] - pad) : min(len(samples), loud[-1] + pad)]


def piper_synth(model: str, length_scale: float) -> tuple[Callable[[str], np.ndarray], int]:
    from piper import PiperVoice, SynthesisConfig

    voice = PiperVoice.load(model)
    config = SynthesisConfig(length_scale=length_scale, noise_scale=0.6, noise_w_scale=0.7)

    def synth(text: str) -> np.ndarray:
        return np.concatenate([c.audio_int16_array for c in voice.synthesize(text, syn_config=config)])

    return synth, voice.config.sample_rate


def elevenlabs_synth(voice_id: str, model_id: str) -> tuple[Callable[[str], np.ndarray], int]:
    rate = 44100
    key = os.environ["ELEVENLABS_API_KEY"]

    def synth(text: str) -> np.ndarray:
        request = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            data=json.dumps({"text": text, "model_id": model_id}).encode(),
            headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        )
        with urllib.request.urlopen(request) as response:
            mp3 = response.read()
        pcm = subprocess.run(
            ["ffmpeg", "-loglevel", "error", "-i", "pipe:0", "-f", "s16le", "-ac", "1", "-ar", str(rate), "pipe:1"],
            input=mp3,
            capture_output=True,
            check=True,
        ).stdout
        return np.frombuffer(pcm, dtype=np.int16)

    return synth, rate


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser()
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--model", help="modelo .onnx de Piper")
    source.add_argument("--elevenlabs-voice", help="voice_id de ElevenLabs")
    parser.add_argument("--elevenlabs-model", default="eleven_multilingual_v2")
    parser.add_argument("--length-scale", type=float, default=0.94)
    args = parser.parse_args()

    script = json.loads((root / "voiceover" / "guion.json").read_text())
    if args.model:
        synth, rate = piper_synth(args.model, args.length_scale)
    else:
        synth, rate = elevenlabs_synth(args.elevenlabs_voice, args.elevenlabs_model)

    audio: list[np.ndarray] = [np.zeros(int(LEAD_IN_S * rate), dtype=np.int16)]
    t = LEAD_IN_S
    pieces = []
    captions = []

    for p_index, piece in enumerate(script["pieces"]):
        piece_start = t
        sentences = []
        for s_index, sentence in enumerate(piece["sentences"]):
            samples = trim_silence(synth(spoken_sentence(sentence["text"])), rate)
            duration = len(samples) / rate
            audio.append(samples)

            tokens = sentence["text"].split()
            weights = [syllables(spoken_form(tok)) for tok in tokens]
            pauses = [PAUSE_WEIGHT.get(tok[-1], 0.0) if i < len(tokens) - 1 else 0.0 for i, tok in enumerate(tokens)]
            total = sum(weights) + sum(pauses)
            cursor = t
            for i, tok in enumerate(tokens):
                word_len = duration * weights[i] / total
                captions.append(
                    {
                        "text": (" " if captions else "") + tok,
                        "startMs": round(cursor * 1000),
                        "endMs": round((cursor + word_len) * 1000),
                        "timestampMs": round((cursor + word_len / 2) * 1000),
                        "confidence": None,
                        "keyword": is_keyword(tok),
                        "handle": strip_punct(tok).startswith("@"),
                        "pageBreakAfter": i == len(tokens) - 1 or tok[-1] in ",:…",
                    }
                )
                cursor += word_len + duration * pauses[i] / total

            sentences.append(
                {
                    "text": sentence["text"],
                    "start": round((t - piece_start) * FPS),
                    "end": round((t + duration - piece_start) * FPS),
                }
            )
            t += duration
            last_sentence = s_index == len(piece["sentences"]) - 1
            gap = 0.0 if last_sentence else SENTENCE_GAP_S
            audio.append(np.zeros(int(gap * rate), dtype=np.int16))
            t += gap

        last_piece = p_index == len(script["pieces"]) - 1
        gap = TAIL_S if last_piece else PIECE_GAP_S
        audio.append(np.zeros(int(gap * rate), dtype=np.int16))
        t += gap
        pieces.append({"id": piece["id"], "startSeconds": piece_start, "sentences": sentences})

    # Cada pieza dura hasta que empieza la siguiente, en frames enteros.
    total_frames = round(t * FPS)
    starts = [0] + [round(p["startSeconds"] * FPS) for p in pieces[1:]]
    for i, piece in enumerate(pieces):
        piece["from"] = starts[i]
        piece["durationInFrames"] = (starts[i + 1] if i + 1 < len(starts) else total_frames) - starts[i]
        offset = round(piece.pop("startSeconds") * FPS) - starts[i]
        for s in piece["sentences"]:
            s["start"] += offset
            s["end"] += offset

    out_audio = root / "public" / "voiceover" / "voz-guia.mp3"
    out_audio.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        wav_path = Path(tmp) / "voz.wav"
        with wave.open(str(wav_path), "wb") as wav:
            wav.setnchannels(1)
            wav.setsampwidth(2)
            wav.setframerate(rate)
            wav.writeframes(np.concatenate(audio).tobytes())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav_path), "-ar", "44100", "-b:a", "192k", str(out_audio)],
            check=True,
        )

    timeline = {"fps": FPS, "durationInFrames": total_frames, "pieces": pieces, "captions": captions}
    (root / "src" / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2) + "\n")
    print(f"Duración total: {t:.2f} s ({total_frames} frames)")
    for piece in pieces:
        print(f"  {piece['id']:<8} desde {piece['from'] / FPS:6.2f} s  dura {piece['durationInFrames'] / FPS:5.2f} s")


if __name__ == "__main__":
    main()
