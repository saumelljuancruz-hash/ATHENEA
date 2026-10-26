import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-bateria";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaBateria = "hook" | "corte" | "inteligente" | "pausa" | "calor" | "remate" | "cta";

export const CONFIG_LINEA_BATERIA: ConfigLinea<EscenaBateria, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "corte", inicio: { frase: ANCLAS.corte } },
    { id: "inteligente", inicio: { frase: ANCLAS.inteligente } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "calor", inicio: { frase: ANCLAS.calor } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasBateria = LineaDeTiempo<EscenaBateria, typeof MARCAS>["marcas"];

export const lineaBateria = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_BATERIA);
