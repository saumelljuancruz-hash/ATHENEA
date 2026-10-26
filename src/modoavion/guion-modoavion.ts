/**
 * GUION — "¿El modo avión puede tirar un avión?"
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
  voz: "voz-modoavion.mp3",
  timestamps: "voz-modoavion-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Si no ponés modo avión, el avión no se cae. No hay ningún accidente comprobado por un celular. Pero algo sí pasa. Allá arriba, tu celular busca antenas sin parar, y cuanto más lejos están, más fuerte transmite para encontrarlas. Esas señales se cuelan en los auriculares de los pilotos como un zumbido: ti ti ti, ti ti ti. ¿Vos ponés modo avión o te hacés el distraído? Contámelo en los comentarios. Y con cientos de celulares buscando a la vez desde el aire, también molestan a las antenas de la tierra. Por eso te piden apagarlo: más por el ruido que por peligro. Y el wifi del avión sí se puede usar, porque esa señal está controlada. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

export const ANCLAS = {
  busqueda: "Allá arriba, tu",
  zumbido: "Esas señales se",
  pausa: "Vos ponés modo",
  antenas: "Y con cientos",
  remateDespuesDe: "está controlada",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "está controlada",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    noSeCae: "no se cae",
    accidente: "ningún accidente",
    algo: "algo sí pasa",
  },
  busqueda: {
    antenas: "busca antenas",
    lejos: "más lejos",
    fuerte: "más fuerte",
  },
  zumbido: {
    auriculares: "los auriculares",
    titi: "como un zumbido",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  antenas: {
    cientos: "cientos de celulares",
    tierra: "antenas de la tierra",
    ruido: "más por el ruido",
    wifi: "el wifi",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

export const PALABRAS_CLAVE = [
  "modo",
  "avion",
  "cae",
  "accidente",
  "antenas",
  "fuerte",
  "pilotos",
  "zumbido",
  "comentarios",
  "cientos",
  "tierra",
  "ruido",
  "wifi",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    modoAvion: "MODO AVIÓN",
    mito: "MITO",
    contador: "ACCIDENTES POR CELULARES",
  },
  busqueda: {
    seccion: "01",
    titulo: "LA BÚSQUEDA",
    buscando: "buscando señal…",
    antena: "antena",
    contador: "POTENCIA DEL CELULAR",
  },
  zumbido: {
    seccion: "02",
    titulo: "EL ZUMBIDO",
    piloto: "auriculares del piloto",
    titi: "ti ti ti",
    contador: "INTERFERENCIA",
  },
  pausa: {
    pregunta: "¿Vos ponés modo avión o te hacés el distraído?",
    pie: "Contámelo en los comentarios",
    opciones: ["LO PONGO", "ME HAGO EL DISTRAÍDO"],
    emoji: "💬",
  },
  antenas: {
    seccion: "03",
    titulo: "LAS ANTENAS",
    saturada: "antena saturada",
    wifi: "wifi del avión: controlado",
    contador: "CELULARES BUSCANDO SEÑAL",
  },
  remate: ["NO ES PELIGRO", "ES RUIDO", "EN LA CABINA"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  pasajeros: 180,
};
