# Fecha 4 · FC NTLE (TikTok) — guion y fuentes

Video vertical de 55,5 s con la voz de Fernando Martínez (ElevenLabs). Resume la fecha 4 de la Liga Curiosa y cuenta las bengalas que ya hay para la fecha 5.

## Suspenso

- **Pregunta en el primer segundo:** "¿Y aun así le podemos ganar al TERCERO?", con el escudo de Agujero Negro y un "?" que late.
- **Barra "LA RESPUESTA":** aparece con "La respuesta la prendieron ustedes" y se llena hasta el "¡66 %!".
- **Adelanto sin resolver al final:** "Faltan solo 484" y "¿LLEGAMOS ANTES DEL PARTIDO?".

## Guion

| Pieza | Texto |
|---|---|
| Gancho | ¡3 a 0 en contra! ¿Y aun así le podemos ganar al TERCERO? La respuesta la prendieron ustedes. |
| Partido | De visitante no suma la hinchada: contra Gravedad teníamos un 6% de chance. |
| Tabla | Bajamos del cuarto al SÉPTIMO puesto, a cuatro puntos del puntero. |
| Hinchas | Pero la tribuna no para: ya somos 1.307 hinchas, 132 más que ayer. |
| Bengalas | Y el video de ayer tuvo 421 compartidos. O sea: 421 BENGALAS prendidas para mañana. |
| Números | Mañana jugamos de local contra Agujero Negro. Sin bengalas, la chance era 45%. Con estas 421… ¡66%! |
| Faltan | Y con 905 bengalas tocamos el tope: 90%. Faltan solo 484. |
| Cierre | COMPARTILO: cada compartido es una BENGALA más para mañana. Y SEGUÍ a @nadietelo.explico: cada seguidor nuevo es un HINCHA más en la tribuna. |

## De dónde sale cada dato

- **Resultado, tabla y fixture:** `club-hinchas/scripts/liga.mjs jugar --hinchas 1307 --bengalas 0` (semilla `t1-f4-GRA-NUE`). Quedó en `club-hinchas/src/liga/estado.json` y `fecha.json`.
- **Hinchas (1.307) y compartidos (421):** los pasó el usuario el 6/11/2026, sacados de su TikTok. 1.307 − 1.175 (fecha 3) = 132.
- **6 % de visitante:** `chanceVisitanteVs("GRA")` en `Futbol.tsx` (5,94 % ganar, 13,4 % empate, 80,7 % perder), la misma cuenta de Poisson del simulador.
- **45 % y 66 %:** `chanceLocalVs("RAN", 1307)` = 44,76 % y `chanceLocalVs("RAN", 1307, 421)` = 44,76 % + 421 × 0,05 % = 65,81 %.
- **905 y 484:** `bengalasParaTope("RAN", 1307)` = ⌈(90 % − 44,76 %) / 0,05 %⌉ = 905; 905 − 421 = 484. Si mañana hay más hinchas, la base sube un poco y hacen falta algunas menos.
- **"El tercero":** Agujero Negro está 3.º en la tabla después de la fecha 4 (7 puntos, +2).
