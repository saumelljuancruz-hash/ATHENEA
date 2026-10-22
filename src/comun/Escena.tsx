import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SUAVE } from "./anim";
import { Fondo } from "./Fondo";

/** Contenedor de escena con una entrada rápida (zoom + desenfoque) para los cortes con whoosh. */
export const Escena: React.FC<{
  children: React.ReactNode;
  entrada?: boolean;
  fondo?: boolean;
  name?: string;
}> = ({ children, entrada = true, fondo = true, name }) => {
  const frame = useCurrentFrame();
  const p = entrada
    ? interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: SUAVE })
    : 1;
  return (
    <AbsoluteFill
      name={name}
      style={{
        scale: String(interpolate(p, [0, 1], [1.07, 1])),
        filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
        opacity: interpolate(p, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      {fondo ? <Fondo /> : null}
      {children}
    </AbsoluteFill>
  );
};
