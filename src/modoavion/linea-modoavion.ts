import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-modoavion";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaModoAvion = "hook" | "busqueda" | "zumbido" | "pausa" | "antenas" | "remate" | "cta";

export const CONFIG_LINEA_MODOAVION: ConfigLinea<EscenaModoAvion, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "busqueda", inicio: { frase: ANCLAS.busqueda } },
    { id: "zumbido", inicio: { frase: ANCLAS.zumbido } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "antenas", inicio: { frase: ANCLAS.antenas } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasModoAvion = LineaDeTiempo<EscenaModoAvion, typeof MARCAS>["marcas"];

export const lineaModoAvion = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_MODOAVION);
