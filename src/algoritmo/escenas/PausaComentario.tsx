import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-algoritmo";
import { MarcasAlgoritmo } from "../linea-algoritmo";
import { Parecidos, PropsParecidos } from "./Parecidos";

export type PropsPausa = {
  marcas: MarcasAlgoritmo["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsParecidos;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Parecidos {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
