import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Paisaje } from "../../cielo/componentes/Paisaje";
import { Telefono } from "../../faceid/componentes/Telefono";
import { AvionLateral, IconoAvion } from "../componentes/Vuelo";
import { TEXTOS } from "../guion-modoavion";
import { MarcasModoAvion } from "../linea-modoavion";

export type PropsHook = { marcas: MarcasModoAvion["hook"]; duracion: number };

/** Pantalla de ajustes con el interruptor de modo avión (coordenadas del teléfono). */
export const AjustesModoAvion: React.FC<{ encendido: number; etiqueta: string; resaltar?: number }> = ({ encendido, etiqueta, resaltar = 0 }) => (
  <g>
    <rect x={-128} y={-215} width={256} height={74} rx={16} fill="#22252b" stroke={COLOR.naranja} strokeOpacity={resaltar} strokeWidth={3} />
    <rect x={-114} y={-200} width={44} height={44} rx={10} fill={COLOR.naranja} />
    <IconoAvion x={-92} y={-178} tamano={36} color="#fff" />
    <text x={-58} y={-171} fill={COLOR.texto} fontFamily={FUENTE.inter} fontWeight={700} fontSize={18}>
      {etiqueta}
    </text>
    <rect x={68} y={-191} width={48} height={28} rx={14} fill={encendido > 0.5 ? COLOR.naranja : "#4a4e57"} />
    <circle cx={82 + 20 * encendido} cy={-177} r={11} fill="#fff" />
    {[0, 1, 2].map((k) => (
      <g key={k}>
        <rect x={-128} y={-125 + k * 66} width={256} height={54} rx={14} fill="#1c1f24" />
        <rect x={-112} y={-110 + k * 66} width={110 - k * 20} height={12} rx={6} fill="#3a3d44" />
      </g>
    ))}
  </g>
);

export const Hook: React.FC<PropsHook> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;

  // El avión "amaga" con caer cuando se dice "no se cae", y el sello de MITO lo frena.
  const amago = entre(frame, marcas.noSeCae - 0.3 * fps, marcas.noSeCae + 0.2 * fps) * (1 - entre(frame, marcas.noSeCae + 0.3 * fps, marcas.noSeCae + 0.9 * fps, ENTRA_SALE));
  const sello = resorte(frame, fps, marcas.noSeCae + 0.25 * fps, { damping: 9, stiffness: 220 });
  const cierre = entre(frame, marcas.algo - 0.2 * fps, duracion, ENTRA_SALE);
  const avionX = interpolate(frame, [0, duracion], [880, 300]);

  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="tap" desde={marcas.noSeCae + 0.25 * fps} volumen={0.5} />
      <Sfx efecto="bip" desde={marcas.accidente} volumen={0.2} />
      <Paisaje hora={0.12} saturacion={0.75} sol={{ x: 180, y: 300 }} frame={frame} horizonte={1180} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <AvionLateral x={avionX} y={360 + amago * 140 + flotar(frame, 120, 6)} escala={0.42 + 0.25 * cierre} inclinacion={amago * 14 - 4} frame={frame} />
      </svg>
      <AbsoluteFill style={{ opacity: 1 - cierre, translate: `0px ${cierre * 400}px` }}>
        <Telefono ubicacion={{ x: 505, y: 870 + flotar(frame, 160, 6), rot: flotar(frame, 220, 1.5), escala: 1.15 }} pantalla="apagada">
          <AjustesModoAvion encendido={0} etiqueta={T.modoAvion} resaltar={0.5 + 0.5 * Math.sin(frame / 8)} />
        </Telefono>
      </AbsoluteFill>
      {/* Sello de MITO */}
      <div
        style={{
          position: "absolute",
          left: 505,
          top: 560,
          translate: "-50% -50%",
          rotate: "-12deg",
          scale: String(sello),
          opacity: 1 - cierre,
          border: `8px solid ${COLOR.rojo}`,
          borderRadius: 18,
          padding: "6px 40px",
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 110,
          letterSpacing: 6,
          color: COLOR.rojo,
          background: "rgba(22,23,26,0.55)",
          boxShadow: `0 0 40px ${COLOR.rojo}55`,
        }}
      >
        {T.mito}
      </div>
      <ContadorHud etiqueta={T.contador} valor={0} color={COLOR.verde} aparece={marcas.accidente} />
    </Escena>
  );
};
