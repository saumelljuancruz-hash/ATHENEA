/**
 * GUION — "Por qué las ventanillas del avión son redondeadas"
 *
 * Escrito con GUIA-REELS.md: gancho en pantalla desde el cuadro 1, mini historia real
 * (el Comet, 1954), números concretos, pregunta para completar y cierre para mandarlo.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-ventanas.mp3",
  timestamps: "voz-ventanas-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Por esta forma de ventana se cayeron aviones. Te cuento. En los años cincuenta, el Comet era el primer avión de pasajeros a reacción. El futuro, ¿viste? Pero en mil novecientos cincuenta y cuatro, dos se partieron en el aire en menos de tres meses. Para entenderlo, metieron un avión entero en una pileta gigante y lo inflaron y desinflaron miles de veces, como en cada vuelo. Hasta que apareció la grieta: en la esquina de una ventana. ¿Por qué creés que se rompió justo ahí? Contame en los comentarios. En una esquina, la fuerza se amontona en un solo punto. En una curva, se reparte. Por eso hoy todas las ventanillas son redondeadas. [pausa 2.5 s] Mandáselo al que siempre pide ventanilla.";

export const ANCLAS = {
  comet: "En los años",
  pileta: "Para entenderlo, metieron",
  pausa: "Por qué creés",
  esquina: "En una esquina,",
  remateDespuesDe: "son redondeadas",
  cta: "Mandáselo al que",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "son redondeadas",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    forma: "esta forma",
    cayeron: "se cayeron",
    cuento: "Te cuento",
  },
  comet: {
    primer: "el primer avión",
    futuro: "El futuro",
    anio: "cincuenta y cuatro",
    partieron: "se partieron",
    meses: "tres meses",
  },
  pileta: {
    pileta: "una pileta",
    inflaron: "lo inflaron",
    miles: "miles de veces",
    grieta: "la grieta",
    ventana: "de una ventana",
  },
  pausa: {
    comentarios: "Contame",
  },
  esquina: {
    punto: "un solo punto",
    curva: "En una curva",
    reparte: "se reparte",
    hoy: "Por eso hoy",
  },
  cta: {
    manda: "Mandáselo",
  },
};

export const PALABRAS_CLAVE = [
  "forma",
  "ventana",
  "cayeron",
  "comet",
  "primer",
  "cincuenta",
  "partieron",
  "meses",
  "pileta",
  "miles",
  "grieta",
  "esquina",
  "comentarios",
  "punto",
  "curva",
  "reparte",
  "redondeadas",
  "mandaselo",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    gancho: [{ texto: "POR ESTA FORMA" }, { texto: "SE CAYERON" }, { texto: "AVIONES", color: "rojo" }],
  },
  comet: {
    seccion: "01",
    titulo: "EL COMET",
    nombre: "de Havilland Comet · 1952",
    primer: "primer jet de pasajeros",
    contador: "AVIONES PERDIDOS EN 1954",
    meses: ["ENE", "FEB", "MAR", "ABR"],
  },
  pileta: {
    seccion: "02",
    titulo: "LA PILETA",
    presion: "presión de cabina",
    grieta: "grieta",
    contador: "CICLOS DE PRESIÓN",
  },
  pausa: {
    pregunta: "¿Por qué creés que se rompió justo en la esquina?",
    pie: "Contame en los comentarios",
    opciones: ["LA FORMA", "EL MATERIAL"],
    emoji: "💬",
  },
  esquina: {
    seccion: "03",
    titulo: "LA ESQUINA",
    punto: "la fuerza se amontona",
    reparte: "la fuerza se reparte",
    contador: "VENTANILLAS REDONDEADAS HOY",
  },
  remate: ["NO ES ESTÉTICA", "ES FÍSICA", "Y SALVA VIDAS"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "MANDÁSELO ➤",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  ciclos: 3000,
};

/** Portada del Reel (imagen fija). */
export const PORTADA = {
  etiqueta: "HISTORIA REAL · 1954",
  lineas: ["POR ESTA FORMA", "SE CAYERON", "AVIONES"],
};
