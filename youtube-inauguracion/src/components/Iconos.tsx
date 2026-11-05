import React from "react";
import { C } from "../theme";

const TEAL = "#3ee0c0";

/** Íconos de línea con brillo, en el estilo del banner del canal. */
export const Icono: React.FC<{ tipo: string; size: number; color?: string; grosor?: number }> = ({ tipo, size, color = TEAL, grosor = 6 }) => {
  const s = { fill: "none", stroke: color, strokeWidth: grosor, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 16px ${color})` }}>
      {tipo === "rayo" ? <path d="M 58 6 L 24 56 H 48 L 40 94 L 76 40 H 52 Z" {...s} /> : null}
      {tipo === "espejo" ? (
        <g {...s}>
          <ellipse cx={50} cy={44} rx={28} ry={36} />
          <path d="M 50 80 V 94 M 36 94 H 64 M 38 30 L 50 20" />
        </g>
      ) : null}
      {tipo === "moneda" ? (
        <g {...s}>
          <circle cx={50} cy={50} r={40} />
          <path d="M 42 28 V 72 M 54 28 V 72 M 36 34 H 58 C 70 34 70 50 58 50 H 36 M 58 50 C 72 50 72 66 58 66 H 36" />
        </g>
      ) : null}
      {tipo === "celular" ? (
        <g {...s}>
          <rect x={28} y={8} width={44} height={84} rx={10} />
          <path d="M 44 18 H 56" />
          <circle cx={50} cy={80} r={3} />
        </g>
      ) : null}
      {tipo === "wifi" ? (
        <g {...s}>
          <path d="M 14 42 C 34 24 66 24 86 42 M 26 56 C 40 44 60 44 74 56 M 38 70 C 45 64 55 64 62 70" />
          <circle cx={50} cy={82} r={4} fill={color} />
        </g>
      ) : null}
      {tipo === "cargador" ? (
        <g {...s}>
          <rect x={34} y={36} width={32} height={34} rx={6} />
          <path d="M 42 36 V 20 M 58 36 V 20 M 50 70 V 92" />
        </g>
      ) : null}
      {tipo === "lupa" ? (
        <g {...s}>
          <circle cx={42} cy={42} r={26} />
          <path d="M 61 61 L 88 88" strokeWidth={grosor * 1.5} />
        </g>
      ) : null}
      {tipo === "campana" ? (
        <g {...s}>
          <path d="M 26 70 V 46 C 26 30 36 20 50 20 C 64 20 74 30 74 46 V 70 L 82 78 H 18 Z" />
          <path d="M 42 84 C 44 90 56 90 58 84 M 50 12 V 20" />
        </g>
      ) : null}
      {tipo === "parlante" ? (
        <g {...s}>
          <path d="M 14 40 H 30 L 50 22 V 78 L 30 60 H 14 Z" />
          <path d="M 62 36 C 70 44 70 56 62 64 M 72 26 C 86 40 86 60 72 74" />
        </g>
      ) : null}
      {tipo === "play" ? (
        <g {...s}>
          <rect x={8} y={20} width={84} height={60} rx={16} />
          <path d="M 42 36 L 62 50 L 42 64 Z" fill={color} />
        </g>
      ) : null}
    </svg>
  );
};

/** Persiana de una cámara de verdad (obturador de láminas), cerrándose según `cierre` (0 → 1). */
export const Persiana: React.FC<{ size: number; cierre: number }> = ({ size, cierre }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ overflow: "visible" }}>
    <circle r={52} fill="#0b0f17" stroke="#8b95a8" strokeWidth={5} />
    {new Array(6).fill(0).map((_, i) => (
      <path key={i} d={`M 0 0 L 48 ${-14 + cierre * 14} A 50 50 0 0 0 ${24 - cierre * 10} -44 Z`} fill="#3a4256" stroke="#8b95a8" strokeWidth={2} transform={`rotate(${i * 60 + cierre * 30})`} opacity={0.4 + cierre * 0.6} />
    ))}
    <circle r={18 * (1 - cierre)} fill={TEAL} opacity={0.5} />
  </svg>
);

/** La bandera de Japón (dibujo simple). */
export const Japon: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={width * 0.66} viewBox="0 0 150 100">
    <rect width={150} height={100} rx={6} fill="#f4f4f4" />
    <circle cx={75} cy={50} r={28} fill="#bc002d" />
  </svg>
);

export const ROJO_YT = "#ff1f3d";
export const AMARILLO = C.yellow;
