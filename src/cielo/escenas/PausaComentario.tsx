import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-cielo";
import { MarcasCielo } from "../linea-cielo";
import { Rebote, PropsRebote } from "./Rebote";

export type PropsPausa = {
  marcas: MarcasCielo["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsRebote;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Rebote {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
