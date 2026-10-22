import React from "react";
import { AbsoluteFill } from "remotion";

/** Cámara 2D sobre todo el escenario: zoom y giro alrededor de `foco`, que se lleva a `destino`. */
export type Vista = { zoom: number; giro: number; foco: [number, number]; destino: [number, number] };

export const VISTA_NEUTRA: Vista = { zoom: 1, giro: 0, foco: [540, 960], destino: [540, 960] };

export const aPantalla = ([x, y]: [number, number], v: Vista) => {
  const a = (v.giro * Math.PI) / 180;
  const dx = (x - v.foco[0]) * v.zoom;
  const dy = (y - v.foco[1]) * v.zoom;
  return { x: v.destino[0] + dx * Math.cos(a) - dy * Math.sin(a), y: v.destino[1] + dx * Math.sin(a) + dy * Math.cos(a) };
};

/** Aplica la vista a todo su contenido (dibujado en coordenadas de 1080×1920). */
export const ContenedorVista: React.FC<{ vista: Vista; children: React.ReactNode; style?: React.CSSProperties }> = ({
  vista,
  children,
  style,
}) => (
  <AbsoluteFill
    style={{
      transformOrigin: "0 0",
      transform: `translate(${vista.destino[0]}px, ${vista.destino[1]}px) rotate(${vista.giro}deg) scale(${vista.zoom}) translate(${-vista.foco[0]}px, ${-vista.foco[1]}px)`,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);
