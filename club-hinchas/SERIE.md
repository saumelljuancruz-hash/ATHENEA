# El club de los seguidores — biblia de la serie

**Cuenta:** @nadietelo.explico en Instagram y TikTok · **Arranque:** 18 (Instagram) + 894 (TikTok) = 912 hinchas · **Formato:** un reel por episodio, un carrusel de resultados por día y una historia diaria.

## La idea en una línea

La cuenta funda un club de fútbol sin nombre, sin escudo y sin colores. Cada seguidor es un hincha que ocupa un lugar en la tribuna, y los comentarios deciden todo lo demás. El club juega una liga de 10 equipos con una fecha por día: los partidos no se ven, solo se publican los resultados, y la hinchada hace más fuerte al club cuando juega de local.

## Por qué funciona

- **Te necesita para crecer:** seguir la cuenta es literalmente entrar a la cancha, y cada hincha nuevo cambia los resultados.
- **Te da un motivo para comentar:** el nombre, el escudo y los colores salen de los comentarios.
- **Crea un hábito:** todos los días hay un resultado nuevo y una tabla que se mueve. Es la razón para volver mañana.
- **El que llega tarde no se queda afuera:** cada carrusel se entiende solo (nuestro partido, todos los resultados y la tabla).
- **Arranca con una meta cerca:** con 912 hinchas el club ya superó el potrero y está en la cancha de barrio al 91 %. Faltan 88 para la primera mudanza grande, a un estadio de 10.000.

## Las reglas (lo que se les cuenta a los seguidores)

### 1 · Un seguidor = un hincha

La tribuna se llena con la cantidad de seguidores del día, **sumando Instagram y TikTok**: es un solo club en las dos redes, con los mismos resultados y la misma tabla. El que sigue en las dos cuenta doble. Cuando se llena, el club se muda a una cancha más grande, y cada mudanza es un episodio especial.

| Nivel | Cancha | Lugares |
|---|---|---|
| 1 | Potrero (tablones de madera) | 100 |
| 2 | Cancha de barrio | 1.000 |
| 3 | Estadio | 10.000 |
| 4 | Monumental | 100.000 |

### 2 · El club lo arman los comentarios

En este orden:
1. **Nombre:** propuestas en los comentarios del episodio 1. Las 3 o 4 con más "me gusta" pasan a la votación.
2. **Escudo:** con las ideas de los comentarios armo 3 escudos y se vota.
3. **Colores:** se votan los colores de la camiseta.

Hasta que haya nombre, el club juega como **"Club Sin Nombre"**, con un escudo vacío y un signo de pregunta. Eso también es parte del chiste.

### 3 · La Liga Curiosa

- **Formato:** 10 equipos, todos contra todos, ida y vuelta: 18 fechas, una por día. El club de la serie alterna siempre entre local y visitante.
- **Los resultados no los elige nadie:** cada partido sale de un sorteo con semilla pública ("t1-f3-NUE-GRA"). Cualquiera puede repetir la cuenta con `scripts/liga.mjs` y le da lo mismo.
- **La única ventaja del club es su hinchada:** cuando juega de local, suma 4 × log10(hinchas + 1) puntos de fuerza. Así cambian las chances:

| Hinchas | Chance de ganar de local |
|---|---|
| 8 | 39 % |
| 100 | 49 % |
| 912 (hoy) | 58 % |
| 1.000 | 58 % |
| 10.000 | 67 % |
| 100.000 | 76 % |

  De visitante gana un 11 % de las veces: es el club más débil de la liga, y eso solo lo cambia la gente.

- **Los rivales** tienen nombres de datos curiosos, como la cuenta. Son todos inventados, así no hay nombres ni escudos de clubes reales.

| Equipo | Sigla | Fuerza |
|---|---|---|
| Deportivo Big Bang | DBB | 80 |
| Racing Agujero Negro | RAN | 78 |
| Atlético Gravedad | GRA | 76 |
| Juventud Tsunami | JTS | 74 |
| Defensores de Pi | DPI | 72 |
| Sportivo Neutrón | SNE | 70 |
| Estrella Supernova | ESN | 68 |
| Unión Fotosíntesis | UFO | 66 |
| Ferro Magnético | FMA | 64 |
| **Club Sin Nombre** (el nuestro) | ??? | 63 + hinchada de local |

