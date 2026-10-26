import React from "react";
import { COLOR, FUENTE } from "../../comun/tema";

/** Color de la carga: rojo cuando está baja, turquesa el resto. */
export const colorNivel = (nivel: number) => (nivel < 0.2 ? COLOR.rojo : COLOR.verde);

/** Rayo de "cargando". */
export const Rayo: React.FC<{ x: number; y: number; tamano: number; color: string; opacidad?: number }> = ({ x, y, tamano, color, opacidad = 1 }) => (
  <path
    transform={`translate(${x} ${y}) scale(${tamano / 100})`}
    d="M12 -50 L-28 6 L-2 6 L-12 50 L28 -8 L2 -8 Z"
    fill={color}
    opacity={opacidad}
    stroke="rgba(0,0,0,0.35)"
    strokeWidth={4}
  />
);

/**
 * Pila de batería (estilo maqueta) para dibujar dentro de un <svg>.
 * `nivel` 0..1; `calor` 0..1 la pone naranja y con brillo; `horizontal` la acuesta.
 */
export const Pila: React.FC<{
  x: number;
  y: number;
  alto: number;
  nivel: number;
  frame: number;
  cargando?: number;
  calor?: number;
  horizontal?: boolean;
  porcentaje?: boolean;
  color?: string;
}> = ({ x, y, alto, nivel, frame, cargando = 0, calor = 0, horizontal = false, porcentaje = true, color }) => {
  const ancho = alto * 0.48;
  const n = Math.min(1, Math.max(0, nivel));
  const relleno = color ?? (calor > 0.4 ? COLOR.naranjaCalor : colorNivel(n));
  const borde = 14;
  const interior = alto - borde * 2;
  const id = `pila${horizontal ? "h" : "v"}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${horizontal ? 90 : 0})`}>
      <defs>
        <linearGradient id={`${id}Cuerpo`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5d626c" />
          <stop offset="45%" stopColor="#3a3d44" />
          <stop offset="100%" stopColor="#1f2126" />
        </linearGradient>
        <linearGradient id={`${id}Brillo`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="40%" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <filter id={`${id}Glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={30} />
        </filter>
      </defs>
      {/* Halo de calor */}
      {calor > 0 ? <rect x={-ancho / 2 - 20} y={-alto / 2 - 20} width={ancho + 40} height={alto + 40} rx={60} fill={COLOR.naranjaCalor} opacity={0.55 * calor * (0.8 + 0.2 * Math.sin(frame / 6))} filter={`url(#${id}Glow)`} /> : null}
      {/* Polo */}
      <rect x={-ancho * 0.22} y={-alto / 2 - 34} width={ancho * 0.44} height={44} rx={10} fill="#4a4e57" />
      {/* Cuerpo */}
      <rect x={-ancho / 2} y={-alto / 2} width={ancho} height={alto} rx={44} fill={`url(#${id}Cuerpo)`} stroke="rgba(255,255,255,0.18)" strokeWidth={3} />
      <rect x={-ancho / 2 + borde} y={-alto / 2 + borde} width={ancho - borde * 2} height={interior} rx={32} fill="#101114" />
      {/* Carga */}
      <rect
        x={-ancho / 2 + borde + 6}
        y={alto / 2 - borde - 6 - (interior - 12) * n}
        width={ancho - borde * 2 - 12}
        height={(interior - 12) * n}
        rx={26}
        fill={relleno}
        opacity={0.92}
      />
      {/* Burbujitas de carga subiendo */}
      {cargando > 0
        ? Array.from({ length: 6 }, (_, k) => {
            const a = ((frame * 1.2 + k * 37) % 120) / 120;
            const top = (interior - 12) * n;
            return <circle key={k} cx={-ancho * 0.28 + ((k * 53) % (ancho * 0.56))} cy={alto / 2 - borde - 10 - a * top} r={5} fill="#fff" opacity={cargando * 0.5 * (1 - a) * (n > 0.05 ? 1 : 0)} />;
          })
        : null}
      <rect x={-ancho / 2 + 8} y={-alto / 2 + 8} width={ancho * 0.4} height={alto - 16} rx={36} fill={`url(#${id}Brillo)`} />
      {cargando > 0 ? <Rayo x={0} y={-alto * 0.08} tamano={alto * 0.22} color="#fff" opacidad={cargando * (0.75 + 0.25 * Math.sin(frame / 7))} /> : null}
      {porcentaje ? (
        <text
          x={0}
          y={alto * 0.22}
          transform={horizontal ? `rotate(-90 0 ${alto * 0.22})` : undefined}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontFamily={FUENTE.inter}
          fontWeight={800}
          fontSize={alto * 0.1}
        >
          {Math.round(n * 100)}%
        </text>
      ) : null}
    </g>
  );
};

/** Cable con puntos de corriente que avanzan. `flujo` 0..1 (0 = sin corriente). */
export const Cable: React.FC<{ d: string; largo: number; flujo: number; frame: number; color?: string; grosor?: number }> = ({
  d,
  largo,
  flujo,
  frame,
  color = COLOR.verde,
  grosor = 18,
}) => (
  <g>
    <path d={d} fill="none" stroke="#2a2d33" strokeWidth={grosor + 6} strokeLinecap="round" />
    <path d={d} fill="none" stroke="#4a4e57" strokeWidth={grosor} strokeLinecap="round" />
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={grosor * 0.45}
      strokeLinecap="round"
      strokeDasharray={`10 ${34}`}
      strokeDashoffset={-((frame * 3.2) % largo)}
      opacity={flujo}
    />
  </g>
);

/** Cargador de pared (ladrillo con enchufe). */
export const Cargador: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <rect x={-20} y={-90} width={10} height={36} rx={3} fill="#9aa0a8" />
    <rect x={10} y={-90} width={10} height={36} rx={3} fill="#9aa0a8" />
    <rect x={-60} y={-60} width={120} height={120} rx={26} fill="#e6e8ec" />
    <rect x={-60} y={-60} width={120} height={120} rx={26} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth={3} />
    <rect x={-50} y={20} width={100} height={36} rx={16} fill="#c9cdd4" />
    <Rayo x={0} y={-12} tamano={40} color="#7d828b" />
  </g>
);
