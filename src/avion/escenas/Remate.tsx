import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { COLOR } from "../../comun/tema";
import { crearProyeccion, GRATICULA, rutaGranCirculo, TIERRA, trazar } from "../geo";
import { TEXTOS } from "../guion-avion";

export type PropsRemate = { duracion: number };

const GC = rutaGranCirculo(140);

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<GloboAlambre />} />
);

/** Globo de alambre que gira sin parar, con el gran círculo. */
const GloboAlambre: React.FC = () => {
  const frame = useCurrentFrame();
  const p = crearProyeccion({
    aplanado: 0,
    mercator: 1,
    radioGlobo: 1,
    escala: 560,
    centro: [700, 900],
    rotacion: [150 - frame * 0.35, -55, 0],
  });
  return (
    <svg width={1080} height={1920}>
      <path d={trazar(p, { type: "Sphere" })} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
      <path d={trazar(p, GRATICULA)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
      <path d={trazar(p, TIERRA)} fill="rgba(255,255,255,0.10)" />
      <path d={trazar(p, { type: "LineString", coordinates: GC })} fill="none" stroke={COLOR.verde} strokeWidth={6} />
    </svg>
  );
};
