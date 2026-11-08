# Resumen para seguir en otro chat — Reels de @nadietelo.explico

Pegá este texto (o adjuntá este archivo y `GUIA-REELS.md`) al empezar el otro chat.

## Qué es el proyecto
- Cuenta de Instagram **Nadie Te Lo Explicó (@nadietelo.explico)**: Reels verticales que explican
  cómo funcionan cosas de todos los días.
- Los videos se hacen con **Remotion** (código en el repo `saumelljuancruz-hash/ATHENEA`, rama
  `claude/remotion-avion-reel-9h24pq`). Cada Reel vive en `src/<reel>/` y sus textos en
  `src/<reel>/guion-<reel>.ts`.
- La voz la graba el usuario (`public/voz-<reel>.mp3`); se transcribe con
  `node --no-warnings scripts/transcribir-voz.mjs <reel>` y el video se arma solo según los tiempos.
- Render: `npx remotion render <Reel>Reel out/<reel>.mp4 --codec=h264 --crf=18 --audio-codec=aac --audio-bitrate=192k`.
- Portadas: `npx remotion still <Reel>-Portada out/portada-<reel>.png`.

## Reglas (todas están en `GUIA-REELS.md`, que es el "cerebro")
1. **Gancho escrito en pantalla desde el cuadro 1** (pregunta grande, palabra clave en color).
2. **Sin pedir comentarios en el video** (ahí la retención cae ~30 %): la pregunta va en la descripción
   y en el comentario fijado.
3. **Sin silencios** y **sin triple texto (remate)**. Estructura: Hook → 01 → 02 → 03 → CTA → loop.
4. **Cierre "Mandáselo a…"** (CTA con MANDÁSELO ➤ → SEGUIME → ✓ Siguiendo).
5. **Loop final de ~0,75 s** que funde al primer cuadro.
6. **Subtítulos chicos (50 px)** con pastilla oscura suave.
7. **Estilo cálido y humano:** fondos de colores, personajes con cara y expresiones, escenas
   cotidianas; nada gris oscuro ni "de manual técnico".
8. **Animación humanizada:** resortes con rebote, cámara en mano, movimiento secundario,
   ritmos irregulares; **zoom sin saltos y sin bordes a la vista**.
9. **Cortes o cambios de plano cada 2–3 s**, en las palabras clave de la voz.
10. **Guion en tono de charla** (rioplatense), 20–35 s de voz, temas cotidianos, datos chequeados.
11. Descripción: primera línea gancho, segunda "Mandáselo a…", explicación corta y **5 hashtags**.
12. **No hacer operaciones de GitHub** (push, PRs) salvo que el usuario lo pida.

## Reels hechos
| Reel | Carpeta | Estado |
| --- | --- | --- |
| Curva de los aviones en el mapa | `src/avion/` | publicado |
| Face ID | `src/faceid/` | publicado |
| Microondas | `src/microondas/` | publicado |
| GPS | `src/gps/` | publicado |
| QR roto | `src/qr/` | publicado |
| Cielo azul | `src/cielo/` | publicado |
| Modo avión | `src/modoavion/` | publicado |
| Batería de noche | `src/bateria/` | publicado |
| Algoritmo | `src/algoritmo/` | publicado |
| Google Maps y el carrito | `src/trafico/` | publicado |
| Ventanillas del avión | `src/ventanas/` | publicado |
| Cerrar apps | `src/apps/` | publicado |
| Ácaros (Demodex) | `src/acaros/` | descartado (no se sube) |
| Pierna dormida | `src/pierna/` | terminado con voz (estilo nuevo) |
| Estrellitas al pararte | `src/mareo/` | terminado con voz (estilo nuevo) |
| Ojo que late | `src/parpado/` | terminado con voz (estilo nuevo) |

## Horarios que funcionaron
Tres Reels por día, separados ~4 h: **13:00**, **16:30–17:00** y **20:30–21:00** (Argentina).
El más fuerte primero.

## Ideas pendientes (cotidianas)
- Entrás a una habitación y te olvidás a qué ibas (efecto puerta).
- El sacudón al quedarte dormido (sacudida hípnica).
- Una canción pegada en la cabeza (y el truco del chicle).
- Por qué la cebolla te hace llorar.
- Se te tapan los oídos en el avión.
- Tu voz grabada suena rara.
- La regla de los 5 segundos es mentira.
- El pan en la heladera se pone duro más rápido.
