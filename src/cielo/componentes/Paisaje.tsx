import React from "react";
import { interpolateColors } from "remotion";

/** Colores del cielo: gris (sin color), mediodía y atardecer. */
const CIELO = {
  gris: ["#3a3d44", "#5b6069", "#7b8089"],
  mediodia: ["#1c4fa8", "#3f85d9", "#9cc9f5"],
  atardecer: ["#2a2c5a", "#b44a63", "#ffb15c"],
};

export const colorCielo = (k: 0 | 1 | 2, hora: number, saturacion: number) => {
  const color = interpolateColors(hora, [0, 1], [CIELO.mediodia[k], CIELO.atardecer[k]]);
  return interpolateColors(saturacion, [0, 1], [CIELO.gris[k], color]);
};

/** Colinas en capas (estilo maqueta) + observador. Se dibuja en un <svg> de 1080×1920. */
export const Paisaje: React.FC<{
  /** 0 = mediodía, 1 = atardecer. */
  hora: number;
  /** 0..1: cuánto color tiene el cielo (0 = gris). */
  saturacion?: number;
  sol: { x: number; y: number; r?: number };
  frame: number;
  /** Mirada del observador (-1 izquierda … 1 derecha); null = sin observador. */
  mirada?: number | null;
  horizonte?: number;
}> = ({ hora, saturacion = 1, sol, frame, mirada = null, horizonte = 1180 }) => {
  const id = `p${Math.round(hora * 100)}`;
  const capa = (base: number, amp: number, fase: number, color: string, borde: string) => {
    const pts = Array.from({ length: 28 }, (_, i) => {
      const x = -40 + i * 45;
      const y = base - amp * (0.55 + 0.45 * Math.sin(i * 0.55 + fase)) - amp * 0.3 * Math.sin(i * 1.7 + fase * 2);
      return `${i ? "L" : "M"}${x},${y.toFixed(1)}`;
    }).join("");
    return (
      <g>
        <path d={`${pts} L1120,${base + 12} L1120,1920 L-40,1920 Z`} fill={borde} transform="translate(0 10)" />
        <path d={`${pts} L1120,${base} L1120,1920 L-40,1920 Z`} fill={color} />
      </g>
    );
  };
  const tinte = (c1: string, c2: string) => interpolateColors(hora, [0, 1], [c1, c2]);
  const solColor = interpolateColors(hora, [0, 1], ["#fff6d8", "#ff8a3d"]);
  const r = sol.r ?? 70;
  const yo = { x: 560, y: horizonte + 110 };
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id={`${id}cielo`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorCielo(0, hora, saturacion)} />
          <stop offset="55%" stopColor={colorCielo(1, hora, saturacion)} />
          <stop offset="100%" stopColor={colorCielo(2, hora, saturacion)} />
        </linearGradient>
        <radialGradient id={`${id}sol`}>
          <stop offset="0%" stopColor={solColor} stopOpacity={0.9} />
          <stop offset="100%" stopColor={solColor} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1080} height={horizonte + 60} fill={`url(#${id}cielo)`} />
      <circle cx={sol.x} cy={sol.y} r={r * 3.2} fill={`url(#${id}sol)`} opacity={0.55 + 0.1 * Math.sin(frame / 20)} />
      <circle cx={sol.x} cy={sol.y} r={r} fill={solColor} />
      {capa(horizonte, 120, 0.6 + frame * 0.002, tinte("#39424a", "#3e2f3c"), tinte("#262c31", "#2a2029"))}
      {capa(horizonte + 80, 90, 2.2 + frame * 0.003, tinte("#2c3338", "#2f2430"), tinte("#1c2125", "#1d171f"))}
      {capa(horizonte + 170, 60, 4.1, tinte("#1f2427", "#211a22"), tinte("#141719", "#141015"))}
      {mirada !== null ? (
        <g transform={`translate(${yo.x} ${yo.y})`}>
          <ellipse cx={4} cy={92} rx={34} ry={8} fill="#000" opacity={0.35} />
          <path d="M-22 90 Q-24 30 0 24 Q24 30 22 90 Z" fill="#c9cdd4" />
          <circle cx={0} cy={4} r={20} fill="#e3e6ea" />
          <circle cx={9 * mirada} cy={0} r={4} fill="#16171a" />
        </g>
      ) : null}
    </svg>
  );
};

export const OBSERVADOR = (horizonte = 1180) => ({ x: 560, y: horizonte + 114 });
