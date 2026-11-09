# Contexto para seguir en un chat nuevo · @nadietelo.explico

Este archivo resume todo lo que se hizo y cómo se trabaja, para que un chat nuevo de Claude siga igual que el anterior. La conversación completa está en [chat-completo.md](chat-completo.md). Estado al **6/11/2026**, después de la fecha 4.

## 1 · La cuenta

- **Marca:** "Nadie Te Lo Explicó", usuario **@nadietelo.explico** en Instagram, TikTok y YouTube (el de YouTube lo crea el usuario; recomendado el mismo).
- **Bio:** "Cómo funcionan las cosas que usás todos los días 🔍 · Datos que nadie te contó, en 30 segundos".
- **Idioma:** español rioplatense, con voseo ("usás", "seguí", "compartilo").
- **Logo:** radar turquesa con centro blanco y marcas de mira (`*/public/logo.png` y `logo-icono.png`).
- **Seguidores registrados:**
  - Instagram: 8 → 18.
  - TikTok: 894 → 995.
  - Hinchas del club (suma o TikTok solo): 912 el 2/11, 1.013 el 3/11, 1.131 el 4/11 y 1.175 el 5/11. Desde el 4/11 el usuario pasa el número cuando ya publica solo en TikTok.

## 2 · Reglas de los reels de datos (pedido original del usuario)

- **Formato:** vertical 9:16, de 45 a 60 s, hecho con Remotion y motion graphics.
- **Regla 1:** anclar el tema a algo que el espectador tiene, usa o toca AHORA (casi siempre el celular).
- **Regla 2:** en el primer segundo no hay nada quieto: algo grande en primer plano se mueve desde el frame 0 (el dedo gigante, la pelota).
- **Regla 3:** mostrar, no contar. Nunca pedir "imaginá".
- **Estructura de 8 piezas:** Gancho (0–3 s), Introducción (3–8 s), Cuerpo 1, Bucle abierto, Cuerpo 2, Bucle abierto, Cuerpo final y Llamado a la acción.
- **Voz en off:**
  - frases muy cortas, en segunda persona y en tono de charla, de 130 a 160 palabras;
  - números concretos y nada de relleno;
  - el cierre dice "Seguí a @nadietelo.explico para más datos así".
- **Marca de agua:** el logo y @nadietelo.explico arriba a la derecha, en todas las escenas.
- **Formato de la respuesta, por pieza:** pieza y tiempo; voz en off; texto en pantalla, palabra por palabra y con la palabra clave en MAYÚSCULAS; visual descripto para IA (3D oscuro y limpio, luz cinematográfica, objetos en primer plano); y movimiento.
- **Al final:** 3 ganchos alternativos, una descripción de 2 líneas como máximo con 5 hashtags y un chequeo de las 3 reglas.
- **Datos verdaderos:** se investigan y se citan las fuentes en `GUION.md`.
- **Suspenso, siempre** (pedido del usuario el 5/11, para que la gente se quede hasta el final):
  - Abrir con una pregunta o promesa en el primer segundo y resolverla recién al final ("te muestro cómo al final").
  - Mostrar una barra o contador de "la respuesta" que avanza durante el video.
  - Adelantar sin resolver en el momento, y no revelar el dato principal hasta la última parte.
  - Cambiar algo en pantalla cada 2 o 3 segundos.

## 3 · Estilo visual y de audio

- Fondo oscuro con brillo de color y viñeta. Tipografía Montserrat 900, con la palabra clave en amarillo (`#ffe14d`) y acentos turquesa (`#3ee0c0`).
- Paneles de vidrio, pop y resorte en las entradas, sacudones y flashes.
- **Subtítulos:** palabra por palabra en la franja y = 1250–1580. Las palabras sin minúsculas salen amarillas y el @ en celeste. Lo visual va entre y = 240 y 1240.
- **Voz:** ElevenLabs, voz **Fernando Martínez** (voice_id `dlGxemPxFMTY7iXagmOj`, modelo `eleven_v4`, 2 tomas por generación). La voz va a volumen 0,6.
- **Efectos:** se generan con ffmpeg y quedan entre 12 y 15 dB por debajo de la voz. Los volúmenes están en `src/components/sfx.ts`. El usuario se quejó una vez de que el viento estaba muy fuerte: los efectos nunca tienen que tapar la voz.
- **Masterizado:** `loudnorm` en dos pasadas a −14 LUFS y TP −1,5, sin recodificar el video (`-c:v copy`), AAC a 192k con `+faststart`. El resultado va a `entrega/`.

