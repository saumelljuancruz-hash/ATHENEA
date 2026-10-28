/**
 * GUION — "¿Por qué te late el ojo?"
 *
 * GUIA-REELS.md: gancho escrito desde el cuadro 1, situación cotidiana, tono de charla con humor
 * ("O sea, una semana normal"), una aclaración honesta, sin comentarios, sin silencios, sin triple
 * texto y cierre para mandarlo.
 *
 * Datos: mioquimia palpebral: contracciones involuntarias del músculo del párpado; se asocia a
 * dormir poco, estrés, cafeína y fatiga visual; casi siempre benigna y se va sola en días o semanas.
 * Consultar si dura semanas, si el párpado se cierra del todo o si afecta otras partes de la cara.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-parpado.mp3",
  timestamps: "voz-parpado-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Ese ojo que te late solo, como si tuviera vida propia… no es el ojo. Es un musculito del párpado que se dispara sin que se lo pidas. Se llama mioquimia y es súper común. ¿Las causas? Las de siempre: dormir poco, estrés, mucho café y horas mirando pantallas. O sea, una semana normal. Casi siempre es inofensivo y se va solo en unos días. Si dura semanas o te cierra el ojo, ahí sí, al médico. Así que no, no te está guiñando nadie: es tu cuerpo pidiendo descanso. Mandáselo al que hoy tiene el ojo bailando.";

export const ANCLAS = {
  musculo: "Es un musculito",
  causas: "Las causas",
  tranqui: "Casi siempre es",
  cta: "Mandáselo al que",
  adelanto: 0.12,
};

export const MARCAS = {
  hook: {
    late: "te late",
    vida: "vida propia",
    noEs: "no es el",
  },
  musculo: {
    parpado: "del párpado",
    dispara: "se dispara",
    mioquimia: "mioquimia",
    comun: "súper común",
  },
  causas: {
    dormir: "dormir poco",
    estres: "estrés",
    cafe: "mucho café",
    pantallas: "mirando pantallas",
    semana: "una semana",
  },
  tranqui: {
    dias: "unos días",
    medico: "al médico",
    guinando: "guiñando nadie",
    descanso: "tu cuerpo",
  },
  cta: {
    manda: "Mandáselo",
  },
};

export const PALABRAS_CLAVE = [
  "ojo",
  "late",
  "vida",
  "propia",
  "musculito",
  "parpado",
  "dispara",
  "mioquimia",
  "comun",
  "causas",
  "dormir",
  "estres",
  "cafe",
  "pantallas",
  "semana",
  "inofensivo",
  "dias",
  "medico",
  "descanso",
  "mandaselo",
  "bailando",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: [] as string[],
  pastilla: true,
};

export const TEXTOS = {
  hook: {
    gancho: [{ texto: "¿POR QUÉ" }, { texto: "TE LATE" }, { texto: "EL OJO?", color: "rojo" }],
  },
  musculo: {
    seccion: "01",
    titulo: "EL MÚSCULO",
    musculo: "músculo del párpado",
    nombre: "mioquimia",
    contador: "TICS POR MINUTO",
  },
  causas: {
    seccion: "02",
    titulo: "LAS CAUSAS",
    dormir: "dormir poco",
    estres: "estrés",
    cafe: "mucho café",
    pantallas: "pantallas",
    semana: "una semana normal",
    contador: "CAFÉS HOY",
  },
  tranqui: {
    seccion: "03",
    titulo: "TRANQUI",
    dias: "se va solo",
    medico: "si dura semanas: al médico",
    descanso: "descanso",
    contador: "DÍAS",
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
  lineas: ["¿POR QUÉ", "TE LATE", "EL OJO?"],
};
