import React from "react";
import { random } from "remotion";
import { colorTemp } from "./Microondas";

/** Molécula de agua estilizada: una esfera grande (oxígeno) y dos chicas (hidrógeno). Se dibuja dentro de un <svg>. */
export const MoleculaAgua: React.FC<{ x: number; y: number; r: number; angulo: number; temp: number; opacidad?: number }> = ({
  x,
  y,
  r,
  angulo,
  temp,
  opacidad = 1,
}) => {
  const color = colorTemp(temp);
  const h = (signo: number) => {
    const a = ((angulo + signo * 52 + 90) * Math.PI) / 180;
    return { x: Math.cos(a) * r * 1.02, y: Math.sin(a) * r * 1.02 };
  };
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacidad}>
      <ellipse cx={r * 0.25} cy={r * 1.35} rx={r * 1.25} ry={r * 0.28} fill="#000" opacity={0.25} />
      {[-1, 1].map((s) => {
        const p = h(s);
        return (
          <g key={s}>
            <circle cx={p.x} cy={p.y} r={r * 0.55} fill="#e9edf2" />
            <circle cx={p.x} cy={p.y} r={r * 0.55} fill="url(#esferaLuz)" />
          </g>
        );
      })}
      <circle cx={0} cy={0} r={r} fill={color} />
      <circle cx={0} cy={0} r={r} fill="url(#esferaLuz)" />
    </g>
  );
};

/** Gradiente compartido que da volumen a las esferas (brillo arriba a la izquierda, sombra abajo). */
export const DefsEsferas: React.FC = () => (
  <defs>
    <radialGradient id="esferaLuz" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stopColor="#fff" stopOpacity={0.6} />
      <stop offset="35%" stopColor="#fff" stopOpacity={0.05} />
      <stop offset="80%" stopColor="#000" stopOpacity={0.25} />
      <stop offset="100%" stopColor="#000" stopOpacity={0.45} />
    </radialGradient>
  </defs>
);

export type Molecula = { x: number; y: number; r: number; base: number; fase: number };

/** Moléculas repartidas en un área (posiciones fijas, deterministas). */
export const repartir = (n: number, area: { x0: number; x1: number; y0: number; y1: number }, rMin: number, rMax: number, semilla: string): Molecula[] => {
  const salida: Molecula[] = [];
  let k = 0;
  while (salida.length < n && k < n * 60) {
    k++;
    const r = rMin + random(`${semilla}r${k}`) * (rMax - rMin);
    const x = area.x0 + r + random(`${semilla}x${k}`) * (area.x1 - area.x0 - 2 * r);
    const y = area.y0 + r + random(`${semilla}y${k}`) * (area.y1 - area.y0 - 2 * r);
    if (salida.every((m) => Math.hypot(m.x - x, m.y - y) > (m.r + r) * 2.1)) {
      salida.push({ x, y, r, base: random(`${semilla}b${k}`) * 360, fase: random(`${semilla}f${k}`) * Math.PI * 2 });
    }
  }
  return salida;
};
