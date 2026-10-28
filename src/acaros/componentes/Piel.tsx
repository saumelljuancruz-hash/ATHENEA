import React from "react";
import { random } from "remotion";
import { COLOR, FUENTE } from "../../comun/tema";

/**
 * Ácaro Demodex (vista de arriba): cabeza chiquita, 4 pares de patitas cortas
 * adelante y un cuerpo largo y anillado. Mide 200 px de largo con escala 1 (cabeza arriba).
 */
export const Acaro: React.FC<{
  x: number;
  y: number;
  escala?: number;
  rot?: number;
  frame: number;
  camina?: number;
  brillo?: number;
  opacidad?: number;
}> = ({ x, y, escala = 1, rot = 0, frame, camina = 0, brillo = 0, opacidad = 1 }) => {
  // Movimiento secundario: cada ácaro se balancea, "respira" y mueve las patitas a su ritmo,
  // con períodos irregulares para que no parezca un loop mecánico.
  const semilla = (x * 7 + y * 3) % 100;
  const balanceo = 3 * Math.sin(frame / 17 + semilla) + 1.5 * Math.sin(frame / 7.3 + semilla * 2);
  const respira = 1 + 0.035 * Math.sin(frame / 11 + semilla);
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rot + balanceo}) scale(${escala * respira} ${escala / respira})`}
      opacity={opacidad}
    >
      <defs>
        <linearGradient id="cuerpoAcaro" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfae8a" />
          <stop offset="45%" stopColor="#f1e6cf" />
          <stop offset="100%" stopColor="#a8976f" />
        </linearGradient>
      </defs>
      {brillo > 0 ? <ellipse cx={0} cy={0} rx={60} ry={130} fill={COLOR.verde} opacity={0.18 * brillo} /> : null}
      {/* Patitas: 4 pares */}
      {[0, 1, 2, 3].map((k) =>
        [-1, 1].map((l) => {
          const a =
            (camina * 22 + 4) * Math.sin(frame / (4 + (1 - camina) * 5) + k * 1.3 + (l > 0 ? Math.PI : 0) + semilla);
          return (
            <line
              key={`${k}${l}`}
              x1={l * 16}
              y1={-62 + k * 13}
              x2={l * 36}
              y2={-58 + k * 13}
              stroke="#d9cba9"
              strokeWidth={6}
              strokeLinecap="round"
              transform={`rotate(${l * (a - 10 + k * 8)} ${l * 16} ${-62 + k * 13})`}
            />
          );
        }),
      )}
      {/* Cuerpo */}
      <path
        d="M 0 -96 C 12 -96 16 -86 18 -74 C 24 -50 22 -20 18 10 C 14 50 8 80 0 100 C -8 80 -14 50 -18 10 C -22 -20 -24 -50 -18 -74 C -16 -86 -12 -96 0 -96 Z"
        fill="url(#cuerpoAcaro)"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth={2}
      />
      {Array.from({ length: 16 }, (_, k) => {
        const yy = -12 + k * 6.5;
        const w = 18 * (1 - (k / 16) * 0.85);
        return (
          <path key={k} d={`M ${-w} ${yy} Q 0 ${yy + 3} ${w} ${yy}`} fill="none" stroke="#a8976f" strokeWidth={1.6} />
        );
      })}
      {/* Cabeza: tantea para los costados */}
      <path
        d="M -8 -96 Q 0 -110 8 -96"
        fill="#d9cba9"
        stroke="rgba(0,0,0,0.3)"
        strokeWidth={1.5}
        transform={`rotate(${8 * Math.sin(frame / 13 + semilla)} 0 -96)`}
      />
    </g>
  );
};

/** Molécula de melatonina estilizada (anillos y cadena), para "la hormona del sueño". */
export const Melatonina: React.FC<{ x: number; y: number; escala?: number; opacidad?: number }> = ({
  x,
  y,
  escala = 1,
  opacidad = 1,
}) => {
  const hex = (cx: number, cy: number) =>
    Array.from({ length: 6 }, (_, k) => {
      const a = (Math.PI / 3) * k + Math.PI / 6;
      return `${k ? "L" : "M"}${(cx + 20 * Math.cos(a)).toFixed(1)},${(cy + 20 * Math.sin(a)).toFixed(1)}`;
    }).join("") + "Z";
  return (
    <g
      transform={`translate(${x} ${y}) scale(${escala})`}
      opacity={opacidad}
      fill="none"
      stroke="#9fb7ff"
      strokeWidth={4}
      strokeLinejoin="round"
    >
      <path d={hex(0, 0)} />
      <path d={`M 17 -10 L 38 -18 L 46 2 L 30 16 L 17 10`} />
      <path d="M -17 10 L -34 20 L -50 10" />
      <circle cx={-50} cy={10} r={4} fill="#9fb7ff" />
      <circle cx={46} cy={2} r={4} fill="#9fb7ff" />
    </g>
  );
};

/** Piel vista de arriba: textura, poros y ácaros que salen de ellos. `noche` 0..1 la enfría. */
export const SuperficiePiel: React.FC<{
  noche?: number;
  poros: { x: number; y: number }[];
  rojo?: number;
  children?: React.ReactNode;
}> = ({ noche = 0, poros, rojo = 0, children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="poro">
        <stop offset="0%" stopColor="#120b0b" />
        <stop offset="60%" stopColor="#2a1a1a" />
        <stop offset="100%" stopColor="#2a1a1a" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={1080} height={1920} fill="#5a4444" />
    <rect width={1080} height={1920} fill="#1c2340" opacity={0.65 * noche} />
    <rect width={1080} height={1920} fill={COLOR.rojo} opacity={0.28 * rojo} />
    {/* Surcos de la piel */}
    {Array.from({ length: 40 }, (_, k) => {
      const x0 = random(`sx${k}`) * 1080;
      const y0 = random(`sy${k}`) * 1920;
      return (
        <path
          key={k}
          d={`M ${x0} ${y0} l ${60 + random(`sl${k}`) * 120} ${-30 + random(`sa${k}`) * 60} l ${40 + random(`sb${k}`) * 80} ${-40 + random(`sc${k}`) * 80}`}
          fill="none"
          stroke="#3e2d2d"
          strokeWidth={3}
          opacity={0.6}
        />
      );
    })}
    {poros.map((p, k) => (
      <g key={k}>
        <ellipse cx={p.x} cy={p.y} rx={46} ry={40} fill="url(#poro)" />
        <ellipse cx={p.x} cy={p.y} rx={20} ry={17} fill="#0d0808" />
      </g>
    ))}
    {children}
  </svg>
);

/** Corte de la piel: superficie, folículos con su pelo y glándulas de grasa. */
export const CortePiel: React.FC<{ foliculos: number[]; glandula?: number; children?: React.ReactNode }> = ({
  foliculos,
  glandula = 0,
  children,
}) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="dermis" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4a3434" />
        <stop offset="100%" stopColor="#241a1c" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="#16171a" />
    <rect x={0} y={520} width={1080} height={1400} fill="url(#dermis)" />
    <rect x={0} y={520} width={1080} height={50} fill="#6e5050" />
    {foliculos.map((fx, k) => (
      <g key={k}>
        <path
          d={`M ${fx - 46} 520 Q ${fx - 50} 900 ${fx - 30} 1240 Q ${fx} 1290 ${fx + 30} 1240 Q ${fx + 50} 900 ${fx + 46} 520 Z`}
          fill="#1a1112"
          stroke="#6e5050"
          strokeWidth={3}
        />
        {/* Glándulas de grasa a los costados */}
        {[-1, 1].map((l) => (
          <ellipse
            key={l}
            cx={fx + l * 88}
            cy={780}
            rx={44}
            ry={70}
            fill="#e8c45a"
            opacity={0.25 + 0.5 * glandula}
            stroke="#e8c45a"
            strokeOpacity={0.6}
            strokeWidth={2}
          />
        ))}
        {/* Pelo */}
        <path
          d={`M ${fx} 1250 L ${fx + 6} 520 L ${fx + 60} 160`}
          fill="none"
          stroke="#2c1d17"
          strokeWidth={16}
          strokeLinecap="round"
        />
      </g>
    ))}
    {children}
  </svg>
);

/** Raíz de la pestaña `k` (sobre el borde del párpado). */
export const raizPestana = (k: number) => {
  const bx = 60 + k * 120;
  return { x: bx, y: 1100 - 240 * Math.sin((Math.PI * bx) / 1080) * 0.95 };
};

/** Borde del párpado con pestañas (de costado), en primer plano. `detras` se dibuja debajo del párpado. */
export const Pestanas: React.FC<{ frame: number; detras?: React.ReactNode; children?: React.ReactNode }> = ({
  frame,
  detras,
  children,
}) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <rect width={1080} height={1920} fill="#16171a" />
    {detras}
    <path d="M -50 1100 Q 540 860 1130 1100 L 1130 1920 L -50 1920 Z" fill="#5a4444" />
    <path d="M -50 1100 Q 540 860 1130 1100" fill="none" stroke="#8a6464" strokeWidth={20} />
    {Array.from({ length: 9 }, (_, k) => {
      const bx = 60 + k * 120;
      const by = 1100 - 240 * Math.sin((Math.PI * bx) / 1080) * 0.95;
      const sway = 4 * Math.sin(frame / 40 + k);
      return (
        <path
          key={k}
          d={`M ${bx} ${by} Q ${bx + 30 + sway} ${by - 260} ${bx + 120 + sway} ${by - 420}`}
          fill="none"
          stroke="#1a110d"
          strokeWidth={14}
          strokeLinecap="round"
        />
      );
    })}
    {children}
  </svg>
);

/** Perfil de una cara dormida (silueta), mirando a la derecha. */
export const Rostro: React.FC<{ x: number; y: number; escala?: number; frame: number }> = ({
  x,
  y,
  escala = 1,
  frame,
}) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <path
      d="M -200 -360 C -40 -420 150 -330 170 -150 C 175 -110 210 -70 220 -20 C 225 0 200 10 190 20 C 200 50 195 70 180 80 C 190 100 180 130 160 140 C 160 200 120 240 40 250 C -40 260 -120 300 -200 360 Z"
      fill="#2b2e35"
      stroke="#4a4e57"
      strokeWidth={4}
    />
    {/* Ojo cerrado con pestañas */}
    <path d="M 70 -110 Q 105 -90 140 -110" fill="none" stroke="#9aa0a8" strokeWidth={6} strokeLinecap="round" />
    {[0, 1, 2, 3].map((k) => (
      <line
        key={k}
        x1={80 + k * 18}
        y1={-100}
        x2={74 + k * 20}
        y2={-82}
        stroke="#9aa0a8"
        strokeWidth={4}
        strokeLinecap="round"
      />
    ))}
    {/* Respiración: "z" del sueño */}
    <text
      x={210}
      y={-180 - 10 * Math.sin(frame / 20)}
      fill="#9fb7ff"
      fontFamily={FUENTE.inter}
      fontWeight={800}
      fontSize={44}
      opacity={0.7}
    >
      z
    </text>
    <text
      x={250}
      y={-230 - 10 * Math.sin(frame / 20 + 1)}
      fill="#9fb7ff"
      fontFamily={FUENTE.inter}
      fontWeight={800}
      fontSize={30}
      opacity={0.5}
    >
      z
    </text>
  </g>
);

/** Poros fijos para las vistas de superficie. */
export const POROS = Array.from({ length: 14 }, (_, k) => ({
  x: 130 + (k % 4) * 270 + (Math.floor(k / 4) % 2) * 120,
  y: 380 + Math.floor(k / 4) * 330,
}));
