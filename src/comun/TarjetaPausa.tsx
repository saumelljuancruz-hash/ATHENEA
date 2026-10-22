import React from "react";
import { AbsoluteFill, Freeze, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "./anim";
import { Escena } from "./Escena";
import { Sfx, SfxActivos } from "./Sonido";
import { COLOR, FUENTE, SEGURO } from "./tema";

const CHIPS = 30;

export type TextosPausa = { pregunta: string; pie: string; opciones: string[]; emoji: string };

/**
 * Pausa para comentarios: la escena anterior congelada, oscurecida y con blur,
 * y una tarjeta con la pregunta y dos chips.
 */
export const TarjetaPausa: React.FC<{
  duracion: number;
  /** Frame (relativo) en el que la voz dice "Contámelo…": los chips vuelven a saltar. */
  comentarios: number;
  textos: TextosPausa;
  /** Escena anterior (se congela en `frameCongelado`). */
  fondo: React.ReactNode;
  frameCongelado: number;
}> = ({ duracion, comentarios, textos: T, fondo, frameCongelado }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const congelar = entre(frame, 0, 14);
  const tarjeta = resorte(frame, fps, 6, { damping: 13, stiffness: 150 });
  const salida = entre(frame, duracion - 10, duracion);
  const centroX = (SEGURO.izquierda + (SEGURO.ancho - SEGURO.derecha)) / 2;

  return (
    <Escena entrada={false} fondo={false} name="Pausa">
      {/* Escena congelada, oscurecida y con blur leve (con un zoom lento para que no quede quieta). */}
      <AbsoluteFill
        style={{
          filter: `blur(${congelar * 7}px) brightness(${1 - congelar * 0.55}) saturate(${1 - congelar * 0.4})`,
          scale: String(1 + 0.04 * entre(frame, 0, duracion)),
        }}
      >
        <SfxActivos.Provider value={false}>
          <Freeze frame={frameCongelado}>{fondo}</Freeze>
        </SfxActivos.Provider>
      </AbsoluteFill>

      <Sfx efecto="pop" desde={8} volumen={0.35} />
      <Sfx efecto="pop" desde={CHIPS} />
      <Sfx efecto="pop" desde={CHIPS + 7} />

      <div
        style={{
          position: "absolute",
          left: centroX,
          top: 860 + flotar(frame, 150, 8),
          width: 800,
          translate: "-50% -50%",
          scale: String(tarjeta * (1 - salida * 0.15)),
          rotate: `${flotar(frame, 200, 0.8)}deg`,
          opacity: 1 - salida,
          filter: salida > 0 ? `blur(${salida * 8}px)` : undefined,
          background: "linear-gradient(160deg, rgba(42,44,49,0.96), rgba(22,23,26,0.96))",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 34,
          padding: "64px 56px 56px",
          boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 0 6px rgba(62,224,192,0.06)",
        }}
      >
        <Burbuja frame={frame} emoji={T.emoji} />
        <div
          style={{
            fontFamily: FUENTE.inter,
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1.15,
            color: COLOR.texto,
          }}
        >
          {T.pregunta}
        </div>
        <div style={{ fontFamily: FUENTE.mono, fontSize: 26, color: COLOR.textoSuave, marginTop: 26 }}>
          {T.pie}
        </div>
        <div style={{ display: "flex", gap: 22, marginTop: 40 }}>
          {T.opciones.map((op, i) => {
            const pop = resorte(frame, fps, CHIPS + i * 7, { damping: 11, stiffness: 200 });
            // En "Contámelo" los chips vuelven a saltar para invitar a comentar.
            const llamada = resorte(frame, fps, comentarios + i * 5, { damping: 7, stiffness: 260 });
            const color = i === 0 ? COLOR.verde : COLOR.textoSuave;
            return (
              <div
                key={op}
                style={{
                  scale: String(pop * (1 + 0.03 * Math.sin((frame + i * 20) / 10)) * (1 + 0.12 * Math.sin(Math.PI * Math.min(1, llamada)))),
                  opacity: Math.min(1, pop * 1.5),
                  border: `3px solid ${color}`,
                  color,
                  background: i === 0 ? "rgba(62,224,192,0.12)" : "rgba(255,255,255,0.04)",
                  borderRadius: 999,
                  padding: "16px 44px",
                  fontFamily: FUENTE.inter,
                  fontWeight: 800,
                  fontSize: 40,
                }}
              >
                {op}
              </div>
            );
          })}
        </div>
      </div>
    </Escena>
  );
};

const Burbuja: React.FC<{ frame: number; emoji: string }> = ({ frame, emoji }) => {
  const rebote = Math.abs(Math.sin(frame / 9)) * 26;
  const aplastar = 1 + 0.08 * Math.max(0, Math.cos(frame / 9) ** 8);
  return (
    <div
      style={{
        position: "absolute",
        right: 40,
        top: -70,
        fontSize: 104,
        translate: `0px ${-rebote}px`,
        scale: `${aplastar} ${2 - aplastar}`,
        transformOrigin: "bottom center",
        filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.5))",
      }}
    >
      {emoji}
    </div>
  );
};
