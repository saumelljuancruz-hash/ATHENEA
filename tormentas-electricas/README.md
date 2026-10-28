# Reel · Cómo se forman las tormentas eléctricas

Reel vertical 9:16 (1080 × 1920, 30 fps, 50 s) para **@nadietelo.explico**, hecho con Remotion y motion graphics en SVG/CSS. El guion completo, los prompts visuales, los ganchos alternativos, el caption y el chequeo de reglas están en [GUION.md](GUION.md).

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
| `scripts/generar_voz_guia.py` | Sintetiza la voz frase por frase y escribe `public/voiceover/voz-guia.mp3` y `src/timeline.json`. |
| `src/timeline.json` | Generado: dónde empieza cada pieza, cada frase y cada palabra. Las escenas y los subtítulos se sincronizan con esto. |
| `src/Reel.tsx` | Une las 8 escenas, los subtítulos, la marca de agua, la voz y el ambiente de lluvia. |
| `src/scenes/` | Una escena por pieza del guion (gancho, intro, cuerpo 1, bucle, cuerpo 2, bucle, final, CTA). |
| `src/components/` | Dedo, rayo, nube, subtítulos y elementos de interfaz. |
| `public/sfx/` | Efectos generados con ffmpeg (trueno, chispa, toque, whoosh, ding, lluvia). |
| `public/fonts/` | Montserrat y JetBrains Mono (licencia OFL), cargadas localmente. |

## Voz en off

La voz actual es una **voz guía** generada localmente con [Piper](https://github.com/rhasspy/piper) y la voz `es_AR-daniela-high` (entrenada con el dataset OpenSLR 61, licencia CC BY-SA 4.0). Sirve para sincronizar el video. Para publicar conviene reemplazarla por una voz final.

Si cambiás el texto o la voz, volvé a generar el audio y la línea de tiempo: las escenas y los subtítulos se ajustan solos.

```console
# Piper (gratis, local)
pip install piper-tts
python scripts/generar_voz_guia.py --model ruta/es_AR-daniela-high.onnx

# ElevenLabs (necesita ELEVENLABS_API_KEY y créditos)
python scripts/generar_voz_guia.py --elevenlabs-voice 34RuvBpKQDapycxZnrDJ
```

Piper no es determinista: cada corrida da una toma un poco distinta (±0,5 s en total), y el video se reacomoda solo.

Si grabás tu propia voz, grabá cada frase de `voiceover/guion.json` por separado, o ajustá a mano los tiempos de `src/timeline.json`.
