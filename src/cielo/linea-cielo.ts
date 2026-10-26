import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-cielo";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaCielo = "hook" | "luz" | "rebote" | "pausa" | "atardecer" | "remate" | "cta";

export const CONFIG_LINEA_CIELO: ConfigLinea<EscenaCielo, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "luz", inicio: { frase: ANCLAS.luz } },
    { id: "rebote", inicio: { frase: ANCLAS.rebote } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "atardecer", inicio: { frase: ANCLAS.atardecer } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasCielo = LineaDeTiempo<EscenaCielo, typeof MARCAS>["marcas"];

export const lineaCielo = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_CIELO);
