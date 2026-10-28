# Reel · Cómo se forman las tormentas eléctricas

Reel vertical 9:16 (1080 × 1920, 30 fps, 58 s) para **@nadietelo.explico**, hecho con Remotion y motion graphics en SVG/CSS. El guion completo, los prompts visuales, los ganchos alternativos, el caption y el chequeo de reglas están en [GUION.md](GUION.md).

## Comandos

```console
npm i
npm run dev                         # Remotion Studio para previsualizar
npx remotion render TormentasElectricas out/tormentas-electricas.mp4
```

El archivo listo para subir está en `entrega/tormentas-electricas.mp4`: es el render de Remotion con el audio llevado a −14 LUFS (el nivel habitual de Instagram y TikTok) sin recodificar el video:

```console
ffmpeg -i out/tormentas-electricas.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart entrega/tormentas-electricas.mp4
```

En Studio, la composición `TormentasElectricas` es el reel completo, y la carpeta `Escenas` tiene cada pieza por separado.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `voiceover/guion.json` | Texto de la voz en off, por pieza y por frase. Las palabras clave van en MAYÚSCULAS. |
| `scripts/generar_voz.py` | Genera o alinea la voz en off y escribe `public/voiceover/voz-en-off.mp3` y `src/timeline.json`. |
| `src/timeline.json` | Generado: dónde empieza cada pieza, cada frase y cada palabra. Las escenas y los subtítulos se sincronizan con esto. |
| `src/Reel.tsx` | Une las 8 escenas, los subtítulos, la marca de agua, la voz y el ambiente de lluvia. |
| `src/scenes/` | Una escena por pieza del guion (gancho, intro, cuerpo 1, bucle, cuerpo 2, bucle, final, CTA). |
| `src/components/` | Dedo, rayo, nube, subtítulos y elementos de interfaz. |
| `public/sfx/` | Efectos generados con ffmpeg (trueno, chispa, toque, whoosh, ding, lluvia). |
| `public/fonts/` | Montserrat y JetBrains Mono (licencia OFL), cargadas localmente. |

## Voz en off

La voz es **Fernando Martínez** de ElevenLabs (modelo `eleven_v4`, voice_id `dlGxemPxFMTY7iXagmOj`), generada como una sola toma con el texto de `voiceover/guion.json` y acelerada un 5 % sin cambiar el tono para que el reel quede por debajo de 60 s. La toma se transcribe con faster-whisper y cada palabra del guion se alinea con lo que se escucha, así los subtítulos y los cortes de escena caen justo.

Si cambiás el texto o la voz, volvé a generar el audio y la línea de tiempo: las escenas y los subtítulos se ajustan solos.

```console
pip install faster-whisper            # para --audio
pip install piper-tts                 # para --model

# Una locución ya hecha (toma de ElevenLabs o tu voz grabada)
python scripts/generar_voz.py --audio toma.mp3 --tempo 1.05

# Piper, gratis y local (voz guía)
python scripts/generar_voz.py --model ruta/es_AR-daniela-high.onnx

# ElevenLabs por API, frase por frase (necesita ELEVENLABS_API_KEY)
python scripts/generar_voz.py --elevenlabs-voice dlGxemPxFMTY7iXagmOj
```
