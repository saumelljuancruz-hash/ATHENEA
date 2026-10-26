/**
 * GUION — "¿Por qué el cielo es azul (y el atardecer naranja)?"
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
  voz: "voz-cielo.mp3",
  timestamps: "voz-cielo-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "El cielo no es azul. Lo que ves es luz azul rebotando. La luz del sol parece blanca, pero trae todos los colores mezclados. Al chocar con el aire, el azul rebota unas cinco veces más que el rojo y se desparrama por todo el cielo. Por eso, mires para donde mires, te llega azul. ¿Qué te gusta más: el cielo del mediodía o el del atardecer? Contámelo en los comentarios. Al atardecer, la luz cruza mucho más aire hasta llegar a vos. En el camino, el azul rebota para otros lados y solo te llegan los naranjas y los rojos. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

export const ANCLAS = {
  luz: "La luz del",
  rebote: "Al chocar con",
  pausa: "Qué te gusta",
  atardecer: "Al atardecer, la",
  remateDespuesDe: "y los rojos",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "y los rojos",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    noAzul: "no es azul",
    rebotando: "azul rebotando",
  },
  luz: {
    blanca: "parece blanca",
    colores: "todos los colores",
  },
  rebote: {
    aire: "con el aire",
    rojo: "que el rojo",
    cinco: "cinco veces",
    desparrama: "se desparrama",
    mires: "mires para donde",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  atardecer: {
    aire: "mucho más aire",
    camino: "En el camino",
    rojos: "los naranjas",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

export const PALABRAS_CLAVE = [
  "azul",
  "rebotando",
  "blanca",
  "colores",
  "aire",
  "rojo",
  "cinco",
  "desparrama",
  "comentarios",
  "atardecer",
  "naranjas",
  "rojos",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    rebote: "luz azul rebotando",
    molecula: "aire (N₂ y O₂)",
  },
  luz: {
    seccion: "01",
    titulo: "LA LUZ BLANCA",
    blanca: "luz del sol",
    rojo: "rojo · 700 nm",
    azul: "azul · 450 nm",
    contador: "COLORES EN LA LUZ",
  },
  rebote: {
    seccion: "02",
    titulo: "EL REBOTE",
    azul: "el azul rebota",
    rojo: "el rojo sigue de largo",
    vos: "vos",
    contador: "REBOTE AZUL VS. ROJO",
  },
  pausa: {
    pregunta: "¿Qué te gusta más: el cielo del mediodía o el del atardecer?",
    pie: "Contámelo en los comentarios",
    opciones: ["MEDIODÍA", "ATARDECER"],
    emoji: "💬",
  },
  atardecer: {
    seccion: "03",
    titulo: "EL ATARDECER",
    mediodia: "mediodía: poco aire",
    tarde: "atardecer: mucho aire",
    pierde: "el azul se pierde",
    contador: "AIRE ATRAVESADO",
  },
  remate: ["NO ES AZUL", "ES LUZ", "REBOTANDO"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  /** (700/450)^4 ≈ 5,9: el azul se dispersa "unas cinco veces" más que el rojo. */
  reboteAzulVsRojo: Math.pow(700 / 450, 4),
  /** Masa de aire en el horizonte respecto del cenit (≈ 38 veces más aire). */
  aireHorizonte: 38,
};
