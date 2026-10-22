import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-faceid";
import { MarcasFaceId } from "../linea-faceid";
import { Puntos, PropsPuntos } from "./Puntos";

export type PropsPausa = {
  marcas: MarcasFaceId["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsPuntos;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Puntos {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
