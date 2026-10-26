import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { ESPECTRO, onda } from "../componentes/Luz";
import { TEXTOS } from "../guion-cielo";
import { MarcasCielo } from "../linea-cielo";

export type PropsLuz = { marcas: MarcasCielo["luz"]; duracion: number };

const SOL = { x: 150, y: 760 };
const PRISMA = { x: 470, y: 760, lado: 220 };

export const Luz: React.FC<PropsLuz> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.luz;
  const s = (seg: number) => seg * fps;

  const haz = entre(frame, 0, s(0.6));
  const abanico = entre(frame, m.colores - s(0.5), m.colores + s(0.4));
  const dy = flotar(frame, 220, 5);
  const h = (PRISMA.lado * Math.sqrt(3)) / 2;
  const prisma = `M${PRISMA.x},${PRISMA.y - h * 0.62 + dy} L${PRISMA.x + PRISMA.lado / 2},${PRISMA.y + h * 0.38 + dy} L${PRISMA.x - PRISMA.lado / 2},${PRISMA.y + h * 0.38 + dy} Z`;
  const salida = { x: PRISMA.x + 40, y: PRISMA.y + dy };
  const finX = 900;
  const colores = Math.max(1, Math.round(ESPECTRO.length * abanico));
  const rojo = { x: finX, y: salida.y - 260 * abanico };
  const azul = { x: finX, y: salida.y + 260 * abanico * (5 / 6) };

  return (
    <Escena name="Luz">
      <Sfx efecto="brillo" desde={m.colores} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="luzSol">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="45%" stopColor="#ffe9a8" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#ffe9a8" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="luzPrisma" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#9fb6d6" stopOpacity={0.12} />
          </linearGradient>
        </defs>
        <circle cx={SOL.x} cy={SOL.y + dy} r={150 + 8 * Math.sin(frame / 12)} fill="url(#luzSol)" />
        <circle cx={SOL.x} cy={SOL.y + dy} r={62} fill="#fff6d8" />
        {/* Haz blanco hasta el prisma */}
        <path d={onda(SOL.x + 70, SOL.y + dy, SOL.x + 70 + (salida.x - 60 - SOL.x - 70) * haz, salida.y, 70, 9, frame * 0.4)} fill="none" stroke="#fff" strokeWidth={12} strokeOpacity={0.2} />
        <path d={onda(SOL.x + 70, SOL.y + dy, SOL.x + 70 + (salida.x - 60 - SOL.x - 70) * haz, salida.y, 70, 9, frame * 0.4)} fill="none" stroke="#fff" strokeWidth={4} />
        {/* Abanico de colores: cada uno con su longitud de onda */}
        {ESPECTRO.map((c, i) => {
          const ang = (-0.42 + (i / (ESPECTRO.length - 1)) * 0.78) * abanico;
          const x1 = salida.x + (finX - salida.x) * Math.cos(ang);
          const y1 = salida.y + (finX - salida.x) * Math.sin(ang);
          return (
            <g key={i} opacity={abanico > 0 ? 1 : 0}>
              <path d={onda(salida.x, salida.y, x1, y1, c.nm / 7, 8, frame * 0.45)} fill="none" stroke={c.color} strokeWidth={9} strokeOpacity={0.18} />
              <path d={onda(salida.x, salida.y, x1, y1, c.nm / 7, 8, frame * 0.45)} fill="none" stroke={c.color} strokeWidth={3.5} />
            </g>
          );
        })}
        <path d={prisma} fill="url(#luzPrisma)" stroke="rgba(255,255,255,0.7)" strokeWidth={3} />
        <path d={prisma} fill="none" stroke="#fff" strokeWidth={1} transform="translate(8 10)" opacity={0.25} />
      </svg>
      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: SOL.x, y: SOL.y + dy - 70 }} caja={{ x: SOL.x + 30, y: SOL.y - 280 }} texto={T.blanca} color={COLOR.texto} aparece={m.blanca} tamano={24} />
        <HudEtiqueta ancla={rojo} caja={{ x: rojo.x - 20, y: rojo.y - 140 }} lado="izquierda" texto={T.rojo} color={COLOR.rojo} aparece={m.colores + s(0.3)} tamano={24} />
        <HudEtiqueta ancla={azul} caja={{ x: azul.x - 20, y: azul.y + 150 }} lado="izquierda" texto={T.azul} color={COLOR.azul} aparece={m.colores + s(0.45)} tamano={24} />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={colores} color={COLOR.azul} aparece={m.blanca} />
    </Escena>
  );
};
