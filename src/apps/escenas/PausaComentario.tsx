import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-apps";
import { MarcasApps } from "../linea-apps";
import { Cero, PropsCero } from "./Cero";

export type PropsPausa = {
  marcas: MarcasApps["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsCero;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Cero {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
