import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-acaros";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaAcaros = "hook" | "quienes" | "noche" | "tranqui" | "cta";

export const CONFIG_LINEA_ACAROS: ConfigLinea<EscenaAcaros, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "quienes", inicio: { frase: ANCLAS.quienes } },
    { id: "noche", inicio: { frase: ANCLAS.noche } },
    { id: "tranqui", inicio: { frase: ANCLAS.tranqui } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasAcaros = LineaDeTiempo<EscenaAcaros, typeof MARCAS>["marcas"];

export const lineaAcaros = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_ACAROS);
