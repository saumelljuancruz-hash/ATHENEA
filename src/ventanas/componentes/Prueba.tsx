import React from "react";
import { COLOR } from "../../comun/tema";

/** Fuselaje de costado (cilindro) con su fila de ventanillas; `infla` 0..1 lo hincha un poco. */
export const Fuselaje: React.FC<{ x: number; y: number; largo: number; alto: number; infla: number; redondez?: number; grieta?: number }> = ({
  x,
  y,
  largo,
  alto,
  infla,
  redondez = 0,
  grieta = 0,
}) => {
  const h = alto * (1 + 0.06 * infla);
  const n = 9;
  const r = 4 + 18 * redondez;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <linearGradient id="fuselajePrueba" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef0f3" />
          <stop offset="60%" stopColor="#b9bec6" />
          <stop offset="100%" stopColor="#6f747d" />
        </linearGradient>
      </defs>
      <rect x={-largo / 2} y={-h / 2} width={largo} height={h} rx={h / 2} fill="url(#fuselajePrueba)" stroke="rgba(0,0,0,0.3)" strokeWidth={3} />
      {Array.from({ length: n }, (_, k) => {
        const wx = -largo * 0.36 + k * ((largo * 0.72) / (n - 1));
        return <rect key={k} x={wx - 18} y={-h * 0.18 - 20} width={36} height={40} rx={r} fill="#2a3a4f" stroke="#5d626c" strokeWidth={3} />;
      })}
      {grieta > 0 ? (
        <circle cx={-largo * 0.36 + 4 * ((largo * 0.72) / (n - 1)) + 18} cy={-h * 0.18 - 20} r={16 + 30 * grieta} fill={COLOR.rojo} opacity={0.35 * grieta} />
      ) : null}
    </g>
  );
};

/** Pileta de prueba vista en corte: paredes, agua con burbujas. `agua` 0..1 es el nivel. */
export const Pileta: React.FC<{ agua: number; frame: number; children?: React.ReactNode }> = ({ agua, frame, children }) => {
  const fondo = 1380;
  const tope = 520;
  const nivel = fondo - (fondo - tope) * agua;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="aguaPileta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4aa3ff" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#1f4f80" stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <rect width={1080} height={1920} fill="#16171a" />
      {/* Grúa */}
      <rect x={0} y={330} width={1080} height={26} fill="#4a4e57" />
      <line x1={540} y1={356} x2={540} y2={760} stroke="#7d828b" strokeWidth={6} />
      {children}
      <rect x={60} y={nivel} width={960} height={fondo - nivel} fill="url(#aguaPileta)" />
      <path d={`M60 ${nivel} Q 300 ${nivel - 10 * Math.sin(frame / 10)} 540 ${nivel} T 1020 ${nivel}`} fill="none" stroke="#9fd0ff" strokeWidth={4} opacity={agua > 0.02 ? 0.8 : 0} />
      {agua > 0.3
        ? Array.from({ length: 14 }, (_, k) => {
            const a = ((frame * 1.5 + k * 53) % 400) / 400;
            return <circle key={k} cx={100 + ((k * 67) % 880)} cy={fondo - 20 - a * (fondo - nivel - 30)} r={4 + (k % 3) * 2} fill="#cfe7ff" opacity={0.5 * (1 - a)} />;
          })
        : null}
      {/* Paredes */}
      <path d={`M60 ${tope - 40} L60 ${fondo} L1020 ${fondo} L1020 ${tope - 40}`} fill="none" stroke="#9aa0a8" strokeWidth={14} />
      <rect x={40} y={fondo} width={1000} height={30} fill="#4a4e57" />
    </svg>
  );
};

/** Manómetro de la presión de cabina; `valor` 0..1. */
export const Manometro: React.FC<{ x: number; y: number; valor: number }> = ({ x, y, valor }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={70} fill="#1d2026" stroke="#9aa0a8" strokeWidth={6} />
    {Array.from({ length: 9 }, (_, k) => {
      const a = (-220 + k * 32.5) * (Math.PI / 180);
      return <line key={k} x1={Math.cos(a) * 52} y1={Math.sin(a) * 52} x2={Math.cos(a) * 62} y2={Math.sin(a) * 62} stroke={k > 6 ? COLOR.rojo : "#9aa0a8"} strokeWidth={4} />;
    })}
    <line x1={0} y1={0} x2={Math.cos((-220 + valor * 260) * (Math.PI / 180)) * 50} y2={Math.sin((-220 + valor * 260) * (Math.PI / 180)) * 50} stroke={COLOR.naranja} strokeWidth={6} strokeLinecap="round" />
    <circle r={8} fill={COLOR.naranja} />
  </g>
);
