/**
 * GUION — "Cerrar las apps NO ahorra batería" (Mitos de la tecnología)
 *
 * Escrito con GUIA-REELS.md: confesión de entrada, creencia rota, el "pero",
 * autoridad (Apple y Google), una excepción honesta y cierre para mandarlo.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-apps.mp3",
  timestamps: "voz-apps-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Confieso: yo cerraba todas las apps como veinte veces por día. Y resulta que gastaba más batería. Otro mito de la tecnología. Cuando salís de una app, el celular no la deja andando: la congela. Queda dormida en la memoria, casi sin gastar nada. Pero si la cerrás, la próxima vez tiene que arrancar de cero y cargar todo otra vez. Y eso gasta más que despertarla. Lo dicen hasta Apple y Google. ¿Vos sos de los que cierran todo? Contame la verdad en los comentarios. Ojo, hay una excepción: si una app se trabó o está usando el GPS de fondo, ahí sí, cerrala. [pausa 2.5 s] Mandáselo al que cierra todas las apps.";

export const ANCLAS = {
  congela: "Cuando salís de",
  cero: "Pero si la",
  pausa: "Vos sos de",
  excepcion: "Ojo, hay una",
  remateDespuesDe: "ahí sí, cerrala",
  cta: "Mandáselo al que",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "ahí sí, cerrala",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    veinte: "veinte veces",
    mas: "más batería",
    mito: "Otro mito",
  },
  congela: {
    congela: "la congela",
    dormida: "Queda dormida",
    nada: "sin gastar",
  },
  cero: {
    cerras: "la cerrás",
    cero: "de cero",
    cargar: "cargar todo",
    despertarla: "que despertarla",
    apple: "Apple y Google",
  },
  pausa: {
    comentarios: "Contame",
  },
  excepcion: {
    trabo: "se trabó",
    gps: "el GPS",
    cerrala: "ahí sí",
  },
  cta: {
    manda: "Mandáselo",
  },
};

export const PALABRAS_CLAVE = [
  "confieso",
  "veinte",
  "bateria",
  "mito",
  "congela",
  "dormida",
  "nada",
  "cerras",
  "cero",
  "despertarla",
  "apple",
  "google",
  "comentarios",
  "excepcion",
  "trabo",
  "gps",
  "cerrala",
  "mandaselo",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    gancho: [{ texto: "CERRAR LAS APPS" }, { texto: "GASTA MÁS" }, { texto: "BATERÍA", color: "rojo" }],
    mito: "MITO",
    contador: "APPS CERRADAS HOY",
  },
  congela: {
    seccion: "01",
    titulo: "LA CONGELA",
    memoria: "memoria",
    dormida: "dormida: casi 0 consumo",
    contador: "CONSUMO EN SEGUNDO PLANO",
  },
  cero: {
    seccion: "02",
    titulo: "DE CERO",
    despertar: "despertarla",
    abrir: "abrirla de cero",
    fuente: "Apple · Google",
    contador: "PROCESADOR",
  },
  pausa: {
    pregunta: "¿Sos de los que cierran todas las apps?",
    pie: "Contame la verdad en los comentarios",
    opciones: ["CULPABLE", "NUNCA"],
    emoji: "💬",
  },
  excepcion: {
    seccion: "03",
    titulo: "LA EXCEPCIÓN",
    trabada: "trabada",
    gps: "GPS de fondo",
    cerrala: "ahí sí: cerrala",
    contador: "BATERÍA",
  },
  remate: ["NO LAS CIERRES", "DEJALAS DORMIR", "TU BATERÍA LO NOTA"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "MANDÁSELO ➤",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

/** Apps de ejemplo (íconos genéricos, sin marcas). */
export const APPS = [
  { nombre: "fotos", color: "#ff9a3c" },
  { nombre: "chat", color: "#3ee0c0" },
  { nombre: "música", color: "#ff4f7a" },
  { nombre: "mapa", color: "#4aa3ff" },
  { nombre: "videos", color: "#ff5a4e" },
  { nombre: "notas", color: "#ffc94a" },
];

/** Portada del Reel (imagen fija). */
export const PORTADA = {
  etiqueta: "MITOS DE LA TECNOLOGÍA",
  lineas: ["CERRAR LAS APPS", "GASTA MÁS", "BATERÍA"],
};
