import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { pulsoMano } from "./Cortes";

export type Plano = { desde: number; contenido: React.ReactNode };

/**
 * Cambia de plano con un corte y un empujón que se acomoda con un resorte (se pasa apenas y vuelve),
 * más un vaivén de cámara en mano: se siente editado por una persona, no por una máquina
 * (GUIA-REELS #15 y #17: cortar cada 2–3 s; animación humanizada).
 */
export const Planos: React.FC<{ planos: Plano[]; direccion?: 1 | -1 }> = ({ planos, direccion = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lista = [...planos].sort((a, b) => a.desde - b.desde);
  let i = 0;
  while (i < lista.length - 1 && frame >= lista[i + 1].desde) i++;
  const p = lista[i];
  const t = i === 0 ? 1 : spring({ frame: frame - p.desde, fps, config: { damping: 13, stiffness: 170, mass: 0.8 } });
  const desenfoque =
    i === 0 ? 0 : interpolate(frame - p.desde, [0, 5], [6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lado = (i % 2 === 0 ? 1 : -1) * direccion;
  const mano = pulsoMano(frame + i * 97, 0.9);
  return (
    <AbsoluteFill
      style={{
        // Escala base 1,05: con el empujón (≤ 36 px), el giro y el vaivén, nunca se ve el borde.
        translate: `${(1 - t) * 36 * lado + mano.x}px ${mano.y}px`,
        rotate: `${(1 - t) * 0.6 * lado + mano.giro}deg`,
        scale: String(1.05 + 0.06 * Math.max(0, 1 - t)),
        filter: desenfoque > 0.05 ? `blur(${desenfoque}px)` : undefined,
      }}
    >
      {p.contenido}
    </AbsoluteFill>
  );
};
