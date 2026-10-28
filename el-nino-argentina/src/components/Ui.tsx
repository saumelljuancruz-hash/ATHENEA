import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, DISPLAY, MONO } from "../theme";

/** Sacudón de cámara que decae después de cada impacto. */
export const shake = (frame: number, hits: number[], strength = 26, decay = 7) => {
  let x = 0;
  let y = 0;
  let r = 0;
  for (const hit of hits) {
    const d = frame - hit;
    if (d < 0 || d > decay * 5) {
      continue;
    }
    const a = strength * Math.exp(-d / decay);
    x += Math.sin(d * 2.1 + hit) * a;
    y += Math.cos(d * 2.7 + hit * 0.7) * a;
    r += Math.sin(d * 1.6 + hit) * a * 0.04;
  }
  return { translate: `${x}px ${y}px`, rotate: `${r}deg` };
};

/** 300000000 → "300.000.000" */
export const fmt = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Background: React.FC<{ rain?: number; tint?: string }> = ({ rain = 0, tint = C.bg2 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 35%, ${tint} 0%, ${C.bg} 70%)` }}>
      {rain > 0 ? (
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: rain }}>
          {new Array(70).fill(0).map((_, i) => {
            const speed = 38 + random(`rs${i}`) * 30;
            const len = 60 + random(`rl${i}`) * 90;
            const x0 = random(`rx${i}`) * 1300 - 100;
            const y = ((random(`ry${i}`) * 2200 + frame * speed) % 2200) - 200;
            const x = x0 - y * 0.18;
            return (
              <line key={i} x1={x} y1={y} x2={x - len * 0.18} y2={y + len} stroke="#9fc4ff" strokeWidth={2 + random(`rw${i}`) * 2} opacity={0.15 + random(`ro${i}`) * 0.25} strokeLinecap="round" />
            );
          })}
        </svg>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(90% 60% at 50% 45%, transparent 55%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{ at: number; color?: string; length?: number; peak?: number }> = ({
  at,
  color = C.core,
  length = 10,
  peak = 0.9,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [at - 1, at, at + length], [0, peak, 0], clamp);
  if (opacity <= 0) {
    return null;
  }
  return <AbsoluteFill style={{ backgroundColor: color, opacity, mixBlendMode: "screen", pointerEvents: "none" }} />;
};

export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
  mono?: boolean;
}> = ({ children, color = C.white, size = 56, style, mono = false }) => (
  <div
    style={{
      fontFamily: mono ? MONO : DISPLAY,
      fontWeight: mono ? 800 : 900,
      fontSize: size,
      color,
      letterSpacing: mono ? 0 : -1,
      lineHeight: 1,
      textShadow: `0 0 24px ${color}55, 0 6px 18px rgba(0,0,0,0.8)`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Panel de vidrio oscuro para lecturas tipo instrumento. */
export const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; glow?: string }> = ({
  children,
  style,
  glow = C.electric,
}) => (
  <div
    style={{
      background: "linear-gradient(160deg, rgba(20,32,60,0.85), rgba(6,10,22,0.9))",
      border: `2px solid ${glow}55`,
      borderRadius: 28,
      boxShadow: `0 0 40px ${glow}33, inset 0 1px 0 rgba(255,255,255,0.12), 0 30px 60px rgba(0,0,0,0.6)`,
      padding: "22px 30px",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Watermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 150,
      right: 54,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 20px 10px 14px",
      borderRadius: 40,
      background: "rgba(0,0,0,0.38)",
      border: "1.5px solid rgba(255,255,255,0.16)",
      fontFamily: DISPLAY,
      fontWeight: 800,
      fontSize: 32,
      color: "rgba(255,255,255,0.82)",
      letterSpacing: -0.3,
    }}
  >
    <svg width={26} height={34} viewBox="0 0 26 34">
      <path d="M15 0 L2 19 H12 L9 34 L24 13 H14 Z" fill={C.yellow} />
    </svg>
    @nadietelo.explico
  </div>
);

/** Silueta de una persona con el celular en la mano. */
export const Person: React.FC<{ color?: string; size?: number }> = ({ color = C.white, size = 120 }) => (
  <svg width={size} height={size * 1.7} viewBox="0 0 100 170">
    <circle cx={50} cy={26} r={22} fill={color} />
    <path d="M 14 170 L 18 82 C 20 62 34 54 50 54 C 66 54 80 62 82 82 L 86 170 Z" fill={color} />
    <rect x={62} y={70} width={22} height={36} rx={5} fill={C.electric} />
  </svg>
);
