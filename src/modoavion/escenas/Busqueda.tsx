import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Paisaje } from "../../cielo/componentes/Paisaje";
import { Anillos, AvionLateral, Torre } from "../componentes/Vuelo";
import { TEXTOS } from "../guion-modoavion";
import { MarcasModoAvion } from "../linea-modoavion";

export type PropsBusqueda = { marcas: MarcasModoAvion["busqueda"]; duracion: number };

const HORIZONTE = 1020;
const TORRES = [
  { x: 150, y: HORIZONTE + 120 },
  { x: 880, y: HORIZONTE + 150 },
];

/** Barras de señal que suben y bajan (buscando). */
const Barras: React.FC<{ x: number; y: number; nivel: number }> = ({ x, y, nivel }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 1, 2, 3].map((k) => (
      <rect key={k} x={k * 14} y={-10 - k * 9} width={10} height={10 + k * 9} rx={2} fill={k < nivel ? COLOR.verde : "#4a4e57"} />
    ))}
  </g>
);

export const Busqueda: React.FC<PropsBusqueda> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.busqueda;
  const s = (seg: number) => seg * fps;

  const avion = { x: 540 + interpolate(frame, [0, duracion], [60, -60]), y: 470 + flotar(frame, 140, 8) };
  const cel = { x: avion.x + 20, y: avion.y + 6 };
  const busca = entre(frame, m.antenas - s(0.4), m.antenas);
  const lejos = entre(frame, m.lejos - s(0.2), m.lejos + s(0.5));
  const fuerte = entre(frame, m.fuerte - s(0.2), m.fuerte + s(0.8));
  const potencia = interpolate(fuerte, [0, 1], [18, 100]);
  const nivelBarras = Math.floor(((frame / 8) % 4) * (1 - fuerte * 0.5));

  return (
    <Escena name="Busqueda">
      <Sfx efecto="ping" desde={m.antenas} volumen={0.25} />
      <Sfx efecto="ping" desde={m.fuerte} volumen={0.35} />
      <Paisaje hora={0.12} saturacion={0.7} sol={{ x: 180, y: 260 }} frame={frame} horizonte={HORIZONTE} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {TORRES.map((t, k) => (
          <g key={k}>
            <line x1={cel.x} y1={cel.y + 40} x2={t.x} y2={t.y - 206} stroke={COLOR.verde} strokeWidth={2} strokeDasharray="6 10" opacity={0.6 * lejos} />
            <Torre x={t.x} y={t.y} escala={0.85} frame={frame} recibe={busca * (0.4 + 0.6 * fuerte)} />
          </g>
        ))}
        <Anillos x={cel.x} y={cel.y + 30} frame={frame} intensidad={busca * (0.35 + 0.65 * fuerte)} alcance={220 + 380 * fuerte} periodo={interpolate(fuerte, [0, 1], [50, 26])} />
        <AvionLateral x={avion.x} y={avion.y} escala={1.05} inclinacion={-3} corte={1} celulares={0.05} frame={frame} />
        <Barras x={cel.x + 60} y={cel.y - 110} nivel={nivelBarras} />
      </svg>

      {/* Distancia hasta la antena */}
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 760,
          opacity: lejos,
          fontFamily: FUENTE.mono,
          fontWeight: 700,
          fontSize: 30,
          color: COLOR.azul,
          background: "rgba(8,9,11,0.8)",
          border: `1px solid ${COLOR.azul}88`,
          borderRadius: 6,
          padding: "6px 12px",
        }}
      >
        ↕ 10 km
      </div>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: cel.x + 4, y: cel.y }} caja={{ x: 90, y: cel.y + 300 }} texto={T.buscando} color={COLOR.verde} aparece={m.antenas} tamano={24} />
        <HudEtiqueta ancla={{ x: TORRES[0].x + 10, y: TORRES[0].y - 175 }} caja={{ x: TORRES[0].x + 70, y: TORRES[0].y - 110 }} texto={T.antena} color={COLOR.azul} aparece={m.antenas + s(0.4)} tamano={22} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={potencia} unidad="%" color={fuerte > 0.6 ? COLOR.naranjaCalor : COLOR.verde} aparece={m.antenas} />
    </Escena>
  );
};
