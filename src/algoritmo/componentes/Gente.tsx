import React from "react";
import { COLOR } from "../../comun/tema";

/** Personita (cabeza + hombros) para dibujar dentro de un <svg>. */
export const Persona: React.FC<{ x: number; y: number; r: number; color: string; opacidad?: number }> = ({ x, y, r, color, opacidad = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacidad}>
    <circle cx={0} cy={-r * 0.55} r={r * 0.45} fill={color} />
    <path d={`M ${-r * 0.85} ${r * 0.85} C ${-r * 0.85} ${r * 0.05} ${r * 0.85} ${r * 0.05} ${r * 0.85} ${r * 0.85} Z`} fill={color} />
  </g>
);

/** Avatar grande de "vos" con anillo. `anillo` 0..1 dibuja el progreso del perfil. */
export const Avatar: React.FC<{ x: number; y: number; r: number; anillo?: number; color?: string; brillo?: number }> = ({
  x,
  y,
  r,
  anillo = 0,
  color = COLOR.verde,
  brillo = 0,
}) => {
  const c = 2 * Math.PI * (r + 14);
  return (
    <g transform={`translate(${x} ${y})`}>
      {brillo > 0 ? <circle r={r + 40} fill={color} opacity={0.18 * brillo} /> : null}
      <circle r={r} fill="#22252b" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
      <Persona x={0} y={r * 0.12} r={r * 0.7} color="#8f96a1" />
      <circle r={r + 14} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={8} />
      <circle
        r={r + 14}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={`${c * Math.min(1, anillo)} ${c}`}
        transform="rotate(-90)"
      />
    </g>
  );
};
