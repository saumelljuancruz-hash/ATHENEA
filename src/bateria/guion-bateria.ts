/**
 * GUION — "¿Cargar el celular toda la noche lo arruina?"
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
  voz: "voz-bateria.mp3",
  timestamps: "voz-bateria-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Dejás el celular cargando toda la noche. ¿Lo estás matando? Tranquilo: no. Cuando llega al cien por ciento, el celular corta la carga solo. Y muchos, además, aprenden a qué hora te despertás: frenan en ochenta y completan justo antes de que suene la alarma. ¿Vos lo cargás de noche o durante el día? Contámelo en los comentarios. Lo que de verdad gasta la batería es el calor. Por eso, nunca lo cargues debajo de la almohada ni al sol. Y no hace falta esperar a que llegue a cero: a la batería le gusta vivir entre el veinte y el ochenta por ciento. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

export const ANCLAS = {
  corte: "Cuando llega al",
  inteligente: "Y muchos, además",
  pausa: "Vos lo cargás",
  calor: "Lo que de",
  remateDespuesDe: "ochenta por ciento",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "ochenta por ciento",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    matando: "Lo estás matando",
    tranquilo: "Tranquilo",
  },
  corte: {
    cien: "cien por ciento",
    corta: "corta la carga",
  },
  inteligente: {
    aprenden: "aprenden a qué",
    ochenta: "frenan en ochenta",
    alarma: "suene la alarma",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  calor: {
    calor: "es el calor",
    almohada: "la almohada",
    sol: "ni al sol",
    cero: "llegue a cero",
    rango: "entre el veinte",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

export const PALABRAS_CLAVE = [
  "noche",
  "matando",
  "tranquilo",
  "cien",
  "corta",
  "despertas",
  "ochenta",
  "alarma",
  "comentarios",
  "calor",
  "almohada",
  "sol",
  "cero",
  "veinte",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    hora: "03:47",
    no: "NO",
    contador: "CARGA",
  },
  corte: {
    seccion: "01",
    titulo: "EL CORTE",
    corta: "al 100 % corta la carga",
    corriente: "corriente",
    contador: "CORRIENTE DE CARGA",
  },
  inteligente: {
    seccion: "02",
    titulo: "CARGA INTELIGENTE",
    pausa: "espera en 80 %",
    alarma: "alarma 07:00",
    contador: "CARGA",
  },
  pausa: {
    pregunta: "¿Vos lo cargás de noche o durante el día?",
    pie: "Contámelo en los comentarios",
    opciones: ["DE NOCHE", "DE DÍA"],
    emoji: "💬",
  },
  calor: {
    seccion: "03",
    titulo: "EL ENEMIGO",
    almohada: "debajo de la almohada",
    sol: "al sol",
    rango: "su zona feliz",
    contador: "SALUD DE LA BATERÍA",
  },
  remate: ["NO ES LA NOCHE", "ES EL CALOR", "CUIDALO"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

/** Portada del Reel (imagen fija). */
export const PORTADA = {
  etiqueta: "LO HACÉS TODAS LAS NOCHES",
  lineas: ["¿CARGARLO", "TODA LA NOCHE", "LO ARRUINA?"],
};
