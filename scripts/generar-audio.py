"""Genera la música de fondo y los efectos de sonido del Reel (síntesis propia, sin licencias).

Uso:  python3 scripts/generar-audio.py
Salida: public/audio/*.wav  (y musica-suave.mp3 si hay ffmpeg)
"""
import os
import subprocess
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "audio")
rng = np.random.default_rng(7)


def guardar(nombre, x, estereo=False):
    x = np.asarray(x, dtype=np.float64)
    if estereo and x.ndim == 1:
        x = np.stack([x, x], axis=1)
    pico = np.max(np.abs(x)) or 1.0
    x = x / pico * 0.89
    data = (x * 32767).astype(np.int16)
    ruta = os.path.join(OUT, nombre)
    with wave.open(ruta, "wb") as w:
        w.setnchannels(2 if x.ndim == 2 else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    return ruta


def t_(seg):
    return np.arange(int(seg * SR)) / SR


def lowpass(x, fc):
    # Filtro de un polo, suficiente para suavizar ruido.
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def bandpass_sweep(x, f_ini, f_fin, q=1.4):
    # State-variable filter con frecuencia de corte variable.
    n = len(x)
    fc = np.geomspace(f_ini, f_fin, n) if np.isscalar(f_ini) else f_ini
    low = band = 0.0
    y = np.zeros(n)
    for i in range(n):
        f = 2 * np.sin(np.pi * fc[i] / SR)
        high = x[i] - low - band / q
        band += f * high
        low += f * band
        y[i] = band
    return y


def env_adsr(n, a, r):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


# ---------- Música: pad ambiental + arpegio suave (~44 s) ----------
def nota(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def musica(duracion=44.0):
    t = t_(duracion)
    izq = np.zeros_like(t)
    der = np.zeros_like(t)
    acordes = [[57, 60, 64, 71], [53, 57, 60, 64], [48, 55, 59, 64], [55, 59, 62, 66]]  # Am9 Fmaj7 Cmaj7 G
    largo = 4.0
    for k in range(int(np.ceil(duracion / largo))):
        ac = acordes[k % 4]
        i0 = int(k * largo * SR)
        n = min(int((largo + 1.5) * SR), len(t) - i0)
        if n <= 0:
            break
        tt = np.arange(n) / SR
        e = env_adsr(n, 1.2, 1.8)
        for j, m in enumerate(ac):
            f = nota(m)
            for det, lado in ((-0.18, 0), (0.18, 1)):
                s = np.sin(2 * np.pi * (f + det) * tt) + 0.25 * np.sin(2 * np.pi * 2 * (f + det) * tt)
                (izq if lado == 0 else der)[i0:i0 + n] += s * e * 0.07
        # Bajo
        fb = nota(ac[0] - 12)
        izq[i0:i0 + n] += np.sin(2 * np.pi * fb * tt) * e * 0.12
        der[i0:i0 + n] += np.sin(2 * np.pi * fb * tt) * e * 0.12
        # Arpegio en corcheas (tempo 90)
        paso = 60 / 90 / 2
        for p in range(int(largo / paso)):
            m = ac[[0, 2, 1, 3, 2, 1, 3, 2][p % 8]] + 12
            j0 = i0 + int(p * paso * SR)
            nn = min(int(0.9 * SR), len(t) - j0)
            if nn <= 0:
                continue
            ttt = np.arange(nn) / SR
            s = np.sin(2 * np.pi * nota(m) * ttt) * np.exp(-ttt * 5.5) * 0.06
            pan = 0.5 + 0.35 * np.sin(p * 1.3)
            izq[j0:j0 + nn] += s * (1 - pan)
            der[j0:j0 + nn] += s * pan
    # Aire: ruido muy filtrado
    aire = lowpass(rng.standard_normal(len(t)), 600) * 0.03
    izq += aire
    der += np.roll(aire, 2000)
    fade = np.ones_like(t)
    fade[: SR * 2] = np.linspace(0, 1, SR * 2)
    fade[-SR * 2:] = np.linspace(1, 0, SR * 2)
    return np.stack([lowpass(izq, 5000) * fade, lowpass(der, 5000) * fade], axis=1)


# ---------- Efectos ----------
def motor(duracion=6.0):
    t = t_(duracion)
    ruido = lowpass(lowpass(rng.standard_normal(len(t)), 260), 420)
    rumble = 0.6 * np.sin(2 * np.pi * 72 * t + 0.6 * np.sin(2 * np.pi * 0.4 * t))
    silbido = bandpass_sweep(rng.standard_normal(len(t)), np.full(len(t), 2400.0), None, q=6) * 0.25
    x = ruido * 3 + rumble * 0.25 + silbido
    x *= 1 + 0.15 * np.sin(2 * np.pi * 0.33 * t)
    # Bucle sin costura: crossfade de 0.5 s
    nc = SR // 2
    rampa = np.linspace(0, 1, nc)
    x[:nc] = x[:nc] * rampa + x[-nc:] * (1 - rampa)
    return x[:-nc]


def estirar():
    t = t_(1.1)
    f = 140 + 520 * (1 - np.exp(-t * 3.2))
    vib = 1 + 0.06 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 2)
    fase = 2 * np.pi * np.cumsum(f * vib) / SR
    tono = np.sin(fase) + 0.4 * np.sin(2 * fase) + 0.2 * np.sin(3 * fase)
    goma = bandpass_sweep(rng.standard_normal(len(t)), np.geomspace(300, 1800, len(t)), None, q=3) * 0.5
    e = env_adsr(len(t), 0.03, 0.5) * (0.6 + 0.4 * np.exp(-t * 1.5))
    return lowpass((tono * 0.5 + goma) * e, 3500)


def whoosh():
    t = t_(0.6)
    n = len(t)
    centro = np.concatenate([np.geomspace(350, 3200, n // 2), np.geomspace(3200, 500, n - n // 2)])
    x = bandpass_sweep(rng.standard_normal(n), centro, None, q=1.2)
    e = np.sin(np.pi * np.clip(t / 0.6, 0, 1)) ** 2
    return x * e


def pop():
    t = t_(0.14)
    f = 1100 * np.exp(-t * 18) + 380
    fase = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(fase) * np.exp(-t * 34)


def tap():
    t = t_(0.09)
    clic = rng.standard_normal(len(t)) * np.exp(-t * 160)
    cuerpo = np.sin(2 * np.pi * 520 * t) * np.exp(-t * 55)
    return lowpass(clic * 0.6 + cuerpo, 6000)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    guardar("sfx-motor.wav", motor())
    guardar("sfx-estirar.wav", estirar())
    guardar("sfx-whoosh.wav", whoosh())
    guardar("sfx-pop.wav", pop())
    guardar("sfx-tap.wav", tap())
    ruta = guardar("musica-suave.wav", musica())
    try:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", ruta, "-b:a", "160k",
                        os.path.join(OUT, "musica-suave.mp3")], check=True)
        os.remove(ruta)
    except (FileNotFoundError, subprocess.CalledProcessError):
        pass
    print("Audio generado en", os.path.abspath(OUT))
