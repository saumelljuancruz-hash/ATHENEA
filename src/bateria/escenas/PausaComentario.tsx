import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-bateria";
import { MarcasBateria } from "../linea-bateria";
import { Inteligente, PropsInteligente } from "./Inteligente";

export type PropsPausa = {
  marcas: MarcasBateria["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsInteligente;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Inteligente {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
