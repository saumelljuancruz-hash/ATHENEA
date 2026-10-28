import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { GanchoPantalla, LineaGancho } from "../../comun/Gancho";
import { Cabeza, PELOS, PIELES } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { ticParpado } from "../componentes/Ojo";
import { TEXTOS } from "../guion-parpado";
import { MarcasParpado } from "../linea-parpado";

export type PropsHook = { marcas: MarcasParpado["hook"]; duracion: number };

/** La protagonista de este Reel (siempre la misma). */
export const ESTILO = {
  piel: PIELES[0],
  pelo: PELOS[2],
  peinado: "largo" as const,
  remera: "#ff4f7a",
  pantalon: "#3b4a6b",
  semilla: 7,
};
export const TONO_GANCHO = "70,30,80";

/** Cara grande con el párpado que late, sobre fondo cálido. */
export const CaraConTic: React.FC<{
  frame: number;
  expresion?: "molestia" | "sorpresa" | "neutra" | "sonrisa";
  tic: number;
}> = ({ frame, expresion = "molestia", tic }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffd1e0 0%, #ffc9a8 100%)" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <circle cx={540} cy={1000} r={480} fill="#fff" opacity={0.25} />
      <g transform={`translate(540 ${1010 + 6 * Math.sin(frame / 25)}) scale(4.4)`}>
        <Cabeza {...ESTILO} expresion={expresion} mirada={[0.2, 0]} frame={frame} semilla={ESTILO.semilla} tic={tic} />
      </g>
      {tic > 0.3
        ? [0, 1, 2].map((k) => (
            <path
              key={k}
              d={`M ${400 - k * 40} ${880 - k * 30} l -40 -30`}
              stroke={COLOR.naranja}
              strokeWidth={10}
              strokeLinecap="round"
              opacity={tic}
            />
          ))
        : null}
    </svg>
  </AbsoluteFill>
);

export const Hook: React.FC<PropsHook> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const tic = ticParpado(frame + 20);
  return (
    <Escena entrada={false} fondo={false} name="Hook">
      <Sfx efecto="tap" desde={m.late} volumen={0.3} />
      <Sfx efecto="tap" desde={m.vida} volumen={0.3} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 0.9, foco: [540, 1000], destino: [540, 1120] },
          { desde: m.vida, zoom: 1.3, foco: [430, 1000], destino: [540, 1000] },
          { desde: m.noEs, zoom: 2.1, foco: [420, 1000], destino: [540, 960] },
        ]}
      >
        <CaraConTic frame={frame} tic={tic} />
      </Cortes>
      <GanchoPantalla lineas={T.gancho as LineaGancho[]} hasta={m.vida + 0.3 * fps} tono={TONO_GANCHO} />
    </Escena>
  );
};
