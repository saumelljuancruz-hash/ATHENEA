import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-pierna";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaPierna = "hook" | "cable" | "hormigueo" | "tranqui" | "cta";

export const CONFIG_LINEA_PIERNA: ConfigLinea<EscenaPierna, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "cable", inicio: { frase: ANCLAS.cable } },
    { id: "hormigueo", inicio: { frase: ANCLAS.hormigueo } },
    { id: "tranqui", inicio: { frase: ANCLAS.tranqui } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasPierna = LineaDeTiempo<EscenaPierna, typeof MARCAS>["marcas"];

export const lineaPierna = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_PIERNA);
