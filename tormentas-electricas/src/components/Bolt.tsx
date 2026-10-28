import React, { useMemo } from "react";
import { random } from "remotion";
import { C } from "../theme";

export type Pt = [number, number];

const jag = (
  seed: string,
  from: Pt,
  to: Pt,
  segments: number,
  jitter: number,
): Pt[] => {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  const len = Math.hypot(dx, dy);
  const [nx, ny] = [-dy / len, dx / len];
  const pts: Pt[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const edge = i === 0 || i === segments ? 0 : 1;
    const off = (random(`${seed}-${i}`) - 0.5) * 2 * jitter * edge;
    const along = (random(`${seed}-a-${i}`) - 0.5) * (len / segments) * 0.4 * edge;
    pts.push([
      from[0] + dx * t + nx * off + (dx / len) * along,
      from[1] + dy * t + ny * off + (dy / len) * along,
    ]);
  }
  return pts;
};

const lengthOf = (pts: Pt[]) =>
  pts.slice(1).reduce((sum, p, i) => sum + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

const toPath = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");

type Strand = { d: string; length: number; width: number; startsAt: number };

/** Puntos de un rayo con ramas, siempre iguales para la misma semilla. */
export const buildBolt = (
  seed: string,
  from: Pt,
  to: Pt,
  segments: number,
  jitter: number,
  branches: number,
): { main: Pt[]; strands: Strand[] } => {
  const main = jag(seed, from, to, segments, jitter);
  const total = lengthOf(main);
  const strands: Strand[] = [{ d: toPath(main), length: total, width: 1, startsAt: 0 }];
  for (let b = 0; b < branches; b++) {
    const idx = 1 + Math.floor(random(`${seed}-b-${b}`) * (segments - 3));
    const origin = main[idx];
    const ahead = main[Math.min(idx + 2, segments)];
    const baseAngle = Math.atan2(ahead[1] - origin[1], ahead[0] - origin[0]);
    const side = random(`${seed}-s-${b}`) > 0.5 ? 1 : -1;
    const angle = baseAngle + side * (0.35 + random(`${seed}-r-${b}`) * 0.6);
    const blen = total * (0.12 + random(`${seed}-l-${b}`) * 0.2);
    const end: Pt = [origin[0] + Math.cos(angle) * blen, origin[1] + Math.sin(angle) * blen];
    const pts = jag(`${seed}-br-${b}`, origin, end, 6, jitter * 0.45);
    strands.push({
      d: toPath(pts),
      length: lengthOf(pts),
      width: 0.45,
      startsAt: lengthOf(main.slice(0, idx + 1)) / total,
    });
  }
  return { main, strands };
};

type BoltProps = {
  seed: string;
  from: Pt;
  to: Pt;
  segments?: number;
  jitter?: number;
  branches?: number;
  /** 0 → 1: cuánto del rayo está dibujado. */
  progress?: number;
  /** Dibuja desde el final (`to`) hacia el inicio: la descarga de retorno. */
  reverse?: boolean;
  intensity?: number;
  width?: number;
  color?: string;
};

export const Bolt: React.FC<BoltProps> = ({
  seed,
  from,
  to,
  segments = 18,
  jitter = 60,
  branches = 4,
  progress = 1,
  reverse = false,
  intensity = 1,
  width = 10,
  color = C.electric,
}) => {
  const { strands } = useMemo(
    () => buildBolt(seed, from, to, segments, jitter, branches),
    [seed, from, to, segments, jitter, branches],
  );
  const filterId = `glow-${seed}`;

  const dash = (s: Strand) => {
    const branchStart = reverse ? 1 - s.startsAt : s.startsAt;
    const local = s.width === 1 ? progress : Math.max(0, (progress - branchStart) / (1 - branchStart));
    const visible = s.length * Math.min(1, local);
    if (reverse && s.width === 1) {
      return { strokeDasharray: `${visible} ${s.length * 2}`, strokeDashoffset: visible - s.length };
    }
    return { strokeDasharray: `${visible} ${s.length * 2}`, strokeDashoffset: 0 };
  };

  return (
    <g style={{ opacity: intensity }}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={width * 1.6} />
        </filter>
      </defs>
      {strands.map((s, i) => (
        <g key={i} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d={s.d} stroke={color} strokeWidth={width * 5 * s.width} opacity={0.55} filter={`url(#${filterId})`} {...dash(s)} />
          <path d={s.d} stroke={color} strokeWidth={width * 1.8 * s.width} opacity={0.9} {...dash(s)} />
          <path d={s.d} stroke={C.core} strokeWidth={width * 0.7 * s.width} {...dash(s)} />
        </g>
      ))}
    </g>
  );
};
