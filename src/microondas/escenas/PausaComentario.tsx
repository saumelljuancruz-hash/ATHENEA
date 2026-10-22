import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-microondas";
import { MarcasMicroondas } from "../linea-microondas";
import { Magnetron, PropsMagnetron } from "./Magnetron";

export type PropsPausa = {
  marcas: MarcasMicroondas["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsMagnetron;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Magnetron {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
