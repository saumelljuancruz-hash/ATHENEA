# Reel · El hackeo a Binance

Reel vertical 9:16 (1080 × 1920, 30 fps, 57,6 s) para **@nadietelo.explico** sobre el robo de US$ 6.300 millones a Binance del 29 de octubre de 2026, hecho con Remotion y motion graphics en SVG/CSS. El guion completo, los prompts visuales, los ganchos alternativos, la descripción para Instagram, el chequeo de reglas y las fuentes de cada dato están en [GUION.md](GUION.md). Los datos son al 31/10/2026.

## Comandos

```console
npm i
npm run dev                         # Remotion Studio para previsualizar
npx remotion render BinanceHackeo out/binance-hackeo.mp4
```

El archivo listo para subir está en `entrega/binance-hackeo.mp4`: es el render de Remotion con el audio llevado a −14 LUFS (el nivel habitual de Instagram y TikTok) con `loudnorm` en dos pasadas, sin recodificar el video. La portada sugerida está en `entrega/portada.jpg`.

En Studio, la composición `BinanceHackeo` es el reel completo, y la carpeta `Escenas` tiene cada pieza por separado.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `voiceover/guion.json` | Texto de la voz en off, por pieza y por frase. Las palabras clave van en MAYÚSCULAS. |
| `scripts/generar_voz.py` | Alinea la toma de la voz en off y escribe `public/voiceover/voz-en-off.mp3` y `src/timeline.json`. |
| `scripts/mapa-corea.mjs` | Proyecta la península de Corea desde Natural Earth y genera `src/korea.json`. |
| `src/timeline.json` | Generado: dónde empieza cada pieza, cada frase y cada palabra. Las escenas y los subtítulos se sincronizan con esto. |
| `src/Reel.tsx` | Une las 8 escenas, los subtítulos, la marca de agua, la voz y el colchón musical. |
| `src/scenes/` | Una escena por pieza del guion (gancho, intro, cuerpo 1, bucle, cuerpo 2, bucle, final, CTA). |
| `src/components/Crypto.tsx` | Monedas, la pantalla del exchange, laptop, servidor de firmas, huella, cronómetro, encapuchado, mapa de Corea, hielo, candado, barra de progreso y el ícono de enviar. |
| `src/components/sfx.ts` | Volumen de cada efecto, calculado para que quede al menos 8 dB por debajo de la voz. |
| `public/sfx/` | Efectos generados con ffmpeg (toque, whoosh, ding, chispa y colchón musical). |
| `public/logo.png`, `public/logo-icono.png` | Logo de la cuenta para la tarjeta del CTA y la marca de agua. |

## Voz en off

La voz es **Fernando Martínez** de ElevenLabs (modelo `eleven_v4`, voice_id `dlGxemPxFMTY7iXagmOj`), generada como una sola toma con el texto de `voiceover/guion.json` y acelerada un 6 % para que el reel no pase de 60 s. La toma se transcribe con faster-whisper y cada palabra del guion se alinea con lo que se escucha, así los subtítulos y los cortes de escena caen justo.

```console
pip install faster-whisper
python scripts/generar_voz.py --audio toma.mp3 --tempo 1.06
```
