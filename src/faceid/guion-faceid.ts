/**
 * GUION — "¿Cómo funciona el reconocimiento facial del celular?" (Face ID)
 *
 * Misma plantilla que guion-avion.ts: textos visibles, frases que anclan cada
 * escena a la voz y volúmenes. Los componentes no tienen texto hardcodeado.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-faceid.mp3",
  timestamps: "voz-faceid-timestamps.json",
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
  "Cada vez que desbloqueás tu celular con la cara, te tira más de treinta mil puntos invisibles. Un proyector lanza esos puntos de luz infrarroja, que el ojo humano no puede ver. Una cámara especial lee cómo se deforman sobre tu nariz, tus pómulos y tu frente. ¿Vos usás la cara o la huella para desbloquear? Contámelo en los comentarios. Con eso arma un mapa en tres dimensiones de tu cara, lo convierte en números y lo compara con el que guardó. Por eso funciona a oscuras, y no se engaña con una foto. Y ese mapa nunca sale de tu teléfono. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

/** Cada escena empieza en la primera palabra de su frase (ignorando mayúsculas, tildes y puntuación). */
export const ANCLAS = {
  puntos: "Un proyector lanza",
  pausa: "Vos usás la cara",
  mapa3d: "Con eso arma",
  privacidad: "Y ese mapa nunca",
  remateDespuesDe: "sale de tu teléfono",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

/** Pausa para el Remate: se inserta si la locución no la trae. */
export const PAUSA_REMATE = {
  despuesDe: "sale de tu teléfono",
  segundos: 2.5,
  silencioMinimo: 2,
};

/** Momentos internos de cada escena, anclados a frases de la voz. */
export const MARCAS = {
  hook: {
    cara: "con la cara",
    puntos: "te tira",
    invisibles: "puntos invisibles",
  },
  puntos: {
    proyector: "Un proyector",
    infrarroja: "luz infrarroja",
    noPuedeVer: "no puede ver",
    camara: "Una cámara especial",
    deforman: "se deforman",
    nariz: "tu nariz",
    pomulos: "tus pómulos",
    frente: "tu frente",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  mapa3d: {
    mapa: "un mapa",
    numeros: "en números",
    compara: "lo compara",
    guardo: "que guardó",
    porEso: "Por eso funciona",
    oscuras: "a oscuras",
    engana: "no se engaña",
    foto: "con una foto",
  },
  privacidad: {
    mapa: "ese mapa",
    telefono: "tu teléfono",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

/** Palabras que se pintan en verde agua dentro de los subtítulos. */
export const PALABRAS_CLAVE = [
  "cara",
  "puntos",
  "invisibles",
  "proyector",
  "infrarroja",
  "camara",
  "deforman",
  "nariz",
  "pomulos",
  "frente",
  "comentarios",
  "mapa",
  "dimensiones",
  "numeros",
  "compara",
  "oscuras",
  "foto",
  "nunca",
  "telefono",
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
    contador: "PUNTOS PROYECTADOS",
    unidad: "puntos",
  },
  puntos: {
    seccion: "01",
    titulo: "LOS PUNTOS",
    proyector: "proyector de puntos",
    camara: "cámara infrarroja",
    iluminador: "iluminador",
    infrarroja: "luz infrarroja · invisible",
    nariz: "nariz",
    pomulos: "pómulos",
    frente: "frente",
    contador: "RELIEVE MEDIDO",
  },
  pausa: {
    pregunta: "¿Vos usás la cara o la huella para desbloquear?",
    pie: "Contámelo en los comentarios",
    opciones: ["CARA", "HUELLA"],
    emoji: "💬",
  },
  mapa3d: {
    seccion: "02",
    titulo: "EL MAPA 3D",
    malla: "malla 3D",
    numeros: "tu cara en números",
    guardada: "mapa guardado",
    coincide: "coincide",
    oscuras: "funciona a oscuras",
    foto: "una foto no tiene profundidad",
    luces: "LUCES: OFF",
    contador: "COINCIDENCIA",
  },
  privacidad: {
    seccion: "03",
    titulo: "PRIVACIDAD",
    chip: "chip seguro",
    etiqueta: "se queda en tu teléfono",
    contador: "ENVIADO A INTERNET",
  },
  remate: ["NO TE MIRA", "TE MIDE", "EN 3D"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  puntos: 30_000,
  /** Relieve aproximado de una cara (punta de la nariz vs. mejillas), en mm. */
  relieveMm: 32,
};
