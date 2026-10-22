import React from "react";

/** Candado en SVG (se dibuja dentro de un <svg>). `apertura` 0 = cerrado, 1 = abierto. */
export const Candado: React.FC<{
  x: number;
  y: number;
  tamano: number;
  apertura: number;
  color: string;
  /** Desplazamiento horizontal para "temblar" cuando el acceso se rechaza. */
  temblor?: number;
}> = ({ x, y, tamano, apertura, color, temblor = 0 }) => {
  const s = tamano / 100;
  const sube = Math.min(1, Math.max(0, apertura)) * 22;
  const gira = Math.min(1, Math.max(0, apertura)) * -28;
  return (
    <g transform={`translate(${x + temblor} ${y}) scale(${s})`}>
      <g transform={`translate(0 ${-sube}) rotate(${gira} 26 -10)`}>
        <path d="M-26 -8 V-30 A26 26 0 0 1 26 -30 V-8" fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" />
      </g>
      <rect x={-40} y={-12} width={80} height={62} rx={12} fill={color} />
      <circle cx={0} cy={14} r={8} fill="#111316" />
      <rect x={-3.5} y={16} width={7} height={16} rx={3} fill="#111316" />
    </g>
  );
};
