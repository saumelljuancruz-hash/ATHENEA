import React from "react";
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from "remotion";
import { SfxActivos } from "./Sonido";

/**
 * Últimos cuadros del Reel: funde al primer cuadro del Hook para que el video empalme
 * consigo mismo y se vuelva a ver sin cortes (GUIA-REELS #23: loop visual).
 * Va dentro de una <Sequence> que cubre los últimos `duracion` frames.
 */
export const CierreLoop: React.FC<{ duracion: number; children: React.ReactNode }> = ({ duracion, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [0, duracion - 1], [0, 1], { extrapolateRight: "clamp" }) }}>
      <SfxActivos.Provider value={false}>
        <Freeze frame={0}>{children}</Freeze>
      </SfxActivos.Provider>
    </AbsoluteFill>
  );
};
