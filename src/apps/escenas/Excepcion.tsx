import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { TarjetaApp } from "../componentes/Apps";
import { APPS, TEXTOS } from "../guion-apps";
import { MarcasApps } from "../linea-apps";

export type PropsExcepcion = { marcas: MarcasApps["excepcion"]; duracion: number };

/** Pin de GPS con anillos (la app usando la ubicación de fondo). */
const PinGps: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g transform={`translate(${x} ${y})`}>
    {[0, 1, 2].map((k) => {
      const a = ((frame + k * 14) % 42) / 42;
      return <circle key={k} cy={10} r={30 + a * 140} fill="none" stroke={COLOR.azul} strokeWidth={5} opacity={1 - a} />;
    })}
    <path d="M0 40 C -30 0 -50 -25 -50 -50 A 50 50 0 1 1 50 -50 C 50 -25 30 0 0 40 Z" fill={COLOR.azul} />
    <circle cy={-50} r={18} fill="#fff" />
  </g>
);

export const Excepcion: React.FC<PropsExcepcion> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.excepcion;
  const s = (seg: number) => seg * fps;

  const trabada = entre(frame, m.trabo - s(0.2), m.trabo + s(0.2));
  const tiembla = trabada * Math.sin(frame * 1.9) * 8;
  const cierra = entre(frame, m.cerrala, m.cerrala + s(0.45));
  const check = resorte(frame, fps, m.cerrala + s(0.3), { damping: 10 });
  const bateria = interpolate(frame, [m.gps, m.cerrala], [64, 57], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const tarjeta = (app: number, extra: React.ReactNode, estado: { trabada?: number }) => (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <g opacity={1 - cierra} transform={`translate(0 ${-cierra * 700})`}>
        <TarjetaApp x={540 + tiembla} y={860 + flotar(frame, 160, 5)} ancho={380} alto={660} app={APPS[app]} frame={frame} trabada={estado.trabada} />
        {extra}
      </g>
    </svg>
  );

  return (
    <Escena name="Excepcion">
      <Sfx efecto="bip" desde={m.trabo} volumen={0.3} />
      <Sfx efecto="ping" desde={m.gps} volumen={0.3} />
      <Sfx efecto="whoosh" desde={m.cerrala} volumen={0.35} />
      <Sfx efecto="ding" desde={m.cerrala + s(0.3)} volumen={0.35} />
      <Planos
        planos={[
          { desde: 0, contenido: tarjeta(4, null, { trabada }) },
          { desde: m.gps - s(0.1), contenido: tarjeta(3, <PinGps x={540} y={880} frame={frame} />, {}) },
        ]}
      />
      <div style={{ position: "absolute", left: 540, top: 860, translate: "-50% -50%", scale: String(check), fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 260, color: COLOR.verde, textShadow: `0 0 60px ${COLOR.verde}88` }}>
        ✓
      </div>
      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: 400, y: 640 }} caja={{ x: 110, y: 470 }} texto={T.trabada} color={COLOR.rojo} aparece={m.trabo + s(0.2)} desaparece={m.gps - s(0.1)} tamano={28} />
        <HudEtiqueta ancla={{ x: 540, y: 800 }} caja={{ x: 110, y: 470 }} texto={T.gps} color={COLOR.azul} aparece={m.gps + s(0.2)} desaparece={m.cerrala} tamano={28} />
        <HudEtiqueta ancla={{ x: 540, y: 760 }} caja={{ x: 110, y: 470 }} texto={T.cerrala} color={COLOR.verde} aparece={m.cerrala + s(0.3)} tamano={28} />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={bateria} unidad="%" color={frame > m.gps && frame < m.cerrala ? COLOR.naranja : COLOR.verde} aparece={s(0.2)} sale={duracion} />
    </Escena>
  );
};
