import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { GanchoPantalla, LineaGancho } from "../../comun/Gancho";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Lupa } from "../componentes/Lupa";
import { Rostro } from "../componentes/Piel";
import { TEXTOS } from "../guion-acaros";
import { MarcasAcaros } from "../linea-acaros";

export type PropsHook = { marcas: MarcasAcaros["hook"]; duracion: number };

const MEJILLA = { x: 470, y: 1110 };
const LUPA = { x: 770, y: 1000, r: 210 };

/** Cara dormida con la lupa sobre la mejilla (se reutiliza en el loop final y la portada). */
export const CaraConLupa: React.FC<{ frame: number; asoma: number; zoomLupa: number; etiqueta: string }> = ({ frame, asoma, zoomLupa, etiqueta }) => (
  <AbsoluteFill style={{ background: "#141724" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <Rostro x={320} y={1060 + flotar(frame, 220, 4)} escala={1.15} frame={frame} />
      <line x1={MEJILLA.x} y1={MEJILLA.y} x2={LUPA.x - LUPA.r * 0.7} y2={LUPA.y + LUPA.r * 0.7} stroke={COLOR.verde} strokeWidth={3} strokeDasharray="8 8" />
      <circle cx={MEJILLA.x} cy={MEJILLA.y} r={14} fill="none" stroke={COLOR.verde} strokeWidth={4} />
    </svg>
    <Lupa x={LUPA.x} y={LUPA.y} r={LUPA.r} zoom={zoomLupa} asoma={asoma} frame={frame} etiqueta={etiqueta} noche={0.6} />
  </AbsoluteFill>
);

export const Hook: React.FC<PropsHook> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const asoma = 0.35 + 0.65 * entre(frame, m.bichos, m.bichos + 0.8 * fps);
  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="pop" desde={m.bichos} volumen={0.3} />
      <Sfx efecto="tap" desde={m.literal} volumen={0.4} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 1000], destino: [540, 1000] },
          { desde: m.bichos, zoom: 1.2, foco: [LUPA.x - 60, LUPA.y], destino: [540, 1020] },
          { desde: m.literal, zoom: 1.55, foco: [LUPA.x, LUPA.y], destino: [560, 1040] },
        ]}
      >
        <CaraConLupa frame={frame} asoma={asoma} zoomLupa={1.4} etiqueta={T.lupa} />
      </Cortes>
      <GanchoPantalla lineas={T.gancho as LineaGancho[]} hasta={duracion} />
    </Escena>
  );
};
