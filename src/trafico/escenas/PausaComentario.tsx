import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-trafico";
import { MarcasTrafico } from "../linea-trafico";
import { Truco, PropsTruco } from "./Truco";

export type PropsPausa = {
  marcas: MarcasTrafico["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsTruco;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Truco {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
