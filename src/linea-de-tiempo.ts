import { ANCLAS, MARCAS } from "./guion-avion";
import { PalabraConTiempo, TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaId =
  | "hook"
  | "mapaMiente"
  | "pausa"
  | "prueba"
  | "granCirculo"
  | "remate"
  | "cta";

export type Escena = {
  id: EscenaId;
  /** Frame global de inicio. */
  desde: number;
  duracion: number;
};

type MarcasDe<K extends keyof typeof MARCAS> = Record<keyof (typeof MARCAS)[K], number>;

/** Marcas en frames RELATIVOS al inicio de cada escena. */
export type Marcas = {
  hook: MarcasDe<"hook">;
  mapaMiente: MarcasDe<"mapaMiente">;
  pausa: MarcasDe<"pausa">;
  prueba: MarcasDe<"prueba">;
  granCirculo: MarcasDe<"granCirculo">;
  cta: MarcasDe<"cta">;
};

export type LineaDeTiempo = {
  escenas: Record<EscenaId, Escena>;
  marcas: Marcas;
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
 * contiene la frase exacta (p. ej. "14" en vez de "catorce"), usa la posición
 * estimada escalada a la duración real.
 */
const ubicarFrase = (palabras: PalabraConTiempo[], frase: string, desde = 0) => {
  const i = buscarIndice(palabras, frase, desde);
  const n = frase.split(/\s+/).filter(Boolean).length;
  if (i >= 0) {
    return { inicio: palabras[i].inicio, fin: palabras[i + n - 1].fin, indice: i };
  }
  const j = buscarIndice(TIMESTAMPS_ESTIMADOS, frase);
  const totalEst = TIMESTAMPS_ESTIMADOS[TIMESTAMPS_ESTIMADOS.length - 1].fin;
  const totalReal = palabras[palabras.length - 1]?.fin ?? totalEst;
  const k = totalReal / totalEst;
  if (j < 0) {
    throw new Error(`La frase "${frase}" no está en los timestamps ni en el guion.`);
  }
  return {
    inicio: TIMESTAMPS_ESTIMADOS[j].inicio * k,
    fin: TIMESTAMPS_ESTIMADOS[j + n - 1].fin * k,
    indice: desde,
  };
};

export const construirLineaDeTiempo = (
  palabras: PalabraConTiempo[],
  fps: number,
  totalFrames: number,
): LineaDeTiempo => {
  const f = (s: number) => Math.max(0, Math.round(s * fps));
  const ad = ANCLAS.adelanto;

  const mapa = ubicarFrase(palabras, ANCLAS.mapaMiente);
  const pausa = ubicarFrase(palabras, ANCLAS.pausa, mapa.indice);
  const prueba = ubicarFrase(palabras, ANCLAS.prueba, pausa.indice);
  const gran = ubicarFrase(palabras, ANCLAS.granCirculo, prueba.indice);
  const finVoz = ubicarFrase(palabras, ANCLAS.remateDespuesDe, gran.indice);
  const cta = ubicarFrase(palabras, ANCLAS.cta, finVoz.indice);

  const inicios: [EscenaId, number][] = [
    ["hook", 0],
    ["mapaMiente", f(mapa.inicio - ad)],
    ["pausa", f(pausa.inicio - ad)],
    ["prueba", f(prueba.inicio - ad)],
    ["granCirculo", f(gran.inicio - ad)],
    ["remate", f(finVoz.fin + 0.08)],
    ["cta", f(cta.inicio - ad)],
  ];

  const escenas = {} as Record<EscenaId, Escena>;
  inicios.forEach(([id, desde], i) => {
    const hasta = i < inicios.length - 1 ? inicios[i + 1][1] : totalFrames;
    escenas[id] = { id, desde, duracion: Math.max(1, hasta - desde) };
  });

  const marcasDe = <K extends keyof typeof MARCAS>(clave: K, escena: EscenaId, desdeIndice: number) => {
    const salida = {} as Record<string, number>;
    for (const [nombre, frase] of Object.entries(MARCAS[clave])) {
      const u = ubicarFrase(palabras, frase as string, desdeIndice);
      salida[nombre] = f(u.inicio) - escenas[escena].desde;
    }
    return salida as MarcasDe<K>;
  };

  return {
    escenas,
    marcas: {
      hook: marcasDe("hook", "hook", 0),
      mapaMiente: marcasDe("mapaMiente", "mapaMiente", mapa.indice),
      pausa: marcasDe("pausa", "pausa", pausa.indice),
      prueba: marcasDe("prueba", "prueba", prueba.indice),
      granCirculo: marcasDe("granCirculo", "granCirculo", gran.indice),
      cta: marcasDe("cta", "cta", cta.indice),
    },
  };
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
