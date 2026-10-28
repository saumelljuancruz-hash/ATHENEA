import React from "react";
import { COLOR, FUENTE } from "../../comun/tema";

/** Tic del párpado: ráfagas cortas de temblor cada tanto (irregular, como el de verdad). */
export const ticParpado = (frame: number, fuerza = 1) => {
  const ciclo = (frame + 13) % 74;
  const enRafaga = ciclo < 28 && frame % 151 < 120;
  return enRafaga ? fuerza * Math.max(0, Math.sin(frame * 2.6)) * (0.6 + 0.4 * Math.sin(frame * 0.9)) : 0;
};

/**
 * Ojo grande (ilustración cálida): piel alrededor, globo, iris, pupila, párpados y el músculo del
 * párpado (anillo de fibras) que se puede mostrar con `musculo` 0..1. `tic` 0..1 hace temblar el
 * párpado de abajo y prende las fibras.
 */
export const OjoGrande: React.FC<{
  x: number;
  y: number;
  tamano: number;
  tic: number;
  musculo: number;
  frame: number;
  piel?: string;
}> = ({ x, y, tamano, tic, musculo, frame, piel = "#e0a77c" }) => {
  const s = tamano / 100;
  const parpadoAbajo = 4 + tic * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={190} ry={150} fill={piel} />
      <ellipse cx={30} cy={20} rx={160} ry={120} fill="#000" opacity={0.04} />
      {/* Músculo del párpado: anillo de fibras */}
      <g opacity={musculo}>
        {Array.from({ length: 36 }, (_, k) => {
          const a = (k / 36) * Math.PI * 2;
          const r1 = 1.0;
          const r2 = 1.35;
          const brillo = tic > 0.2 && k % 3 === frame % 3;
          return (
            <line
              key={k}
              x1={Math.cos(a) * 112 * r1}
              y1={Math.sin(a) * 70 * r1}
              x2={Math.cos(a) * 112 * r2}
              y2={Math.sin(a) * 70 * r2}
              stroke={brillo ? "#ffe14d" : "#ff6f8a"}
              strokeWidth={9}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </g>
      {/* Globo ocular */}
      <ellipse cx={0} cy={0} rx={100} ry={56} fill="#fff" />
      <circle cx={6} cy={2} r={42} fill="#6b4a2e" />
      <circle cx={6} cy={2} r={42} fill="none" stroke="#3a2a22" strokeWidth={4} />
      <circle cx={6} cy={2} r={20} fill="#1b1410" />
      <circle cx={20} cy={-12} r={9} fill="#fff" />
      {/* Párpado de arriba con pestañas */}
      <path d="M -112 -4 Q 0 -96 112 -4 L 112 -70 L -112 -70 Z" fill={piel} />
      <path d="M -104 -8 Q 0 -78 104 -8" fill="none" stroke="#3a2a22" strokeWidth={8} strokeLinecap="round" />
      {Array.from({ length: 7 }, (_, k) => {
        const px = -72 + k * 24;
        const py = -8 - 70 * (1 - (px / 104) ** 2) * 0.62;
        return (
          <line
            key={k}
            x1={px}
            y1={py}
            x2={px + (px / 104) * 10}
            y2={py - 22}
            stroke="#3a2a22"
            strokeWidth={5}
            strokeLinecap="round"
          />
        );
      })}
      {/* Párpado de abajo: el que tiembla */}
      <path d={`M -112 4 Q 0 ${70 - parpadoAbajo} 112 4 L 112 80 L -112 80 Z`} fill={piel} />
      <path
        d={`M -100 8 Q 0 ${62 - parpadoAbajo} 100 8`}
        fill="none"
        stroke="#c98a5a"
        strokeWidth={5}
        strokeLinecap="round"
      />
      {tic > 0.3
        ? [-1, 0, 1].map((k) => (
            <path
              key={k}
              d={`M ${k * 50} ${92 + 4 * Math.sin(frame)} q 8 10 0 20 q -8 10 0 20`}
              fill="none"
              stroke={COLOR.naranja}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={tic}
            />
          ))
        : null}
    </g>
  );
};

/** Escritorio de casa: pared mostaza → durazno, ventana, escritorio con notebook y taza. Notebook en (720, 1030). */
export const Escritorio: React.FC<{ frame: number; children?: React.ReactNode }> = ({ frame, children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <defs>
      <linearGradient id="paredEscritorio" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffe6a8" />
        <stop offset="100%" stopColor="#ffb98f" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#paredEscritorio)" />
    <rect x={120} y={300} width={300} height={340} rx={24} fill="#9fd8ff" stroke="#fff" strokeWidth={14} />
    <ellipse cx={240 + 20 * Math.sin(frame / 90)} cy={400} rx={60} ry={22} fill="#fff" opacity={0.9} />
    {/* Estante con plantas y libros */}
    <rect x={600} y={520} width={360} height={18} rx={9} fill="#c98a5a" />
    {["#ff5a4e", "#4aa3ff", "#3ee0c0", "#ffc94a"].map((c, k) => (
      <rect key={c} x={620 + k * 40} y={420} width={32} height={100} rx={6} fill={c} />
    ))}
    <rect x={820} y={450} width={80} height={70} rx={14} fill="#ff9a3c" />
    <ellipse cx={860} cy={420} rx={22} ry={46} fill="#3fae7a" />
    <rect x={0} y={1300} width={1080} height={620} fill="#d98c62" />
    {/* Escritorio */}
    <rect x={480} y={1080} width={600} height={40} rx={12} fill="#a8683f" />
    <rect x={520} y={1120} width={30} height={200} fill="#8a5432" />
    <rect x={1000} y={1120} width={30} height={200} fill="#8a5432" />
    <path d="M 600 1080 L 640 920 L 860 920 L 830 1080 Z" fill="#3a3d44" />
    <path d="M 612 1070 L 648 932 L 850 932 L 818 1070 Z" fill="#9fd8ff" opacity={0.7 + 0.2 * Math.sin(frame / 12)} />
    {children}
  </svg>
);

/** Taza de café humeante. */
export const Taza: React.FC<{ x: number; y: number; escala?: number; frame: number }> = ({
  x,
  y,
  escala = 1,
  frame,
}) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    {[0, 1, 2].map((k) => (
      <path
        key={k}
        d={`M ${-20 + k * 20} -70 q 10 -15 0 -30 q -10 -15 0 -30`}
        fill="none"
        stroke="#fff"
        strokeWidth={6}
        strokeLinecap="round"
        opacity={0.5 + 0.4 * Math.sin(frame / 8 + k)}
      />
    ))}
    <path d="M -45 -60 L 45 -60 L 35 30 Q 0 45 -35 30 Z" fill="#ffffff" stroke="#e3c7a8" strokeWidth={4} />
    <path d="M 45 -40 q 35 0 35 25 q 0 25 -38 22" fill="none" stroke="#ffffff" strokeWidth={12} />
    <ellipse cx={0} cy={-58} rx={42} ry={8} fill="#6b3d22" />
  </g>
);

/** Nube de tormenta con rayo (estrés). */
export const Tormenta: React.FC<{ x: number; y: number; escala?: number; frame: number }> = ({
  x,
  y,
  escala = 1,
  frame,
}) => (
  <g transform={`translate(${x + 4 * Math.sin(frame / 7)} ${y}) scale(${escala})`}>
    <ellipse cx={-40} cy={0} rx={60} ry={42} fill="#7a7fa8" />
    <ellipse cx={20} cy={-20} rx={70} ry={52} fill="#8a8fba" />
    <ellipse cx={70} cy={6} rx={50} ry={36} fill="#7a7fa8" />
    <path
      d="M 10 30 L -10 80 L 12 80 L -4 130 L 40 66 L 18 66 L 30 30 Z"
      fill="#ffe14d"
      opacity={frame % 30 < 18 ? 1 : 0.3}
    />
  </g>
);

/** Calendario de la semana con un ícono por día. */
export const Semana: React.FC<{ x: number; y: number; dias: number; marcas: string[]; color: string }> = ({
  x,
  y,
  dias,
  marcas,
  color,
}) => (
  <g transform={`translate(${x} ${y})`}>
    {["L", "M", "M", "J", "V", "S", "D"].map((d, k) => (
      <g key={k} transform={`translate(${k * 118} 0)`} opacity={k < dias ? 1 : 0.35}>
        <rect x={-50} y={-70} width={100} height={140} rx={18} fill="#fff" />
        <rect x={-50} y={-70} width={100} height={36} rx={18} fill={color} />
        <text x={0} y={-44} textAnchor="middle" fill="#fff" fontFamily={FUENTE.inter} fontWeight={800} fontSize={24}>
          {d}
        </text>
        <text x={0} y={36} textAnchor="middle" fontSize={50}>
          {k < dias ? marcas[k % marcas.length] : ""}
        </text>
      </g>
    ))}
  </g>
);
