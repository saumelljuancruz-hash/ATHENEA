import React from "react";
import { random } from "remotion";
import { COLOR } from "../../comun/tema";

/** Avión de costado (estilo maqueta). Se dibuja dentro de un <svg>. `corte` muestra la cabina por dentro. */
export const AvionLateral: React.FC<{
  x: number;
  y: number;
  escala?: number;
  inclinacion?: number;
  corte?: number;
  /** Celulares encendidos en la cabina (0..1 = cuántos). */
  celulares?: number;
  frame: number;
  children?: React.ReactNode;
}> = ({ x, y, escala = 1, inclinacion = 0, corte = 0, celulares = 0, frame, children }) => {
  const largo = 760;
  const alto = 120;
  const asientos = 22;
  return (
    <g transform={`translate(${x} ${y}) rotate(${inclinacion}) scale(${escala})`}>
      <defs>
        <linearGradient id="fuselaje" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2f4f7" />
          <stop offset="55%" stopColor="#c9cdd4" />
          <stop offset="100%" stopColor="#7d828b" />
        </linearGradient>
      </defs>
      {/* Sombra lejana */}
      <ellipse cx={20} cy={alto * 1.6} rx={largo * 0.42} ry={14} fill="#000" opacity={0.18} />
      {/* Ala trasera y deriva */}
      <path d={`M${largo * 0.3} ${-alto * 0.35} L${largo * 0.46} ${-alto * 1.25} L${largo * 0.52} ${-alto * 1.25} L${largo * 0.48} ${-alto * 0.3} Z`} fill="#aeb3bb" />
      {/* Fuselaje */}
      <path
        d={`M${-largo / 2} 0 C ${-largo / 2} ${-alto * 0.55} ${-largo * 0.38} ${-alto / 2} ${-largo * 0.3} ${-alto / 2} L ${largo * 0.36} ${-alto / 2} C ${largo * 0.46} ${-alto / 2} ${largo * 0.5} ${-alto * 0.25} ${largo * 0.52} ${-alto * 0.1} L ${largo * 0.36} ${alto / 2} L ${-largo * 0.3} ${alto / 2} C ${-largo * 0.42} ${alto / 2} ${-largo / 2} ${alto * 0.35} ${-largo / 2} 0 Z`}
        fill="url(#fuselaje)"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth={2}
      />
      {/* Cabina de pilotos */}
      <path d={`M${-largo * 0.46} ${-alto * 0.12} Q ${-largo * 0.44} ${-alto * 0.34} ${-largo * 0.38} ${-alto * 0.3} L ${-largo * 0.37} ${-alto * 0.1} Z`} fill="#2a3a4f" />
      {/* Corte: interior de la cabina con pasajeros y celulares */}
      {corte > 0 ? (
        <g opacity={corte}>
          <rect x={-largo * 0.32} y={-alto * 0.36} width={largo * 0.64} height={alto * 0.72} rx={20} fill="#1d2026" />
          {Array.from({ length: asientos }, (_, i) => {
            const ax = -largo * 0.3 + (i + 0.5) * ((largo * 0.6) / asientos);
            const encendido = random(`cel${i}`) < celulares;
            return (
              <g key={i}>
                <rect x={ax - 9} y={-6} width={18} height={30} rx={4} fill="#3a3d44" />
                <circle cx={ax} cy={-18} r={8} fill="#8f96a1" />
                {encendido ? (
                  <>
                    <circle cx={ax + 6} cy={2} r={12} fill={COLOR.verde} opacity={0.25 + 0.15 * Math.sin(frame / 5 + i)} />
                    <rect x={ax + 2} y={-4} width={7} height={12} rx={2} fill={COLOR.verde} />
                  </>
                ) : null}
              </g>
            );
          })}
        </g>
      ) : (
        Array.from({ length: asientos }, (_, i) => (
          <rect key={i} x={-largo * 0.3 + i * ((largo * 0.6) / asientos)} y={-alto * 0.2} width={12} height={16} rx={5} fill="#3a4a5f" />
        ))
      )}
      {/* Ala */}
      <path d={`M${-largo * 0.05} ${alto * 0.2} L${largo * 0.15} ${alto * 0.95} L${largo * 0.24} ${alto * 0.95} L${largo * 0.14} ${alto * 0.2} Z`} fill="#9aa0a8" stroke="rgba(0,0,0,0.2)" />
      <rect x={largo * 0.02} y={alto * 0.45} width={70} height={30} rx={14} fill="#7d828b" />
      {children}
    </g>
  );
};

