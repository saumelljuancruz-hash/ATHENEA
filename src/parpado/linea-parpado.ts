import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-parpado";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaParpado = "hook" | "musculo" | "causas" | "tranqui" | "cta";

export const CONFIG_LINEA_PARPADO: ConfigLinea<EscenaParpado, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "musculo", inicio: { frase: ANCLAS.musculo } },
    { id: "causas", inicio: { frase: ANCLAS.causas } },
    { id: "tranqui", inicio: { frase: ANCLAS.tranqui } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasParpado = LineaDeTiempo<EscenaParpado, typeof MARCAS>["marcas"];

export const lineaParpado = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_PARPADO);
