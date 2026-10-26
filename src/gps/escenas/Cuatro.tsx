import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Pin, Satelite } from "../componentes/Espacio";
import { Plano, PLANO } from "../componentes/Plano";
import { TEXTOS } from "../guion-gps";
import { MarcasGps } from "../linea-gps";

export type PropsCuatro = { marcas: MarcasGps["cuatro"]; duracion: number };

/** Dónde está el celular sobre el plano. */
export const OBJETIVO = { x: PLANO.x + 70, y: PLANO.y + 40 };
const SATS = [
  { x: 200, y: 420, color: COLOR.verde },
  { x: 860, y: 450, color: COLOR.verde },
  { x: 230, y: 1150, color: COLOR.verde },
  { x: 850, y: 1170, color: COLOR.azul },
];

export const Cuatro: React.FC<PropsCuatro> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.cuatro;
  const s = (seg: number) => seg * fps;

  // Tres círculos con un pequeño error de reloj; el cuarto lo corrige y todos se cruzan en un punto.
  const ajuste = entre(frame, m.cruza + s(0.2), m.punto - s(0.1), ENTRA_SALE);
  const caida = resorte(frame, fps, m.punto, { damping: 10, stiffness: 160 });
  const usados = SATS.filter((_, k) => frame >= (k < 3 ? s(0.15) + k * s(0.3) : m.cruza)).length;

  return (
    <Escena name="Cuatro">
      <Sfx efecto="ping" desde={m.punto} />
      {SATS.map((_, k) => (
        <Sfx key={k} efecto="pop" desde={k < 3 ? s(0.15) + k * s(0.3) : m.cruza} />
      ))}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Plano dy={flotar(frame, 240, 4)} />
        <defs>
          <clipPath id="cuatroPlano">
            <rect x={PLANO.x - PLANO.ancho / 2} y={PLANO.y - PLANO.alto / 2} width={PLANO.ancho} height={PLANO.alto} rx={28} />
          </clipPath>
        </defs>
        <g clipPath="url(#cuatroPlano)">
          {SATS.map((sat, k) => {
            const inicio = k < 3 ? s(0.15) + k * s(0.3) : m.cruza;
            const crece = entre(frame, inicio, inicio + s(0.6));
            const real = Math.hypot(OBJETIVO.x - sat.x, OBJETIVO.y - sat.y);
            const error = k < 3 ? 1 + 0.06 * (1 - ajuste) * (k === 1 ? -1 : 1) : 1;
            if (crece <= 0) return null;
            return (
              <g key={k}>
                <circle cx={sat.x} cy={sat.y} r={real * error * crece} fill={sat.color} fillOpacity={0.05} stroke={sat.color} strokeWidth={3} strokeOpacity={0.85} />
                <circle cx={sat.x} cy={sat.y} r={real * error * crece} fill="none" stroke={sat.color} strokeWidth={12} strokeOpacity={0.12} />
              </g>
            );
          })}
          {/* Zona de duda antes de corregir */}
          <circle cx={OBJETIVO.x} cy={OBJETIVO.y} r={interpolate(ajuste, [0, 1], [46, 6])} fill={COLOR.rojo} opacity={0.25 * entre(frame, s(0.9), s(1.2)) * (1 - ajuste)} />
        </g>
        {SATS.map((sat, k) => {
          const inicio = k < 3 ? s(0.15) + k * s(0.3) : m.cruza;
          const p = resorte(frame, fps, inicio, { damping: 12 });
          return <Satelite key={k} x={sat.x} y={sat.y + flotar(frame, 150, 4, k * 20)} tamano={58 * p} angulo={-15} brillo={k === 3 ? 0.8 : 0.3} />;
        })}
        {frame >= m.punto ? <Pin x={OBJETIVO.x} y={OBJETIVO.y - (1 - caida) * 120} tamano={58} pulso={((frame - m.punto) % 40) / 40} /> : null}
      </svg>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: SATS[3].x - 30, y: SATS[3].y - 30 }} caja={{ x: SATS[3].x - 60, y: SATS[3].y - 150 }} lado="izquierda" texto={T.reloj} color={COLOR.azul} aparece={m.cruza + s(0.2)} desaparece={m.punto + s(0.3)} tamano={22} />
        <HudEtiqueta ancla={{ x: OBJETIVO.x + 10, y: OBJETIVO.y - 40 }} caja={{ x: OBJETIVO.x + 120, y: OBJETIVO.y - 170 }} texto={T.punto} color={COLOR.verde} aparece={m.punto + s(0.15)} tamano={26} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={usados} color={COLOR.verde} aparece={6} extra="de 4" />
    </Escena>
  );
};
