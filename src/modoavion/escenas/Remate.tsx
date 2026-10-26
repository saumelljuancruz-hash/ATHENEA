import React from "react";
import { useCurrentFrame } from "remotion";
import { flotar } from "../../comun/anim";
import { RemateLineas } from "../../comun/RemateLineas";
import { Paisaje } from "../../cielo/componentes/Paisaje";
import { Anillos, AvionLateral } from "../componentes/Vuelo";
import { TEXTOS } from "../guion-modoavion";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<VueloDeFondo />} />
);

/** El avión cruzando el cielo con las señales saliendo, de fondo. */
const VueloDeFondo: React.FC = () => {
  const frame = useCurrentFrame();
  const y = 520 + flotar(frame, 150, 10);
  return (
    <>
      <Paisaje hora={0.15} saturacion={0.6} sol={{ x: 880, y: 300 }} frame={frame} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Anillos x={540} y={y + 40} frame={frame} intensidad={0.7} alcance={520} periodo={40} />
        <AvionLateral x={1000 - ((frame * 1.6) % 1700)} y={y} escala={0.9} inclinacion={-3} frame={frame} />
      </svg>
    </>
  );
};
