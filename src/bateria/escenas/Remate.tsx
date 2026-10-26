import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { Pila } from "../componentes/Bateria";
import { TEXTOS } from "../guion-bateria";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<PilaDeFondo />} />
);

/** La pila respirando entre 20 y 80 %, de fondo. */
const PilaDeFondo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Pila x={540} y={1000} alto={900} nivel={0.5 + 0.3 * Math.sin(frame / 40)} frame={frame} cargando={1} porcentaje={false} />
    </svg>
  );
};
