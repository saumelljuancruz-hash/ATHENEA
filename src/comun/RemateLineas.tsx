import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "./anim";
import { Escena } from "./Escena";
import { COLOR, FUENTE, SEGURO } from "./tema";

/** Remate: tres líneas grandes, una por una con subrayado verde agua, sobre un fondo desenfocado. */
export const RemateLineas: React.FC<{ duracion: number; lineas: string[]; fondo: React.ReactNode }> = ({
  duracion,
  lineas,
  fondo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paso = Math.max(0.3 * fps, Math.min(0.62 * fps, (duracion - 0.7 * fps) / lineas.length));

  return (
    <Escena name="Remate">
      <AbsoluteFill style={{ filter: "blur(4px)", opacity: 0.45, scale: String(1 + 0.05 * entre(frame, 0, duracion)) }}>
        {fondo}
      </AbsoluteFill>

      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(22,23,26,0.85) 0%, rgba(22,23,26,0.2) 75%)" }} />

      <div style={{ position: "absolute", left: SEGURO.izquierda, top: 620, display: "flex", flexDirection: "column", gap: 54 }}>
        {lineas.map((texto, i) => {
          const desde = 6 + i * paso;
          const entrada = resorte(frame, fps, desde, { damping: 15, stiffness: 160 });
          const subrayado = entre(frame, desde + 5, desde + 20);
          return (
            <div
              key={texto}
              style={{
                opacity: Math.min(1, entrada * 1.4),
                translate: `${flotar(frame, 200, 3, i * 30)}px ${interpolate(entrada, [0, 1], [60, 0])}px`,
              }}
            >
              <div
                style={{
                  fontFamily: FUENTE.inter,
                  fontWeight: 800,
                  fontSize: 84,
                  lineHeight: 1,
                  letterSpacing: -1,
                  color: COLOR.texto,
                  textShadow: "0 6px 24px rgba(0,0,0,0.6)",
                }}
              >
                {texto}
              </div>
              <div
                style={{
                  height: 10,
                  marginTop: 14,
                  borderRadius: 5,
                  width: `${subrayado * 100}%`,
                  background: COLOR.verde,
                  boxShadow: `0 0 22px ${COLOR.verde}88`,
                }}
              />
            </div>
          );
        })}
      </div>
    </Escena>
  );
};
