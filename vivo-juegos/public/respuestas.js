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

const compacto = (texto) => texto.replace(/ /g, "");
const claveDe = (item) => item.codigo ?? item.id;

/**
 * ¿El comentario nombra a la respuesta correcta (un país o una marca)?
 * Cada opción trae `acepta`: las formas normalizadas en que vale escribirla.
 * - Vale si una forma aceptada aparece entera en el comentario: "es peru!!" acierta Perú.
 * - No vale nombrar otra opción además ("colombia o ecuador"), salvo que sea parte del nombre correcto:
 *   "guinea ecuatorial" acierta Guinea Ecuatorial aunque adentro diga "guinea", pero no acierta Guinea.
 * - Vale escrito todo junto o separado: "mc donalds", "cocacola", "play station".
 * - Si no, se perdonan errores de tipeo chicos, siempre que la opción más parecida sea la correcta.
 */
export const acierta = (comentario, item, todos) => {
  const texto = normalizar(comentario);
  if (!texto) {
    return false;
  }
  const clave = claveDe(item);
  const propias = new Set(item.acepta);
  const dichas = [...propias].filter((frase) => contiene(texto, frase));
  const ajenas = [];
  for (const otro of todos) {
    if (claveDe(otro) === clave) {
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
  const junto = compacto(texto);
  let mejor = Infinity;
  let ganadores = new Set();
  for (const opcion of todos) {
    for (const frase of opcion.acepta) {
      const f = compacto(frase);
      if (Math.abs(f.length - junto.length) > 2) {
        continue;
      }
      const d = distancia(junto, f);
      if (d > tolerancia(f)) {
        continue;
      }
      if (d < mejor) {
        mejor = d;
        ganadores = new Set([claveDe(opcion)]);
      } else if (d === mejor) {
        ganadores.add(claveDe(opcion));
      }
    }
  }
  return ganadores.size === 1 && ganadores.has(clave);
};

/** Igual que `acierta`, para las banderas. */
export const aciertaPais = acierta;

/**
 * El primer número de un comentario, como lo escribimos en Argentina:
 * "206", "67,5", "384.400", "1.300.000", "384 mil", "1,3 millones", "2k", "1 palo".
 * Si no hay número, null.
 */
export const leerNumero = (comentario) => {
  const texto = String(comentario ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const m = texto.match(/(\d[\d.,]*)(?![\d.,])\s*(?:(k|mil|millones|millon|palos|palo)\b)?/);
  if (!m) {
    // "un millón", "un palo", "mil"
    if (/\bun (millon|palo)\b/.test(texto)) {
      return 1e6;
    }
    return /\bmil\b/.test(texto) ? 1e3 : null;
  }
  let cifra = m[1].replace(/[.,]+$/, "");
  const puntos = (cifra.match(/\./g) ?? []).length;
  const comas = (cifra.match(/,/g) ?? []).length;
  if (puntos && comas) {
    // El último separador es el decimal.
    cifra = cifra.lastIndexOf(",") > cifra.lastIndexOf(".") ? cifra.replace(/\./g, "").replace(",", ".") : cifra.replace(/,/g, "");
  } else if (comas) {
    cifra = comas === 1 ? cifra.replace(",", ".") : cifra.replace(/,/g, "");
  } else if (puntos && /^\d{1,3}(\.\d{3})+$/.test(cifra)) {
    cifra = cifra.replace(/\./g, "");
  }
  const valor = Number(cifra);
  if (!Number.isFinite(valor)) {
    return null;
  }
  const por = { k: 1e3, mil: 1e3, millon: 1e6, millones: 1e6, palo: 1e6, palos: 1e6 }[m[2]] ?? 1;
  return valor * por;
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
