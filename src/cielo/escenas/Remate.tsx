import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { Paisaje } from "../componentes/Paisaje";
import { TEXTOS } from "../guion-cielo";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<CieloQueCambia />} />
);

/** Cielo que pasa del azul al atardecer, de fondo. */
const CieloQueCambia: React.FC = () => {
  const frame = useCurrentFrame();
  const hora = 0.5 + 0.5 * Math.sin(frame / 50);
  return <Paisaje hora={hora} sol={{ x: 780, y: 420 + hora * 600 }} frame={frame} />;
};
