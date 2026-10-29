# Reel · Por qué te ves distinto en el espejo que en la cámara

Reel vertical 9:16 (1080 × 1920, 30 fps, 56 s) para **@nadietelo.explico**, hecho con Remotion y motion graphics en SVG/CSS. El guion completo, los prompts visuales, los ganchos alternativos, la descripción para Instagram y el chequeo de reglas están en [GUION.md](GUION.md).

## Comandos

```console
npm i
npm run dev                         # Remotion Studio para previsualizar
npx remotion render EspejoVsCamara out/espejo-vs-camara.mp4
```

El archivo listo para subir está en `entrega/espejo-vs-camara.mp4`: es el render de Remotion con el audio llevado a −14 LUFS (el nivel habitual de Instagram y TikTok), sin recodificar el video:

```console
ffmpeg -i out/espejo-vs-camara.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart entrega/espejo-vs-camara.mp4
```

En Studio, la composición `EspejoVsCamara` es el reel completo, y la carpeta `Escenas` tiene cada pieza por separado.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `voiceover/guion.json` | Texto de la voz en off, por pieza y por frase. Las palabras clave van en MAYÚSCULAS. |
| `scripts/generar_voz.py` | Genera o alinea la voz en off y escribe `public/voiceover/voz-en-off.mp3` y `src/timeline.json`. |
| `src/timeline.json` | Generado: dónde empieza cada pieza, cada frase y cada palabra. Las escenas y los subtítulos se sincronizan con esto. |
| `src/Reel.tsx` | Une las 8 escenas, los subtítulos, la marca de agua, la voz y el colchón musical. |
| `src/scenes/` | Una escena por pieza del guion (gancho, intro, cuerpo 1, bucle, cuerpo 2, bucle, final, CTA). |
| `src/components/Face.tsx` | La cara del personaje, con sus asimetrías y el ancho de nariz como parámetro. |
| `src/components/Props.tsx` | Celular con cámara frontal, espejo, polaroid, cerebro y cabeza de perfil. |
| `src/components/sfx.ts` | Volumen de cada efecto, calculado para que quede al menos 8 dB por debajo de la voz. |
| `public/sfx/` | Efectos generados con ffmpeg (obturador, toque, whoosh, ding, chispa y colchón musical). |
| `public/logo.png`, `public/logo-icono.png` | Logo de la cuenta para la tarjeta del CTA y la marca de agua. |

## Voz en off

La voz es **Fernando Martínez** de ElevenLabs (modelo `eleven_v4`, voice_id `dlGxemPxFMTY7iXagmOj`), generada como una sola toma con el texto de `voiceover/guion.json`. La toma se transcribe con faster-whisper y cada palabra del guion se alinea con lo que se escucha, así los subtítulos y los cortes de escena caen justo.

```console
pip install faster-whisper
python scripts/generar_voz.py --audio toma.mp3
```
