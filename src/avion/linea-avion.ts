import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-avion";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaAvion = "hook" | "mapaMiente" | "pausa" | "prueba" | "granCirculo" | "remate" | "cta";

export const CONFIG_LINEA_AVION: ConfigLinea<EscenaAvion, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "mapaMiente", inicio: { frase: ANCLAS.mapaMiente } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "prueba", inicio: { frase: ANCLAS.prueba } },
    { id: "granCirculo", inicio: { frase: ANCLAS.granCirculo } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasAvion = LineaDeTiempo<EscenaAvion, typeof MARCAS>["marcas"];

export const lineaAvion = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_AVION);
