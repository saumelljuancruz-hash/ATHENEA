# Nadie Te Lo Explicó — "¿Por qué los aviones hacen una curva?"

Reel vertical (1080×1920, 60 fps) hecho con [Remotion](https://remotion.dev) para **@nadietelo.explico**.

## Archivos que tenés que poner en `public/`

| Archivo | Para qué | Si falta |
| --- | --- | --- |
| `voz-avion.mp3` | Voz en off (100 %) | El video se arma igual, sin voz, con la duración de los timestamps estimados |
| `voz-avion-timestamps.json` | Subtítulos palabra por palabra exactos (se genera con `scripts/transcribir-voz.mjs`) | Se usan los estimados de `src/timestamps-estimados.ts`, escalados al largo real del audio |
| `logo.png` | Logo en la CTA | Se dibuja un monograma "NT" provisorio |

El JSON de timestamps acepta: un array `[{word|text|palabra, start|inicio|startMs, end|fin|endMs}]`,
`{words: [...]}`, Whisper (`{segments: [{words}]}`) o la alineación por caracteres de ElevenLabs
(`{alignment: {characters, character_start_times_seconds, character_end_times_seconds}}`).

## Comandos

```bash
npm i
node --no-warnings scripts/transcribir-voz.mjs   # timestamps reales de la voz (Whisper local)
npx remotion studio                  # revisar timing
npx remotion render AvionReel out/avion.mp4 --codec=h264 --crf=18 --audio-codec=aac --audio-bitrate=192k
python3 scripts/generar-audio.py     # regenera música y efectos (síntesis propia, sin licencias)
```

## Cómo está armado

- **Duración**: `calcular-metadata.ts` mide la voz y usa `largo + pausa insertada + 0,5 s`, limitado entre 1800 y 2600 frames.
- **Pausa del Remate**: si la locución no trae el silencio de 2,5 s después de "muchísimo combustible",
  se inserta cortando la voz en ese silencio y retomándola 2,5 s después (`PAUSA_REMATE` en el guion).
- **Timestamps**: `scripts/transcribir-voz.mjs` transcribe con Whisper y alinea con el texto del guion,
  así los subtítulos usan la ortografía del guion ("catorce" aunque se escuche "14").
- **`src/guion-avion.ts`**: plantilla con todos los textos, etiquetas, palabras clave de subtítulos,
  frases de anclaje de cada escena y volúmenes. Para otro Reel, duplicá y editá este archivo.
- **`src/linea-de-tiempo.ts`**: ubica cada escena (y cada momento interno) buscando su frase en los
  timestamps; si cambia la locución, todo se reacomoda solo.
- **Escenas** (`src/escenas/`): `Hook`, `MapaMiente`, `PausaComentario`, `Prueba`, `GranCirculo`,
  `Remate`, `CTA`. Cada una está registrada también como composición suelta en la carpeta *Escenas* del Studio.
- **Mapa**: `d3-geo` + `world-atlas`, con una proyección interpolada globo → plano → Mercator (`src/geo.ts`).
  Las distancias (10.875 km por gran círculo vs. 12.818 km por la "recta" del mapa) se calculan, no están escritas a mano.
- **Audio**: voz 100 %, música 8 % con ducking (baja a la mitad mientras hay voz), motor lejano,
  estiramiento elástico, whoosh en cambios de sección y pop en etiquetas.
