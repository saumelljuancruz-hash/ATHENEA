# Guía para armar un Reel de @nadietelo.explico

Todo lo que hay que respetar al escribir el guion y animar un video nuevo. Antes de grabar la voz,
el guion tiene que pasar el **checklist** del final.

---

## 1. Estilo de la cuenta

- **Formato:** 1080×1920, 60 fps, MP4 H.264 + AAC, Remotion. Salida en `out/<reel>.mp4`.
- **Look (desde ácaros en adelante): ilustración cálida y humana, NO gris oscuro.**
  - **Fondos con color:** gradientes suaves y vivos (cielo → lavanda, durazno → coral, menta → turquesa,
    amarillo manteca). Para la noche, azul índigo con luces cálidas, nunca gris carbón ni negro.
  - **Dibujos humanos:** ilustración plana con formas redondeadas, sombras suaves y algo de textura.
    Personas con cara y expresión (ojos, cejas, boca), tonos de piel variados, manos y gestos.
    Los objetos y bichos pueden tener carita/personalidad cuando suma.
  - **Escenas cotidianas reconocibles** (la cocina, la cama, el colectivo, la mano con el celular)
    antes que diagramas técnicos. Los diagramas, si hacen falta, también con color y calidez.
  - Nada de siluetas grises ni maquetas frías: si algo se ve "de manual técnico", rehacerlo.
  - **Cómo se arma:** personajes con `src/comun/personajes/Personaje.tsx` (cara con parpadeo y expresiones,
    parado o sentado, manos, celular, pierna floja, tambaleo) y lugares de `Lugares.tsx` (baño, living,
    dormitorio). Subtítulos con `pastilla: true`; gancho y portada con `tono` violeta/borravino cálido;
    CTA con `fondo` en gradiente cálido. Un mismo personaje por Reel (`ESTILO` en el Hook).
- **Colores de acento:** turquesa #3ee0c0 (lo correcto / principal), rojo coral #ff5a4e (lo engañoso),
  azul #4aa3ff (datos), amarillo #ffc94a, naranja #ff7a3d, rosa #ff4f7a.
- **HUD:** etiquetas en JetBrains Mono 22–26 px con línea guía animada de 1 px; contador abajo a la izquierda.
  Paneles con buen contraste sobre fondos de color (claros o translúcidos), no bloques negros pesados.
- **Título de sección:** badge "01" con borde turquesa + Inter bold en mayúsculas.
- **Subtítulos:** Inter Bold **50 px** blanco (más chicos para no tapar el video), 2–4 palabras,
  palabra clave en turquesa, tercio inferior.
- **Zonas libres:** ~250 px abajo y ~150 px a la derecha (interfaz de Instagram).
- **Audio:** voz 100 %, música 8 % con ducking, efectos sutiles y puntuales.
- **Textos:** todos en `src/<reel>/guion-<reel>.ts` (nada hardcodeado en los componentes).
- **Portada:** `PORTADA` en el guion; pregunta gigante con la palabra clave en color, todo dentro del recorte 4:5.

## 2. Estructura del video

Hook → 01 → 02 → 03 → **CTA** → loop.

- **Sin pausa para comentarios.** Nada de tarjeta "Contame en los comentarios" ni frase de la voz
  pidiendo comentarios: en los datos de la cuenta, ahí la retención cae casi un 30 %.
- **Sin triple texto (Remate):** no hay escena de 3 líneas en mayúsculas. La idea central la repite la voz
  en la última frase, sobre una imagen de la sección 03.
- **Sin silencios:** no se inserta pausa (no se usa `PAUSA_REMATE`) y el guion no lleva `[pausa]`.
- **CTA:** "¿LO SABÍAS?", teléfono con el Reel, dedo que toca **MANDÁSELO ➤** → SEGUIME → ✓ Siguiendo.
- **Loop:** los últimos **45 frames (≈ 0,75 s)** funden suave al primer cuadro del Hook (`CierreLoop`).

## 3. Lo aprendido sobre alcance

- **Pedir comentarios en el medio del video hace caer la retención ~30 %** (dato de la cuenta).
  La interacción se pide en la descripción y en el comentario fijado, nunca frenando el video.
- **Ningún silencio largo:** cualquier pausa sin voz (como la del remate) es un punto de salida.
- **El triple texto del remate no suma:** se sacó de la estructura.
- **Lo cotidiano engancha más:** temas que le pasan a cualquiera en el día (dormir, comer, el celular,
  el cuerpo) y dibujos cálidos y humanos en los que la gente se reconoce.

- **Primer segundo:** la pregunta o el dato tiene que estar **escrito en pantalla desde el cuadro 1**
  (como la portada), no solo en los subtítulos. Si la gente salta en los primeros 2–3 s, el Reel muere.
- **Duración:** apuntar a **20–35 s**. Más largo = menos gente llega al final.
- **Compartidos:** que lo manden por mensaje es la señal más fuerte para llegar a no seguidores.
  El cierre tiene que invitar a mandarlo ("Mandáselo a…").
