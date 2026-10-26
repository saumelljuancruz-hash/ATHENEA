import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-qr";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaQr = "hook" | "esquinas" | "binario" | "pausa" | "respaldo" | "remate" | "cta";

export const CONFIG_LINEA_QR: ConfigLinea<EscenaQr, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "esquinas", inicio: { frase: ANCLAS.esquinas } },
    { id: "binario", inicio: { frase: ANCLAS.binario } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "respaldo", inicio: { frase: ANCLAS.respaldo } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasQr = LineaDeTiempo<EscenaQr, typeof MARCAS>["marcas"];

export const lineaQr = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_QR);
