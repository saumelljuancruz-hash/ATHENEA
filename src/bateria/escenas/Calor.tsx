import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ENTRA_SALE, entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Termometro } from "../../microondas/componentes/Termometro";
import { Pila } from "../componentes/Bateria";
import { TEXTOS } from "../guion-bateria";
import { MarcasBateria } from "../linea-bateria";

export type PropsCalor = { marcas: MarcasBateria["calor"]; duracion: number };

/** Ondas de calor que suben. */
const OndasCalor: React.FC<{ x: number; y: number; ancho: number; frame: number; intensidad: number }> = ({ x, y, ancho, frame, intensidad }) => (
  <g opacity={intensidad}>
    {Array.from({ length: 5 }, (_, k) => {
      const a = ((frame + k * 18) % 90) / 90;
      const cx = x - ancho / 2 + (k + 0.5) * (ancho / 5);
      const yy = y - a * 220;
      return (
        <path
          key={k}
          d={`M ${cx} ${yy} q 14 -20 0 -40 q -14 -20 0 -40`}
          fill="none"
          stroke={COLOR.naranjaCalor}
          strokeWidth={6}
          strokeLinecap="round"
          opacity={Math.sin(Math.PI * a)}
        />
      );
    })}
  </g>
);

/** Almohada (vista de frente). */
const Almohada: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-300 -90 Q -320 0 -300 90 Q 0 120 300 90 Q 320 0 300 -90 Q 0 -120 -300 -90 Z" fill="#d9dce3" />
    <path d="M-300 -90 Q -320 0 -300 90 Q 0 120 300 90 Q 320 0 300 -90 Q 0 -120 -300 -90 Z" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth={4} />
    <path d="M-240 -40 Q 0 -70 240 -40" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={10} strokeLinecap="round" />
  </g>
);

/** Sol con rayos girando. */
const Sol: React.FC<{ x: number; y: number; frame: number; escala: number }> = ({ x, y, frame, escala }) => (
  <g transform={`translate(${x} ${y}) scale(${escala}) rotate(${frame * 0.6})`}>
    {Array.from({ length: 12 }, (_, k) => (
      <rect key={k} x={-8} y={-150} width={16} height={46} rx={8} fill="#ffc94a" transform={`rotate(${k * 30})`} />
    ))}
    <circle r={86} fill="#ffc94a" />
    <circle r={86} fill="none" stroke="#ffe08a" strokeWidth={6} />
  </g>
);

// Barra horizontal 0–100 % de la segunda parte.
const B = { x: 120, y: 860, ancho: 780, alto: 150 };
const bX = (pct: number) => B.x + (pct / 100) * B.ancho;