- **Constancia:** 4–7 Reels por semana durante 1–2 meses; cada video es un intento.
- **Originalidad:** si se usan clips reales ajenos, pedir permiso y dar crédito, y sumar algo propio
  (título, explicación, voz). Alternativa legal: Pexels / Pixabay.
- **Audio en tendencia:** se puede sumar desde la app, muy bajo debajo de la voz.
- **Formato "video real":** fondo negro, logo + usuario arriba, frase corta con la palabra clave en color,
  video impactante al centro, momento fuerte cerca del final.

## 4. Animación humanizada (no robótica)

Que se sienta animado por una persona, no por una máquina:

- **Nada a velocidad constante ni con movimiento lineal.** Todo arranca, acelera y frena.
- **Resortes con un poquito de rebote:** las cosas llegan, se pasan apenas y se acomodan
  (`spring` en `Cortes` y `Planos`).
- **Cámara en mano:** vaivén chico e irregular siempre activo (`pulsoMano`): la imagen nunca está quieta.
- **Movimiento secundario:** los personajes se balancean, "respiran" (estiran y encogen apenas),
  mueven la cabeza y las patas aunque estén quietos.
- **Ritmos irregulares:** períodos distintos que no coinciden (sumas de senos), cada elemento con su
  propia semilla; nada sincronizado como un metrónomo.
- **Escalonado:** los elementos de un grupo entran uno después del otro, no todos juntos.
- **Textos vivos:** el gancho y los títulos laten y se mueven apenas, cada línea a su ritmo.
- **Personalidad:** los personajes tienen intención (tantean, se frenan, se miran), no solo se desplazan.

## 5. Las 30 estrategias de retención

### Ganchos de storytelling
1. Planteá una incógnita
2. Prometé una revelación
3. Interrumpite a vos mismo
4. Empezá con una confesión
5. Contá una mini historia
6. Abrí con un dato que choque
7. Generá curiosidad sin revelar todo
8. Usá el "pero" narrativo
9. Mostrá una transformación
10. Hacé una pregunta abierta

### Prueba y autoridad
11. Mostrá evidencia concreta
12. Citá números específicos
13. Usá una analogía visual
14. Rompé una creencia común

### Estructura y edición
15. Cortá cada 2-3 segundos
16. Usá zooms dinámicos
17. Cambiá el encuadre seguido
18. Agregá subtítulos en movimiento
19. Insertá B-roll que complemente
20. Meté pausas dramáticas
21. Usá efectos de sonido puntuales

### Interacción y tensión
22. Hacé una pregunta directa a la cámara
23. Creá un loop visual
24. Usá un cliffhanger al final
25. Dejá un espacio para que el espectador complete la frase
26. Autocorregite en el momento
27. Mostrá un error y cómo lo solucionás

### Cierre y retención
28. Repetí el concepto clave con otras palabras
29. Conectá con una emoción específica
30. Cerrá con una micro-CTA que no sea vender

## 6. Checklist antes de grabar la voz

**Guion**
- [ ] Las primeras 8 palabras son un dato que choca, una incógnita o una creencia rota (1, 6, 14).
- [ ] Hay una promesa de revelación en los primeros 3 s (2, 7).
- [ ] Hay al menos un "pero" que da vuelta la historia (8).
- [ ] Hay una mini historia, confesión o autocorrección con tono cercano (3, 4, 5, 26).
- [ ] Al menos 2 números concretos (12).
- [ ] **No pide comentarios** en ningún momento del video (va en la descripción y el comentario fijado).
- [ ] **No tiene `[pausa]`**: la voz va de corrido hasta el "Mandáselo".
- [ ] La última frase repite la idea central con otras palabras (28) y toca una emoción (29).
- [ ] Es algo que le pasa a la gente en su día a día (o se conecta con eso en la primera frase).
- [ ] El cierre es una micro-CTA para mandar o comentar, o un cliffhanger de parte 2 (24, 30).
- [ ] La voz dura 20–35 s.

**Animación**
- [ ] La pregunta está escrita en pantalla desde el cuadro 1.
- [ ] Cambio de encuadre, zoom o corte cada 2–3 s, en las palabras clave (15, 16, 17).
- [ ] Evidencia visual de cada dato: contador, gráfico o comparación (11, 13).
- [ ] Hay una transformación de antes a después (9).
- [ ] Algún clip real (B-roll) de 1–2 s si suma (19).
- [ ] Efectos de sonido solo en los momentos clave (21).
- [ ] El último cuadro empalma con el primero: fundido de ≈ 0,75 s (loop visual, 23).
- [ ] Movimiento humanizado: resortes, cámara en mano, movimiento secundario, ritmos irregulares.
- [ ] Subtítulos a 50 px. Sin escena de remate (triple texto) y sin silencios.
- [ ] Look cálido y humano: fondos con color, personas con cara y expresión, nada gris oscuro.
