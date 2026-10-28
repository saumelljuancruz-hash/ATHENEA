import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Persona } from "../../algoritmo/componentes/Gente";
import { Acaro, POROS, SuperficiePiel } from "../componentes/Piel";
import { TEXTOS } from "../guion-acaros";
import { MarcasAcaros } from "../linea-acaros";

export type PropsTranqui = { marcas: MarcasAcaros["tranqui"]; duracion: number };

const COLS = 7;
const FILAS = 6;

export const Tranqui: React.FC<PropsTranqui> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.tranqui;
  const s = (seg: number) => seg * fps;

  const encienden = entre(frame, m.adultos - s(0.1), m.adultos + s(0.9));
  const check = resorte(frame, fps, m.inofensivos + s(0.15), { damping: 11 });

  const multitud = (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: COLS * FILAS }, (_, i) => {
        const c = i % COLS;
        const f = Math.floor(i / COLS);
        const x = 120 + c * 140 + (f % 2) * 50;
        const y = 520 + f * 140 + flotar(frame, 160, 3, i);
        const tiene = i !== 17; // casi todos
        const on = tiene && random(`on${i}`) < encienden * 1.15;
        return (
          <g key={i}>
            <Persona x={x} y={y} r={50} color={on ? "#5d626c" : "#3a3d44"} />
            {on ? <circle cx={x + 12} cy={y - 26} r={7} fill={COLOR.verde} opacity={0.6 + 0.4 * Math.sin(frame / 7 + i)} /> : null}
          </g>
        );
      })}
    </svg>
  );

  const muchos = Array.from({ length: 34 }, (_, k) => ({ x: 80 + random(`mx${k}`) * 920, y: 380 + random(`my${k}`) * 1000, rot: random(`mr${k}`) * 360 }));

  return (
    <Escena name="Tranqui">
      <Sfx efecto="brillo" desde={m.adultos} volumen={0.3} />
      <Sfx efecto="zumbido" desde={m.demasiados} volumen={0.18} />
      <Sfx efecto="ding" desde={m.inofensivos + s(0.15)} volumen={0.3} />
      <Planos
        planos={[
          { desde: 0, contenido: <AbsoluteFill style={{ background: "#16171a", scale: String(interpolate(frame, [0, m.demasiados], [1.1, 1])) }}>{multitud}</AbsoluteFill> },
          {
            desde: m.demasiados - s(0.1),
            contenido: (
              <AbsoluteFill style={{ scale: "1.15" }}>
                <SuperficiePiel poros={POROS} rojo={1}>
                  {muchos.map((a, k) => (
                    <Acaro key={k} x={a.x + 6 * Math.sin(frame / 9 + k)} y={a.y} escala={0.42} rot={a.rot + frame * 0.6} frame={frame} camina={1} />
                  ))}
                </SuperficiePiel>
              </AbsoluteFill>
            ),
          },
          {
            desde: m.inofensivos - s(0.1),
            contenido: (
              <AbsoluteFill style={{ scale: "1.05" }}>
                <SuperficiePiel poros={POROS}>
                  {[2, 7, 9].map((k) => (
                    <Acaro key={k} x={POROS[k].x + 30} y={POROS[k].y - 60} escala={0.45} rot={20} frame={frame} />
                  ))}
                </SuperficiePiel>
              </AbsoluteFill>
            ),
          },
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 150, top: 760, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 240, color: COLOR.verde, scale: String(check), textShadow: `0 0 60px ${COLOR.verde}88` }}>
        ✓
      </div>
      <HudEtiqueta ancla={{ x: 540, y: 800 }} caja={{ x: 110, y: 470 }} texto={T.demasiados} color={COLOR.rojo} aparece={m.demasiados + s(0.2)} desaparece={m.inofensivos - s(0.1)} tamano={30} />
      <HudEtiqueta ancla={{ x: 540, y: 760 }} caja={{ x: 110, y: 470 }} texto={T.inofensivos} color={COLOR.verde} aparece={m.inofensivos + s(0.3)} tamano={30} />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={100 * encienden} unidad="%" prefijo="≈ " color={COLOR.verde} aparece={m.adultos} />
    </Escena>
  );
};
