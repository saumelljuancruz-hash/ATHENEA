# Nadie Te Lo Explicó — Reels animados

Reels verticales (1080×1920, 60 fps) hechos con [Remotion](https://remotion.dev) para **@nadietelo.explico**.

| Reel | Composición | Carpeta | Salida |
| --- | --- | --- | --- |
| ¿Por qué los aviones hacen una curva en el mapa? | `AvionReel` | `src/avion/` | `out/avion.mp4` |
| ¿Cómo funciona el reconocimiento facial (Face ID)? | `FaceIdReel` | `src/faceid/` | `out/faceid.mp4` |
| ¿Cómo calienta la comida un microondas? | `MicroondasReel` | `src/microondas/` | `out/microondas.mp4` |

## Archivos en `public/`

| Archivo | Para qué | Si falta |
| --- | --- | --- |
| `voz-<reel>.mp3` | Voz en off (100 %) | El video se arma igual, sin voz, con los timestamps estimados |
| `voz-<reel>-timestamps.json` | Subtítulos palabra por palabra (se genera con `scripts/transcribir-voz.mjs`) | Se usan los estimados de `src/<reel>/timestamps-estimados.ts`, escalados al largo real del audio |
| `logo.png` | Logo en el cierre | Se dibuja un monograma "NT" provisorio |

El JSON de timestamps acepta: un array `[{word|text|palabra, start|inicio|startMs, end|fin|endMs}]`,
`{words: [...]}`, Whisper (`{segments: [{words}]}`) o la alineación por caracteres de ElevenLabs
(`{alignment: {characters, character_start_times_seconds, character_end_times_seconds}}`).

## Comandos

```bash
npm i
node --no-warnings scripts/transcribir-voz.mjs faceid   # timestamps reales de la voz (Whisper local)
npx remotion studio                                    # revisar timing
npx remotion render FaceIdReel out/faceid.mp4 --codec=h264 --crf=18 --audio-codec=aac --audio-bitrate=192k
npx remotion render AvionReel out/avion.mp4 --codec=h264 --crf=18 --audio-codec=aac --audio-bitrate=192k
python3 scripts/generar-audio.py                       # regenera música y efectos (síntesis propia)
```

## Cómo está armado

- **`src/comun/`** — todo lo que comparten los Reels de la cuenta:
  - `metadata.ts`: `crearCalcularMetadata()` mide la voz y fija la duración en `voz + pausa insertada + 0,5 s`,
    entre `minFrames` y `maxFrames` (Face ID y microondas: 1800–2400; avión: 1800–2600 porque su locución dura 40,3 s).
    Si la locución no trae la pausa del Remate, la inserta cortando la voz en el silencio indicado.
  - `linea-de-tiempo.ts`: ubica cada escena y cada momento interno buscando frases en los timestamps.
  - `Hud.tsx` (etiquetas con línea animada, título de sección, contador), `Subtitulos.tsx`, `Fondo.tsx`,
    `Sonido.tsx` (biblioteca de efectos, voz + música con ducking), `vista.tsx` (zoom/giro de cámara 2D),
    `TarjetaPausa.tsx`, `RemateLineas.tsx`, `CierreCTA.tsx`.
- **`src/<reel>/guion-<reel>.ts`** — plantilla con textos, etiquetas, palabras clave, frases de anclaje y
  volúmenes. Para un Reel nuevo: copiá una carpeta de Reel, cambiá el guion y las escenas propias.
- **Avión**: mapa con `d3-geo` + `world-atlas` y proyección interpolada globo → plano → Mercator.
- **Face ID**: busto 3D propio en canvas (`src/faceid/cabeza.ts`: superficie paramétrica, iluminación y
  orden de profundidad), nube de ~3.000 puntos infrarrojos que representan los 30.000 reales, y malla 3D.
- **Microondas**: microondas ilustrado en SVG con vista de frente y en corte (`src/microondas/componentes/`),
  ondas que rebotan en las paredes, moléculas de agua (O + 2 H) que cambian de azul a naranja, y una
  simulación simple de calor por celdas para los puntos calientes y el plato giratorio.
