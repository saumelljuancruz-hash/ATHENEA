import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { Nubes, Ventanilla } from "../componentes/Ventana";
import { TEXTOS } from "../guion-ventanas";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<VentanillaDeFondo />} />
);

/** Una ventanilla redondeada grande, con nubes que pasan. */
export const VentanillaDeFondo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <rect width={1080} height={1920} fill="#8f949c" />
      <Ventanilla x={540} y={1000} ancho={520} alto={720} redondez={1} panel={false} cielo={<Nubes x={540} y={1000} frame={frame} />} />
    </svg>
  );
};
