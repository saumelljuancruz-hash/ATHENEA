/**
 * GUION — "Tenés bichos viviendo en la cara" (los ácaros Demodex)
 *
 * Escrito con GUIA-REELS.md: dato que choca en pantalla desde el cuadro 1, tono de charla,
 * autocorrección ("Bueno, salen… caminan un centímetro por hora"), números concretos y cierre
 * para mandarlo. Sin pausa para comentarios, sin silencios y sin el triple texto del remate.
 *
 * Datos: miden ~0,3 mm, viven cabeza abajo en folículos y poros (pestañas incluidas) y comen sebo;
 * de noche salen a aparearse y, según el estudio de su genoma (2022), usan la melatonina de la
 * persona para activarse; avanzan ~1 cm por hora; casi todos los adultos los tienen; se pasan de
 * la madre al bebé; en exceso se asocian a irritación de párpados (blefaritis) y rosácea.
 */

export const CUENTA = {
  nombre: "Nadie Te Lo Explicó",
  usuario: "@nadietelo.explico",
  logo: "logo.png",
};

export const ARCHIVOS = {
  voz: "voz-acaros.mp3",
  timestamps: "voz-acaros-timestamps.json",
};

export const VOLUMEN = {
  voz: 1,
  musica: 0.08,
  ducking: 0.5,
};

/** Texto de la voz en off (para grabar). El timing sale de los timestamps. */
export const TEXTO_VOZ =
  "Ahora mismo tenés bichos viviendo en la cara. Literal. Se llaman Demodex y miden un tercio de milímetro. Viven cabeza abajo en tus poros y en tus pestañas, comiéndose la grasa de tu piel. De día no se mueven. Pero de noche usan tu hormona del sueño como despertador y salen a buscar pareja. Bueno, salen… caminan un centímetro por hora. Tranqui: casi todos los adultos los tenemos y, salvo que haya demasiados, son inofensivos. Te los pasó tu mamá de bebé. Mandáselo al que se está rascando la cara.";

export const ANCLAS = {
  quienes: "Se llaman Demodex",
  noche: "De día no",
  tranqui: "Tranqui: casi",
  cta: "Mandáselo al que",
  adelanto: 0.12,
};

export const MARCAS = {
  hook: {
    bichos: "tenés bichos",
    literal: "Literal",
  },
  quienes: {
    demodex: "Demodex",
    tercio: "un tercio",
    cabeza: "cabeza abajo",
    pestanas: "tus pestañas",
    grasa: "la grasa",
  },
  noche: {
    noche: "de noche",
    hormona: "hormona del sueño",
    pareja: "buscar pareja",
    bueno: "Bueno, salen",
    centimetro: "un centímetro",
  },
  tranqui: {
    adultos: "los adultos",
    demasiados: "haya demasiados",
    inofensivos: "son inofensivos",
    mama: "Te los pasó",
  },
  cta: {
    manda: "Mandáselo",
  },
};

export const PALABRAS_CLAVE = [
  "bichos",
  "cara",
  "literal",
  "demodex",
  "tercio",
  "milimetro",
  "poros",
  "pestanas",
  "grasa",
  "noche",
  "sueno",
  "despertador",
  "pareja",
  "centimetro",
  "hora",
  "todos",
  "demasiados",
  "inofensivos",
  "mama",
  "mandaselo",
];

export const SUBTITULOS = {
  maxPalabras: 3,
  maxCaracteresCon4: 17,
  ocultarEn: [] as string[],
};

export const TEXTOS = {
  hook: {
    gancho: [{ texto: "AHORA MISMO" }, { texto: "TENÉS BICHOS" }, { texto: "EN LA CARA", color: "rojo" }],
    lupa: "×400",
  },
  quienes: {
    seccion: "01",
    titulo: "QUIÉNES SON",
    nombre: "Demodex",
    medida: "0,3 mm",
    poro: "poro",
    pestana: "raíz de la pestaña",
    grasa: "sebo: su comida",
    contador: "TAMAÑO",
  },
  noche: {
    seccion: "02",
    titulo: "DE NOCHE",
    melatonina: "melatonina",
    pareja: "buscando pareja",
    velocidad: "1 cm",
    hora: "1 hora",
    contador: "HORA",
  },
  tranqui: {
    seccion: "03",
    titulo: "TRANQUI",
    demasiados: "demasiados: irritan",
    inofensivos: "normal: inofensivos",
    mama: "de mamá a bebé",
    contador: "ADULTOS QUE LOS TIENEN",
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
  etiqueta: "ESTÁ PASANDO AHORA",
  lineas: ["TENÉS BICHOS", "VIVIENDO EN", "TU CARA"],
};
