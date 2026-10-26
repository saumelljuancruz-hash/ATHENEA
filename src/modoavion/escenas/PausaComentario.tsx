import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-modoavion";
import { MarcasModoAvion } from "../linea-modoavion";
import { Zumbido, PropsZumbido } from "./Zumbido";

export type PropsPausa = {
  marcas: MarcasModoAvion["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsZumbido;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Zumbido {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
