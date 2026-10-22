import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { dibujarMalla } from "../cabeza";
import { Lienzo } from "../componentes/Lienzo";
import { TEXTOS } from "../guion-faceid";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<MallaGirando />} />
);

/** Malla de la cara girando sin parar, de fondo. */
const MallaGirando: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Lienzo
      dibujar={(ctx) =>
        dibujarMalla(ctx, { yaw: -0.4 + frame * 0.012, pitch: 0.1, escala: 430, centro: [720, 860] }, { grosor: 2.2 })
      }
    />
  );
};
