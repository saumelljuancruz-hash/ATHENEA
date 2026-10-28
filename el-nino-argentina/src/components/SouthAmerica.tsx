import React from "react";
import maps from "../maps.json";
import { C, MONO } from "../theme";

export const SA = maps.sudamerica;
export const PLACES = SA.places as unknown as Record<string, [number, number]>;

type SouthAmericaProps = {
  frame: number;
  /** Ríos Paraná y Uruguay: brillo y grosor, 0 → 1. */
  rivers?: number;
  /** Mancha de lluvia sobre el Litoral y la Pampa, 0 → 1. */
  region?: number;
  /** Corriente de humedad desde la Amazonia, 0 → 1. */
  moisture?: number;
  argentina?: number;
};

const AMAZON = PLACES.amazonia;
const CHACO = PLACES.chaco;
const LITORAL = PLACES.litoral;

// Hilos de humedad que bajan por el este de los Andes hacia el Litoral.
const STREAMS = [-70, -35, 0, 35, 70].map(
  (dx) => `M ${AMAZON[0] + dx * 1.6} ${AMAZON[1] - 40} C ${AMAZON[0] + dx - 60} ${AMAZON[1] + 160}, ${CHACO[0] + dx * 0.6 - 40} ${CHACO[1] - 90}, ${LITORAL[0] + dx * 0.5} ${LITORAL[1] + Math.abs(dx) * 0.3}`,
);

export const SouthAmericaMap: React.FC<SouthAmericaProps> = ({ frame, rivers = 0, region = 0, moisture = 0, argentina = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    <defs>
      <radialGradient id="rain-region" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#2f8cff" stopOpacity="0.75" />
        <stop offset="1" stopColor="#2f8cff" stopOpacity="0" />
      </radialGradient>
      <filter id="river-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation={8} />
      </filter>
    </defs>
    <path d={SA.neighbors} fill="#111a2c" stroke="#2b3a57" strokeWidth={2} />
    <path d={SA.argentina} fill="#1b2946" stroke={C.electric} strokeWidth={3} strokeOpacity={0.5 + 0.5 * argentina} />
    <ellipse cx={(PLACES.litoral[0] + PLACES.pampa[0]) / 2} cy={(PLACES.litoral[1] + PLACES.pampa[1]) / 2} rx={170} ry={210} fill="url(#rain-region)" opacity={region} />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={SA.parana} stroke={C.negative} strokeWidth={4 + rivers * 10} opacity={0.5 * rivers} filter="url(#river-glow)" />
      <path d={SA.uruguay} stroke={C.negative} strokeWidth={4 + rivers * 10} opacity={0.5 * rivers} filter="url(#river-glow)" />
      <path d={SA.parana} stroke="#8fd0ff" strokeWidth={2.5 + rivers * 4} opacity={0.55 + 0.45 * rivers} />
      <path d={SA.uruguay} stroke="#8fd0ff" strokeWidth={2.5 + rivers * 4} opacity={0.55 + 0.45 * rivers} />
    </g>
    {moisture > 0 ? (
      <g fill="none" strokeLinecap="round" opacity={moisture}>
        {STREAMS.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="#7fdcff" strokeWidth={26} opacity={0.18} />
            <path d={d} stroke="#bfefff" strokeWidth={8} strokeDasharray="30 26" strokeDashoffset={-frame * 5 - i * 11} />
          </g>
        ))}
      </g>
    ) : null}
  </svg>
);

export const MapLabel: React.FC<{ at: [number, number]; text: string; opacity: number; dy?: number; color?: string; size?: number }> = ({ at, text, opacity, dy = 0, color = "#d7ecff", size = 30 }) => (
  <div
    style={{
      position: "absolute",
      left: at[0],
      top: at[1] + dy,
      translate: "-50% -50%",
      opacity,
      fontFamily: MONO,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 2,
      color,
      WebkitTextStroke: "8px #03050b",
      paintOrder: "stroke fill",
      whiteSpace: "nowrap",
    }}
  >
    {text}
  </div>
);
