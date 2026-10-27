import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ENTRA_SALE, entre } from "./anim";
import { LineaAjustada } from "./Portada";
import { COLOR } from "./tema";

export type LineaGancho = { texto: string; color?: keyof typeof COLOR };

/**
 * El gancho escrito en pantalla desde el cuadro 1 (GUIA-REELS: la gente decide en 2 s).
 * Late suave mientras está y sale hacia arriba al llegar a `hasta`.
 */
export const GanchoPantalla: React.FC<{ lineas: LineaGancho[]; hasta: number; top?: number }> = ({ lineas, hasta, top = 250 }) => {
  const frame = useCurrentFrame();
  const sale = entre(frame, hasta - 10, hasta, ENTRA_SALE);
  if (sale >= 1) return null;
  const late = 1 + 0.015 * Math.sin(frame / 9);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: top + 520,
          background: "linear-gradient(180deg, rgba(22,23,26,0.92) 0%, rgba(22,23,26,0.75) 65%, rgba(22,23,26,0) 100%)",
          opacity: 1 - sale,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 150,
          top,
          opacity: 1 - sale,
          translate: `0 ${-120 * sale}px`,
          scale: String(late),
          transformOrigin: "left center",
        }}
      >
        {lineas.map((l, k) => (
          <LineaAjustada key={k} linea={{ texto: l.texto, color: l.color ? COLOR[l.color] : undefined }} ancho={850} maximo={150} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
