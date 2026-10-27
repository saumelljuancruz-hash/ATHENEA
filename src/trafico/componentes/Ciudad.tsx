import React from "react";
import { interpolateColors, random } from "remotion";
import { COLOR, FUENTE } from "../../comun/tema";

// Plano de la ciudad (vista de arriba), en coordenadas de 1080×1920.
export const CALLE_PRINCIPAL = 1000;
export const HORIZONTALES = [300, 650, CALLE_PRINCIPAL, 1350, 1700];
export const VERTICALES = [110, 400, 690, 980];
const ANCHO_CALLE = 64;

/** Color de tráfico: 0 = fluido (turquesa), 0.5 = lento (naranja), 1 = embotellado (rojo). */
export const colorTrafico = (t: number) => interpolateColors(Math.min(1, Math.max(0, t)), [0, 0.5, 1], [COLOR.verde, COLOR.naranja, COLOR.rojo]);

/** Calles con un color de tráfico propio: [y o x, horizontal, nivel 0..1]. */
export type EstadoCalle = { indice: number; horizontal: boolean; nivel: number };

export const MapaCiudad: React.FC<{
  /** Fracción de la calle principal (desde la izquierda) que se pinta de rojo. */
  rojo?: number;
  /** Nivel de tráfico de las otras calles (0..1); null = sin pintar. */
  otras?: number | null;
  frame: number;
  children?: React.ReactNode;
}> = ({ rojo = 0, otras = null, frame, children }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <rect width={1080} height={1920} fill="#1b1d22" />
    {/* Manzanas */}
    {[-1, ...HORIZONTALES].map((y0, fi) => {
      const y1 = HORIZONTALES[fi] ?? 2100;
      const ya = y0 < 0 ? -200 : y0 + ANCHO_CALLE / 2;
      return [-1, ...VERTICALES].map((x0, ci) => {
        const x1 = VERTICALES[ci] ?? 1300;
        const xa = x0 < 0 ? -200 : x0 + ANCHO_CALLE / 2;
        const w = x1 - ANCHO_CALLE / 2 - xa;
        const h = y1 - ANCHO_CALLE / 2 - ya;
        if (w <= 0 || h <= 0) return null;
        const parque = random(`parque${fi}-${ci}`) < 0.14;
        return (
          <g key={`${fi}-${ci}`}>
            <rect x={xa} y={ya} width={w} height={h} rx={16} fill={parque ? "#1e3530" : "#2a2d33"} />
            {!parque
              ? Array.from({ length: 4 }, (_, k) => (
                  <rect
                    key={k}
                    x={xa + 18 + (k % 2) * (w / 2 - 6)}
                    y={ya + 18 + Math.floor(k / 2) * (h / 2 - 6)}
                    width={w / 2 - 30}
                    height={h / 2 - 30}
                    rx={8}
                    fill="#33363e"
                  />
                ))
              : null}
          </g>
        );
      });
    })}
    {/* Calles */}
    {HORIZONTALES.map((y, k) => (
      <rect key={`h${k}`} x={-50} y={y - ANCHO_CALLE / 2} width={1180} height={ANCHO_CALLE} fill="#3a3d44" />
    ))}
    {VERTICALES.map((x, k) => (
      <rect key={`v${k}`} x={x - ANCHO_CALLE / 2} y={-50} width={ANCHO_CALLE} height={2020} fill="#3a3d44" />
    ))}
    {/* Tráfico de las otras calles */}
    {otras !== null
      ? [...HORIZONTALES.filter((y) => y !== CALLE_PRINCIPAL).map((y, k) => ({ y, k, h: true })), ...VERTICALES.map((x, k) => ({ y: x, k: k + 10, h: false }))].map(({ y, k, h }) => {
          const nivel = Math.min(1, Math.max(0, otras * (0.2 + 0.8 * random(`niv${k}`)) + 0.08 * Math.sin(frame / 30 + k)));
          return h ? (
            <rect key={`t${k}`} x={-50} y={y - 7} width={1180} height={14} rx={7} fill={colorTrafico(nivel)} opacity={0.85} />
          ) : (
            <rect key={`t${k}`} x={y - 7} y={-50} width={14} height={2020} rx={7} fill={colorTrafico(nivel)} opacity={0.85} />
          );
        })
      : null}
    {/* La calle del carrito */}
    <rect x={-50} y={CALLE_PRINCIPAL - 7} width={1180} height={14} rx={7} fill={COLOR.verde} opacity={0.85} />
    {rojo > 0 ? <rect x={-50} y={CALLE_PRINCIPAL - 9} width={1180 * rojo} height={18} rx={9} fill={COLOR.rojo} /> : null}
    {children}
  </svg>
);

