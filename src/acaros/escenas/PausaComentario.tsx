import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-acaros";
import { MarcasAcaros } from "../linea-acaros";
import { Noche, PropsNoche } from "./Noche";

export type PropsPausa = {
  marcas: MarcasAcaros["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsNoche;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Noche {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
