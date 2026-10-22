import React from "react";
import { interpolate } from "remotion";
import { formatear } from "../../comun/anim";
import { COLOR, FUENTE } from "../../comun/tema";
import { colorTemp } from "./Microondas";

/** Termómetro HUD vertical con la temperatura en °C. `t` 0..1 recorre de `min` a `max`. */
export const Termometro: React.FC<{
  x: number;
  y: number;
  alto: number;
  t: number;
  min: number;
  max: number;
  etiqueta: string;
  opacidad?: number;
}> = ({ x, y, alto, t, min, max, etiqueta, opacidad = 1 }) => {
  const nivel = Math.min(1, Math.max(0, t));
  const temp = interpolate(nivel, [0, 1], [min, max]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 90, height: alto + 120, opacity: opacidad }}>
      <div style={{ fontFamily: FUENTE.mono, fontSize: 20, letterSpacing: 2, color: COLOR.textoSuave, textAlign: "center" }}>{etiqueta}</div>
      <svg width={90} height={alto + 70} style={{ position: "absolute", top: 32 }}>
        <defs>
          <linearGradient id="termoGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={COLOR.azul} />
            <stop offset="55%" stopColor={COLOR.naranjaCalor} />
            <stop offset="100%" stopColor="#ff3b2f" />
          </linearGradient>
        </defs>
        <rect x={33} y={4} width={24} height={alto} rx={12} fill="rgba(8,9,11,0.75)" stroke="rgba(255,255,255,0.25)" />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={60} x2={70} y1={10 + (i * (alto - 12)) / 5} y2={10 + (i * (alto - 12)) / 5} stroke="rgba(255,255,255,0.3)" />
        ))}
        <rect x={38} y={4 + (alto - 8) * (1 - nivel)} width={14} height={(alto - 8) * nivel + 10} rx={7} fill="url(#termoGrad)" />
        <circle cx={45} cy={alto + 28} r={28} fill={colorTemp(nivel)} stroke="rgba(255,255,255,0.25)" />
      </svg>
      <div style={{ position: "absolute", top: alto + 98, width: 90, textAlign: "center", fontFamily: FUENTE.mono, fontWeight: 700, fontSize: 26, color: colorTemp(nivel) }}>
        {formatear(temp)}°C
      </div>
    </div>
  );
};
