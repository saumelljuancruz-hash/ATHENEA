import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export type Plano = { desde: number; contenido: React.ReactNode };

/**
 * Cambia de plano con un corte seco y un barrido corto (≈ 0,12 s de desenfoque),
 * como un corte de edición (GUIA-REELS #15 y #17: cortar cada 2–3 s, cambiar el encuadre).
 */
export const Planos: React.FC<{ planos: Plano[]; direccion?: 1 | -1 }> = ({ planos, direccion = 1 }) => {
  const frame = useCurrentFrame();
  const lista = [...planos].sort((a, b) => a.desde - b.desde);
  let i = 0;
  while (i < lista.length - 1 && frame >= lista[i + 1].desde) i++;
  const p = lista[i];
  const t = i === 0 ? 1 : interpolate(frame, [p.desde, p.desde + 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lado = (i % 2 === 0 ? 1 : -1) * direccion;
  return (
    <AbsoluteFill
      style={{
        translate: `${(1 - t) * 90 * lado}px 0`,
        scale: String(1 + 0.06 * (1 - t)),
        filter: t < 1 ? `blur(${(1 - t) * 10}px)` : undefined,
      }}
    >
      {p.contenido}
    </AbsoluteFill>
  );
};
