import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-gps";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaGps = "hook" | "senal" | "pausa" | "cuatro" | "tiempo" | "remate" | "cta";

export const CONFIG_LINEA_GPS: ConfigLinea<EscenaGps, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "senal", inicio: { frase: ANCLAS.senal } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "cuatro", inicio: { frase: ANCLAS.cuatro } },
    { id: "tiempo", inicio: { frase: ANCLAS.tiempo } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasGps = LineaDeTiempo<EscenaGps, typeof MARCAS>["marcas"];

export const lineaGps = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_GPS);
