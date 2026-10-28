import React, { useMemo } from "react";
import { random } from "remotion";

type Puff = { x: number; y: number; r: number; shade: number };

// Cumulonimbus de 800 × 900: base abajo (y = 900), yunque arriba (y = 0).
const buildPuffs = (seed: string): Puff[] => {
  const puffs: Puff[] = [];
  for (let i = 0; i < 9; i++) {
    puffs.push({ x: 120 + i * 70 + (random(`${seed}b${i}`) - 0.5) * 30, y: 800 + random(`${seed}by${i}`) * 40, r: 95 + random(`${seed}br${i}`) * 50, shade: 0.35 });
  }
  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    puffs.push({ x: 400 + (random(`${seed}t${i}`) - 0.5) * 240 * (1 - t * 0.3), y: 740 - t * 560, r: 120 + random(`${seed}tr${i}`) * 50, shade: 0.55 + t * 0.3 });
  }
  for (let i = 0; i < 12; i++) {
    puffs.push({ x: 40 + i * 66 + (random(`${seed}a${i}`) - 0.5) * 20, y: 120 + (random(`${seed}ay${i}`) - 0.5) * 60 + Math.abs(i - 6) * 6, r: 70 + random(`${seed}ar${i}`) * 40, shade: 0.95 });
  }
  return puffs;
};

type CloudProps = {
  width: number;
  /** 0 → 1: la nube crece desde la base hasta el yunque. */
  grow?: number;
  /** Destello interno, 0 → 1. */
  flash?: number;
  seed?: string;
  style?: React.CSSProperties;
};

export const Cloud: React.FC<CloudProps> = ({ width, grow = 1, flash = 0, seed = "nube", style }) => {
  const puffs = useMemo(() => buildPuffs(seed), [seed]);
  const height = (width / 800) * 900;
  return (
    <svg width={width} height={height} viewBox="0 0 800 900" style={{ overflow: "visible", ...style }}>
      <defs>
        <radialGradient id={`puff-${seed}`} cx="0.42" cy="0.22" r="0.85">
          <stop offset="0" stopColor="#a3b5d8" />
          <stop offset="0.45" stopColor="#4d5e86" />
          <stop offset="1" stopColor="#1a2340" />
        </radialGradient>
        {/* Bordes esponjosos: el ruido deforma los círculos y los funde. */}
        <filter id={`fx-${seed}`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={3} seed={4} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={70} xChannelSelector="R" yChannelSelector="G" result="fluffy" />
          <feGaussianBlur in="fluffy" stdDeviation={3} />
        </filter>
        <radialGradient id={`flash-${seed}`} cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="#e9f8ff" stopOpacity="1" />
          <stop offset="0.5" stopColor="#7fdcff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#7fdcff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g filter={`url(#fx-${seed})`}>
        {puffs.map((p, i) => {
          const appear = Math.min(1, Math.max(0, (grow - (900 - p.y) / 900 * 0.85) / 0.15));
          return (
            <circle
              key={i}
              cx={p.x}
              cy={900 - (900 - p.y) * grow}
              r={p.r * appear}
              fill={`url(#puff-${seed})`}
              opacity={0.75 + p.shade * 0.25}
            />
          );
        })}
      </g>
      <ellipse cx={400} cy={520} rx={420} ry={460} fill={`url(#flash-${seed})`} opacity={flash} style={{ mixBlendMode: "screen" }} />
    </svg>
  );
};
