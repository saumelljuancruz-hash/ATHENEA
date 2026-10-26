import React from "react";
import { random, useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { COLOR } from "../../comun/tema";
import { Persona } from "../componentes/Gente";
import { TEXTOS } from "../guion-algoritmo";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<MultitudDeFondo />} />
);

/** Multitud con algunas personas que se encienden, de fondo. */
export const MultitudDeFondo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 14 * 24 }, (_, i) => {
        const c = i % 14;
        const f = Math.floor(i / 14);
        const brillo = Math.max(0, Math.sin(frame / 25 + random(`m${i}`) * 40)) ** 8;
        return <Persona key={i} x={40 + c * 76 + (f % 2) * 38} y={60 + f * 80 - ((frame * 0.6) % 80)} r={24} color={brillo > 0.5 ? COLOR.verde : "#4a4e57"} opacidad={0.5 + 0.5 * brillo} />;
      })}
    </svg>
  );
};
