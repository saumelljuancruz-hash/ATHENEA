/**
 * GUION — "¿Por qué los aviones hacen una curva en el mapa?"
 *
 * Plantilla reutilizable: todos los textos visibles, las frases que anclan cada
 * escena a la voz y los volúmenes viven acá. Para otro Reel de la cuenta,
 * duplicá este archivo y cambiá los valores; los componentes no tienen texto
 * hardcodeado.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-avion.mp3",
  timestamps: "voz-avion-timestamps.json",
};

/** Volúmenes de voz y música (los efectos están en src/comun/Sonido.tsx). */
export const VOLUMEN = {
  voz: 1,
  /** Volumen nominal de la música. */
  musica: 0.08,
  /** Factor aplicado a la música mientras habla la voz (ducking). */
  ducking: 0.5,
};

/** Texto completo de la voz en off (referencia; el timing sale de los timestamps). */
export const TEXTO_VOZ =
  "Si mirás un vuelo en el mapa, parece que da una vuelta enorme. Pero esa curva es el camino más corto. La Tierra es redonda, y para dibujarla plana hay que estirarla. Por eso Groenlandia parece igual de grande que África, cuando en realidad África es catorce veces más grande. ¿Alguna vez miraste la ruta de tu vuelo en la pantallita del avión? Contámelo en los comentarios. Ahora tirá un hilo sobre un globo terráqueo, de Nueva York a Tokio. El hilo pasa cerca de Alaska. Y es justo por donde vuela el avión. Esa ruta se llama gran círculo, y ahorra horas de vuelo y muchísimo combustible. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

/**
 * Cada escena empieza en la primera palabra de su frase de anclaje
 * (se buscan en los timestamps ignorando mayúsculas, tildes y puntuación).
 * El Remate no tiene voz: ocupa la pausa entre `remateDespuesDe` y la CTA.
 */
export const ANCLAS = {
  mapaMiente: "La Tierra es redonda",
  pausa: "Alguna vez miraste",
  prueba: "Ahora tirá un hilo",
  granCirculo: "Esa ruta se llama",
  remateDespuesDe: "muchísimo combustible",
  cta: "Seguí la cuenta",
  /** Segundos que cada escena se adelanta a su palabra de anclaje. */
  adelanto: 0.12,
};

/**
 * Pausa para el Remate. Si la locución no la trae (silencio menor a
 * `silencioMinimo`), se inserta cortando la voz en el silencio después de la frase.
 */
export const PAUSA_REMATE = {
  despuesDe: "muchísimo combustible",
  segundos: 2.5,
  silencioMinimo: 2,
};

/** Momentos internos de cada escena, también anclados a frases de la voz. */
export const MARCAS = {
  hook: {
    vueltaEnorme: "vuelta enorme",
    curva: "esa curva",
    corto: "más corto",
  },
  mapaMiente: {
    plana: "dibujarla plana",
    estirar: "estirarla",
    groenlandia: "Groenlandia",
    africa: "África",
    realidad: "en realidad",
    catorce: "catorce veces",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  prueba: {
    hilo: "un hilo",
    nuevaYork: "Nueva York",
    tokio: "Tokio",
    alaska: "Alaska",
    vuela: "justo por donde",
    avion: "el avión",
  },
  granCirculo: {
    granCirculo: "gran círculo",
    horas: "horas de vuelo",
    combustible: "muchísimo combustible",
  },
  cta: {
    cuenta: "la cuenta",
    usas: "lo que usás",
  },
};

/** Palabras que se pintan en verde agua dentro de los subtítulos. */
export const PALABRAS_CLAVE = [
  "curva",
  "corto",
  "redonda",
  "estirarla",
  "groenlandia",
  "africa",
  "catorce",
  "comentarios",
  "hilo",
  "alaska",
  "avion",
  "gran",
  "circulo",
  "combustible",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  /** Se permiten 4 palabras si el bloque entra en estos caracteres. */
  maxCaracteresCon4: 17,
  /** Escenas donde los subtítulos se ocultan (la pantalla ya muestra el texto). */
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    nuevaYork: "NUEVA YORK",
    tokio: "TOKIO",
    pregunta: "¿no es más corto así?",
    contador: "DISTANCIA",
  },
  mapaMiente: {
    seccion: "01",
    titulo: "EL MAPA MIENTE",
    ecuador: "ecuador: ×1",
    polo: "60° N: ×4 de área",
    groenlandia: "GROENLANDIA",
    africa: "ÁFRICA",
    escalaReal: "escala real",
    resultado: "África = 14 × Groenlandia",
    contadorEstirar: "ÁREA A 60° N",
    contadorAfrica: "ÁFRICA",
    contadorRatio: "ÁFRICA ÷ GROENLANDIA",
    unidadArea: "km²",
  },
  pausa: {
    pregunta: "¿Alguna vez miraste la ruta de tu vuelo en la pantallita del avión?",
    pie: "Contámelo en los comentarios",
    opciones: ["SÍ", "NUNCA"],
    emoji: "💬",
  },
  prueba: {
    seccion: "02",
    titulo: "LA PRUEBA",
    nuevaYork: "Nueva York",
    tokio: "Tokio",
    alaska: "Alaska",
    contador: "LATITUD MÁX.",
  },
  granCirculo: {
    seccion: "03",
    titulo: "GRAN CÍRCULO",
    recta: "más larga",
    curva: "más corta",
    horas: "menos horas",
    combustible: "menos combustible",
    contador: "AHORRO",
    horasSufijo: "h menos",
  },
  remate: ["NO ES UNA CURVA", "ES UNA RECTA", "SOBRE UNA ESFERA"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

/** Datos reales (km²) usados por los contadores. */
export const DATOS = {
  areaAfrica: 30_370_000,
  areaGroenlandia: 2_166_000,
  velocidadCrucero: 900, // km/h, para estimar horas ahorradas
};
