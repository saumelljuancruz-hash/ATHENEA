import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { COLOR } from "./tema";

const BOKEH = Array.from({ length: 14 }, (_, i) => ({
  x: random(`bx${i}`) * 1080,
  y: random(`by${i}`) * 1920,
  r: 40 + random(`br${i}`) * 140,
  vel: 0.15 + random(`bv${i}`) * 0.35,
  fase: random(`bf${i}`) * 1000,
  tinte: i % 5 === 0 ? COLOR.verde : i % 7 === 0 ? COLOR.azul : "#ffffff",
}));

/** Fondo carbón con bokeh desenfocado: da profundidad de campo y movimiento constante. */
export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 85% 60% at 50% 42%, ${COLOR.fondoClaro} 0%, ${COLOR.fondoOscuro} 78%)`,
      }}
    >
      {BOKEH.map((b, i) => {
        const y = ((b.y - frame * b.vel * 1.4 + 2200) % 2200) - 140;
        const x = b.x + Math.sin((frame + b.fase) / 140) * 30;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - b.r,
              top: y - b.r,
              width: b.r * 2,
              height: b.r * 2,
              borderRadius: "50%",
              background: b.tinte,
              opacity: 0.035 + 0.025 * Math.sin((frame + b.fase) / 90),
              filter: `blur(${b.r / 3}px)`,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