/** Torre de antena de celular. `saturada` 0..1 la pinta de rojo y titila. */
export const Torre: React.FC<{ x: number; y: number; escala?: number; saturada?: number; frame: number; recibe?: number }> = ({
  x,
  y,
  escala = 1,
  saturada = 0,
  frame,
  recibe = 0,
}) => {
  const color = saturada > 0.5 ? COLOR.rojo : COLOR.verde;
  const titila = saturada > 0.5 ? 0.4 + 0.6 * Math.abs(Math.sin(frame / 3)) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <path d="M-34 0 L-6 -170 L6 -170 L34 0" fill="none" stroke="#9aa0a8" strokeWidth={6} />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={-34 + 28 * k} y1={-170 * k} x2={34 - 28 * k} y2={-170 * k} stroke="#9aa0a8" strokeWidth={4} />
      ))}
      <line x1={-30} y1={-20} x2={22} y2={-120} stroke="#7d828b" strokeWidth={3} />
      <line x1={30} y1={-20} x2={-22} y2={-120} stroke="#7d828b" strokeWidth={3} />
      <rect x={-22} y={-200} width={12} height={34} rx={3} fill="#c9cdd4" />
      <rect x={10} y={-200} width={12} height={34} rx={3} fill="#c9cdd4" />
      <circle cx={0} cy={-206} r={8} fill={color} opacity={titila} />
      {recibe > 0
        ? [0, 1].map((k) => {
            const a = ((frame + k * 15) % 30) / 30;
            return <circle key={k} cx={0} cy={-206} r={12 + a * 40} fill="none" stroke={color} strokeWidth={3} opacity={recibe * (1 - a)} />;
          })
        : null}
    </g>
  );
};

/** Anillos de señal que salen de un punto hacia abajo (el celular buscando antena). */
export const Anillos: React.FC<{ x: number; y: number; frame: number; intensidad: number; alcance?: number; color?: string; periodo?: number; desfase?: number }> = ({
  x,
  y,
  frame,
  intensidad,
  alcance = 260,
  color = COLOR.verde,
  periodo = 40,
  desfase = 0,
}) => {
  if (intensidad <= 0) return null;
  return (
    <g>
      {[0, 1, 2].map((k) => {
        const a = (((frame + desfase + (k * periodo) / 3) % periodo) + periodo) % periodo / periodo;
        return (
          <path
            key={k}
            d={`M ${x - a * alcance} ${y} A ${a * alcance} ${a * alcance * 0.8} 0 0 0 ${x + a * alcance} ${y}`}
            fill="none"
            stroke={color}
            strokeWidth={2 + 3 * intensidad}
            opacity={intensidad * (1 - a)}
          />
        );
      })}
    </g>
  );
};

/** Ícono de "modo avión" (avioncito de perfil superior). */
export const IconoAvion: React.FC<{ x: number; y: number; tamano: number; color: string }> = ({ x, y, tamano, color }) => (
  <g transform={`translate(${x} ${y}) scale(${tamano / 100}) rotate(-45)`}>
    <path d="M0 -46 C6 -46 8 -38 8 -30 L8 -10 L44 12 L44 22 L8 10 L8 30 L18 38 L18 46 L0 40 L-18 46 L-18 38 L-8 30 L-8 10 L-44 22 L-44 12 L-8 -10 L-8 -30 C-8 -38 -6 -46 0 -46 Z" fill={color} />
  </g>
);
