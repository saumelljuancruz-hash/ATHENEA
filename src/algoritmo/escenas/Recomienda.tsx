import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Avatar, Persona } from "../componentes/Gente";
import { TEXTOS } from "../guion-algoritmo";
import { MarcasAlgoritmo } from "../linea-algoritmo";
import { BarrasPerfil, PERFIL } from "./Parecidos";

export type PropsRecomienda = { marcas: MarcasAlgoritmo["recomienda"]; duracion: number };

// Gente parecida a vos, arriba; vos, abajo.
const PARECIDOS = Array.from({ length: 7 }, (_, k) => ({ x: 150 + k * 110, y: 470 + (k % 2) * 50 }));
const YO = { x: 470, y: 1060 };
const VIDEO = { x: 470, y: 760 };

/** Tarjeta de video (miniatura con play). */
const TarjetaVideo: React.FC<{ x: number; y: number; escala: number; frame: number; play: number }> = ({ x, y, escala, frame, play }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <rect x={-95} y={-160} width={190} height={320} rx={22} fill="#1f3b4a" stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
    <circle cx={-20 + 20 * Math.sin(frame / 20)} cy={-40} r={44} fill={COLOR.verde} opacity={0.4} />
    <circle cx={0} cy={20} r={38} fill="rgba(0,0,0,0.45)" />
    <path d="M -12 -2 L 20 20 L -12 42 Z" fill="#fff" opacity={play} />
    <rect x={-70} y={110} width={110} height={10} rx={5} fill="rgba(255,255,255,0.6)" />
  </g>
);

/** Corazón. */
const Corazon: React.FC<{ x: number; y: number; tamano: number; opacidad: number }> = ({ x, y, tamano, opacidad }) => (
  <path
    transform={`translate(${x} ${y}) scale(${tamano / 40})`}
    d="M0 14 C -26 -4 -20 -26 -6 -24 C -2 -24 0 -20 0 -18 C 0 -20 2 -24 6 -24 C 20 -26 26 -4 0 14 Z"
    fill={COLOR.magenta}
    opacity={opacidad}
  />
);

export const Recomienda: React.FC<PropsRecomienda> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.recomienda;
  const s = (seg: number) => seg * fps;

  const entraVideo = resorte(frame, fps, m.encanto - s(0.4), { damping: 14 });
  const baja = entre(frame, m.muestra - s(0.2), m.muestra + s(0.7), ENTRA_SALE);
  const llega = resorte(frame, fps, m.muestra + s(0.6), { damping: 10 });
  const frena = entre(frame, m.frenas - s(0.1), m.frenas + s(0.3));
  const ensena = entre(frame, m.ensenas - s(0.2), m.ensenas + s(0.8));
  const precision = interpolate(frame, [0, m.muestra, m.ensenas, duracion], [71, 78, 82, 94], { extrapolateRight: "clamp" });

  const video = { x: VIDEO.x, y: interpolate(baja, [0, 1], [VIDEO.y, YO.y - 230]) };
  // Tu perfil se ajusta cuando te frenás a mirar algo.
  const ajuste = PERFIL.map((v, k) => v + ensena * (k === 2 ? 0.4 : k === 5 ? -0.08 : 0.04 * Math.sin(k)));

  return (
    <Escena name="Recomienda">
      <Sfx efecto="pop" desde={m.encanto} volumen={0.25} />
      <Sfx efecto="whoosh" desde={m.muestra} volumen={0.25} />
      <Sfx efecto="ding" desde={m.muestra + s(0.7)} volumen={0.3} />
      <Sfx efecto="tap" desde={m.frenas} volumen={0.4} />
      <Sfx efecto="brillo" desde={m.ensenas} volumen={0.3} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {PARECIDOS.map((p, k) => {
          const e = resorte(frame, fps, 4 + k * 3, { damping: 14 });
          // Corazones que suben de cada persona parecida.
          const t = (frame - m.encanto - k * 4) / s(1.2);
          return (
            <g key={k}>
              <line x1={p.x} y1={p.y + 30} x2={VIDEO.x} y2={VIDEO.y - 160} stroke={COLOR.verde} strokeWidth={2} opacity={0.3 * entraVideo * (1 - baja)} />
              <Persona x={p.x} y={p.y + flotar(frame, 140, 4, k)} r={40 * e} color={COLOR.verde} />
              {t > 0 && t < 1 ? <Corazon x={p.x + 30 * Math.sin(t * 6 + k)} y={p.y - 50 - t * 150} tamano={34 + 10 * random(`c${k}`)} opacidad={Math.sin(Math.PI * t)} /> : null}
            </g>
          );
        })}
        <g opacity={entraVideo}>
          <TarjetaVideo x={video.x} y={video.y} escala={0.6 + 0.4 * entraVideo - 0.15 * baja} frame={frame} play={1 - frena} />
          {/* Rayas de velocidad mientras baja */}
          {baja > 0 && baja < 1
            ? [0, 1, 2].map((k) => <line key={k} x1={video.x - 60 + k * 60} x2={video.x - 60 + k * 60} y1={video.y - 200} y2={video.y - 320} stroke="#fff" strokeWidth={4} opacity={0.4 * Math.sin(Math.PI * baja)} />)
            : null}
        </g>
        <Avatar x={YO.x} y={YO.y + flotar(frame, 160, 4)} r={70} anillo={precision / 100} brillo={llega * (1 - entre(frame, m.muestra + s(1.4), m.muestra + s(2))) + frena} />
        {/* Te frenás: ícono de pausa sobre el video */}
        {frena > 0 ? (
          <g transform={`translate(${video.x} ${video.y + 20}) scale(${0.8 + 0.2 * frena})`} opacity={frena * (1 - ensena * 0.6)}>
            <rect x={-26} y={-30} width={16} height={60} rx={4} fill="#fff" />
            <rect x={10} y={-30} width={16} height={60} rx={4} fill="#fff" />
          </g>
        ) : null}
        {/* Dato que vuelve a tu perfil */}
        {ensena > 0 && ensena < 1 ? <circle cx={interpolate(ensena, [0, 1], [YO.x + 80, 700])} cy={interpolate(ensena, [0, 1], [YO.y - 40, 960])} r={12} fill={COLOR.verde} /> : null}
      </svg>

      {/* Mini perfil que se ajusta */}
      <div style={{ opacity: entre(frame, m.frenas, m.frenas + s(0.4)) }}>
        <BarrasPerfil x={640} y={900} ancho={240} paso={38} crecer={PERFIL.map(() => 1)} valores={ajuste} etiquetas={false} frame={frame} />
      </div>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: PARECIDOS[6].x, y: PARECIDOS[6].y - 40 }} caja={{ x: PARECIDOS[6].x - 40, y: 380 }} lado="izquierda" texto={T.video} color={COLOR.magenta} aparece={m.encanto + s(0.3)} desaparece={m.muestra} tamano={24} />
        <HudEtiqueta ancla={{ x: YO.x - 80, y: YO.y }} caja={{ x: 90, y: YO.y - 120 }} texto={T.vos} color={COLOR.verde} aparece={m.muestra + s(0.6)} tamano={24} />
        <HudEtiqueta ancla={{ x: 760, y: 900 }} caja={{ x: 640, y: 830 }} texto={T.aprende} color={COLOR.verde} aparece={m.ensenas + s(0.2)} tamano={22} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={precision} unidad="%" color={COLOR.verde} aparece={s(0.2)} />
    </Escena>
  );
};
