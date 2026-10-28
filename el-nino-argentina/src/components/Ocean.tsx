import React from "react";
import { lerpColor, mix } from "./anim";
import { C } from "../theme";

type CrossSectionProps = {
  id: string;
  width: number;
  height: number;
  frame: number;
  /** +1: el agua apilada a la izquierda (oeste, Asia); −1: a la derecha. */
  tilt: number;
  /** Desnivel en píxeles cuando tilt = 1 (está exagerado a propósito). */
  tiltPx?: number;
  /** 0: normal, capa caliente gruesa al oeste; 1: El Niño, pareja hasta el este. */
  nino?: number;
  waves?: number;
  /** Flechas de agua fría subiendo frente a Perú, 0 → 1. */
  upwelling?: number;
};

/** Corte del Pacífico ecuatorial de oeste a este: capa caliente arriba, agua fría abajo. */
export const CrossSection: React.FC<CrossSectionProps> = ({ id, width, height, frame, tilt, tiltPx = height * 0.12, nino = 0, waves = 6, upwelling = 0 }) => {
  const steps = 48;
  const xs = new Array(steps + 1).fill(0).map((_, i) => (i / steps) * width);
  const base = height * 0.32;
  const surface = xs.map(
    (x) => base - tilt * tiltPx * (0.5 - x / width) * 2 + waves * (Math.sin(x * 0.011 + frame * 0.22) + 0.5 * Math.sin(x * 0.029 - frame * 0.17)),
  );
  const layer = xs.map((x) => mix(nino, mix(x / width, height * 0.3, height * 0.05), height * 0.17));
  const thermocline = surface.map((y, i) => y + layer[i]);
  const line = (ys: number[]) => xs.map((x, i) => `${x.toFixed(1)} ${ys[i].toFixed(1)}`);
  const warm = `M ${line(surface).join(" L ")} L ${line(thermocline).reverse().join(" L ")} Z`;
  const cold = `M ${line(thermocline).join(" L ")} L ${width} ${height} L 0 ${height} Z`;
  const east = lerpColor("#2f8cff", "#ff7a3a", nino);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`warm-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#ff4f2e" />
          <stop offset="0.55" stopColor={lerpColor("#ff9a3c", "#ff5a2e", nino)} />
          <stop offset="1" stopColor={east} />
        </linearGradient>
        <linearGradient id={`cold-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#144a96" />
          <stop offset="1" stopColor="#030c22" />
        </linearGradient>
      </defs>
      <path d={cold} fill={`url(#cold-${id})`} />
      <path d={warm} fill={`url(#warm-${id})`} opacity={0.95} />
      <polyline points={line(surface).join(" ")} fill="none" stroke="#fff" strokeWidth={4} opacity={0.7} />
      {upwelling > 0
        ? [0.8, 0.87, 0.94].map((fx, i) => {
            const x = width * fx;
            const top = thermocline[Math.round(fx * steps)] + 10;
            return (
              <g key={i} opacity={upwelling}>
                <line x1={x} y1={height - 10} x2={x} y2={top} stroke={C.negative} strokeWidth={10} strokeDasharray="22 16" strokeDashoffset={frame * 3} strokeLinecap="round" />
                <path d={`M ${x - 18} ${top + 20} L ${x} ${top} L ${x + 18} ${top + 20}`} fill="none" stroke={C.negative} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            );
          })
        : null}
    </svg>
  );
};

/** Nivel del agua del corte en una posición x (0 → 1), para ubicar reglas y etiquetas. */
export const surfaceAt = (fx: number, height: number, tilt: number, tiltPx = height * 0.12) => height * 0.32 - tilt * tiltPx * (0.5 - fx) * 2;
