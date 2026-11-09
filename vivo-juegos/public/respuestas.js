// Cómo se corrigen los comentarios del chat. Lo usan el juego (navegador) y las pruebas (Node).

/** "¡Perú!!" → "peru", "EE. UU." → "ee uu", "Côte d’Ivoire" → "cote d ivoire". */
export const normalizar = (texto) =>
  String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const contiene = (texto, frase) => ` ${texto} `.includes(` ${frase} `);

/** Distancia de edición (cuántas letras hay que cambiar para pasar de una palabra a otra). */
export const distancia = (a, b) => {
  if (a === b) {
    return 0;
  }
  let fila = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const nueva = [i];
    for (let j = 1; j <= b.length; j++) {
      nueva[j] = Math.min(fila[j] + 1, nueva[j - 1] + 1, fila[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    fila = nueva;
  }
  return fila[b.length];
};

/** Cuántos errores de tipeo se perdonan según el largo del nombre. */
const tolerancia = (frase) => (frase.length >= 9 ? 2 : frase.length >= 5 ? 1 : 0);

/**
 * ¿El comentario nombra al país correcto?
 * - Vale si el nombre (o una forma aceptada) aparece entero en el comentario: "es peru!!" acierta Perú.
 * - No vale nombrar otro país además ("colombia o ecuador"), salvo que sea parte del nombre correcto:
 *   "guinea ecuatorial" acierta Guinea Ecuatorial aunque adentro diga "guinea", pero no acierta Guinea.
 * - Si no aparece ningún país, se perdonan errores de tipeo chicos, siempre que el más parecido sea el correcto.
 */
export const aciertaPais = (comentario, pais, todos) => {
  const texto = normalizar(comentario);
  if (!texto) {
    return false;
  }
  const propias = new Set(pais.acepta);
  const dichas = [...propias].filter((frase) => contiene(texto, frase));
  const ajenas = [];
  for (const otro of todos) {
    if (otro.codigo === pais.codigo) {
      continue;
    }
    for (const frase of otro.acepta) {
      if (!propias.has(frase) && contiene(texto, frase)) {
        ajenas.push(frase);
      }
    }
  }
  if (dichas.length > 0) {
    return ajenas.every((ajena) => dichas.some((propia) => contiene(propia, ajena)));
  }
  if (ajenas.length > 0 || texto.length > 40) {
    return false;
  }
  let mejor = Infinity;
  let ganadores = new Set();
  for (const p of todos) {
    for (const frase of p.acepta) {
      if (Math.abs(frase.length - texto.length) > 2) {
        continue;
      }
      const d = distancia(texto, frase);
      if (d > tolerancia(frase)) {
        continue;
      }
      if (d < mejor) {
        mejor = d;
        ganadores = new Set([p.codigo]);
      } else if (d === mejor) {
        ganadores.add(p.codigo);
      }
    }
  }
  return ganadores.size === 1 && ganadores.has(pais.codigo);
};

const VERDADERO = new Set(["v", "vv", "vvv", "verdadero", "verdadera", "verdad", "cierto", "true"]);
const FALSO = new Set(["f", "ff", "fff", "falso", "falsa", "false", "mentira"]);

/** "V", "verdadero!!", "es falso" → "V" o "F". Si no queda claro, null. */
export const respuestaVF = (comentario) => {
  const palabras = normalizar(comentario).split(" ");
  const v = palabras.some((p) => VERDADERO.has(p));
  const f = palabras.some((p) => FALSO.has(p));
  return v === f ? null : v ? "V" : "F";
};
