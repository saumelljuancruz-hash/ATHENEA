import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { HudEtiqueta } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { ContenedorVista } from "../../comun/vista";
import { DefsEsferas } from "../../microondas/componentes/Moleculas";
import { MoleculaAire, onda, Rebote } from "../componentes/Luz";
import { Paisaje } from "../componentes/Paisaje";
import { TEXTOS } from "../guion-cielo";
import { MarcasCielo } from "../linea-cielo";

export type PropsHook = { marcas: MarcasCielo["hook"]; duracion: number };

export const MOLECULAS_AIRE = [
  { x: 230, y: 560, r: 30, a: 20 },
  { x: 470, y: 760, r: 34, a: -35 },
  { x: 760, y: 610, r: 28, a: 60 },
  { x: 330, y: 1000, r: 32, a: 10 },
  { x: 690, y: 950, r: 30, a: -70 },
  { x: 860, y: 1130, r: 26, a: 35 },
  { x: 200, y: 1200, r: 28, a: -20 },
];

/** Vista "microscópica" del aire: un haz blanco cruza y el azul rebota en cada molécula. */
export const AireConRebote: React.FC<{ frame: number; rebote: number; haz?: number }> = ({ frame, rebote, haz = 1 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <DefsEsferas />
    <rect width={1080} height={1920} fill="#14243f" opacity={0.6} />
    <g opacity={haz}>
      <path d={onda(-40, 300, 1120, 1300, 90, 10, frame * 0.4)} fill="none" stroke="#ffffff" strokeWidth={10} strokeOpacity={0.15} />
      <path d={onda(-40, 300, 1120, 1300, 90, 10, frame * 0.4)} fill="none" stroke="#ffffff" strokeWidth={3.5} />
    </g>
    {MOLECULAS_AIRE.map((m, i) => (
      <g key={i}>
        <Rebote x={m.x} y={m.y} frame={frame} semilla={i} intensidad={rebote} />
        <MoleculaAire x={m.x + flotar(frame, 90, 4, i * 9)} y={m.y + flotar(frame, 110, 4, i * 17)} r={m.r} angulo={m.a + frame * 0.6} />
      </g>
    ))}
  </svg>
);

export const Hook: React.FC<PropsHook> = ({ marcas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;

  // "El cielo no es azul": el cielo pierde el color… y entramos al aire.
  const sinColor = entre(frame, marcas.noAzul, marcas.noAzul + 0.5 * fps);
  const inicioZoom = Math.max(0.9 * fps, marcas.rebotando - 0.45 * fps);
  const zoom = interpolate(frame, [inicioZoom, inicioZoom + 0.55 * fps], [1, 16], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });
  const aire = entre(frame, inicioZoom + 0.4 * fps, inicioZoom + 0.75 * fps);

  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="whoosh" desde={inicioZoom} volumen={0.4} />
      <Sfx efecto="brillo" desde={marcas.rebotando} />
      {aire < 1 ? (
        <ContenedorVista
          vista={{ zoom: zoom * (1 + 0.03 * entre(frame, 0, inicioZoom)), giro: 0, foco: [540, 520], destino: [540, 520] }}
          style={{ filter: zoom > 2.5 ? `blur(${Math.min(14, zoom - 2.5)}px)` : undefined, opacity: 1 - aire }}
        >
          <Paisaje hora={0} saturacion={1 - 0.9 * sinColor} sol={{ x: 820, y: 330 + flotar(frame, 200, 6) }} frame={frame} />
        </ContenedorVista>
      ) : null}
      {aire > 0 ? (
        <AbsoluteFill style={{ opacity: aire, scale: String(interpolate(aire, [0, 1], [2.2, 1])), filter: aire < 1 ? `blur(${(1 - aire) * 10}px)` : undefined }}>
          <AireConRebote frame={frame} rebote={entre(frame, marcas.rebotando, marcas.rebotando + 0.4 * fps)} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: 470, y: 726 }} caja={{ x: 530, y: 560 }} texto={T.rebote} color={COLOR.azul} aparece={marcas.rebotando + 0.15 * fps} tamano={26} />
      </AbsoluteFill>
    </Escena>
  );
};
