import React from "react";
import { TarjetaPausa } from "../../comun/TarjetaPausa";
import { TEXTOS } from "../guion-qr";
import { MarcasQr } from "../linea-qr";
import { Binario, PropsBinario } from "./Binario";

export type PropsPausa = {
  marcas: MarcasQr["pausa"];
  duracion: number;
  /** La escena anterior, que se muestra congelada detrás de la tarjeta. */
  anterior: PropsBinario;
};

export const PausaComentario: React.FC<PropsPausa> = ({ marcas, duracion, anterior }) => (
  <TarjetaPausa
    duracion={duracion}
    comentarios={marcas.comentarios}
    textos={TEXTOS.pausa}
    fondo={<Binario {...anterior} />}
    frameCongelado={anterior.duracion - 1}
  />
);
