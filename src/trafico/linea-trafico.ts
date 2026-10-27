import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-trafico";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaTrafico = "hook" | "carrito" | "truco" | "pausa" | "nosotros" | "remate" | "cta";

export const CONFIG_LINEA_TRAFICO: ConfigLinea<EscenaTrafico, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "carrito", inicio: { frase: ANCLAS.carrito } },
    { id: "truco", inicio: { frase: ANCLAS.truco } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "nosotros", inicio: { frase: ANCLAS.nosotros } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasTrafico = LineaDeTiempo<EscenaTrafico, typeof MARCAS>["marcas"];

export const lineaTrafico = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_TRAFICO);
