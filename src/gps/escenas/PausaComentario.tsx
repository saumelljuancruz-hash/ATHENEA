import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-gps";
import { MarcasGps } from "../linea-gps";
import { Senal, PropsSenal } from "./Senal";

export type PropsPausa = {
  marcas: MarcasGps["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsSenal;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Senal {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
