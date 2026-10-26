/**
 * GUION — "¿Por qué un QR roto se puede leer igual?"
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
  voz: "voz-qr.mp3",
  timestamps: "voz-qr-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Podés tapar casi un tercio de un QR y tu celular lo lee igual. Los tres cuadrados de las esquinas le dicen a la cámara dónde está el código y si está girado. El resto son cuadraditos: cada negro es un uno y cada blanco, un cero. Así se guarda un link en binario. ¿Vos escaneás cualquier QR que te cruzás, o desconfiás? Contámelo en los comentarios. El truco es que, además del link, guarda datos de respaldo. Si una parte se mancha o se rompe, con el resto alcanza para reconstruirla. Por eso hay QR con un logo en el medio que funcionan igual. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

export const ANCLAS = {
  esquinas: "Los tres cuadrados",
  binario: "El resto son",
  pausa: "Vos escaneás cualquier",
  respaldo: "El truco es",
  remateDespuesDe: "funcionan igual",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "funcionan igual",
  segundos: 2.5,
  silencioMinimo: 2,
};

/** Texto que guarda el QR del video (es real: se puede escanear). */
export const CONTENIDO_QR = "instagram.com/nadietelo.explico";

export const MARCAS = {
  hook: {
    tapar: "tapar casi",
    lee: "lo lee igual",
  },
  esquinas: {
    camara: "a la cámara",
    girado: "está girado",
  },
  binario: {
    negro: "cada negro",
    blanco: "cada blanco",
    link: "un link",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  respaldo: {
    respaldo: "datos de respaldo",
    mancha: "se mancha",
    reconstruir: "para reconstruirla",
    logo: "un logo",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

export const PALABRAS_CLAVE = [
  "tercio",
  "igual",
  "esquinas",
  "girado",
  "uno",
  "cero",
  "binario",
  "comentarios",
  "respaldo",
  "mancha",
  "reconstruirla",
  "logo",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    tapado: "TAPADO",
    leido: "QR leído",
  },
  esquinas: {
    seccion: "01",
    titulo: "LAS ESQUINAS",
    esquina: "marca de posición",
    orientacion: "orientación",
    contador: "GIRO DETECTADO",
  },
  binario: {
    seccion: "02",
    titulo: "UNOS Y CEROS",
    uno: "negro = 1",
    cero: "blanco = 0",
    contador: "BITS LEÍDOS",
  },
  pausa: {
    pregunta: "¿Vos escaneás cualquier QR que te cruzás, o desconfiás?",
    pie: "Contámelo en los comentarios",
    opciones: ["ESCANEO", "DESCONFÍO"],
    emoji: "💬",
  },
  respaldo: {
    seccion: "03",
    titulo: "EL RESPALDO",
    respaldo: "datos de respaldo",
    danado: "parte dañada",
    reconstruido: "reconstruido",
    logo: "logo encima: se lee igual",
    contador: "DAÑO TOLERADO",
  },
  remate: ["NO ES UN DIBUJO", "ES UN CÓDIGO", "CON REPUESTO"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  /** Nivel H de corrección de errores: hasta ~30 % de daño. */
  danoMaximo: 30,
};
