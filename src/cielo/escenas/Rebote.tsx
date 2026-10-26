import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { DefsEsferas } from "../../microondas/componentes/Moleculas";
import { AZUL_LUZ, MoleculaAire, onda, Rebote as RebotePunto, ROJO_LUZ } from "../componentes/Luz";
import { OBSERVADOR, Paisaje } from "../componentes/Paisaje";
import { DATOS, TEXTOS } from "../guion-cielo";
import { MarcasCielo } from "../linea-cielo";

export type PropsRebote = { marcas: MarcasCielo["rebote"]; duracion: number };

const Y = 760;
const MOLES = [
  { x: 250, y: Y - 18, r: 30 },
  { x: 470, y: Y + 22, r: 34 },
  { x: 690, y: Y - 12, r: 30 },
  { x: 900, y: Y + 16, r: 28 },
];
/** Puntos del cielo desde donde llega luz azul al observador. */
const FUENTES = Array.from({ length: 12 }, (_, i) => ({
  x: 80 + random(`fx${i}`) * 880,
  y: 240 + random(`fy${i}`) * 520,
  fase: random(`ff${i}`),
}));

export const Rebote: React.FC<PropsRebote> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.rebote;
  const s = (seg: number) => seg * fps;

  const choque = entre(frame, m.aire - s(0.1), m.aire + s(0.5));
  const cambio = entre(frame, m.desparrama - s(0.2), m.desparrama + s(0.6), ENTRA_SALE);
  const factor = interpolate(entre(frame, m.cinco - s(0.2), m.cinco + s(0.8)), [0, 1], [1, DATOS.reboteAzulVsRojo]);
  const cielo = entre(frame, m.desparrama, m.mires);
  const mirada = frame > m.mires ? Math.sin(((frame - m.mires) / fps) * 2.6) : 0;
  const HORIZONTE = 980;
  const yo = OBSERVADOR(HORIZONTE);

  // El azul se va "gastando" en cada molécula; el rojo sigue de largo.
  const tramos = [-40, ...MOLES.map((p) => p.x), 1120];

  return (
    <Escena name="Rebote">
      <Sfx efecto="pop" desde={m.aire} />
      <Sfx efecto="brillo" desde={m.desparrama} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - cambio }}>
        <DefsEsferas />
        <path d={onda(-40, Y, 1120, Y, 100, 14, frame * 0.35)} fill="none" stroke={ROJO_LUZ} strokeWidth={4} />
        <path d={onda(-40, Y, 1120, Y, 76, 12, frame * 0.4 + 1)} fill="none" stroke="#5fd36a" strokeWidth={3} opacity={0.8} />
        {tramos.slice(0, -1).map((x0, k) => {
          const intensidad = Math.max(0.12, 1 - k * 0.24 * choque);
          return (
            <path
              key={k}
              d={onda(x0, Y, tramos[k + 1], Y, 52, 10, frame * 0.5 - (x0 * 2 * Math.PI) / 52)}
              fill="none"
              stroke={AZUL_LUZ}
              strokeWidth={4}
              opacity={intensidad}
            />
          );
        })}
        {MOLES.map((p, i) => (
          <g key={i}>
            <RebotePunto x={p.x} y={p.y} frame={frame} semilla={i + 3} intensidad={choque} />
            <MoleculaAire x={p.x + flotar(frame, 90, 4, i * 13)} y={p.y + flotar(frame, 120, 4, i * 7)} r={p.r} angulo={30 * i + frame * 0.6} />
          </g>
        ))}
      </svg>

      {cambio > 0 ? (
        <AbsoluteFill style={{ opacity: cambio }}>
          <Paisaje hora={0} saturacion={0.25 + 0.75 * cielo} sol={{ x: 860, y: 300 }} frame={frame} mirada={mirada} horizonte={HORIZONTE} />
          <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
            {/* Luz azul llegando desde todo el cielo */}
            {FUENTES.map((f, i) => {
              const u = ((frame / fps) * 0.9 + f.fase) % 1;
              const x0 = f.x + (yo.x - f.x) * Math.max(0, u - 0.25);
              const y0 = f.y + (yo.y - f.y) * Math.max(0, u - 0.25);
              const x1 = f.x + (yo.x - f.x) * u;
              const y1 = f.y + (yo.y - f.y) * u;
              return (
                <g key={i} opacity={cielo > 0 ? Math.min(1, cielo * 3) * (1 - u * 0.4) : 0}>
                  <circle cx={f.x} cy={f.y} r={8} fill={AZUL_LUZ} opacity={0.6} />
                  <path d={onda(x0, y0, x1, y1, 26, 5, frame * 0.5)} fill="none" stroke="#bfe0ff" strokeWidth={3} strokeLinecap="round" />
                </g>
              );
            })}
          </svg>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: MOLES[1].x, y: MOLES[1].y - 40 }} caja={{ x: MOLES[1].x + 40, y: Y - 260 }} texto={T.azul} color={COLOR.azul} aparece={m.aire + s(0.4)} desaparece={m.desparrama - s(0.2)} />
        <HudEtiqueta ancla={{ x: 960, y: Y }} caja={{ x: 930, y: Y + 230 }} lado="izquierda" texto={T.rojo} color={COLOR.rojo} aparece={m.rojo} desaparece={m.desparrama - s(0.2)} />
        <HudEtiqueta ancla={{ x: yo.x, y: yo.y - 20 }} caja={{ x: yo.x + 120, y: yo.y - 140 }} texto={T.vos} color={COLOR.verde} aparece={m.mires} tamano={26} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} prefijo="×" valor={factor} decimales={1} color={COLOR.azul} aparece={m.aire} />
    </Escena>
  );
};
