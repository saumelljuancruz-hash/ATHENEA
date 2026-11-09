# Juegos en vivo · @nadietelo.explico

Juegos para los vivos de TikTok: la gente comenta la respuesta en el chat, el juego la corrige solo y suma puntos en un ranking. Hay cinco modos:

| Tecla | Juego | Cómo se juega |
|---|---|---|
| **1** | **Adiviná el país por su bandera** | Aparece una bandera y la gente comenta el país. Acepta la respuesta sin tildes ni mayúsculas, con variantes ("eeuu", "holanda") y con errores de tipeo chicos. No vale tirar varios países juntos. Salen primero las banderas fáciles y después las difíciles (193 países de la ONU). |
| **2** | **¿Verdadero o falso?** | Aparece un dato curioso y la gente comenta **V** o **F**. Vale el primer voto de cada uno. Se ve en vivo qué porcentaje votó cada opción, y al final se revela la respuesta con la explicación y la fuente. Hay 63 datos, todos con fuente. |
| **3** | **¿Cuánto?** | Una pregunta con un número de respuesta ("¿cuántos huesos tiene el cuerpo?"). Cada uno comenta un número y vale el primero. Entiende "384.400", "67,5", "384 mil", "1,3 millones" y "un palo". Al final se ven todos los números en una regla, y los tres que más se acercaron ganan 150, 100 y 50; los que la clavan justo, 150. Hay 44 preguntas, todas con fuente. |
| **4** | **Adiviná el logo** | Aparece un logo **difuminado** que se va aclarando con el tiempo, con una pista de la categoría (ropa, app, videojuegos, autos…). Cuanto antes se acierta, más puntos: de 150 apenas aparece a 50 cuando ya se ve entero. Hay 136 marcas, de fácil a difícil. |
| **5** | **Mixto** | Alterna los cuatro: bandera, verdadero o falso, logo y ¿cuánto? |

**Puntos:** 100 por acierto, y 50 extra para el primero que acierta. En los logos, los puntos dependen de qué tan rápido acertás, y en "¿Cuánto?" ganan los que más se acercan. El top 5 se actualiza en vivo, y al final de la partida aparece el podio.

## 1 · Instalar (una sola vez)

1. Instalá **Node.js** (la versión LTS) desde [nodejs.org](https://nodejs.org).
2. Bajá esta carpeta: en GitHub, entrá al repositorio, elegí la rama `claude/reel-tormentas-electricas-7xdwvl`, tocá **Code → Download ZIP** y descomprimilo. Los juegos están en la carpeta `vivo-juegos`.

## 2 · Ensayar sin estar en vivo

Hacé doble clic en **`probar.bat`**.
- La primera vez instala lo necesario, y tarda un minuto.
- Se abre la ventana del juego con **jugadores de prueba** que comentan solos.
- Apretá un número del **1** al **5** para elegir el juego.

## 3 · Jugar en el vivo

1. **Empezá el vivo** en **TikTok LIVE Studio**, en vertical.
2. Hacé doble clic en **`iniciar.bat`**.
   - Se abre la ventana del juego y el programa busca tu vivo cada 20 segundos.
   - Cuando lo encuentra, arriba a la izquierda el punto se pone verde y los comentarios empiezan a contar.
3. **Agregá el juego a la transmisión.** En LIVE Studio, sumá una fuente de **captura de ventana**, elegí la ventana del juego y estirala a toda la pantalla.
   - **Con OBS:** agregá una fuente **Navegador** con la dirección `http://localhost:3000`, de 1080 × 1920.
4. Apretá un número del **1** al **5** en la ventana del juego y listo.

## Teclas

| Tecla | Qué hace |
|---|---|
| 1 a 5 | Elegir juego (desde el menú) |
| Espacio | Pausa |
| → | Saltar: revela la respuesta o pasa a la próxima pregunta |
| R | Otra partida del mismo juego |
| M | Volver al menú |
| B | Prender o apagar los jugadores de prueba |
| C | Escribir un comentario a mano, para probar |
| S | Sonido sí o no |
| F | Pantalla completa |

## Cambiar la duración

En la barra de direcciones se puede agregar, por ejemplo, `http://localhost:3000/?preguntas=50&segundos=20`.

| Opción | Qué cambia | Valor por defecto |
|---|---|---|
| `preguntas` | Preguntas por partida | 30 |
| `segundos` | Segundos para cada bandera | 15 |
| `segundosvf` | Segundos para cada verdadero o falso | 18 |
| `segundoscuanto` | Segundos para cada ¿cuánto? | 20 |
| `segundoslogo` | Segundos para cada logo (lo que tarda en aclararse) | 20 |
| `revelar` | Segundos que se muestra la respuesta | 6 |

## Si no se conecta al vivo

- **Primero, revisá esto:**
  - Tenés que estar **en vivo** y con la cuenta **@nadietelo.explico**. Para usar otra cuenta: `node servidor.mjs otra.cuenta`.
  - El programa lee el chat con [tiktok-live-connector](https://github.com/zerodytrash/TikTok-Live-Connector), una librería gratis que **no es oficial de TikTok**. Si TikTok cambia algo, puede dejar de andar hasta que la actualicen. En ese caso, abrí una terminal en la carpeta y corré `npm update`.
- **Si sigue sin conectarse, poné una clave gratis.** Si dice que hay demasiadas conexiones o que no se pudo firmar, la librería usa un servicio gratis con límites que se puede ampliar con una clave sin costo:
  1. Sacá la clave en [eulerstream.com](https://www.eulerstream.com).
  2. Pegala sola en un archivo `clave-euler.txt` en esta carpeta. Ese archivo no se sube a GitHub.

## Reglas para no tener problemas en TikTok

- Los puntos son solo para el ranking: **no prometas premios con plata** ni cosas que cuesten algo.
- **No des ventajas a cambio de regalos:** que gane el que sabe.

## Archivos

| Archivo | Qué es |
|---|---|
| `servidor.mjs` | Lee los comentarios del vivo y se los pasa al juego, que se ve en `http://localhost:3000`. |
| `public/juego.js` | El juego: rondas, reloj, puntos, ranking y jugadores de prueba. |
| `public/respuestas.js` | Cómo se corrige cada comentario. Las pruebas están en `pruebas/respuestas.test.mjs` y se corren con `npm test`. |
| `public/datos/paises.json` | Los 193 países con sus nombres aceptados. Sale de `herramientas/armar-paises.mjs`. |
| `public/datos/verdadero-falso.json` | Los datos de verdadero o falso, cada uno con su explicación y su fuente. |
| `public/datos/cuanto.json` | Las preguntas de ¿cuánto?, con su respuesta, su explicación y su fuente. |
| `public/datos/logos.json` | Las 136 marcas, con su categoría y las formas aceptadas de escribirlas. Sale de `herramientas/armar-logos.mjs`. |

Las banderas salen del paquete [flag-icons](https://github.com/lipis/flag-icons) (licencia MIT).

Los logos salen de [Simple Icons](https://simpleicons.org) (licencia CC0). Son marcas registradas de sus dueños y acá se muestran solo para que la gente las reconozca en el juego. Algunas marcas pidieron salir de Simple Icons (Microsoft, Amazon, Xbox y Nintendo, entre otras), así que no están.