/** Celular visto desde arriba como un punto que late (lo que "ve" el mapa). */
export const PuntoCelular: React.FC<{ x: number; y: number; frame: number; color?: string; r?: number; fase?: number }> = ({
  x,
  y,
  frame,
  color = COLOR.verde,
  r = 9,
  fase = 0,
}) => (
  <g>
    <circle cx={x} cy={y} r={r * (1.8 + 0.6 * Math.sin(frame / 8 + fase))} fill={color} opacity={0.18} />
    <circle cx={x} cy={y} r={r} fill={color} stroke="#fff" strokeWidth={2} />
  </g>
);

/** Auto visto desde arriba. */
export const AutoArriba: React.FC<{ x: number; y: number; color: string; opacidad?: number; fantasma?: boolean }> = ({ x, y, color, opacidad = 1, fantasma = false }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacidad}>
    <rect x={-44} y={-22} width={88} height={44} rx={14} fill={fantasma ? "none" : color} stroke={fantasma ? "#fff" : "rgba(0,0,0,0.3)"} strokeWidth={fantasma ? 3 : 2} strokeDasharray={fantasma ? "8 6" : undefined} />
    {!fantasma ? (
      <>
        <rect x={-14} y={-17} width={30} height={34} rx={8} fill="rgba(0,0,0,0.35)" />
        <rect x={22} y={-16} width={12} height={32} rx={5} fill="rgba(255,255,255,0.35)" />
      </>
    ) : null}
  </g>
);

