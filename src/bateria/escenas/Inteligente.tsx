import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { TEXTOS } from "../guion-bateria";
import { MarcasBateria } from "../linea-bateria";

export type PropsInteligente = { marcas: MarcasBateria["inteligente"]; duracion: number };

// Gráfico: de 23:00 a 07:00 (8 h) en el eje X, carga % en el eje Y.
const G = { x: 110, y: 470, ancho: 800, alto: 560 };
const HORAS = 8;
const aX = (h: number) => G.x + (h / HORAS) * G.ancho;
const aY = (pct: number) => G.y + G.alto - (pct / 100) * G.alto;

/** Carga según la hora (0 = 23:00): sube a 80, espera, y completa antes de las 07:00. */
const curva = (h: number) => {
  if (h < 1.5) return interpolate(h, [0, 1.5], [30, 80], { easing: Easing.out(Easing.quad) });
  if (h < 6.9) return 80;
  return interpolate(h, [6.9, 7.6], [80, 100], { extrapolateRight: "clamp" });
};

const reloj = (h: number) => {
  const min = Math.floor((23 * 60 + h * 60) % (24 * 60));
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
};

/** Campanita de alarma. */
const Campana: React.FC<{ x: number; y: number; vibra: number }> = ({ x, y, vibra }) => (
  <g transform={`translate(${x} ${y}) rotate(${vibra * 18})`}>
    <path d="M-30 18 C -30 -30 -22 -40 0 -40 C 22 -40 30 -30 30 18 L 38 28 L -38 28 Z" fill={COLOR.naranja} />
    <circle cx={0} cy={36} r={8} fill={COLOR.naranja} />
    <rect x={-5} y={-50} width={10} height={12} rx={4} fill={COLOR.naranja} />
  </g>
);

export const Inteligente: React.FC<PropsInteligente> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.inteligente;
  const s = (seg: number) => seg * fps;

  // El cursor recorre la noche al ritmo de la voz.
  const h = interpolate(frame, [0, m.ochenta, m.alarma - s(0.4), duracion], [0, 1.5, 7.6, 8], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const pct = curva(h);
  const aprende = entre(frame, m.aprenden, m.aprenden + s(0.8));
  const suena = h >= 7.6 ? Math.sin(frame * 1.3) * (1 - entre(frame, m.alarma + s(1.4), m.alarma + s(2))) : 0;
  const entrada = resorte(frame, fps, 2, { damping: 16 });

  const pasos = 120;
  const linea = Array.from({ length: pasos + 1 }, (_, i) => {
    const hh = (i / pasos) * h;
    return `${i ? "L" : "M"}${aX(hh).toFixed(1)},${aY(curva(hh)).toFixed(1)}`;
  }).join("");
  const area = `${linea} L${aX(h).toFixed(1)},${aY(0)} L${aX(0)},${aY(0)} Z`;

  return (
    <Escena name="Inteligente">
      <Sfx efecto="pop" desde={m.ochenta} volumen={0.25} />
      <Sfx efecto="ding" desde={m.alarma} volumen={0.35} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: entrada }}>
        <defs>
          <linearGradient id="areaCarga" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={COLOR.verde} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLOR.verde} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={G.x - 40} y={G.y - 70} width={G.ancho + 80} height={G.alto + 160} rx={24} fill="rgba(8,9,11,0.55)" stroke="rgba(255,255,255,0.08)" />
        {/* Grilla */}
        {[0, 20, 40, 60, 80, 100].map((p) => (
          <g key={p}>
            <line x1={G.x} x2={G.x + G.ancho} y1={aY(p)} y2={aY(p)} stroke={p === 80 ? COLOR.naranja : "rgba(255,255,255,0.08)"} strokeDasharray={p === 80 ? "8 8" : undefined} strokeWidth={p === 80 ? 2 : 1} opacity={p === 80 ? 0.6 : 1} />
            <text x={G.x - 12} y={aY(p) + 7} textAnchor="end" fill={COLOR.textoSuave} fontFamily={FUENTE.mono} fontSize={18}>
              {p}
            </text>
          </g>
        ))}
        {[0, 2, 4, 6, 8].map((hh) => (
          <text key={hh} x={aX(hh)} y={G.y + G.alto + 40} textAnchor="middle" fill={COLOR.textoSuave} fontFamily={FUENTE.mono} fontSize={20}>
            {reloj(hh)}
          </text>
        ))}
        {/* Lo que aprendió: a qué hora sonó la alarma las noches anteriores */}
        {Array.from({ length: 6 }, (_, k) => {
          const a = entre(frame, m.aprenden + k * 5, m.aprenden + k * 5 + 14);
          return <circle key={k} cx={aX(8) - 8 + (k % 2) * 6} cy={aY(18 + k * 9)} r={7} fill={COLOR.naranja} opacity={a * 0.7} />;
        })}
        <rect x={aX(7.7)} y={G.y} width={aX(8) - aX(7.7)} height={G.alto} fill={COLOR.naranja} opacity={0.1 * aprende} />
        <path d={area} fill="url(#areaCarga)" />
        <path d={linea} fill="none" stroke={COLOR.verde} strokeWidth={6} strokeLinejoin="round" />
        {/* Cursor */}
        <line x1={aX(h)} x2={aX(h)} y1={G.y} y2={G.y + G.alto} stroke="#fff" strokeOpacity={0.25} strokeWidth={2} />
        <circle cx={aX(h)} cy={aY(pct)} r={14} fill={COLOR.verde} stroke="#fff" strokeWidth={4} />
        <circle cx={aX(h)} cy={aY(pct)} r={14 + ((frame % 40) / 40) * 26} fill="none" stroke={COLOR.verde} strokeWidth={3} opacity={1 - (frame % 40) / 40} />
        <Campana x={aX(8) - 4} y={G.y - 110} vibra={suena} />
      </svg>

      {/* Hora del cursor */}
      <div style={{ position: "absolute", left: aX(h), top: G.y + G.alto + 64, translate: "-50% 0", fontFamily: FUENTE.mono, fontWeight: 700, fontSize: 30, color: COLOR.texto, background: "rgba(8,9,11,0.85)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "4px 12px", opacity: entrada }}>
        {reloj(h)}
      </div>

      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: aX(3.5), y: aY(80) }} caja={{ x: aX(2.2), y: aY(80) - 130 }} texto={T.pausa} color={COLOR.naranja} aparece={m.ochenta + s(0.2)} tamano={24} />
        <HudEtiqueta ancla={{ x: aX(8) - 30, y: G.y - 110 }} caja={{ x: aX(8) - 60, y: G.y - 170 }} lado="izquierda" texto={T.alarma} color={COLOR.naranja} aparece={m.alarma} tamano={24} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={pct} unidad="%" color={COLOR.verde} aparece={s(0.2)} />
    </Escena>
  );
};
