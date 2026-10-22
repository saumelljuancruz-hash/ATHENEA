import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Bucle, Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { colorTemp } from "../componentes/Microondas";
import { TEXTOS } from "../guion-microondas";
import { MarcasMicroondas } from "../linea-microondas";

export type PropsPuntosCalientes = { marcas: MarcasMicroondas["puntosCalientes"]; duracion: number };

/** Interior visto desde arriba. */
const CENTRO = { x: 505, y: 790 };
const CAVIDAD = { ancho: 800, alto: 700 };
const RADIO = 230;
const ANILLOS = 9;
const SECTORES = 30;

/** Ondas estacionarias: manchas calientes fijas (relativas al centro). */
const CALIENTES = [
  { x: -95, y: -70, s: 95, w: 1 },
  { x: 120, y: 95, s: 90, w: 0.95 },
  { x: 150, y: -150, s: 85, w: 0.8 },
  { x: -175, y: 150, s: 85, w: 0.75 },
  { x: -260, y: -240, s: 95, w: 0.9 },
  { x: 290, y: 250, s: 90, w: 0.8 },
  { x: 300, y: -60, s: 70, w: 0.6 },
];
/** Punto frío marcado (dentro de la comida). */
const FRIO = { x: 40, y: -10 };

const calorEn = (x: number, y: number) => {
  let h = 0;
  for (const c of CALIENTES) h += c.w * Math.exp(-((x - c.x) ** 2 + (y - c.y) ** 2) / (c.s * c.s));
  return Math.min(1.2, h);
};

const CELDAS = Array.from({ length: ANILLOS * SECTORES }, (_, i) => {
  const a = i % SECTORES;
  const r = Math.floor(i / SECTORES);
  return {
    r0: (r / ANILLOS) * RADIO,
    r1: ((r + 1) / ANILLOS) * RADIO,
    a0: (a / SECTORES) * 2 * Math.PI,
    a1: ((a + 1) / SECTORES) * 2 * Math.PI,
  };
});

const sector = (r0: number, r1: number, a0: number, a1: number) => {
  const p = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
  return r0 < 1
    ? `M0,0 L${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} Z`
    : `M${p(r0, a0)} L${p(r1, a0)} A${r1},${r1} 0 0 1 ${p(r1, a1)} L${p(r0, a1)} A${r0},${r0} 0 0 0 ${p(r0, a0)} Z`;
};

