/**
 * GUION — "¿Cómo sabe el algoritmo lo que te gusta?"
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
  voz: "voz-algoritmo.mp3",
  timestamps: "voz-algoritmo-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Este video ya sabe cuánto tiempo lo vas a mirar. Cada segundo que te quedás es un dato. El algoritmo mide si lo mirás entero, si lo repetís, si lo pausás, si lo compartís o si lo pasás rápido. Con eso arma un perfil de lo que te gusta y lo compara con el de millones de personas parecidas a vos. ¿Vos sentís que el algoritmo te conoce demasiado? Contámelo en los comentarios. Si a gente como vos le encantó un video, te lo muestra a vos también. Y cada vez que te frenás a mirar algo, le enseñás un poco más. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

export const ANCLAS = {
  senales: "El algoritmo mide",
  parecidos: "Con eso arma",
  pausa: "Vos sentís que",
  recomienda: "Si a gente",
  remateDespuesDe: "poco más",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "poco más",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    sabe: "ya sabe",
    dato: "es un dato",
  },
  senales: {
    entero: "mirás entero",
    repetis: "lo repetís",
    pausas: "lo pausás",
    compartis: "lo compartís",
    rapido: "pasás rápido",
  },
  parecidos: {
    perfil: "un perfil",
    millones: "millones de personas",
    parecidas: "parecidas a vos",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  recomienda: {
    encanto: "le encantó",
    muestra: "te lo muestra",
    frenas: "te frenás",
    ensenas: "le enseñás",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

export const PALABRAS_CLAVE = [
  "sabe",
  "segundo",
  "dato",
  "algoritmo",
  "entero",
  "repetis",
  "compartis",
  "rapido",
  "perfil",
  "millones",
  "comentarios",
  "encanto",
  "frenas",
  "ensenas",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    contador: "TIEMPO MIRANDO ESTE VIDEO",
    dato: "1 segundo = 1 dato",
  },
  senales: {
    seccion: "01",
    titulo: "LAS SEÑALES",
    senales: [
      { icono: "▶", texto: "lo mirás entero", valor: "+5" },
      { icono: "↻", texto: "lo repetís", valor: "+8" },
      { icono: "❚❚", texto: "lo pausás", valor: "+3" },
      { icono: "↗", texto: "lo compartís", valor: "+10" },
      { icono: "⏭", texto: "lo pasás rápido", valor: "−6" },
    ],
    vos: "vos",
    contador: "DATOS SOBRE VOS",
  },
  parecidos: {
    seccion: "02",
    titulo: "GENTE COMO VOS",
    perfil: "tu perfil",
    parecidos: "gustos parecidos",
    contador: "PERSONAS COMPARADAS",
  },
  pausa: {
    pregunta: "¿Vos sentís que el algoritmo te conoce demasiado?",
    pie: "Contámelo en los comentarios",
    opciones: ["DEMASIADO", "PARA NADA"],
    emoji: "💬",
  },
  recomienda: {
    seccion: "03",
    titulo: "LA RECOMENDACIÓN",
    video: "les encantó",
    vos: "para vos",
    aprende: "aprende de vos",
    contador: "PRECISIÓN",
  },
  remate: ["NO TE LEE", "TE MIDE", "CADA SEGUNDO"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

/** Categorías del perfil (barras). */
export const CATEGORIAS = ["ciencia", "humor", "comida", "viajes", "música", "deporte"];

/** Portada del Reel (imagen fija). */
export const PORTADA = {
  etiqueta: "ESTE VIDEO TAMBIÉN",
  lineas: ["EL ALGORITMO", "TE ESTÁ", "MIDIENDO"],
};
