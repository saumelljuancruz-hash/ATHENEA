import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-ventanas";
import { MarcasVentanas } from "../linea-ventanas";
import { Pileta, PropsPileta } from "./Pileta";

export type PropsPausa = {
  marcas: MarcasVentanas["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsPileta;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Pileta {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
