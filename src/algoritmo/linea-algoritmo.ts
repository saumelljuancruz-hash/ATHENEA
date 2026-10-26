import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-algoritmo";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaAlgoritmo = "hook" | "senales" | "parecidos" | "pausa" | "recomienda" | "remate" | "cta";

export const CONFIG_LINEA_ALGORITMO: ConfigLinea<EscenaAlgoritmo, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "senales", inicio: { frase: ANCLAS.senales } },
    { id: "parecidos", inicio: { frase: ANCLAS.parecidos } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "recomienda", inicio: { frase: ANCLAS.recomienda } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasAlgoritmo = LineaDeTiempo<EscenaAlgoritmo, typeof MARCAS>["marcas"];

export const lineaAlgoritmo = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_ALGORITMO);
