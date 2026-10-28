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

/** Mamá con su bebé (siluetas), con ácaros-puntito que pasan de una mejilla a la otra. */
const MamaBebe: React.FC<{ frame: number; pasa: number }> = ({ frame, pasa }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <rect width={1080} height={1920} fill="#1b1a24" />
    <circle cx={560} cy={880} r={420} fill="#ff9a3c" opacity={0.08} />
    {/* Mamá */}
    <circle cx={420} cy={700} r={130} fill="#3a3d44" />
    <path d="M 220 1250 C 220 980 300 860 420 860 C 560 860 640 980 660 1100 L 660 1250 Z" fill="#3a3d44" />
    {/* Bebé en brazos */}
    <ellipse cx={640} cy={900} rx={150} ry={95} fill="#4a4e57" />
    <circle cx={600} cy={800} r={78} fill="#4a4e57" />
    {Array.from({ length: 8 }, (_, k) => {
      const t = Math.min(1, Math.max(0, pasa * 1.6 - k * 0.08));
      const x = interpolate(t, [0, 1], [470 + (k % 3) * 8, 590 + (k % 3) * 10]);
      const y = interpolate(t, [0, 1], [740 + (k % 2) * 10, 810 + (k % 2) * 8]) - Math.sin(Math.PI * t) * 60;
      return <circle key={k} cx={x} cy={y} r={7} fill={COLOR.verde} opacity={0.5 + 0.5 * Math.sin(frame / 6 + k)} />;
    })}
  </svg>
);

export const Tranqui: React.FC<PropsTranqui> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.tranqui;
  const s = (seg: number) => seg * fps;

  const encienden = entre(frame, m.adultos - s(0.1), m.adultos + s(0.9));
  const pasa = entre(frame, m.mama, m.mama + s(1.2));
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
      <Sfx efecto="pop" desde={m.mama} volumen={0.25} />
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
          { desde: m.mama - s(0.1), contenido: <MamaBebe frame={frame} pasa={pasa} /> },
        ]}
      />
      <div style={{ position: "absolute", left: 0, right: 150, top: 760, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 240, color: COLOR.verde, scale: String(check), opacity: frame < m.mama - s(0.1) ? 1 : 0, textShadow: `0 0 60px ${COLOR.verde}88` }}>
        ✓
      </div>
      <HudEtiqueta ancla={{ x: 540, y: 800 }} caja={{ x: 110, y: 470 }} texto={T.demasiados} color={COLOR.rojo} aparece={m.demasiados + s(0.2)} desaparece={m.inofensivos - s(0.1)} tamano={30} />
      <HudEtiqueta ancla={{ x: 540, y: 760 }} caja={{ x: 110, y: 470 }} texto={T.inofensivos} color={COLOR.verde} aparece={m.inofensivos + s(0.3)} desaparece={m.mama - s(0.1)} tamano={30} />
      <HudEtiqueta ancla={{ x: 530, y: 780 }} caja={{ x: 110, y: 470 }} texto={T.mama} color={COLOR.naranja} aparece={m.mama + s(0.3)} tamano={30} />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={100 * encienden} unidad="%" prefijo="≈ " color={COLOR.verde} aparece={m.adultos} />
    </Escena>
  );
};