## 4 · Cómo se arma un video (pipeline)

1. Escribir `voiceover/guion.json` (piezas y frases, con las palabras clave en MAYÚSCULAS). En `scripts/generar_voz.py` va el mapa `SPOKEN` de los números y siglas ("6.300" → "seis mil trescientos", "@nadietelo.explico" → "Nadie Te Lo Explico").
2. Generar la voz en ElevenLabs con el texto ya escrito como se pronuncia. Se pueden usar etiquetas como `[excited]` y `[warmly]`.
3. Bajar las 2 tomas, transcribirlas con `herramientas/transcribir.py` (faster-whisper "small") y elegir la mejor.
4. Ejecutar `python scripts/generar_voz.py --audio toma.mp3 [--tempo 1.06]`. Escribe `public/voiceover/voz-en-off.mp3` y `src/timeline.json`, y las escenas se sincronizan con `wordAt()` y `beats()`.
5. Escribir las escenas y revisar fotogramas con `node herramientas/stills2.mjs <proyecto> <carpeta> <frames> <Composición>` y `python herramientas/sheet.py <carpeta>`.
6. Hacer el render completo, masterizar, comparar los subtítulos con whisper (diferencias de 0,1 s como máximo) y sacar la portada.
7. Escribir `GUION.md` o `README.md`, hacer el commit y el push a la rama `claude/reel-tormentas-electricas-7xdwvl`.

Las fuentes son locales (`public/fonts`), porque el Chrome sin pantalla no carga Google Fonts.

## 5 · Proyectos (carpetas del repo)

| Carpeta | Qué es | Estado |
|---|---|---|
| `tormentas-electricas/` | Reel "Cómo se forman las tormentas eléctricas" (58 s) | Hecho |
| `el-nino-argentina/` | Reel "Cómo puede llegar El Niño a la Argentina" (56 s) | Hecho |
| `espejo-vs-camara/` | Reel "Por qué te ves distinto en el espejo que en la cámara" (56 s) | Hecho |
| `carrusel-celular/` | Carrusel "6 cosas de tu celular que nadie te explicó" (8 slides de 4:5) | Hecho |
| `binance-hackeo/` | Reel del hackeo a Binance (57,6 s, datos al 31/10/2026) | Hecho |
| `club-hinchas/` | Serie del club: biblia (`SERIE.md`), simulador de la liga, plantillas del carrusel diario, episodio 1 de Instagram | En curso |
| `club-hinchas-tiktok/` | Episodio 1 para TikTok (894 hinchas, cancha de barrio) | Hecho |
| `club-historia-union/` | Historia "Juntamos los dos clubes" (Instagram + TikTok) | Hecho |
| `club-resumen-dia1/` | Video del día 1: nombre, escudo, mudanza y 2-0 | Hecho |
| `club-fecha2/` | Video de la fecha 2 para TikTok: 6-3 contra Big Bang | Hecho |
| `youtube-canal/` | Banner del canal y plan de subidas (`SUBIDAS.md`, `subidas.json`) | Falta subir |

Los proyectos `club-*` nuevos y `youtube-canal` usan las dependencias de `club-hinchas` (en la nube estaban enlazadas). En una PC, ejecutá `npm i` en cada uno antes de renderizar.

## 6 · La serie del club: FC NTLE

- **Idea:** 1 seguidor = 1 hincha en la tribuna. Los comentarios eligen el nombre, el escudo y los colores. Hay una liga simulada con una fecha por día: no se muestran los partidos, solo los resultados.
- **Nombre:** **Club FC NTLE** ("Nadie Te Lo Explicó"), propuesto por **J.P** (69 me gusta).
- **Escudo:** el de **Rami** (28 me gusta), recortado en `club-hinchas/public/club/escudo-ntle.png`. Las capturas de los comentarios están en la misma carpeta.
- **Colores:** azul `#2050f3` y negro.
- **Canchas:**
  - potrero de 100 lugares (superado);
  - cancha de barrio de 1.000 (se llenó el día 1);
  - **estadio de 10.000 (el actual)**;
  - monumental de 100.000.
