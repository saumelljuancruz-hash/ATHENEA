import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-apps";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaApps = "hook" | "congela" | "cero" | "pausa" | "excepcion" | "remate" | "cta";

export const CONFIG_LINEA_APPS: ConfigLinea<EscenaApps, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "congela", inicio: { frase: ANCLAS.congela } },
    { id: "cero", inicio: { frase: ANCLAS.cero } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "excepcion", inicio: { frase: ANCLAS.excepcion } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasApps = LineaDeTiempo<EscenaApps, typeof MARCAS>["marcas"];

export const lineaApps = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_APPS);
