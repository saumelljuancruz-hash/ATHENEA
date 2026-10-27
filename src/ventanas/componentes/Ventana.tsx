import React from "react";
import { interpolateColors, random } from "remotion";
import { COLOR } from "../../comun/tema";

/** Radio de las esquinas según `redondez` (0 = esquinas vivas, 1 = bien redondeadas). */
const radio = (ancho: number, alto: number, redondez: number) => 6 + (Math.min(ancho, alto) / 2 - 6) * 0.85 * redondez;

/** Grieta irregular que sale de la esquina superior derecha. `largo` 0..1. */
export const Grieta: React.FC<{ x: number; y: number; largo: number; escala?: number }> = ({ x, y, largo, escala = 1 }) => {
  if (largo <= 0) return null;
  const pasos = 9;
  let px = 0;
  let py = 0;
  const puntos = [`M ${x} ${y}`];
  for (let k = 1; k <= Math.ceil(pasos * largo); k++) {
    px += (18 + random(`gx${k}`) * 14) * escala;
    py -= (14 + random(`gy${k}`) * 16) * escala * (k % 2 ? 1 : 0.4);
    puntos.push(`L ${x + px} ${y + py}`);
  }
  return (
    <g>
      <path d={puntos.join(" ")} fill="none" stroke={COLOR.rojo} strokeWidth={10 * escala} strokeLinejoin="round" opacity={0.35} />
      <path d={puntos.join(" ")} fill="none" stroke="#1a0d0c" strokeWidth={4 * escala} strokeLinejoin="round" />
    </g>
  );
};

/** Ventanilla en el fuselaje (panel de metal con remaches). */
export const Ventanilla: React.FC<{
  x: number;
  y: number;
  ancho: number;
  alto: number;
  redondez: number;
  grieta?: number;
  /** Brillo rojo en las esquinas (dónde se amontona la fuerza). */
  tension?: number;
  cielo?: React.ReactNode;
  panel?: boolean;
}> = ({ x, y, ancho, alto, redondez, grieta = 0, tension = 0, cielo, panel = true }) => {
  const r = radio(ancho, alto, redondez);
  const id = `vent${Math.round(x)}${Math.round(y)}`;
  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={x - ancho / 2} y={y - alto / 2} width={ancho} height={alto} rx={r} />
        </clipPath>
        <radialGradient id={`${id}calor`}>
          <stop offset="0%" stopColor={COLOR.rojo} stopOpacity={0.9} />
          <stop offset="100%" stopColor={COLOR.rojo} stopOpacity={0} />
        </radialGradient>
        <linearGradient id={`${id}metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d9dce3" />
          <stop offset="100%" stopColor="#9aa0a8" />
        </linearGradient>
      </defs>
      {panel ? (
        <>
          <rect x={x - ancho} y={y - alto * 0.95} width={ancho * 2} height={alto * 1.9} rx={30} fill={`url(#${id}metal)`} />
          {Array.from({ length: 12 }, (_, k) => (
            <circle key={k} cx={x - ancho * 0.9 + (k % 6) * ancho * 0.36} cy={y + (k < 6 ? -1 : 1) * alto * 0.82} r={5} fill="#7d828b" />
          ))}
        </>
      ) : null}
      {/* Marco */}
      <rect x={x - ancho / 2 - 16} y={y - alto / 2 - 16} width={ancho + 32} height={alto + 32} rx={r + 14} fill="#c9cdd4" stroke="#7d828b" strokeWidth={3} />
      <g clipPath={`url(#${id}clip)`}>
        <rect x={x - ancho / 2} y={y - alto / 2} width={ancho} height={alto} fill="#7fb6e8" />
        {cielo}
        <rect x={x - ancho / 2} y={y - alto / 2} width={ancho * 0.35} height={alto} fill="#fff" opacity={0.12} />
      </g>
      <rect x={x - ancho / 2} y={y - alto / 2} width={ancho} height={alto} rx={r} fill="none" stroke="#5d626c" strokeWidth={6} />
      {tension > 0
        ? [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ].map(([sx, sy], k) => (
            <circle key={k} cx={x + (sx * ancho) / 2} cy={y + (sy * alto) / 2} r={70} fill={`url(#${id}calor)`} opacity={tension * (1 - redondez)} />
          ))
        : null}
      <Grieta x={x + ancho / 2 - 2} y={y - alto / 2 + 2} largo={grieta} />
    </g>
  );
};

/**
 * Partículas de "fuerza" que viajan por el fuselaje hacia la ventanilla.
 * Con esquinas (redondez 0) se frenan y se amontonan en las esquinas (rojo);
 * con curva (redondez 1) la rodean suave y se reparten (turquesa).
 */
export const Fuerza: React.FC<{ x: number; y: number; ancho: number; alto: number; redondez: number; frame: number; intensidad: number }> = ({
  x,
  y,
  ancho,
  alto,
  redondez,
  frame,
  intensidad,
}) => {
  if (intensidad <= 0) return null;
  const n = 150;
  const largo = 1100;
  return (
    <g opacity={intensidad}>
      {Array.from({ length: n }, (_, i) => {
        const carril = (random(`car${i}`) * 2 - 1) * alto * 0.75;
        const vel = 3 + random(`vel${i}`) * 2;
        let u = (((random(`fx${i}`) * largo + frame * vel) % largo) + largo) % largo - largo / 2;
        const dentro = Math.abs(carril) < alto / 2 + 10;
        // Esquinas: se frenan contra el borde izquierdo y se amontonan en la esquina.
        const frena = dentro ? (1 - redondez) * Math.max(0, 1 - Math.abs(u + ancho / 2 + 10) / 120) : 0;
        if (dentro && redondez < 0.5 && u > -ancho / 2 - 12 && u < -ancho / 2 + 40) u = -ancho / 2 - 12 + (u + ancho / 2 + 12) * 0.15;
        const borde = alto / 2 + 14;
        const elipse = Math.abs(u) < ancho / 2 + 20 ? borde * Math.sqrt(Math.max(0, 1 - (u / (ancho / 2 + 20)) ** 2)) : 0;
        const cuadrado = Math.abs(u) < ancho / 2 + 12 ? borde : 0;
        const evita = dentro ? cuadrado * (1 - redondez) + elipse * redondez : 0;
        const py = Math.sign(carril || 1) * Math.max(Math.abs(carril), evita);
        const color = interpolateColors(Math.min(1, frena * 1.6 + (dentro ? (1 - redondez) * 0.3 : 0)), [0, 1], [COLOR.verde, COLOR.rojo]);
        return <circle key={i} cx={x + u} cy={y + py} r={5 + 4 * frena} fill={color} opacity={0.9} />;
      })}
    </g>
  );
};

/** Nubes que pasan detrás de una ventanilla. */
export const Nubes: React.FC<{ x: number; y: number; frame: number }> = ({ x, y, frame }) => (
  <g>
    {Array.from({ length: 5 }, (_, k) => {
      const nx = x + ((((k * 170 - frame * 3) % 900) + 900) % 900) - 450;
      return (
        <g key={k} opacity={0.9}>
          <ellipse cx={nx} cy={y - 60 + k * 40} rx={90} ry={30} fill="#fff" />
          <ellipse cx={nx + 50} cy={y - 75 + k * 40} rx={60} ry={28} fill="#fff" />
        </g>
      );
    })}
  </g>
);
