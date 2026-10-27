/**
 * GUION — "El hombre que engañó a Google Maps con un carrito"
 *
 * Escrito con GUIA-REELS.md: gancho en pantalla desde el cuadro 1, tono de charla,
 * autocorrección ("Bueno, no exactamente"), números concretos y cierre para mandarlo.
 * Los componentes no tienen texto hardcodeado.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-trafico.mp3",
  timestamps: "voz-trafico-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Este tipo engañó a Google Maps… con un carrito. En dos mil veinte, en Berlín, un artista metió noventa y nueve celulares usados en un carrito y se puso a caminar despacito por la calle. ¿Y sabés qué pasó? Maps la pintó de rojo. Embotellamiento. Y la calle… vacía. Porque Maps no ve autos. Bueno, no exactamente: ve celulares. Si muchos se mueven lento en el mismo lugar, para Maps eso es tráfico. ¿Vos le hacés caso a Maps aunque veas la calle libre? Contame en los comentarios. Así que ese rojo del mapa somos nosotros, con el celu en el bolsillo. [pausa 2.5 s] Mandáselo al que le cree todo a Maps.";

export const ANCLAS = {
  carrito: "En dos mil",
  truco: "Porque Maps no",
  pausa: "Vos le hacés",
  nosotros: "Así que ese",
  remateDespuesDe: "en el bolsillo",
  cta: "Mandáselo al que",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "en el bolsillo",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    maps: "Google Maps",
    carrito: "un carrito",
  },
  carrito: {
    berlin: "en Berlín",
    celulares: "noventa y nueve",
    caminar: "a caminar",
    paso: "qué pasó",
    rojo: "de rojo",
    embotellamiento: "Embotellamiento",
    vacia: "calle vacía",
  },
  truco: {
    autos: "no ve autos",
    exacto: "no exactamente",
    celulares: "ve celulares",
    lento: "se mueven lento",
    trafico: "es tráfico",
  },
  pausa: {
    comentarios: "Contame",
  },
  nosotros: {
    rojo: "ese rojo",
    nosotros: "somos nosotros",
    bolsillo: "el bolsillo",
  },
  cta: {
    manda: "Mandáselo",
  },
};

export const PALABRAS_CLAVE = [
  "engano",
  "maps",
  "carrito",
  "berlin",
  "noventa",
  "nueve",
  "celulares",
  "rojo",
  "embotellamiento",
  "vacia",
  "autos",
  "lento",
  "trafico",
  "comentarios",
  "nosotros",
  "bolsillo",
  "mandaselo",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    gancho: [{ texto: "ENGAÑÓ A" }, { texto: "GOOGLE MAPS" }, { texto: "CON UN CARRITO", color: "rojo" }],
    contador: "CELULARES EN EL CARRITO",
  },
  carrito: {
    seccion: "01",
    titulo: "EL CARRITO",
    lugar: "Berlín · 2020",
    velocidad: "caminando: 4 km/h",
    embotellamiento: "EMBOTELLAMIENTO",
    vacia: "la calle real: vacía",
    contador: "CELULARES EN EL CARRITO",
  },
  truco: {
    seccion: "02",
    titulo: "EL TRUCO",
    autos: "autos: invisibles",
    celulares: "lo que ve: celulares",
    lento: "muchos + lentos = tráfico",
    contador: "VELOCIDAD PROMEDIO",
  },
  pausa: {
    pregunta: "¿Le hacés caso a Maps aunque veas la calle libre?",
    pie: "Contame en los comentarios",
    opciones: ["SIEMPRE", "YO SÉ MÁS"],
    emoji: "💬",
  },
  nosotros: {
    seccion: "03",
    titulo: "SOMOS NOSOTROS",
    vos: "vos",
    contador: "CELULARES EN ESTE MAPA",
  },
  remate: ["MAPS NO VE AUTOS", "VE CELULARES", "COMO EL TUYO"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "MANDÁSELO ➤",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  celulares: 99,
  velocidadCaminando: 4,
  velocidadCalle: 50,
};

/** Portada del Reel (imagen fija). */
export const PORTADA = {
  etiqueta: "HISTORIA REAL · BERLÍN 2020",
  lineas: ["ENGAÑÓ A", "GOOGLE MAPS", "CON UN CARRITO"],
};