export const Calor: React.FC<PropsCalor> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.calor;
  const s = (seg: number) => seg * fps;

  // Parte 1: el calor.
  const calor = entre(frame, m.calor - s(0.3), m.calor + s(0.8));
  const almohada = resorte(frame, fps, m.almohada - s(0.15), { damping: 13 });
  const sol = resorte(frame, fps, m.sol - s(0.15), { damping: 12 });
  const temp = interpolate(frame, [m.calor - s(0.3), m.almohada, m.sol + s(0.6), m.cero], [0.25, 0.55, 0.9, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const salud = interpolate(frame, [m.calor, m.cero], [100, 82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Parte 2: la zona feliz.
  const cambio = entre(frame, m.cero - s(0.5), m.cero + s(0.1), ENTRA_SALE);
  const rango = entre(frame, m.rango - s(0.2), m.rango + s(0.6));
  const nivel =
    rango > 0
      ? interpolate(rango, [0, 1], [0, 50 + 26 * Math.sin((frame - m.rango) / 34)])
      : interpolate(frame, [m.cero - s(0.4), m.cero + s(0.8)], [60, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cero = nivel < 3 && rango < 0.5;

  const pila = { x: 470, y: 790 + flotar(frame, 160, 6) };

  return (
    <Escena name="Calor">
      <Sfx efecto="estirar" desde={m.calor} volumen={0.25} />
      <Sfx efecto="pop" desde={m.almohada} volumen={0.3} />
      <Sfx efecto="brillo" desde={m.sol} volumen={0.3} />
      <Sfx efecto="bip" desde={m.cero} volumen={0.25} />
      <Sfx efecto="ding" desde={m.rango} volumen={0.3} />

      {/* Parte 1 */}
      <AbsoluteFill style={{ opacity: 1 - cambio, scale: String(1 + 0.08 * cambio) }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 45% 42%, ${COLOR.naranjaCalor}${Math.round(40 * temp).toString(16).padStart(2, "0")}, transparent 60%)` }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Sol x={820} y={interpolate(sol, [0, 1], [-200, 380])} frame={frame} escala={0.9} />
          <OndasCalor x={pila.x} y={pila.y - 330} ancho={320} frame={frame} intensidad={calor} />
          <Pila x={pila.x} y={pila.y} alto={600} nivel={0.8} frame={frame} calor={calor} porcentaje={false} />
          <g opacity={almohada > 0.02 ? 1 : 0}>
            <Almohada x={pila.x} y={interpolate(almohada, [0, 1], [-200, pila.y - 170])} />
          </g>
        </svg>
        <Termometro x={790} y={620} alto={360} t={temp} min={20} max={50} etiqueta="TEMP" />
        <AbsoluteFill>
          <HudEtiqueta ancla={{ x: pila.x - 200, y: pila.y - 170 }} caja={{ x: 90, y: 330 }} texto={T.almohada} color={COLOR.naranjaCalor} aparece={m.almohada + s(0.2)} desaparece={m.cero - s(0.5)} tamano={24} />
          <HudEtiqueta ancla={{ x: 790, y: 470 }} caja={{ x: 800, y: 520 }} texto={T.sol} color="#ffc94a" aparece={m.sol + s(0.3)} desaparece={m.cero - s(0.5)} tamano={24} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Parte 2: barra de 0 a 100 % con la zona feliz */}
      <AbsoluteFill style={{ opacity: cambio }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <rect x={bX(20)} y={B.y - 40} width={bX(80) - bX(20)} height={B.alto + 80} rx={20} fill={COLOR.verde} opacity={0.14 * rango} />
          <rect x={bX(20)} y={B.y - 40} width={bX(80) - bX(20)} height={B.alto + 80} rx={20} fill="none" stroke={COLOR.verde} strokeWidth={3} strokeDasharray="10 8" opacity={rango} />
          <rect x={B.x - 14} y={B.y - 14} width={B.ancho + 28} height={B.alto + 28} rx={36} fill="#2a2d33" stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
          <rect x={B.x + B.ancho + 14} y={B.y + 40} width={26} height={B.alto - 80} rx={8} fill="#4a4e57" />
          <rect x={B.x} y={B.y} width={B.ancho} height={B.alto} rx={24} fill="#101114" />
          <rect x={B.x + 6} y={B.y + 6} width={Math.max(0, (B.ancho - 12) * (nivel / 100))} height={B.alto - 12} rx={20} fill={nivel < 20 ? COLOR.rojo : COLOR.verde} />
          {[0, 20, 80, 100].map((p) => (
            <g key={p}>
              <line x1={bX(p)} x2={bX(p)} y1={B.y + B.alto + 24} y2={B.y + B.alto + 44} stroke={COLOR.textoSuave} strokeWidth={3} />
              <text x={bX(p)} y={B.y + B.alto + 82} textAnchor="middle" fill={p === 20 || p === 80 ? COLOR.verde : COLOR.textoSuave} fontFamily={FUENTE.mono} fontWeight={700} fontSize={28}>
                {p}%
              </text>
            </g>
          ))}
          {cero ? (
            <g transform={`translate(${bX(0) + 70} ${B.y + B.alto / 2})`} opacity={0.6 + 0.4 * Math.sin(frame / 4)}>
              <line x1={-26} y1={-26} x2={26} y2={26} stroke={COLOR.rojo} strokeWidth={10} strokeLinecap="round" />
              <line x1={26} y1={-26} x2={-26} y2={26} stroke={COLOR.rojo} strokeWidth={10} strokeLinecap="round" />
            </g>
          ) : null}
        </svg>
        <div style={{ position: "absolute", left: 0, right: 150, top: 470, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 120, color: nivel < 20 ? COLOR.rojo : COLOR.texto }}>
          {Math.round(nivel)}%
        </div>
        <AbsoluteFill>
          <HudEtiqueta ancla={{ x: bX(50), y: B.y - 40 }} caja={{ x: bX(50) + 40, y: B.y - 160 }} texto={T.rango} color={COLOR.verde} aparece={m.rango + s(0.3)} tamano={26} />
        </AbsoluteFill>
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={salud} unidad="%" color={calor > 0.5 && cambio < 0.5 ? COLOR.naranjaCalor : COLOR.verde} aparece={m.calor} />
    </Escena>
  );
};
