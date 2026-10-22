import { ConfigLinea, construirLineaDeTiempo, LineaDeTiempo } from "../comun/linea-de-tiempo";
import { PalabraConTiempo } from "../comun/tipos";
import { ANCLAS, MARCAS } from "./guion-microondas";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export type EscenaMicroondas = "hook" | "magnetron" | "pausa" | "puntosCalientes" | "plato" | "remate" | "cta";

export const CONFIG_LINEA_MICROONDAS: ConfigLinea<EscenaMicroondas, typeof MARCAS> = {
  escenas: [
    { id: "hook", inicio: null },
    { id: "magnetron", inicio: { frase: ANCLAS.magnetron } },
    { id: "pausa", inicio: { frase: ANCLAS.pausa } },
    { id: "puntosCalientes", inicio: { frase: ANCLAS.puntosCalientes } },
    { id: "plato", inicio: { frase: ANCLAS.plato } },
    { id: "remate", inicio: { despuesDe: ANCLAS.remateDespuesDe } },
    { id: "cta", inicio: { frase: ANCLAS.cta } },
  ],
  marcas: MARCAS,
  adelanto: ANCLAS.adelanto,
  estimados: TIMESTAMPS_ESTIMADOS,
};

export type MarcasMicroondas = LineaDeTiempo<EscenaMicroondas, typeof MARCAS>["marcas"];

export const lineaMicroondas = (palabras: PalabraConTiempo[], fps: number, totalFrames: number) =>
  construirLineaDeTiempo(palabras, fps, totalFrames, CONFIG_LINEA_MICROONDAS);
