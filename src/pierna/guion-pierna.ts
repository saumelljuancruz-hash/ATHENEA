/**
 * GUION — "¿Por qué se te duerme la pierna?"
 *
 * GUIA-REELS.md: gancho escrito desde el cuadro 1, situación cotidiana (el baño con el celular),
 * tono de charla con autocorrección ("bueno, un poquito sí"), sin comentarios, sin silencios,
 * sin triple texto y cierre para mandarlo.
 *
 * Datos: al quedarte sentado así se comprime el nervio (y los vasos) del muslo y las señales dejan
 * de pasar (adormecimiento); al liberar la presión el nervio se reactiva disparando señales
 * desordenadas (el hormigueo, parestesia). Se pasa en un rato moviendo el pie.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-pierna.mp3",
  timestamps: "voz-pierna-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Te levantás del inodoro después de media hora con el celular… y la pierna no existe. ¿Te pasó, no? Lo que pasa es que, sentado así, aplastás un nervio. Y el nervio es como un cable: si lo apretás, las señales no pasan. Por eso no sentís nada. Pero cuando te parás, lo liberás, y el nervio se despierta mandando todo de golpe, desordenado. Eso es el hormigueo. Tranqui: en un ratito se acomoda. Así que el celular no te durmió la pierna… bueno, un poquito sí. Mandáselo al que vive media hora en el baño.";

export const ANCLAS = {
  cable: "Lo que pasa",
  hormigueo: "Pero cuando te",
  tranqui: "Tranqui: en",
  cta: "Mandáselo al que",
  adelanto: 0.12,
};

export const MARCAS = {
  hook: {
    media: "media hora",
    existe: "no existe",
    paso: "Te pasó",
  },
  cable: {
    nervio: "un nervio",
    cable: "un cable",
    apretas: "lo apretás",
    nada: "no sentís",
  },
  hormigueo: {
    paras: "te parás",
    despierta: "se despierta",
    golpe: "de golpe",
    hormigueo: "el hormigueo",
  },
  tranqui: {
    rato: "un ratito",
    celular: "el celular",
    poquito: "un poquito",
  },
  cta: {
    manda: "Mandáselo",
  },
};

export const PALABRAS_CLAVE = [
  "inodoro",
  "media",
  "hora",
  "celular",
  "existe",
  "nervio",
  "cable",
  "senales",
  "nada",
  "liberas",
  "golpe",
  "desordenado",
  "hormigueo",
  "ratito",
  "poquito",
  "mandaselo",
  "bano",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: [] as string[],
  pastilla: true,
};

export const TEXTOS = {
  hook: {
    gancho: [{ texto: "¿POR QUÉ SE" }, { texto: "TE DUERME" }, { texto: "LA PIERNA?", color: "rojo" }],
    reloj: "30 min",
  },
  cable: {
    seccion: "01",
    titulo: "EL CABLE",
    nervio: "nervio",
    apretado: "apretado: no pasa nada",
    contador: "SEÑALES QUE LLEGAN",
  },
  hormigueo: {
    seccion: "02",
    titulo: "EL HORMIGUEO",
    hormigueo: "todo de golpe = hormigueo",
    contador: "SEÑALES QUE LLEGAN",
  },
  tranqui: {
    seccion: "03",
    titulo: "TRANQUI",
    rato: "en un ratito, normal",
    contador: "MINUTOS EN EL BAÑO",
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
  lineas: ["¿POR QUÉ SE", "TE DUERME", "LA PIERNA?"],
};
