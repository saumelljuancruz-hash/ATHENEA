import React from "react";
import { random, useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { Acaro, POROS, SuperficiePiel } from "../componentes/Piel";
import { TEXTOS } from "../guion-acaros";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<PielDeNoche />} />
);

/** Piel de noche con ácaros caminando despacito, de fondo. */
export const PielDeNoche: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SuperficiePiel poros={POROS} noche={0.8}>
      {POROS.slice(0, 10).map((p, k) => {
        const dir = random(`r${k}`) * 360;
        const rad = (dir * Math.PI) / 180;
        const d = 60 + frame * 0.35;
        return <Acaro key={k} x={p.x + Math.sin(rad) * d} y={p.y - Math.cos(rad) * d} escala={0.42} rot={dir} frame={frame} camina={1} />;
      })}
    </SuperficiePiel>
  );
};