- **Liga Curiosa:** 10 equipos inventados con nombres de datos curiosos (Big Bang 80, Agujero Negro 78, Gravedad 76, Tsunami 74, Pi 72, Neutrón 70, Supernova 68, Fotosíntesis 66, Magnético 64; FC NTLE 63). Son 18 fechas de ida y vuelta, y el club alterna siempre entre local y visitante.
- **Resultados justos:** cada partido sale de un sorteo con semilla pública (`t1-f<fecha>-<local>-<visitante>`) y nunca se toca a mano. La hinchada suma de local `4 × log10(hinchas + 1)` puntos de fuerza; de visitante no suma.
- **Comandos** (en `club-hinchas/`):
  - `node scripts/liga.mjs jugar --hinchas <N>` juega la próxima fecha, la guarda en `src/liga/estado.json` y escribe `src/liga/fecha.json`.
  - `node scripts/liga.mjs club --nombre ...` cambia los datos del club.
  - El carrusel se renderiza con `npx remotion still TikTok-1-Partido ...`. Qué slides lleva se elige en `src/liga/redes.json` (`diapositivas`, `mostrarRedes`, `mudanza`).
- **Fechas jugadas:**
  - **Fecha 1** (1.013 hinchas): FC NTLE 2-0 Ferro Magnético, de local. El club quedó 3.º.
  - **Fecha 2** (1.131 hinchas): Big Bang 6-3 FC NTLE, de visitante. Bajó al 6.º puesto, con 3 puntos.
  - **Fecha 3** (1.175 hinchas): FC NTLE 6-2 Juventud Tsunami, de local. Subió al 4.º puesto, con 6 puntos.
  - **Fecha 4** (1.307 hinchas): Gravedad 3-0 FC NTLE, de visitante (tenía 6 % de chance). Bajó al 7.º puesto, con 6 puntos, a 4 del puntero (Big Bang, 10).
- **Bengalas** (regla nueva desde la fecha 3):
  - Cada compartido de los videos es una bengala, y suma **0,05 % de chance de ganar, solo de local, con un tope de 90 %**. El simulador ajusta la fuerza para que la chance real dé exactamente eso.
  - Cuentan los compartidos de los videos publicados desde el último partido de local hasta el próximo.
  - Las primeras van para la **fecha 5, de local contra Agujero Negro**: los compartidos de los videos de las fechas 3 y 4. El usuario pasa ese número antes de jugarla.
  - Se juega con `jugar --hinchas N --bengalas B`. En el código: `POR_BENGALA` y `TOPE` en `scripts/liga.mjs`, y `chanceLocalVs()` en `Futbol.tsx`.
  - En el estadio se ven como puntos rojos que titilan (componente `Bengala` y la prop `bengalas` de `Potrero`). El carrusel suma el slide `bengalas`.
- **Cierre de los videos:** compartí para prender bengalas, y seguí la cuenta porque cada seguidor nuevo es un hincha más en la tribuna.
- **Próxima, fecha 5:** de local contra Agujero Negro (3.º). El video de la fecha 3 tuvo **421 compartidos = 421 bengalas** (guardadas en `redes.json` → `bengalas.acumuladas`). Con 1.307 hinchas: 45 % sin bengalas, **66 % con las 421**, y el tope de 90 % llega con 905 (faltan 484).
  - Antes de jugarla, el usuario pasa los seguidores y los compartidos del video de la fecha 4. Se juega con `jugar --hinchas N --bengalas (421 + compartidos nuevos)`.
  - Las funciones `chanceVisitanteVs()` y `bengalasParaTope()` de `Futbol.tsx` dan la chance de visitante y cuántas bengalas faltan para el tope.
- **Suspenso en los videos del club** (desde la fecha 4): pregunta en el primer segundo ("¿le podemos ganar al tercero?"), barra de "LA RESPUESTA" arriba que se llena hasta el número final y un adelanto sin resolver ("¿llegamos antes del partido?").
- **ElevenLabs:** el 6/11 quedaron ~337 créditos; una toma de 55 s cuesta 920. Hay que recargar antes del próximo video con voz.
- **Pausa (7/11/2026):** por falta de créditos, el usuario avisó que **hasta nuevo aviso no hay videos de fútbol**. Se publicó la imagen `club-hinchas/entrega/avisos/disculpas-sin-voz.png` (composición `Aviso-SinVoz`). La fecha 5 queda sin jugar hasta que el usuario la retome; las 421 bengalas siguen guardadas en `redes.json`.
- **Resto del fixture del club:**
  - F4: Gravedad (V)
  - F5: Agujero Negro (L)
  - F6: Fotosíntesis (V)
  - F7: Pi (L)
  - F8: Supernova (V)
  - F9: Neutrón (L)
  - F10 a F18: la vuelta
