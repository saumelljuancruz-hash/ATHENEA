/**
 * GUION — "¿Cómo calienta la comida un microondas?"
 *
 * Misma plantilla que los otros Reels: textos visibles, frases que anclan cada
 * escena a la voz y volúmenes. Los componentes no tienen texto hardcodeado.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-microondas.mp3",
  timestamps: "voz-microondas-timestamps.json",
};

/** Volúmenes de voz y música (los efectos están en src/comun/Sonido.tsx). */
export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  /** Factor aplicado a la música mientras habla la voz (ducking). */
  ducking: 0.5,
};

/** Texto completo de la voz en off (referencia; el timing sale de los timestamps). */
export const TEXTO_VOZ =
  "El microondas no calienta la comida. Calienta el agua que tiene adentro. Una pieza llamada magnetrón lanza ondas invisibles. Esas ondas hacen girar las moléculas de agua dos mil cuatrocientos millones de veces por segundo. Y con tanto roce, se calientan. ¿Vos también comiste algo hirviendo por fuera y helado por dentro? Contámelo en los comentarios. Pasa porque las ondas no llegan igual a todos lados: hay puntos calientes y puntos fríos. Por eso el plato gira. Y el plato se calienta solo por tocar la comida. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

/** Cada escena empieza en la primera palabra de su frase (ignorando mayúsculas, tildes y puntuación). */
export const ANCLAS = {
  magnetron: "Una pieza llamada",
  pausa: "Vos también comiste",
  puntosCalientes: "Pasa porque las",
  plato: "se calienta solo",
  remateDespuesDe: "tocar la comida",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

/** Pausa para el Remate: se inserta si la locución no la trae. */
export const PAUSA_REMATE = {
  despuesDe: "tocar la comida",
  segundos: 2.5,
  silencioMinimo: 2,
};

/** Momentos internos de cada escena, anclados a frases de la voz. */
export const MARCAS = {
  hook: {
    comida: "la comida",
    agua: "Calienta el agua",
    adentro: "tiene adentro",
  },
  magnetron: {
    magnetron: "llamada magnetrón",
    ondas: "lanza ondas",
    girar: "hacen girar",
    millones: "millones de veces",
    roce: "tanto roce",
    calientan: "se calientan",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  puntosCalientes: {
    igual: "no llegan igual",
    calientes: "puntos calientes",
    frios: "puntos fríos",
    porEso: "Por eso el plato",
    gira: "el plato gira",
  },
  plato: {
    plato: "calienta solo",
    tocar: "por tocar",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

/** Palabras que se pintan en verde agua dentro de los subtítulos. */
export const PALABRAS_CLAVE = [
  "agua",
  "magnetron",
  "ondas",
  "invisibles",
  "girar",
  "moleculas",
  "millones",
  "roce",
  "calientan",
  "hirviendo",
  "helado",
  "comentarios",
  "igual",
  "calientes",
  "frios",
  "gira",
  "tocar",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  /** Escenas donde los subtítulos se ocultan (la pantalla ya muestra el texto). */
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    agua: "agua",
    contador: "ZOOM",
  },
  magnetron: {
    seccion: "01",
    titulo: "EL MAGNETRÓN",
    magnetron: "magnetrón",
    ondas: "ondas · 2,45 GHz",
    paredes: "las paredes de metal las rebotan",
    contador: "GIROS POR SEGUNDO",
    unidad: "giros/seg",
    termometro: "TEMP.",
  },
  pausa: {
    pregunta: "¿Vos también comiste algo hirviendo por fuera y helado por dentro?",
    pie: "Contámelo en los comentarios",
    opciones: ["SÍ, SIEMPRE", "NUNCA"],
    emoji: "💬",
  },
  puntosCalientes: {
    seccion: "02",
    titulo: "PUNTOS CALIENTES",
    caliente: "punto caliente",
    frio: "punto frío",
    girando: "plato girando",
    parejo: "temperatura pareja",
    contador: "DIFERENCIA DE TEMP.",
  },
  plato: {
    seccion: "03",
    titulo: "EL PLATO",
    atraviesan: "las ondas lo atraviesan",
    contacto: "se calienta por contacto",
    contador: "TEMP. DEL PLATO",
  },
  remate: ["NO ES MAGIA", "ES AGUA", "GIRANDO MUY RÁPIDO"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  /** Frecuencia de un microondas doméstico: 2,45 GHz. */
  girosPorSegundo: 2_450_000_000,
  tempInicial: 4,
  tempFinal: 75,
};
