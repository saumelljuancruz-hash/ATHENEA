import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-mareo";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaMareo = "hook" | "gravedad" | "cerebro" | "rescate" | "cta";

export const CONFIG_LINEA_MAREO: ConfigLinea<EscenaMareo, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "gravedad", inicio: { frase: ANCLAS.gravedad } },
    { id: "cerebro", inicio: { frase: ANCLAS.cerebro } },
    { id: "rescate", inicio: { frase: ANCLAS.rescate } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasMareo = LineaDeTiempo<EscenaMareo, typeof MARCAS>["marcas"];

export const lineaMareo = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_MAREO);