- **Preferencias del usuario para la serie:**
  - Desde la fecha 2 se publica **solo en TikTok**. En los videos **no se menciona Instagram**.
  - En TikTok el carrusel va en **9:16** (composiciones `TikTok-*`) y el botón "Seguir" va en rojo.
  - Cada día: **un video** (resumen de la fecha, con voz) y **un carrusel** (partido, resultados, tabla y cancha), con sus descripciones y hashtags.
  - Los datos tienen que ser reales: por ejemplo, no decir "más de mil en un día" si no fue así.
  - Para la fecha del día, el usuario pasa los seguidores antes de publicar.

## 6 bis · Juegos para los vivos de TikTok (`vivo-juegos/`)

- El usuario quiere hacer vivos con minijuegos donde la gente comenta y suma puntos (idea sacada de un vivo de "Adiviná el país").
- Hechos (9/11/2026):
  - **Adiviná el país por su bandera:** 193 países de la ONU, de fácil a difícil.
  - **¿Verdadero o falso?:** 63 datos con fuente.
  - **Mixto:** alterna los dos.
- Cómo funciona:
  - `servidor.mjs` lee el chat del vivo con `tiktok-live-connector` (no oficial, gratis) y se lo pasa por SSE a la página `http://localhost:3000`.
  - La página se captura en TikTok LIVE Studio u OBS. Corre en la PC Windows del usuario con `iniciar.bat`; `probar.bat` abre el modo prueba, con jugadores de mentira.
  - Puntos: 100 por acierto y 50 extra al primero. En verdadero o falso los puntos se reparten al revelar, para no adelantar la respuesta.
- El corrector está en `public/respuestas.js`, con 68 pruebas (`npm test`).
- Sumados con el OK del usuario:
  - **¿Cuánto?:** 44 preguntas de números; ganan los tres que más se acercan.
  - **Adiviná el logo:** 136 marcas de Simple Icons, que empiezan difuminadas y se aclaran; cuanto antes se acierta, más puntos.
- El menú quedó con 5 opciones (1 a 5); la quinta es el mixto de los cuatro juegos. El corrector tiene 103 pruebas.

## 7 · YouTube (pendiente)

- **Canal:** "Nadie Te Lo Explicó", @nadietelo.explico. La descripción sugerida está en el chat.
- **Banner:** `youtube-canal/entrega/banner-youtube.png`, sin el recuadro de FC NTLE (el usuario lo pidió así).
- **Plan de subidas** en `youtube-canal/SUBIDAS.md`: los 4 reels de Instagram como Shorts, 2 por día, a las 12:30 y a las 19:30 de Argentina, con título, descripción y 5 hashtags cada uno.
  - Jue 5/11, 12:30: Binance.
  - Jue 5/11, 19:30: Espejo.
  - Vie 6/11, 12:30: Tormentas.
  - Vie 6/11, 19:30: El Niño.
  - Si las fechas ya pasaron, se corren a los próximos días con los mismos horarios.
- **Qué quiere el usuario:** que Claude los suba y programe en **YouTube Studio desde su Chrome, por Remote Control**.
  - La sesión en la nube no pudo hacerlo: la PC `DESKTOP-GTG8C9P` (Windows) no compartía carpetas, probablemente porque la app de Claude necesitaba actualizarse.
  - En la PC: abrir Chrome con un perfil aparte, que el usuario inicie sesión en YouTube él mismo (nunca escribir su contraseña) y subir y programar desde Studio (Visibilidad → Programar).
  - No usar la API de YouTube: los videos de apps sin verificar quedan privados.
  - Mandar una captura de cada video programado.
- **Opcional, ofrecido:** versiones con "Suscribite" y el botón rojo de YouTube, y videos largos a partir de los reels (por ejemplo, la historia completa de Binance).

## 8 · Forma de trabajar que le gustó al usuario

- Contestar en español rioplatense, claro y directo.
- Para cada entrega:
  - mandar los archivos;
  - dar la descripción lista para copiar con 5 hashtags;
  - explicar qué subir, dónde y en qué orden.
- Revisar fotogramas antes del render final y corregir lo que se pisa o se corta.
- Avisar cuando un número cambia la historia. Por ejemplo, con 894 seguidores ya no se podía decir "casi vacía".
