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


def zumbido(duracion=4.0):
    # Zumbido electrónico suave (bucle): tono grave con armónicos y leve modulación.
    t = t_(duracion)
    base = 2 * np.pi * 110 * t
    x = np.sin(base) + 0.45 * np.sin(2 * base) + 0.2 * np.sin(3 * base + 0.3)
    x *= 0.75 + 0.25 * np.sin(2 * np.pi * 6 * t)
    x += 0.15 * lowpass(rng.standard_normal(len(t)), 900)
    x = lowpass(x, 1800)
    nc = SR // 4
    rampa = np.linspace(0, 1, nc)
    x[:nc] = x[:nc] * rampa + x[-nc:] * (1 - rampa)
    return x[:-nc]


def bip():
    # "Bip" de escaneo: dos tonos cortos y limpios.
    salida = np.zeros(int(0.32 * SR))
    for k, (f, ini) in enumerate(((1760, 0.0), (2350, 0.13))):
        t = t_(0.11)
        tono = np.sin(2 * np.pi * f * t) * np.exp(-t * 18) * env_adsr(len(t), 0.004, 0.03)
        i0 = int(ini * SR)
        salida[i0:i0 + len(t)] += tono * (0.8 if k == 0 else 1)
    return salida


def candado():
    # Click de candado: golpe metálico corto + resorte.
    t = t_(0.25)
    golpe = rng.standard_normal(len(t)) * np.exp(-t * 90)
    metal = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, d in ((2900, 45), (4100, 60), (1250, 30)))
    segundo = np.zeros_like(t)
    i0 = int(0.06 * SR)
    segundo[i0:] = (rng.standard_normal(len(t) - i0) * np.exp(-t[: len(t) - i0] * 120)) * 0.6
    return lowpass(golpe * 0.7 + metal * 0.25 + segundo, 9000)


def microondas(duracion=4.0):
    # Zumbido del microondas: transformador a 100 Hz + ventilador (ruido filtrado). En bucle.
    t = t_(duracion)
    base = 2 * np.pi * 100 * t
    hum = np.sin(base) + 0.6 * np.sin(2 * base) + 0.3 * np.sin(3 * base) + 0.15 * np.sign(np.sin(base)) * 0.3
    ventilador = lowpass(lowpass(rng.standard_normal(len(t)), 700), 900) * 2.2
    x = lowpass(hum * 0.5 + ventilador, 2500) * (1 + 0.05 * np.sin(2 * np.pi * 0.5 * t))
    nc = SR // 4
    rampa = np.linspace(0, 1, nc)
    x[:nc] = x[:nc] * rampa + x[-nc:] * (1 - rampa)
    return x[:-nc]


def burbujeo(duracion=1.6):
    # Burbujas: chirridos cortos ascendentes en momentos aleatorios.
    salida = np.zeros(int(duracion * SR))
    for k in range(38):
        ini = rng.uniform(0, duracion - 0.08)
        d = rng.uniform(0.02, 0.05)
        t = t_(d)
        f0 = rng.uniform(350, 900)
        fase = 2 * np.pi * np.cumsum(f0 * (1 + 1.8 * t / d)) / SR
        b = np.sin(fase) * np.sin(np.pi * t / d) ** 2 * rng.uniform(0.3, 1)
        i0 = int(ini * SR)
        salida[i0:i0 + len(b)] += b
    e = np.ones_like(salida)
    e[: SR // 10] = np.linspace(0, 1, SR // 10)
    e[-SR // 4:] = np.linspace(1, 0, SR // 4)
    return lowpass(salida * e, 4000)


def ding():
    # Campanita del microondas: parciales inarmónicos con decaimiento largo.
    t = t_(1.8)
    x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * d) for f, a, d in ((1568, 1, 2.2), (3920, 0.35, 4), (4704, 0.2, 5.5), (2350, 0.15, 3)))
    golpe = rng.standard_normal(len(t)) * np.exp(-t * 250) * 0.3
    return x + golpe


def ping():
    # Ping de señal (tipo sonar): tono puro con eco suave.
    t = t_(1.2)
    tono = np.sin(2 * np.pi * 1320 * t) * np.exp(-t * 6)
    eco = np.zeros_like(tono)
    d = int(0.18 * SR)
    eco[d:] = tono[:-d] * 0.35
    return (tono + eco) * env_adsr(len(t), 0.003, 0.2)


def brillo():
    # Brillo: arpegio de campanitas agudas, muy suave.
    salida = np.zeros(int(1.4 * SR))
    for k, f in enumerate((2093, 2637, 3136, 4186)):
        t = t_(1.0)
        nota_ = sum(np.sin(2 * np.pi * f * m * t) * a for m, a in ((1, 1), (2.01, 0.2))) * np.exp(-t * 5)
        i0 = int(k * 0.09 * SR)
        salida[i0:i0 + len(t)] += nota_ * (1 - 0.15 * k)
    return salida


def interferencia():
    # Zumbido de interferencia GSM ("ti ti ti"): ráfagas a ~217 Hz con armónicos ásperos.
    salida = np.zeros(int(1.6 * SR))
    for k in range(3):
        i0 = int(k * 0.42 * SR)
        t = t_(0.28)
        portadora = np.sign(np.sin(2 * np.pi * 217 * t)) * 0.5 + np.sin(2 * np.pi * 434 * t) * 0.3
        rafaga = portadora * (np.sin(2 * np.pi * 34 * t) > 0) * env_adsr(len(t), 0.005, 0.04)
        salida[i0:i0 + len(t)] += rafaga
    return lowpass(salida, 3500)


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
    # Efectos del Reel de Face ID (al final, para no cambiar la secuencia aleatoria de lo anterior).
    guardar("sfx-zumbido.wav", zumbido())
    guardar("sfx-bip.wav", bip())
    guardar("sfx-candado.wav", candado())
    # Efectos del Reel del microondas.
    guardar("sfx-microondas.wav", microondas())
    guardar("sfx-burbujeo.wav", burbujeo())
    guardar("sfx-ding.wav", ding())
    # Efectos de los Reels de GPS y cielo.
    guardar("sfx-ping.wav", ping())
    guardar("sfx-brillo.wav", brillo())
    # Efecto del Reel del modo avión.
    guardar("sfx-interferencia.wav", interferencia())
    print("Audio generado en", os.path.abspath(OUT))
