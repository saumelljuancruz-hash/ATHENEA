/**
 * GUION — "¿Por qué ves estrellitas cuando te parás rápido?"
 *
 * GUIA-REELS.md: gancho escrito desde el cuadro 1, situación cotidiana (el sillón), tono de charla,
 * un número concreto, un truco útil, sin comentarios, sin silencios, sin triple texto y cierre para mandarlo.
 *
 * Datos: al pararte de golpe la gravedad desplaza sangre hacia las piernas (del orden de medio litro);
 * por un instante llega menos al cerebro (visión con puntitos, mareo) hasta que el reflejo del cuerpo
 * acelera el corazón y contrae los vasos. Levantarse en dos pasos ayuda.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-mareo.mp3",
  timestamps: "voz-mareo-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Te parás rápido del sillón y… estrellitas. Todo se pone negro un segundo. ¿Qué pasó? Cuando estás sentado, tu corazón ya tiene todo calculado. Pero al pararte de golpe, la gravedad tira como medio litro de sangre hacia las piernas. Y arriba, a tu cerebro, le llega menos por un instante. Por eso ves puntitos y te mareás. Enseguida tu cuerpo reacciona: el corazón late más rápido y los vasos se aprietan para subir la sangre. Truco: levantate en dos pasos. Mandáselo al que se levanta del sillón como un cohete.";

export const ANCLAS = {
  gravedad: "Cuando estás sentado",
  cerebro: "Y arriba, a",
  rescate: "Enseguida tu cuerpo",
  cta: "Mandáselo al que",
  adelanto: 0.12,
};

export const MARCAS = {
  hook: {
    estrellitas: "estrellitas",
    negro: "se pone negro",
    paso: "Qué pasó",
  },
  gravedad: {
    calculado: "todo calculado",
    golpe: "de golpe",
    litro: "medio litro",
    piernas: "las piernas",
  },
  cerebro: {
    menos: "llega menos",
    puntitos: "ves puntitos",
    mareas: "te mareás",
  },
  rescate: {
    corazon: "el corazón",
    vasos: "los vasos",
    subir: "subir la sangre",
    truco: "Truco",
    pasos: "dos pasos",
  },
  cta: {
    manda: "Mandáselo",
  },
};

export const PALABRAS_CLAVE = [
  "sillon",
  "estrellitas",
  "negro",
  "corazon",
  "golpe",
  "gravedad",
  "medio",
  "litro",
  "sangre",
  "piernas",
  "cerebro",
  "menos",
  "puntitos",
  "mareas",
  "rapido",
  "aprietan",
  "truco",
  "dos",
  "pasos",
  "mandaselo",
  "cohete",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: [] as string[],
  pastilla: true,
};

export const TEXTOS = {
  hook: {
    gancho: [{ texto: "¿POR QUÉ VES" }, { texto: "ESTRELLITAS" }, { texto: "AL PARARTE?", color: "rojo" }],
  },
  gravedad: {
    seccion: "01",
    titulo: "LA GRAVEDAD",
    calculado: "sentado: todo en orden",
    gravedad: "gravedad",
    contador: "SANGRE QUE BAJA",
  },
  cerebro: {
    seccion: "02",
    titulo: "EL CEREBRO",
    menos: "le llega menos sangre",
    contador: "SANGRE EN EL CEREBRO",
  },
  rescate: {
    seccion: "03",
    titulo: "EL RESCATE",
    corazon: "más rápido",
    vasos: "los vasos aprietan",
    paso1: "1 · sentate en el borde",
    paso2: "2 · parate tranqui",
    contador: "LATIDOS POR MINUTO",
  },
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "MANDÁSELO ➤",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

/** Portada del Reel (imagen fija). */
export const PORTADA = {
  etiqueta: "TE PASA SIEMPRE",
  lineas: ["¿POR QUÉ VES", "ESTRELLITAS", "AL PARARTE?"],
};
