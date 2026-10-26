import React from "react";
import { random } from "remotion";

/** Colores del espectro (de rojo a violeta) con su longitud de onda aproximada (nm). */
export const ESPECTRO = [
  { color: "#ff3b2f", nm: 700 },
  { color: "#ff8a2a", nm: 620 },
  { color: "#ffd23f", nm: 580 },
  { color: "#5fd36a", nm: 530 },
  { color: "#3ee0c0", nm: 500 },
  { color: "#4aa3ff", nm: 450 },
  { color: "#8a6bff", nm: 410 },
];

export const AZUL_LUZ = "#4aa3ff";
export const ROJO_LUZ = "#ff3b2f";

/** Onda senoidal de (x0,y0) a (x1,y1). `largo` ≈ longitud de onda en px. */
export const onda = (x0: number, y0: number, x1: number, y1: number, largo: number, amp: number, fase: number) => {
  const l = Math.hypot(x1 - x0, y1 - y0);
  const nx = -(y1 - y0) / (l || 1);
  const ny = (x1 - x0) / (l || 1);
  const pasos = Math.max(2, Math.ceil(l / 5));
  return Array.from({ length: pasos + 1 }, (_, i) => {
    const u = i / pasos;
    const a = amp * Math.sin((u * l * 2 * Math.PI) / largo - fase);
    return `${i ? "L" : "M"}${(x0 + (x1 - x0) * u + nx * a).toFixed(1)},${(y0 + (y1 - y0) * u + ny * a).toFixed(1)}`;
  }).join("");
};

/** Molécula de aire (N₂ u O₂): dos esferas unidas. Usa el gradiente "esferaLuz" (DefsEsferas). */
export const MoleculaAire: React.FC<{ x: number; y: number; r: number; angulo: number; color?: string; opacidad?: number }> = ({
  x,
  y,
  r,
  angulo,
  color = "#8f98a6",
  opacidad = 1,
}) => {
  const a = (angulo * Math.PI) / 180;
  const dx = Math.cos(a) * r * 0.7;
  const dy = Math.sin(a) * r * 0.7;
  return (
    <g opacity={opacidad}>
      {[-1, 1].map((s) => (
        <g key={s}>
          <circle cx={x + s * dx} cy={y + s * dy} r={r} fill={color} />
          <circle cx={x + s * dx} cy={y + s * dy} r={r} fill="url(#esferaLuz)" />
        </g>
      ))}
    </g>
  );
};

/** Rebote: ondas azules que salen en todas direcciones desde una molécula. */
export const Rebote: React.FC<{ x: number; y: number; frame: number; semilla: number; intensidad: number; color?: string }> = ({
  x,
  y,
  frame,
  semilla,
  intensidad,
  color = AZUL_LUZ,
}) => {
  if (intensidad <= 0) return null;
  const ciclo = 42;
  const t = ((frame + semilla * 11) % ciclo) / ciclo;
  const n = Math.floor((frame + semilla * 11) / ciclo);
  return (
    <g opacity={intensidad}>
      <circle cx={x} cy={y} r={18 + t * 120} fill="none" stroke={color} strokeWidth={3} opacity={1 - t} />
      {Array.from({ length: 5 }, (_, k) => {
        const a = random(`rb${semilla}-${n}-${k}`) * Math.PI * 2;
        const d0 = 24 + t * 40;
        const d1 = d0 + 70 + t * 60;
        return (
          <path
            key={k}
            d={onda(x + Math.cos(a) * d0, y + Math.sin(a) * d0, x + Math.cos(a) * d1, y + Math.sin(a) * d1, 22, 5, frame * 0.5)}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={1 - t}
          />
        );
      })}
    </g>
  );
};
