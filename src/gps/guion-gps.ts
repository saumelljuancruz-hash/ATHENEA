/**
 * GUION — "¿Cómo sabe el GPS dónde estás?"
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
  voz: "voz-gps.mp3",
  timestamps: "voz-gps-timestamps.json",
};

/** Volúmenes de voz y música (los efectos están en src/comun/Sonido.tsx). */
export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Tu celular sabe dónde estás sin mandarle nada a ningún satélite. Solo escucha. Hay más de treinta satélites dando vueltas, y cada uno transmite la hora exacta todo el tiempo. Tu celular mide cuánto tarda en llegar cada señal y así sabe a qué distancia está cada uno. ¿Vos usás el GPS hasta para ir a lugares que ya conocés? Contámelo en los comentarios. Con cuatro satélites, cruza las distancias y encuentra el único punto donde estás. Pero allá arriba el tiempo pasa distinto: sus relojes se adelantan treinta y ocho microsegundos por día. Sin corregirlo, el error crecería unos diez kilómetros por día. [pausa 2.5 s] Seguí la cuenta para entender cómo funciona todo lo que usás.";

export const ANCLAS = {
  senal: "Hay más de",
  pausa: "Vos usás el",
  cuatro: "Con cuatro satélites",
  tiempo: "Pero allá arriba",
  remateDespuesDe: "kilómetros por día",
  cta: "Seguí la cuenta",
  adelanto: 0.12,
};

export const PAUSA_REMATE = {
  despuesDe: "kilómetros por día",
  segundos: 2.5,
  silencioMinimo: 2,
};

export const MARCAS = {
  hook: {
    nada: "mandarle nada",
    escucha: "Solo escucha",
  },
  senal: {
    treinta: "treinta satélites",
    hora: "la hora exacta",
    mide: "mide cuánto tarda",
    distancia: "qué distancia",
  },
  pausa: {
    comentarios: "Contámelo",
  },
  cuatro: {
    cruza: "cruza las distancias",
    punto: "único punto",
  },
  tiempo: {
    relojes: "sus relojes",
    microsegundos: "ocho microsegundos",
    corregir: "Sin corregirlo",
    diez: "unos diez",
  },
  cta: {
    cuenta: "la cuenta",
  },
};

export const PALABRAS_CLAVE = [
  "satelite",
  "escucha",
  "treinta",
  "hora",
  "exacta",
  "tarda",
  "distancia",
  "comentarios",
  "cuatro",
  "punto",
  "tiempo",
  "distinto",
  "microsegundos",
  "diez",
  "kilometros",
  "segui",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: ["pausa", "remate"] as string[],
};

export const TEXTOS = {
  hook: {
    escucha: "solo escucha",
    contador: "ENVIADO AL SATÉLITE",
  },
  senal: {
    seccion: "01",
    titulo: "LA SEÑAL",
    satelite: "satélite GPS",
    hora: "hora exacta",
    altura: "20.200 km",
    viaje: "la señal tarda 0,067 s",
    contador: "SATÉLITES EN ÓRBITA",
  },
  pausa: {
    pregunta: "¿Vos usás el GPS hasta para ir a lugares que ya conocés?",
    pie: "Contámelo en los comentarios",
    opciones: ["SIEMPRE", "NUNCA"],
    emoji: "💬",
  },
  cuatro: {
    seccion: "02",
    titulo: "CUATRO DISTANCIAS",
    reloj: "el 4.º corrige el reloj",
    punto: "estás acá",
    contador: "SATÉLITES USADOS",
  },
  tiempo: {
    seccion: "03",
    titulo: "EL TIEMPO",
    tierra: "RELOJ EN LA TIERRA",
    satelite: "RELOJ EN EL SATÉLITE",
    adelanto: "+38 μs por día",
    error: "sin corregir",
    corregido: "corregido",
    contador: "ERROR ACUMULADO",
  },
  remate: ["NO TE VE", "TE ESCUCHA", "Y CALCULA"],
  cta: {
    titulo: "¿LO SABÍAS?",
    comentar: "COMÉNTALO 💬",
    seguir: "SEGUIME +",
    siguiendo: "✓ Siguiendo",
  },
};

export const DATOS = {
  satelites: 31,
  alturaKm: 20_200,
  /** Tiempo de viaje de la señal desde 20.200 km a la velocidad de la luz. */
  viajeSeg: 20_200 / 299_792,
  adelantoMicroseg: 38,
  errorKmDia: 10,
  /** Buenos Aires: la "ubicación" del celular en el globo. */
  ubicacion: [-58.4, -34.6] as [number, number],
};
