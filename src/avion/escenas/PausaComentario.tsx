import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-avion";
import { MarcasAvion } from "../linea-avion";
import { MapaMiente, PropsMapaMiente } from "./MapaMiente";

export type PropsPausa = {
  marcas: MarcasAvion["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsMapaMiente;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<MapaMiente {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
