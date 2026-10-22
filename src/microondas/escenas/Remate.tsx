import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { DefsEsferas, MoleculaAgua, repartir } from "../componentes/Moleculas";
import { TEXTOS } from "../guion-microondas";

export type PropsRemate = { duracion: number };

const MOLECULAS = repartir(10, { x0: 380, x1: 1080, y0: 300, y1: 1500 }, 50, 90, "remate");

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<MoleculasGirando />} />
);

/** Moléculas calientes girando sin parar, de fondo. */
const MoleculasGirando: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920}>
      <DefsEsferas />
      {MOLECULAS.map((m, i) => (
        <MoleculaAgua key={i} x={m.x} y={m.y} r={m.r} angulo={m.base + frame * (9 + (i % 3) * 3)} temp={0.75} />
      ))}
    </svg>
  );
};
