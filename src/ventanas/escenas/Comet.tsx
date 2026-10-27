import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Paisaje } from "../../cielo/componentes/Paisaje";
import { AvionLateral } from "../../modoavion/componentes/Vuelo";
import { TEXTOS } from "../guion-ventanas";
import { MarcasVentanas } from "../linea-ventanas";

export type PropsComet = { marcas: MarcasVentanas["comet"]; duracion: number };

/** Calendario de 1954 con los meses en que cayeron los dos aviones. */
const Calendario: React.FC<{ meses: string[]; marca1: number; marca2: number; rango: number }> = ({ meses, marca1, marca2, rango }) => (
  <div style={{ position: "absolute", left: 90, right: 150, top: 820, display: "flex", gap: 18 }}>
    {meses.map((mes, k) => {
      const marcado = k === 0 ? marca1 : k === meses.length - 1 ? marca2 : 0;
      return (
        <div
          key={mes}
          style={{
            flex: 1,
            height: 190,
            borderRadius: 18,
            background: "rgba(8,9,11,0.8)",
            border: `3px solid ${marcado > 0.5 ? COLOR.rojo : "rgba(255,255,255,0.15)"}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: FUENTE.mono,
            fontWeight: 700,
            fontSize: 34,
            color: COLOR.texto,
          }}
        >
          {mes}
          <span style={{ fontSize: 70, color: COLOR.rojo, opacity: marcado, scale: String(0.6 + 0.4 * marcado) }}>✕</span>
        </div>
      );
    })}
    <div style={{ position: "absolute", left: 0, right: 0, top: 215, height: 6, borderRadius: 3, background: COLOR.rojo, transformOrigin: "left", scale: `${rango} 1` }} />
  </div>
);

export const Comet: React.FC<PropsComet> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.comet;
  const s = (seg: number) => seg * fps;

  const avionX = interpolate(frame, [0, duracion], [620, 440]);
  const brillo = entre(frame, m.futuro - s(0.1), m.futuro + s(0.5)) * (1 - entre(frame, m.anio - s(0.4), m.anio));
  const anio = resorte(frame, fps, m.anio - s(0.1), { damping: 12 });
  const parte = entre(frame, m.partieron, m.partieron + s(1.1));
  const marca1 = entre(frame, m.partieron, m.partieron + s(0.3));
  const marca2 = entre(frame, m.meses - s(0.1), m.meses + s(0.2));
  const rango = entre(frame, m.meses + s(0.2), m.meses + s(0.9));
  const perdidos = (marca1 > 0.5 ? 1 : 0) + (marca2 > 0.5 ? 1 : 0);

  const cielo = (zoom: number) => (
    <AbsoluteFill style={{ scale: String(zoom) }}>
      <Paisaje hora={0.25} saturacion={0.45} sol={{ x: 860, y: 330 }} frame={frame} horizonte={1250} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {brillo > 0 ? <circle cx={avionX} cy={760} r={420} fill={COLOR.verde} opacity={0.12 * brillo} /> : null}
        <AvionLateral x={avionX} y={760 + flotar(frame, 150, 8)} escala={1} inclinacion={-3} frame={frame} />
      </svg>
    </AbsoluteFill>
  );

  // Avión que se parte en dos en el aire.
  const separa = parte * 140;
  const roto = (
    <AbsoluteFill style={{ background: "#0f1217" }}>
      <Paisaje hora={0.6} saturacion={0.3} sol={{ x: 860, y: 330 }} frame={frame} horizonte={1250} />
      <AbsoluteFill style={{ background: COLOR.rojo, opacity: 0.25 * Math.max(0, 1 - Math.abs(frame - m.partieron - 4) / 12) }} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="mitadA">
            <rect x={-200} y={0} width={740} height={1920} />
          </clipPath>
          <clipPath id="mitadB">
            <rect x={540} y={0} width={900} height={1920} />
          </clipPath>
        </defs>
        <g transform={`translate(${-separa} ${parte * 80}) rotate(${-parte * 14} 540 760)`} clipPath="url(#mitadA)">
          <AvionLateral x={540} y={760} escala={1.1} frame={frame} />
        </g>
        <g transform={`translate(${separa} ${parte * 220}) rotate(${parte * 26} 540 760)`} clipPath="url(#mitadB)">
          <AvionLateral x={540} y={760} escala={1.1} frame={frame} />
        </g>
        {Array.from({ length: 16 }, (_, k) => (
          <rect
            key={k}
            x={540 + (random(`dx${k}`) - 0.5) * 500 * parte}
            y={760 + (random(`dy${k}`) - 0.3) * 400 * parte}
            width={10 + random(`dw${k}`) * 16}
            height={6 + random(`dh${k}`) * 10}
            fill="#9aa0a8"
            opacity={parte > 0 ? 1 - parte * 0.6 : 0}
            transform={`rotate(${random(`dr${k}`) * 360 + frame * 4} ${540 + (random(`dx${k}`) - 0.5) * 500 * parte} ${760 + (random(`dy${k}`) - 0.3) * 400 * parte})`}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );

  const calendario = (
    <AbsoluteFill style={{ background: "#16171a" }}>
      <div style={{ position: "absolute", left: 0, right: 150, top: 420, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 260, color: COLOR.texto, scale: String(0.7 + 0.3 * anio), opacity: anio, letterSpacing: -6 }}>
        1954
      </div>
      <Calendario meses={T.meses} marca1={marca1} marca2={marca2} rango={rango} />
    </AbsoluteFill>
  );

  return (
    <Escena name="Comet">
      <Sfx efecto="motor" desde={s(0.1)} volumen={0.14} />
      <Sfx efecto="brillo" desde={m.futuro} volumen={0.3} />
      <Sfx efecto="tap" desde={m.anio} volumen={0.4} />
      <Sfx efecto="estirar" desde={m.partieron} volumen={0.45} />
      <Sfx efecto="bip" desde={m.meses} volumen={0.3} />
      <Planos
        planos={[
          { desde: 0, contenido: cielo(interpolate(frame, [0, m.primer], [1, 1.1], { extrapolateRight: "clamp" })) },
          { desde: m.primer - s(0.1), contenido: cielo(1.55) },
          { desde: m.futuro - s(0.1), contenido: cielo(1.2) },
          { desde: m.anio - s(0.15), contenido: calendario },
          { desde: m.partieron - s(0.1), contenido: roto },
          { desde: m.meses - s(0.15), contenido: calendario },
        ]}
      />
      <AbsoluteFill style={{ opacity: frame < m.anio - s(0.15) ? 1 : 0 }}>
        <HudEtiqueta ancla={{ x: 360, y: 740 }} caja={{ x: 110, y: 520 }} texto={T.nombre} color={COLOR.azul} aparece={s(0.4)} desaparece={m.primer - s(0.15)} tamano={26} />
        <HudEtiqueta ancla={{ x: 540, y: 700 }} caja={{ x: 110, y: 470 }} texto={T.primer} color={COLOR.verde} aparece={m.primer + s(0.1)} tamano={28} />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={perdidos} color={perdidos ? COLOR.rojo : COLOR.texto} aparece={m.anio} />
    </Escena>
  );
};
