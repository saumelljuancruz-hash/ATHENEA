# Carrusel · 6 cosas de tu celular que nadie te explicó

**Cuenta:** @nadietelo.explico · **Formato:** 8 slides de 1080 × 1350 (4:5, el que más espacio ocupa en el feed) · **Archivos:** `entrega/01-portada.png` … `entrega/08-cierre.png`

## Qué tomé de la publicación de referencia

De la publicación de @juanpicrea solo se puede ver la portada sin iniciar sesión ("Robá mi Sistema de CARRUSELES · 6 reglas que uso para crear contenido que vende", con la descripción "Comenta CARRU"). De ahí tomé:

1. **Título en dos niveles:** una línea normal y una palabra clave gigante en color de acento que ocupa todo el ancho ("CELULAR").
2. **Un objeto grande en primer plano que pisa el título:** el celular tapa la parte de abajo de la palabra y el dedo lo toca, para dar profundidad.
3. **El número en el gancho:** "6 cosas", con el 6 resaltado, igual que "6 reglas".
4. **El @ visible en la portada y una flecha para deslizar.**
5. **Un llamado a comentar:** en lugar de una palabra para recibir algo por mensaje directo, "Comentá el número" del dato que no sabías. Si más adelante usás una herramienta de respuestas automáticas, se puede cambiar por "Comentá CELU y te mando 6 más".

El resto es nuestro estilo de los reels: fondo oscuro con brillo turquesa, Montserrat negrita con la palabra clave en amarillo, paneles de vidrio, el logo como marca de agua y las ilustraciones de motion graphics (el celular, el dedo y la cara). Además, cada slide tiene un solo dato, un número de avance ("3/6"), puntos de progreso y "DESLIZÁ →", y todos los datos son de algo que el que mira tiene en la mano.

## Slides

| # | Título | Texto | Ilustración |
|---|---|---|---|
| 1 | **6** cosas de tu **CELULAR** que **nadie te explicó.** | — | Celular con un "?" gigante pisando la palabra, el dedo tocándolo y etiquetas de los datos flotando alrededor (¡CLIC!, @, 80%, 4 KB, QR). |
| 2 | El **¡CLIC!** de la cámara es **falso** | Tu celular no tiene obturador mecánico: ese sonido es una grabación. En Japón ni siquiera lo podés apagar. | Celular con la cámara frontal, un parlante que larga "¡CLIC! = AUDIO GRABADO" y un obturador tachado. |
| 3 | El **agujerito** al lado de la cámara es un **micrófono** | En muchos celulares, graba el sonido de tus videos y ayuda a limpiar el ruido de fondo. | Módulo de cámaras con el agujerito marcado, ondas de sonido y la etiqueta "MICRÓFONO". |
| 4 | Un **QR** se lee aunque le falte hasta el **30%** | Guarda la información repetida a propósito: con la corrección más alta, recupera lo que falta. | Un QR con una esquina arrancada (30 % del área), el marco del escáner, "−30%" y "SE LEE IGUAL". |
| 5 | La **@** era una medida de **peso** | En español se llama arroba por una vieja unidad de peso: unos 11,5 kilos. | Una balanza con la @ de un lado y una pesa de 11,5 kg del otro. |
| 6 | Tu celular tiene **2 millones** de veces más memoria que el **Apolo 11** | La computadora que llevó al hombre a la Luna tenía unos 4 KB de RAM. Un celular común, 8 GB. | El cohete con un puntito de "4 KB", un bloque turquesa de "8 GB" y "×2.000.000". |
| 7 | Cargarlo al **100%** todas las noches lo **gasta** | Las baterías de litio sufren llenas o vacías. Entre 20 y 80% duran más años: activá la carga optimizada. | Una batería con la zona ideal de 20 a 80 % en turquesa y las de estrés en rojo. |
| 8 | ¿Cuál **NO** sabías? | Comentá el número · Guardalo y mostráselo a alguien | Seis círculos numerados, la tarjeta de perfil con el logo y el botón "Seguir". |

## Descripción para Instagram

6 cosas de tu celular que nadie te explicó 📱
La 6 te sirve hoy mismo: cambiala antes de enchufarlo esta noche.
Comentá el número del que no sabías, guardalo y seguí a @nadietelo.explico para más datos así.

#celular #datoscuriosos #sabiasque #tecnologia #ciencia

## De dónde salen los datos

- **Clic de la cámara:** los celulares usan obturador electrónico y el sonido lo reproduce el software. En Japón los celulares que se venden suenan siempre al sacar una foto.
- **Micrófono:** en el iPhone, el orificio entre las cámaras y el flash es uno de los micrófonos, y lo usa para grabar video y reducir ruido. Muchos Android hacen lo mismo, pero no todos.
- **QR:** el estándar tiene cuatro niveles de corrección de errores (L 7 %, M 15 %, Q 25 %, H 30 %), según Denso Wave, que inventó el código.
- **Arroba:** el diccionario de la RAE la define como un peso de 11,502 kg.
- **Apolo 11:** la computadora de navegación tenía 2.048 palabras de memoria borrable, unos 4 KB (NASA). 8 GB / 4 KB ≈ 2 millones.
- **Batería:** las baterías de litio se degradan más rápido cuando pasan mucho tiempo al 100 % o se descargan del todo. Por eso iOS tiene "Carga optimizada" y Android "Carga adaptable" o "Proteger batería".

## Cómo regenerarlo

```console
npm i
npm run dev                                                          # ver y editar en Remotion Studio
npx remotion render Carrusel out/slides --sequence --image-format=png
```