## Qué se publica

| Formato | Cuándo | Qué es |
|---|---|---|
| **Reel de episodio** | En cada hito: lanzamiento, nombre elegido, escudo, mudanza de cancha, fin de temporada | Video vertical con la voz de Fernando Martínez, en el estilo de siempre. |
| **Carrusel de la fecha** | Todos los días | 3 slides: nuestro partido, los 5 resultados y la tabla. |
| **Historia diaria** | Todos los días, antes del partido | "La cancha hoy", con el contador de hinchas, y una encuesta: "¿Ganamos hoy?". |

## Calendario de las dos primeras semanas

| Día | Publicación | Para qué |
|---|---|---|
| 1 | **Reel episodio 1:** "Fundé un club y la hinchada sos vos" | Lanzar la serie y juntar propuestas de nombre. |
| 2 | Carrusel **Fecha 1** (de local contra Ferro Magnético) + historia con encuesta de las 4 propuestas más votadas | Primer resultado y votación del nombre. |
| 3 | Carrusel Fecha 2 + historia "último día para votar" | — |
| 4 | **Reel episodio 2:** "Ya tenemos nombre" + pedido de ideas para el escudo | Premiar a los que comentaron. |
| 5 | Carrusel Fecha 3 + historia con 3 bocetos de escudo | Votación del escudo. |
| 6 | Carrusel Fecha 4 | — |
| 7 | **Reel episodio 3:** el escudo y los colores | El club queda armado. |
| 8–14 | Carrusel diario (Fechas 5 a 11) + historia diaria | Hábito diario. Cuando el potrero llegue a 100, reel de mudanza. |

**Horario:** los resultados conviene publicarlos todos los días a la misma hora, por ejemplo a las 20:00, para que la gente sepa cuándo volver.

## Cosas a cuidar

- **Pocos comentarios al principio:** en Instagram (18 seguidores) puede que lleguen pocas propuestas; el grueso va a venir de TikTok. Si pasa, sumá 3 propias en una historia con encuesta, y cada comentario que llegue se suma a la votación.
- **Moderación:** quedan afuera los nombres ofensivos, los de marcas y los de clubes reales.
- **Premiar al que participa:** el que propone el nombre ganador puede ser el "socio fundador n.º 1", con su @ en la tribuna, siempre que dé permiso.
- **Ser claros:** la liga es simulada. Conviene decirlo en la descripción ("resultados sorteados con semilla pública") para que nadie piense que son partidos reales.
- **No tocar los resultados a mano:** la gracia es que sean justos. Si el club pierde 5 seguidos, es contenido: "necesitamos más gente en la cancha".

## Cómo se juega cada fecha

Cada día, antes de publicar, me pasás cuántos seguidores tiene la cuenta y yo:
1. Juego la fecha con `node scripts/liga.mjs jugar --hinchas <seguidores>`. El resultado queda guardado y no se puede volver a sortear sin `--forzar`.
2. Renderizo los 3 slides del carrusel y la historia en `entrega/fecha-XX/`.
3. Te paso la descripción para el posteo.

Cuando el club tenga nombre, lo cargo con `node scripts/liga.mjs club --nombre "..." --corto "..." --sigla ... --colores "#...,#..."` y todas las plantillas se actualizan solas.

## Ideas para más adelante

- **Figura del partido:** que los comentarios voten un jugador inventado.
- **Fichajes por hitos:** cada 100 seguidores nuevos, un "refuerzo" que suma fuerza también de visitante.
- **El clásico:** elegir un rival como clásico y hacer un reel especial ese día.
- **Fin de temporada:** campeón, descenso y una temporada 2 con la cancha nueva.

## Bitácora

- **Día 1 (3/11/2026):**
  - El club se llama **Club FC NTLE** ("Nadie Te Lo Explicó"): lo propuso J.P, con 69 me gusta.
  - El escudo es el de Rami (28 me gusta): azul y negro, con corona, pelota y estrella.
  - La hinchada llegó a 1.013 (18 en Instagram y 995 en TikTok), así que se llenó la cancha de barrio y el club se mudó al estadio de 10.000.
  - Fecha 1: FC NTLE 2-0 Ferro Magnético, de local. Quedó 3.º, con 3 puntos.
  - Fecha 2: de visitante contra Deportivo Big Bang, el más fuerte de la liga.
