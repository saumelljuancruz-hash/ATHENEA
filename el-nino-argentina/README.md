# Reel · Cómo puede llegar El Niño a la Argentina

Reel vertical 9:16 (1080 × 1920, 30 fps, 56 s) para **@nadietelo.explico**, hecho con Remotion y motion graphics en SVG/CSS. El guion completo, los prompts visuales, los ganchos alternativos, la descripción para Instagram y el chequeo de reglas están en [GUION.md](GUION.md).

## Comandos

```console
npm i
npm run dev                         # Remotion Studio para previsualizar
npx remotion render ElNinoArgentina out/el-nino-argentina.mp4
```

El archivo listo para subir está en `entrega/el-nino-argentina.mp4`: es el render de Remotion con el audio llevado a −14 LUFS (el nivel habitual de Instagram y TikTok), sin recodificar el video:

```console
ffmpeg -i out/el-nino-argentina.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -movflags +faststart entrega/el-nino-argentina.mp4
```

En Studio, la composición `ElNinoArgentina` es el reel completo, y la carpeta `Escenas` tiene cada pieza por separado.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `voiceover/guion.json` | Texto de la voz en off, por pieza y por frase. Las palabras clave van en MAYÚSCULAS. |
| `scripts/generar_voz.py` | Genera o alinea la voz en off y escribe `public/voiceover/voz-en-off.mp3` y `src/timeline.json`. |
| `scripts/mapas.mjs` | Proyecta los mapas de Natural Earth (Pacífico ecuatorial y Sudamérica) y escribe `src/maps.json`. |
| `src/timeline.json` | Generado: dónde empieza cada pieza, cada frase y cada palabra. Las escenas y los subtítulos se sincronizan con esto. |
| `src/Reel.tsx` | Une las 8 escenas, los subtítulos, la marca de agua, la voz y el ambiente de mar. |
| `src/scenes/` | Una escena por pieza del guion (gancho, intro, cuerpo 1, bucle, cuerpo 2, bucle, final, CTA). |
| `src/components/` | Dedo, corte del océano, mapas, termómetro de anomalía, widget del clima, subtítulos y elementos de interfaz. |
| `public/sfx/` | Efectos generados con ffmpeg (viento, ola, mar, lluvia, trueno, toque, whoosh, ding). |
| `public/fonts/` | Montserrat y JetBrains Mono (licencia OFL), cargadas localmente. |

## Voz en off

La voz es **Fernando Martínez** de ElevenLabs (modelo `eleven_v4`, voice_id `dlGxemPxFMTY7iXagmOj`), generada como una sola toma con el texto de `voiceover/guion.json`. "NOAA" se pidió con su pronunciación en IPA (`/ˈno.a/`) para que diga "Noa". La toma se transcribe con faster-whisper y cada palabra del guion se alinea con lo que se escucha, así los subtítulos y los cortes de escena caen justo.

```console
pip install faster-whisper
python scripts/generar_voz.py --audio toma.mp3
```

## Mapas

Los mapas salen de [Natural Earth](https://github.com/nvkelso/natural-earth-vector/tree/master/geojson) (dominio público). Para regenerarlos, descargá `ne_110m_land.geojson`, `ne_50m_admin_0_countries.geojson` y `ne_50m_rivers_lake_centerlines.geojson` en una carpeta y corré:

```console
node scripts/mapas.mjs carpeta-con-los-geojson
```

## Datos

Los datos de El Niño 2026 son del pronóstico de la NOAA del 8 de octubre de 2026: Niño 3.4 a +2,1 °C y 83 % de chances de que sea el evento más fuerte desde 1950. Si el reel se publica más tarde, conviene revisar la última actualización del [CPC](https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/ensodisc.shtml) y del [SMN](https://www.smn.gob.ar/).
