import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, resorte } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { MANOS, Personaje } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Corazon, Sangre } from "../componentes/Cuerpo";
import { TEXTOS } from "../guion-mareo";
import { MarcasMareo } from "../linea-mareo";
import { ESTILO } from "./Hook";

export type PropsGravedad = { marcas: MarcasMareo["gravedad"]; duracion: number };

/** Fondo cálido para las vistas "por dentro". */
export const FondoCuerpo: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffe0c2 0%, #ffc1b4 55%, #e9a7c9 100%)" }} />
);

export const Gravedad: React.FC<PropsGravedad> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.gravedad;
  const s = (seg: number) => seg * fps;

  const parada = frame >= m.golpe - s(0.1);
  const abajo = entre(frame, m.golpe, m.piernas + s(0.3));
  const flecha = resorte(frame, fps, m.golpe + s(0.1), { damping: 11 });
  const ml = interpolate(abajo, [0, 1], [0, 500]);
  const Y = parada ? 1000 : 1060;

  return (
    <Escena fondo={false} name="Gravedad">
      <Sfx efecto="ding" desde={m.calculado} volumen={0.25} />
      <Sfx efecto="whoosh" desde={m.golpe} volumen={0.3} />
      <Sfx efecto="burbujeo" desde={m.litro} volumen={0.25} />
      <FondoCuerpo />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 900], destino: [540, 1000] },
          { desde: m.calculado, zoom: 1.7, foco: [540, Y - 200], destino: [540, 900] },
          { desde: m.golpe, zoom: 1, foco: [540, 880], destino: [540, 1000] },
          { desde: m.litro, zoom: 1.45, foco: [540, 1080], destino: [540, 960] },
          { desde: m.piernas, zoom: 1.05, foco: [540, 900], destino: [540, 1000] },
        ]}
      >
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g opacity={0.5}>
            <Personaje
              x={540}
              y={Y}
              escala={1.05}
              {...ESTILO}
              pose={parada ? "parado" : "sentado"}
              expresion={parada ? "sorpresa" : "sonrisa"}
              manos={MANOS.costados}
              frame={frame}
            />
          </g>
          <Sangre x={540} y={Y} escala={1.05} abajo={abajo} frame={frame} />
          <Corazon x={540 + 20} y={Y - 205} tamano={70} frame={frame} bpm={70} fps={fps} />
          {/* Flecha de la gravedad */}
          <g opacity={flecha} transform={`translate(800 ${700 + 60 * flecha})`}>
            <rect x={-18} y={0} width={36} height={300} rx={18} fill="#7b6cff" />
            <path d="M -60 290 L 0 380 L 60 290 Z" fill="#7b6cff" />
            <text
              x={0}
              y={-30}
              textAnchor="middle"
              fill="#5b3a8c"
              fontFamily={FUENTE.inter}
              fontWeight={800}
              fontSize={44}
            >
              {T.gravedad}
            </text>
          </g>
        </svg>
      </Cortes>
      <HudEtiqueta
        ancla={{ x: 560, y: 760 }}
        caja={{ x: 110, y: 520 }}
        texto={T.calculado}
        color={COLOR.verde}
        aparece={m.calculado + s(0.2)}
        desaparece={m.golpe}
        tamano={30}
      />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={ml} unidad=" ml" color={COLOR.rojo} aparece={m.golpe} />
    </Escena>
  );
};
