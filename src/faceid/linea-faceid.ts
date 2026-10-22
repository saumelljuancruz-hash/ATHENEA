import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-faceid";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaFaceId = "hook" | "puntos" | "pausa" | "mapa3d" | "privacidad" | "remate" | "cta";

export const CONFIG_LINEA_FACEID: ConfigLinea<EscenaFaceId, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "puntos", inicio: { frase: ANCLAS.puntos } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "mapa3d", inicio: { frase: ANCLAS.mapa3d } },
    { id: "privacidad", inicio: { frase: ANCLAS.privacidad } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasFaceId = LineaDeTiempo<EscenaFaceId, typeof MARCAS>["marcas"];

export const lineaFaceId = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_FACEID);
