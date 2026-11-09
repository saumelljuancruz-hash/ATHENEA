# Juegos en vivo · @nadietelo.explico

Juegos para los vivos de TikTok: la gente comenta la respuesta en el chat, el juego la corrige solo y suma puntos en un ranking. Hay tres modos:

| Tecla | Juego | Cómo se juega |
|---|---|---|
| **1** | **Adiviná el país por su bandera** | Aparece una bandera y la gente comenta el país. Acepta la respuesta sin tildes ni mayúsculas, con variantes ("eeuu", "holanda") y con errores de tipeo chicos. No vale tirar varios países juntos. Salen primero las banderas fáciles y después las difíciles (193 países de la ONU). |
| **2** | **¿Verdadero o falso?** | Aparece un dato curioso y la gente comenta **V** o **F**. Vale el primer voto de cada uno. Se ve en vivo qué porcentaje votó cada opción, y al final se revela la respuesta con la explicación y la fuente. Hay 63 datos, todos con fuente. |
| **3** | **Mixto** | Alterna una bandera y un verdadero o falso. |

**Puntos:** 100 por acierto y 50 extra para el primero que acierta. El top 5 se actualiza en vivo, y al final de la partida aparece el podio.

## 1 · Instalar (una sola vez)

1. Instalá **Node.js** (la versión LTS) desde [nodejs.org](https://nodejs.org).
2. Bajá esta carpeta: en GitHub, entrá al repositorio, elegí la rama `claude/reel-tormentas-electricas-7xdwvl`, tocá **Code → Download ZIP** y descomprimilo. Los juegos están en la carpeta `vivo-juegos`.

## 2 · Ensayar sin estar en vivo

Hacé doble clic en **`probar.bat`**.
- La primera vez instala lo necesario, y tarda un minuto.
- Se abre la ventana del juego con **jugadores de prueba** que comentan solos.
- Apretá **1**, **2** o **3** para elegir el juego.

## 3 · Jugar en el vivo

1. **Empezá el vivo** en **TikTok LIVE Studio**, en vertical.
2. Hacé doble clic en **`iniciar.bat`**.
   - Se abre la ventana del juego y el programa busca tu vivo cada 20 segundos.
   - Cuando lo encuentra, arriba a la izquierda el punto se pone verde y los comentarios empiezan a contar.
3. **Agregá el juego a la transmisión.** En LIVE Studio, sumá una fuente de **captura de ventana**, elegí la ventana del juego y estirala a toda la pantalla.
   - **Con OBS:** agregá una fuente **Navegador** con la dirección `http://localhost:3000`, de 1080 × 1920.
4. Apretá **1**, **2** o **3** en la ventana del juego y listo.

## Teclas

| Tecla | Qué hace |
|---|---|
| 1 · 2 · 3 | Elegir juego (desde el menú) |
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

Las banderas salen del paquete [flag-icons](https://github.com/lipis/flag-icons) (licencia MIT).