/** Carrito de arriba con 99 celulares (grilla de puntos). */
export const CarritoArriba: React.FC<{ x: number; y: number; frame: number; escala?: number }> = ({ x, y, frame, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <line x1={60} y1={0} x2={120} y2={0} stroke="#9aa0a8" strokeWidth={6} strokeLinecap="round" />
    <rect x={-60} y={-46} width={120} height={92} rx={12} fill="#2f5b8a" stroke="#4aa3ff" strokeWidth={3} />
    {Array.from({ length: 99 }, (_, i) => (
      <circle key={i} cx={-52 + (i % 11) * 10.4} cy={-38 + Math.floor(i / 11) * 9.5} r={3.4} fill={COLOR.verde} opacity={0.6 + 0.4 * Math.sin(frame / 6 + i)} />
    ))}
  </g>
);

/** Persona caminando (de costado), tirando de algo con el brazo hacia atrás. */
export const Caminante: React.FC<{ x: number; y: number; escala?: number; frame: number; paso?: number }> = ({ x, y, escala = 1, frame, paso = 1 }) => {
  const a = Math.sin(frame / 9) * 24 * paso;
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`} stroke="#d9dce3" strokeWidth={14} strokeLinecap="round" fill="none">
      <line x1={0} y1={-120} x2={0} y2={-40} />
      <line x1={0} y1={-40} x2={0} y2={0} transform={`rotate(${a} 0 -40)`} />
      <line x1={0} y1={-40} x2={0} y2={0} transform={`rotate(${-a} 0 -40)`} />
      <line x1={0} y1={-105} x2={-46} y2={-70} />
      <line x1={0} y1={-105} x2={20} y2={-75} transform={`rotate(${-a * 0.6} 0 -105)`} />
      <circle cx={2} cy={-146} r={20} fill="#d9dce3" stroke="none" />
    </g>
  );
};

/** Carrito de costado con los celulares apilados; `cantidad` 0..99. */
export const CarritoLateral: React.FC<{ x: number; y: number; escala?: number; cantidad: number; frame: number; rueda?: number }> = ({
  x,
  y,
  escala = 1,
  cantidad,
  frame,
  rueda = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    {/* Celulares apilados */}
    {Array.from({ length: Math.floor(cantidad) }, (_, i) => {
      const fila = Math.floor(i / 14);
      const col = i % 14;
      const px = -150 + col * 21 + (fila % 2) * 10 + (random(`cx${i}`) - 0.5) * 6;
      const py = -78 - fila * 16 + (random(`cy${i}`) - 0.5) * 4;
      const rot = (random(`cr${i}`) - 0.5) * 40;
      return (
        <g key={i} transform={`translate(${px} ${py}) rotate(${rot})`}>
          <rect x={-7} y={-12} width={14} height={24} rx={3} fill="#1b1d22" stroke="#4a4e57" strokeWidth={1.5} />
          <rect x={-5} y={-9} width={10} height={17} rx={2} fill={COLOR.verde} opacity={0.55 + 0.45 * Math.sin(frame / 7 + i)} />
        </g>
      );
    })}
    {/* Caja del carrito */}
    <path d="M -170 -70 L 170 -70 L 150 10 L -150 10 Z" fill="#2f5b8a" stroke="#4aa3ff" strokeWidth={4} />
    <line x1={-160} y1={-40} x2={160} y2={-40} stroke="#4aa3ff" strokeOpacity={0.4} strokeWidth={3} />
    {/* Manija */}
    <line x1={150} y1={-20} x2={260} y2={-110} stroke="#9aa0a8" strokeWidth={8} strokeLinecap="round" />
    {/* Ruedas */}
    {[-100, 100].map((rx) => (
      <g key={rx} transform={`translate(${rx} 40) rotate(${rueda})`}>
        <circle r={34} fill="#22252b" stroke="#9aa0a8" strokeWidth={6} />
        {[0, 60, 120].map((g) => (
          <line key={g} x1={-28} y1={0} x2={28} y2={0} stroke="#5d626c" strokeWidth={4} transform={`rotate(${g})`} />
        ))}
      </g>
    ))}
  </g>
);

/** Pantalla de un mapa de navegación (coordenadas del teléfono, sin marcas). */
export const PantallaMapa: React.FC<{ rojo: number; banner: number; frame: number; texto: string }> = ({ rojo, banner, frame, texto }) => (
  <g>
    <defs>
      <clipPath id="pantallaMapa">
        <rect x={-138} y={-298} width={276} height={596} rx={34} />
      </clipPath>
    </defs>
    <g clipPath="url(#pantallaMapa)">
      <rect x={-140} y={-300} width={280} height={600} fill="#e9ebef" />
      {[-200, -60, 80, 220].map((y) => (
        <rect key={y} x={-150} y={y} width={300} height={22} fill="#fff" />
      ))}
      {[-80, 40].map((x) => (
        <rect key={x} x={x} y={-300} width={20} height={600} fill="#fff" />
      ))}
      <rect x={-150} y={-10} width={300} height={34} fill="#fff" />
      <rect x={-150} y={0} width={300} height={14} rx={7} fill={COLOR.verde} />
      <rect x={-150} y={-2} width={300 * rojo} height={18} rx={9} fill="#e3392f" />
      <circle cx={-20 + 4 * Math.sin(frame / 10)} cy={7} r={14} fill="#4aa3ff" stroke="#fff" strokeWidth={4} />
      <g opacity={banner} transform={`translate(0 ${-150 + (1 - banner) * -30})`}>
        <rect x={-120} y={-36} width={240} height={72} rx={16} fill="#e3392f" />
        <text x={0} y={10} textAnchor="middle" fill="#fff" fontFamily={FUENTE.inter} fontWeight={800} fontSize={24}>
          {texto}
        </text>
      </g>
    </g>
  </g>
);
