import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
model = WhisperModel("small", device="cpu", compute_type="int8")
for path in sys.argv[1:]:
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", "16000", "pipe:1"], capture_output=True, check=True).stdout
    audio = np.frombuffer(pcm, dtype=np.float32)
    segments, info = model.transcribe(audio, language="es", word_timestamps=True, vad_filter=False, beam_size=5)
    words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for seg in segments for w in seg.words]
    out = path.rsplit(".", 1)[0] + ".words.json"
    json.dump(words, open(out, "w"), ensure_ascii=False)
    print(path.rsplit("/", 1)[-1], len(words), "palabras")
    print(" ".join(w["w"] for w in words))
