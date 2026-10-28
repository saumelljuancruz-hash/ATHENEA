import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, resorte } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Cabeza, PELOS, PIELES } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { OjoGrande, ticParpado } from "../componentes/Ojo";
import { TEXTOS } from "../guion-parpado";
import { MarcasParpado } from "../linea-parpado";
import { ESTILO } from "./Hook";

export type PropsMusculo = { marcas: MarcasParpado["musculo"]; duracion: number };

const GENTE = [
  { piel: PIELES[3], pelo: PELOS[3], peinado: "corto" as const, semilla: 2 },
  { piel: PIELES[1], pelo: PELOS[1], peinado: "rulos" as const, semilla: 4 },
  { piel: PIELES[2], pelo: PELOS[0], peinado: "largo" as const, semilla: 6 },
];

export const Musculo: React.FC<PropsMusculo> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.musculo;
  const s = (seg: number) => seg * fps;

  const musculo = entre(frame, m.parpado - s(0.1), m.parpado + s(0.5));
  const tic = frame >= m.dispara - s(0.1) ? ticParpado(frame) : 0.15 * ticParpado(frame);
  const nombre = resorte(frame, fps, m.mioquimia, { damping: 11 });
  const tics = Math.round(frame >= m.dispara ? 20 + 10 * ticParpado(frame) : 0);

  const ojo = (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffd1e0 0%, #ffc9a8 100%)" }}>
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 900] },
          { desde: m.dispara, zoom: 1.15, foco: [540, 940] },
        ]}
      >
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <OjoGrande x={540} y={960} tamano={380} tic={tic} musculo={musculo} frame={frame} piel={ESTILO.piel} />
        </svg>
      </Cortes>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 150,
          top: 420,
          textAlign: "center",
          scale: String(nombre),
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 110,
          color: "#c2185b",
          textShadow: "0 6px 0 rgba(255,255,255,0.6)",
        }}
      >
        {T.nombre}
      </div>
    </AbsoluteFill>
  );

  // "Súper común": tres personas distintas con el mismo tic.
  const comun = (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #c9f1ff 0%, #ffd9b8 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {GENTE.map((g, k) => {
          const e = resorte(frame, fps, m.comun + k * 5, { damping: 12 });
          return (
            <g key={k} transform={`translate(${220 + k * 320} ${930 + (k % 2) * 80}) scale(${1.9 * e})`}>
              <Cabeza
                {...g}
                expresion={k === 1 ? "sorpresa" : "molestia"}
                frame={frame}
                tic={ticParpado(frame + k * 23)}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );

  return (
    <Escena fondo={false} name="Musculo">
      <Sfx efecto="estirar" desde={m.parpado} volumen={0.25} />
      <Sfx efecto="zumbido" desde={m.dispara} volumen={0.15} />
      <Sfx efecto="pop" desde={m.mioquimia} volumen={0.3} />
      <Sfx efecto="burbujeo" desde={m.comun} volumen={0.2} />
      <Planos
        planos={[
          { desde: 0, contenido: ojo },
          { desde: m.comun - s(0.1), contenido: comun },
        ]}
      />
      <AbsoluteFill style={{ opacity: frame < m.mioquimia - s(0.1) ? 1 : 0 }}>
        <HudEtiqueta
          ancla={{ x: 760, y: 760 }}
          caja={{ x: 110, y: 520 }}
          texto={T.musculo}
          color="#c2185b"
          aparece={m.parpado + s(0.3)}
          tamano={30}
        />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={tics} color={COLOR.naranja} aparece={m.dispara} />
    </Escena>
  );
};
