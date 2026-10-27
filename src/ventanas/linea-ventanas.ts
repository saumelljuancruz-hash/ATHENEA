import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-ventanas";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaVentanas = "hook" | "comet" | "pileta" | "pausa" | "esquina" | "remate" | "cta";

export const CONFIG_LINEA_VENTANAS: ConfigLinea<EscenaVentanas, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "comet", inicio: { frase: ANCLAS.comet } },
    { id: "pileta", inicio: { frase: ANCLAS.pileta } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "esquina", inicio: { frase: ANCLAS.esquina } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasVentanas = LineaDeTiempo<EscenaVentanas, typeof MARCAS>["marcas"];

export const lineaVentanas = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_VENTANAS);
