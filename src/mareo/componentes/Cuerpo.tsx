import React from "react";
import { interpolate, random } from "remotion";
import { COLOR } from "../../comun/tema";

/** Corazón ilustrado que late a `bpm`. */
export const Corazon: React.FC<{ x: number; y: number; tamano: number; frame: number; bpm: number; fps: number }> = ({
  x,
  y,
  tamano,
  frame,
  bpm,
  fps,
}) => {
  const fase = ((frame / fps) * bpm) / 60;
  const u = fase - Math.floor(fase);
  const pulso =
    u < 0.12 ? Math.sin((u / 0.12) * Math.PI) : u > 0.2 && u < 0.3 ? 0.5 * Math.sin(((u - 0.2) / 0.1) * Math.PI) : 0;
  const s = (tamano / 100) * (1 + 0.12 * pulso);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M 0 30 C -60 -10 -50 -60 -20 -60 C -5 -60 0 -48 0 -40 C 0 -48 5 -60 20 -60 C 50 -60 60 -10 0 30 Z"
        fill="#ff4f6a"
      />
      <path
        d="M -30 -42 C -40 -36 -42 -24 -36 -16"
        fill="none"
        stroke="#fff"
        strokeOpacity={0.6}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </g>
  );
};

/** Cerebro ilustrado (rosa con pliegues). `nivel` 0..1 lo pinta más pálido cuando le falta sangre. */
export const Cerebro: React.FC<{ x: number; y: number; tamano: number; nivel: number; frame: number }> = ({
  x,
  y,
  tamano,
  nivel,
  frame,
}) => {
  const color = interpolate(nivel, [0, 1], [0, 1]);
  const fill = `rgb(${Math.round(220 + 35 * color)}, ${Math.round(190 - 60 * color)}, ${Math.round(205 - 40 * color)})`;
  return (
    <g transform={`translate(${x} ${y}) scale(${tamano / 100}) rotate(${2 * Math.sin(frame / 20)})`}>
      <path
        d="M -80 10 C -100 -40 -60 -80 -20 -70 C 0 -95 50 -90 60 -60 C 100 -55 105 0 80 20 C 90 50 50 70 20 60 C 0 80 -40 75 -50 50 C -85 55 -100 30 -80 10 Z"
        fill={fill}
        stroke="#c25b86"
        strokeWidth={5}
      />
      {[
        "M -60 0 Q -40 -20 -20 0 T 20 0",
        "M -40 -40 Q -20 -55 0 -40 T 40 -40",
        "M -30 35 Q -10 20 10 35 T 50 30",
        "M 0 -70 Q 5 -10 0 60",
      ].map((d, k) => (
        <path key={k} d={d} fill="none" stroke="#c25b86" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
      ))}
    </g>
  );
};

/** Estrellitas que giran (mareo). */
export const Estrellitas: React.FC<{
  x: number;
  y: number;
  radio: number;
  frame: number;
  intensidad: number;
  n?: number;
}> = ({ x, y, radio, frame, intensidad, n = 5 }) => {
  if (intensidad <= 0) return null;
  return (
    <g opacity={intensidad}>
      {Array.from({ length: n }, (_, k) => {
        const a = frame / 12 + (k / n) * Math.PI * 2;
        const r = 18 + 8 * Math.sin(frame / 5 + k);
        return (
          <path
            key={k}
            transform={`translate(${x + Math.cos(a) * radio} ${y + Math.sin(a) * radio * 0.35}) rotate(${frame * 3})`}
            d={`M 0 ${-r} L ${r * 0.3} ${-r * 0.3} L ${r} 0 L ${r * 0.3} ${r * 0.3} L 0 ${r} L ${-r * 0.3} ${r * 0.3} L ${-r} 0 L ${-r * 0.3} ${-r * 0.3} Z`}
            fill="#ffe14d"
            stroke="#ff9a3c"
            strokeWidth={2}
          />
        );
      })}
    </g>
  );
};

// Recorrido de los vasos en el cuerpo del Personaje (coordenadas relativas a la cadera, escala 1).
const ARRIBA: [number, number][] = [
  [0, -200],
  [0, -270],
  [0, -330],
  [0, -380],
];
const ABAJO: [number, number][] = [
  [0, -200],
  [-40, -60],
  [-44, 60],
  [-46, 170],
];

/**
 * Sangre en el cuerpo: puntitos rojos en los vasos. `abajo` 0..1 = qué parte se fue a las piernas;
 * `sube` 0..1 = flechas de los vasos apretando para subirla.
 */
export const Sangre: React.FC<{
  x: number;
  y: number;
  escala: number;
  abajo: number;
  frame: number;
  sube?: number;
}> = ({ x, y, escala, abajo, frame, sube = 0 }) => {
  const pos = (camino: [number, number][], t: number): [number, number] => {
    const k = Math.min(camino.length - 2, Math.floor(t * (camino.length - 1)));
    const u = t * (camino.length - 1) - k;
    return [camino[k][0] + (camino[k + 1][0] - camino[k][0]) * u, camino[k][1] + (camino[k + 1][1] - camino[k][1]) * u];
  };
  const total = 34;
  const enPiernas = Math.round(total * (0.45 + 0.4 * abajo));
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      {[ARRIBA, ABAJO, ABAJO.map(([a, b]) => [-a, b] as [number, number])].map((c, k) => (
        <polyline
          key={k}
          points={c.map((p) => p.join(",")).join(" ")}
          fill="none"
          stroke="#ff4f6a"
          strokeOpacity={0.35}
          strokeWidth={22}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {Array.from({ length: total }, (_, i) => {
        const piernas = i < enPiernas;
        const lado = i % 2 ? 1 : -1;
        const camino = piernas ? ABAJO.map(([a, b]) => [a * lado, b] as [number, number]) : ARRIBA;
        const t = (((random(`s${i}`) + frame * 0.004 * (piernas ? 1 : 1.6)) % 1) + 1) % 1;
        const [px, py] = pos(camino, piernas ? 0.35 + 0.65 * t : t);
        return <circle key={i} cx={px + (random(`j${i}`) - 0.5) * 14} cy={py} r={8} fill="#e8304d" />;
      })}
      {sube > 0
        ? [-1, 1].map((l) =>
            [0, 1].map((k) => {
              const a = ((frame + k * 15) % 30) / 30;
              return (
                <path
                  key={`${l}${k}`}
                  d={`M ${l * 90} ${120 - a * 160} l -16 22 m 16 -22 l 16 22`}
                  fill="none"
                  stroke={COLOR.verde}
                  strokeWidth={8}
                  strokeLinecap="round"
                  opacity={sube * (1 - a)}
                />
              );
            }),
          )
        : null}
    </g>
  );
};