export const PuntosCalientes: React.FC<PropsPuntosCalientes> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.puntosCalientes;
  const s = (seg: number) => seg * fps;

  const inicioGiro = m.porEso;
  // Ángulo del plato: quieto hasta "Por eso…", después acelera (varias vueltas antes del corte).
  const giroEn = (f: number) => {
    const t = Math.max(0, (f - inicioGiro) / fps);
    return 4.2 * t * t * (t < 0.6 ? 1 : 0) + (t >= 0.6 ? 4.2 * 0.36 + 5 * (t - 0.6) : 0);
  };

  // Temperatura de cada celda: suma del calor recibido en su posición, frame a frame.
  const temps: number[] = new Array(CELDAS.length).fill(0);
  for (let f = s(0.3); f <= frame; f++) {
    const giro = giroEn(f);
    CELDAS.forEach((c, i) => {
      const r = (c.r0 + c.r1) / 2;
      const a = (c.a0 + c.a1) / 2 + giro;
      temps[i] += calorEn(Math.cos(a) * r, Math.sin(a) * r);
    });
  }

  // Referencia: lo que acumula el punto más caliente hasta que empieza a girar.
  const ref = Math.max(1, (Math.min(frame, inicioGiro) - s(0.3)) * 0.85 + Math.max(0, frame - inicioGiro) * 0.5);
  const media = temps.reduce((a, b) => a + b, 0) / temps.length;
  const mezcla = 0.92 * entre(frame, inicioGiro + s(0.2), duracion - s(0.1), Easing.inOut(Easing.quad));
  const mostradas = temps.map((t) => (t + (media - t) * mezcla) / ref);
  const diferencia = (Math.max(...mostradas) - Math.min(...mostradas)) * 70;
  const rot = giroEn(frame);

  const verMapa = entre(frame, m.igual - s(0.4), m.igual + s(0.4));
  const pCaliente = { x: CENTRO.x + CALIENTES[0].x, y: CENTRO.y + CALIENTES[0].y };
  const pFrio = { x: CENTRO.x + FRIO.x, y: CENTRO.y + FRIO.y };
  const pBorde = { x: CENTRO.x + Math.cos(rot + 0.6) * (RADIO + 22), y: CENTRO.y + Math.sin(rot + 0.6) * (RADIO + 22) };

  return (
    <Escena name="PuntosCalientes">
      <Bucle efecto="microondas" desde={0} duracion={duracion} volumen={0.12} />
      <Sfx efecto="burbujeo" desde={m.calientes + s(0.2)} volumen={0.2} />

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="pcCaliente">
            <stop offset="0%" stopColor="#ff3b2f" stopOpacity={0.85} />
            <stop offset="55%" stopColor={COLOR.naranjaCalor} stopOpacity={0.35} />
            <stop offset="100%" stopColor={COLOR.naranjaCalor} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="pcMetal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4d525b" />
            <stop offset="100%" stopColor="#2c2f35" />
          </linearGradient>
          <filter id="pcSombra" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="14" dy="26" stdDeviation="18" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>
        <g transform={`translate(${CENTRO.x + flotar(frame, 260, 4)} ${CENTRO.y + flotar(frame, 220, 3)})`}>
          {/* Cavidad desde arriba */}
          <rect x={-CAVIDAD.ancho / 2 - 22} y={-CAVIDAD.alto / 2 - 22} width={CAVIDAD.ancho + 44} height={CAVIDAD.alto + 44} rx={30} fill="#3a3d44" filter="url(#pcSombra)" />
          <rect x={-CAVIDAD.ancho / 2} y={-CAVIDAD.alto / 2} width={CAVIDAD.ancho} height={CAVIDAD.alto} rx={14} fill="url(#pcMetal)" />
          {/* Mapa de calor: manchas fijas sobre fondo frío */}
          <g opacity={verMapa}>
            <rect x={-CAVIDAD.ancho / 2} y={-CAVIDAD.alto / 2} width={CAVIDAD.ancho} height={CAVIDAD.alto} rx={14} fill={COLOR.azul} opacity={0.28} />
            {CALIENTES.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.s * 1.9} fill="url(#pcCaliente)" opacity={c.w * (0.85 + 0.15 * Math.sin(frame / 7 + i))} />
            ))}
          </g>
          {/* Plato giratorio + comida (cada celda con su temperatura) */}
          <g transform={`rotate(${(rot * 180) / Math.PI})`}>
            <circle cx={0} cy={0} r={RADIO + 30} fill="#cfd3d9" opacity={0.92} />
            <circle cx={0} cy={0} r={RADIO + 30} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={4} />
            {CELDAS.map((c, i) => (
              <path key={i} d={sector(c.r0, c.r1, c.a0, c.a1)} fill={colorTemp(mostradas[i])} stroke={colorTemp(mostradas[i])} strokeWidth={0.6} />
            ))}
            <circle cx={0} cy={0} r={RADIO} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
            <line x1={0} y1={-RADIO - 26} x2={0} y2={-RADIO - 8} stroke="#5d626c" strokeWidth={6} strokeLinecap="round" />
          </g>
        </g>
      </svg>

      <AbsoluteFill>
        <HudEtiqueta ancla={pCaliente} caja={{ x: pCaliente.x - 40, y: 360 }} lado="izquierda" texto={T.caliente} color={COLOR.naranjaCalor} aparece={m.calientes} desaparece={inicioGiro} />
        <HudEtiqueta ancla={pFrio} caja={{ x: pFrio.x + 120, y: 1205 }} texto={T.frio} color={COLOR.azul} aparece={m.frios} desaparece={inicioGiro} />
        <HudEtiqueta ancla={pBorde} caja={{ x: 640, y: 1205 }} texto={T.girando} color={COLOR.verde} aparece={inicioGiro + s(0.15)} desaparece={duracion - s(0.55)} />
        <HudEtiqueta ancla={{ x: CENTRO.x, y: CENTRO.y }} caja={{ x: 560, y: 1205 }} texto={T.parejo} color={COLOR.verde} aparece={duracion - s(0.5)} />
      </AbsoluteFill>

      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={diferencia}
        unidad="°C"
        color={diferencia > 25 ? COLOR.naranjaCalor : COLOR.verde}
        aparece={m.igual}
      />
    </Escena>
  );
};
