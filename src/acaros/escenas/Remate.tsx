import React from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { RemateLineas } from "../../comun/RemateLineas";
import { COLOR } from "../../comun/tema";
import { Acaro, POROS, SuperficiePiel } from "../componentes/Piel";
import { TEXTOS } from "../guion-acaros";

export type PropsRemate = { duracion: number };

/** El remate acompaña la última frase ("Te los pasó tu mamá de bebé"): de fondo, mamá y bebé. */
export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<MamaBebe />} />
);

/** Mamá con su bebé (siluetas), con ácaros-puntito que pasan de una mejilla a la otra. */
const MamaBebe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pasa = entre(frame, 0.2 * fps, 1.6 * fps);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <rect width={1080} height={1920} fill="#1b1a24" />
      <circle cx={600} cy={1180} r={420} fill="#ff9a3c" opacity={0.1} />
      {/* Mamá */}
      <circle cx={480} cy={1000} r={130} fill="#3a3d44" />
      <path d="M 280 1550 C 280 1280 360 1160 480 1160 C 620 1160 700 1280 720 1400 L 720 1550 Z" fill="#3a3d44" />
      {/* Bebé en brazos */}
      <ellipse cx={700} cy={1200} rx={150} ry={95} fill="#4a4e57" />
      <circle cx={660} cy={1100} r={78} fill="#4a4e57" />
      {Array.from({ length: 8 }, (_, k) => {
        const t = Math.min(1, Math.max(0, pasa * 1.6 - k * 0.08));
        const x = interpolate(t, [0, 1], [530 + (k % 3) * 8, 650 + (k % 3) * 10]);
        const y = interpolate(t, [0, 1], [1040 + (k % 2) * 10, 1110 + (k % 2) * 8]) - Math.sin(Math.PI * t) * 60;
        return <circle key={k} cx={x} cy={y} r={7} fill={COLOR.verde} opacity={0.5 + 0.5 * Math.sin(frame / 6 + k)} />;
      })}
    </svg>
  );
};

/** Piel de noche con ácaros caminando despacito (para la pantalla del CTA). */
export const PielDeNoche: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SuperficiePiel poros={POROS} noche={0.8}>
      {POROS.slice(0, 10).map((p, k) => {
        const dir = random(`r${k}`) * 360;
        const rad = (dir * Math.PI) / 180;
        const d = 60 + frame * 0.35;
        return <Acaro key={k} x={p.x + Math.sin(rad) * d} y={p.y - Math.cos(rad) * d} escala={0.42} rot={dir} frame={frame} camina={1} />;
      })}
    </SuperficiePiel>
  );
};
