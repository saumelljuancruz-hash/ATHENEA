# Serie · El club de los seguidores

Serie de Instagram para **@nadietelo.explico**: un club de fútbol que llenan los seguidores (1 seguidor = 1 hincha), cuyo nombre, escudo y colores eligen los comentarios, y que juega una liga simulada con una fecha por día. La idea, las reglas y el calendario están en [SERIE.md](SERIE.md); el guion del episodio 1, en [GUION-EP01.md](GUION-EP01.md).

## Qué hay en `entrega/`

| Archivo | Qué es |
| --- | --- |
| `episodio-01.mp4` | Reel del lanzamiento para Instagram, con 18 hinchas (47,8 s, 1080 × 1920, audio a −14 LUFS). |
| `portada-episodio-01.jpg` | Portada sugerida del reel. |
| — | La versión de TikTok (894 seguidores, cancha de barrio) está en [club-hinchas-tiktok](../club-hinchas-tiktok). |
| `fecha-01/Fecha-1-Partido.png`, `Fecha-2-Resultados.png`, `Fecha-3-Tabla.png` | Carrusel de la fecha 1 (1080 × 1350). Es una vista previa jugada con 8 hinchas: se vuelve a jugar con los seguidores del día. |
| `fecha-01/Cancha.png` | "La cancha hoy", para la historia. |

## La liga

```console
node scripts/liga.mjs fixture                       # las 18 fechas
node scripts/liga.mjs jugar --hinchas 23            # juega la próxima fecha con 23 hinchas
node scripts/liga.mjs jugar --hinchas 23 --fecha 1 --forzar   # repite una fecha ya jugada
node scripts/liga.mjs club --nombre "Club X" --corto "X" --sigla CLX --colores "#123456,#ffffff" --icono estrella
```

`jugar` guarda la fecha en `src/liga/estado.json` y escribe `src/liga/fecha.json`, que es lo que leen las plantillas. Después:

```console
for c in Fecha-1-Partido Fecha-2-Resultados Fecha-3-Tabla Cancha; do
  npx remotion still $c entrega/fecha-02/$c.png
done
```

Cada partido sale de un sorteo con semilla pública (`t1-f<fecha>-<local>-<visitante>`), así que el mismo cálculo da siempre lo mismo. El club de la serie suma 4 × log10(hinchas + 1) de fuerza cuando juega de local. Los equipos, sus colores, íconos y fuerza están en `src/liga/equipos.json`.

## El episodio

```console
npm i
npm run dev                                          # Remotion Studio
npx remotion render Episodio1 out/episodio-01.mp4
```

El contador de hinchas del reel sale de `src/serie.json` (Instagram). Para otra cuenta, el número y la red se pasan al renderizar, sin tocar archivos; la voz no dice el número:

```console
npx remotion render Episodio1 out/episodio-01-tiktok.mp4 --props='{"hinchas":21,"plataforma":"tiktok"}'
```

La voz es **Fernando Martínez** de ElevenLabs (modelo `eleven_v4`), alineada con faster-whisper:

```console
python scripts/generar_voz.py --audio toma.mp3
```

| Archivo | Qué hace |
| --- | --- |
| `src/components/Futbol.tsx` | Pelota, escudos, potrero con 100 lugares, íconos de estadios, camiseta, comentarios y la cuenta de chances de local. |
| `src/scenes/` | Las 8 piezas del episodio 1. |
| `src/resultados/Resultados.tsx` | Plantillas del carrusel diario y de la historia. |
| `public/sfx/` | Efectos generados con ffmpeg, incluidos el silbato y la patada. |
