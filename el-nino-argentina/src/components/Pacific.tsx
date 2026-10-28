import React from "react";
import { random } from "remotion";
import maps from "../maps.json";
import { C, MONO } from "../theme";

export const PAC = maps.pacific;
/** Longitud este (0–360°) a x del mapa. 200°E = 160°W. */
export const lonX = (lonE: number) => (lonE - PAC.centerLon) * PAC.pxPerDeg + PAC.width / 2;
export const latY = (lat: number) => PAC.height / 2 - lat * PAC.pxPerDeg;
/** Recuadro Niño 3.4: 5°N–5°S, 170°W–120°W. */
export const NINO34 = { x: lonX(190), y: latY(5), w: lonX(240) - lonX(190), h: latY(-5) - latY(5) };

type PacificProps = {
  /** Centro de la pileta caliente, en longitud este. */
  warmLon?: number;
  warmRx?: number;
  warmHeat?: number;
  cold?: number;
  /** Distancia recorrida por el viento hacia el oeste, en píxeles. */
  windDistance?: number;
  wind?: number;
  /** Recuadro Niño 3.4: contorno (0 → 1) y calor dentro (0 → 1). */
  box?: number;
  boxHeat?: number;
  labels?: number;
  /** La "montaña" de agua caliente que viaja hacia el este. */
  bulgeLon?: number;
  bulge?: number;
};

const Tag: React.FC<{ x: number; y: number; text: string; anchor?: "start" | "middle" | "end"; opacity: number }> = ({ x, y, text, anchor = "middle", opacity }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={MONO} fontWeight={800} fontSize={30} fill="#d7ecff" opacity={opacity} letterSpacing={2} stroke="#03050b" strokeWidth={8} paintOrder="stroke">
    {text}
  </text>
);

export const PacificMap: React.FC<PacificProps> = ({ warmLon = 150, warmRx = 380, warmHeat = 1, cold = 1, windDistance = 0, wind = 0, box = 0, boxHeat = 0, labels = 1, bulgeLon = 150, bulge = 0 }) => (
  <svg width={PAC.width} height={PAC.height} style={{ display: "block", maskImage: "linear-gradient(to bottom, transparent 0, #000 70px, #000 calc(100% - 70px), transparent 100%)" }}>
    <defs>
      <linearGradient id="pac-sea" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#0a1c3d" />
        <stop offset="0.5" stopColor="#0c2350" />
        <stop offset="1" stopColor="#081733" />
      </linearGradient>
      <filter id="sst" x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation={46} />
      </filter>
    </defs>
    <rect width={PAC.width} height={PAC.height} fill="url(#pac-sea)" />
    <g filter="url(#sst)">
      <ellipse cx={lonX(262)} cy={latY(-2)} rx={320} ry={78} fill="#2f8cff" opacity={0.85 * cold} />
      <ellipse cx={lonX(warmLon)} cy={latY(0)} rx={warmRx} ry={150} fill="#ff4a24" opacity={0.75 * warmHeat} />
      <ellipse cx={lonX(warmLon)} cy={latY(0)} rx={warmRx * 0.55} ry={82} fill="#ffb347" opacity={0.65 * warmHeat} />
      <ellipse cx={lonX(bulgeLon)} cy={latY(0)} rx={190} ry={70} fill="#ffd27a" opacity={bulge} />
    </g>
    <rect x={NINO34.x} y={NINO34.y} width={NINO34.w} height={NINO34.h} fill="#ff3b2f" opacity={0.55 * boxHeat} />
    <path d={PAC.land} fill="#16213a" stroke="#7fdcff" strokeWidth={2} strokeOpacity={0.55} />
    <line x1={0} y1={latY(0)} x2={PAC.width} y2={latY(0)} stroke="#ffffff" strokeOpacity={0.35} strokeWidth={2} strokeDasharray="14 12" />
    {wind > 0
      ? new Array(56).fill(0).map((_, i) => {
          const span = PAC.width + 400;
          const speed = 0.7 + random(`wv${i}`) * 0.6;
          const x = ((((random(`wx${i}`) * span - windDistance * speed) % span) + span) % span) - 200;
          const y = latY((random(`wy${i}`) - 0.5) * 30);
          const len = 70 + random(`wl${i}`) * 90;
          return (
            <g key={i} opacity={wind * (0.35 + random(`wo${i}`) * 0.5)} stroke="#e8f6ff" strokeWidth={4} strokeLinecap="round" fill="none">
              <line x1={x} y1={y} x2={x + len} y2={y} />
              <path d={`M ${x + 16} ${y - 12} L ${x} ${y} L ${x + 16} ${y + 12}`} />
            </g>
          );
        })
      : null}
    {box > 0 ? (
      <rect x={NINO34.x} y={NINO34.y} width={NINO34.w} height={NINO34.h} fill="none" stroke={C.yellow} strokeWidth={6} strokeDasharray={`${(NINO34.w + NINO34.h) * 2 * box} 4000`} />
    ) : null}
    <Tag x={lonX(117)} y={latY(-5)} text="INDONESIA" opacity={labels} />
    <Tag x={lonX(134)} y={latY(-24)} text="AUSTRALIA" opacity={labels} />
    <Tag x={lonX(103)} y={latY(26)} text="ASIA" opacity={labels} anchor="start" />
    <Tag x={lonX(283)} y={latY(-13)} text="PERÚ" opacity={labels} anchor="end" />
    <Tag x={lonX(290)} y={latY(10)} text="SUDAMÉRICA" opacity={labels} anchor="end" />
    <Tag x={lonX(205)} y={latY(-30)} text="OCÉANO PACÍFICO" opacity={labels * 0.8} />
  </svg>
);
