import { PalabraConTiempo } from "./tipos";

export type Escena<Id extends string = string> = {
  id: Id;
  /** Frame global de inicio. */
  desde: number;
  duracion: number;
};

/**
 * Cómo empieza cada escena:
 * - `null`: en el frame 0.
 * - `{ frase }`: en la primera palabra de la frase (menos `adelanto`).
 * - `{ despuesDe }`: al terminar la frase (para escenas sin voz, como el Remate).
 */
export type InicioEscena = null | { frase: string } | { despuesDe: string };

export type ConfigLinea<Id extends string, M extends Partial<Record<Id, Record<string, string>>>> = {
  escenas: { id: Id; inicio: InicioEscena }[];
  /** Momentos internos de cada escena, anclados a frases de la voz. */
  marcas: M;
  /** Segundos que cada escena se adelanta a su palabra de anclaje. */
  adelanto: number;
  /** Timestamps estimados: respaldo si una frase no aparece en la transcripción. */
  estimados: PalabraConTiempo[];
};

export type LineaDeTiempo<Id extends string, M> = {
  escenas: Record<Id, Escena<Id>>;
  /** Marcas en frames RELATIVOS al inicio de cada escena. */
  marcas: { [K in keyof M]: Record<keyof M[K], number> };
};

export const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const buscarIndice = (palabras: PalabraConTiempo[], frase: string, desde = 0) => {
  const tokens = frase.split(/\s+/).map(normalizar).filter(Boolean);
  for (let i = Math.max(0, desde); i <= palabras.length - tokens.length; i++) {
    if (tokens.every((t, k) => normalizar(palabras[i + k].palabra) === t)) {
      return i;
    }
  }
  return -1;
};

/**
 * Devuelve [inicio, fin] en segundos de una frase. Si la transcripción real no
 * contiene la frase exacta, usa la posición estimada escalada a la duración real.
 */
export const ubicarFrase = (
  palabras: PalabraConTiempo[],
  frase: string,
  estimados: PalabraConTiempo[],
  desde = 0,
) => {
  const i = buscarIndice(palabras, frase, desde);
  const n = frase.split(/\s+/).filter(Boolean).length;
  if (i >= 0) {
    return { inicio: palabras[i].inicio, fin: palabras[i + n - 1].fin, indice: i };
  }
  const j = buscarIndice(estimados, frase);
  if (j < 0) {
    throw new Error(`La frase "${frase}" no está en los timestamps ni en el guion.`);
  }
  const totalEst = estimados[estimados.length - 1].fin;
  const totalReal = palabras[palabras.length - 1]?.fin ?? totalEst;
  const k = totalReal / totalEst;
  return { inicio: estimados[j].inicio * k, fin: estimados[j + n - 1].fin * k, indice: desde };
};

export const construirLineaDeTiempo = <Id extends string, M extends Partial<Record<Id, Record<string, string>>>>(
  palabras: PalabraConTiempo[],
  fps: number,
  totalFrames: number,
  config: ConfigLinea<Id, M>,
): LineaDeTiempo<Id, M> => {
  const f = (s: number) => Math.max(0, Math.round(s * fps));

  let indice = 0;
  const anclas = config.escenas.map(({ id, inicio }) => {
    if (inicio === null) return { id, desde: 0, indice };
    if ("frase" in inicio) {
      const u = ubicarFrase(palabras, inicio.frase, config.estimados, indice);
      indice = u.indice;
      return { id, desde: f(u.inicio - config.adelanto), indice };
    }
    const u = ubicarFrase(palabras, inicio.despuesDe, config.estimados, indice);
    indice = u.indice;
    return { id, desde: f(u.fin + 0.08), indice };
  });

  const escenas = {} as Record<Id, Escena<Id>>;
  anclas.forEach(({ id, desde }, i) => {
    const hasta = i < anclas.length - 1 ? anclas[i + 1].desde : totalFrames;
    escenas[id] = { id, desde, duracion: Math.max(1, hasta - desde) };
  });

  const marcas = {} as Record<string, Record<string, number>>;
  for (const { id, indice: desdeIndice } of anclas) {
    const frases = config.marcas[id] as Record<string, string> | undefined;
    if (!frases) continue;
    marcas[id] = {};
    for (const [nombre, frase] of Object.entries(frases)) {
      const u = ubicarFrase(palabras, frase, config.estimados, desdeIndice);
      marcas[id][nombre] = f(u.inicio) - escenas[id].desde;
    }
  }

  return { escenas, marcas: marcas as LineaDeTiempo<Id, M>["marcas"] };
};

/** 0 → 1 cuando la voz está hablando (con rampas suaves), para el ducking. */
export const intensidadVoz = (palabras: PalabraConTiempo[], t: number) => {
  const rampa = 0.25;
  let mejor = 0;
  for (const p of palabras) {
    if (t >= p.inicio && t <= p.fin) return 1;
    const d = t < p.inicio ? p.inicio - t : t - p.fin;
    if (d < rampa) mejor = Math.max(mejor, 1 - d / rampa);
    if (p.inicio > t + rampa) break;
  }
  return mejor;
};
