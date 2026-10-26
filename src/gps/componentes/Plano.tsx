import React from "react";
import { random } from "remotion";

/** Plano de ciudad visto desde arriba, estilo maqueta (manzanas extruidas). Se dibuja dentro de un <svg>. */
export const PLANO = { x: 505, y: 800, ancho: 820, alto: 820 };

const CALLE = 18;
const MANZANA = 74;

const MANZANAS = (() => {
  const salida: { x: number; y: number; w: number; h: number; tono: number }[] = [];
  const paso = MANZANA + CALLE;
  const n = Math.floor(PLANO.ancho / paso);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = -PLANO.ancho / 2 + CALLE + i * paso;
      const y = -PLANO.alto / 2 + CALLE + j * paso;
      // Una avenida diagonal: se saltean las manzanas que cruza.
      if (Math.abs(i - j - 1) < 0.5) continue;
      salida.push({ x, y, w: MANZANA, h: MANZANA, tono: random(`mz${i}-${j}`) });
    }
  }
  return salida;
})();

export const Plano: React.FC<{ escala?: number; opacidad?: number; dx?: number; dy?: number }> = ({ escala = 1, opacidad = 1, dx = 0, dy = 0 }) => (
  <g transform={`translate(${PLANO.x + dx} ${PLANO.y + dy}) scale(${escala})`} opacity={opacidad}>
    <defs>
      <filter id="planoSombra" x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow dx="16" dy="30" stdDeviation="20" floodColor="#000" floodOpacity="0.55" />
      </filter>
    </defs>
    <rect x={-PLANO.ancho / 2} y={-PLANO.alto / 2 + 16} width={PLANO.ancho} height={PLANO.alto} rx={28} fill="#0f1013" />
    <rect x={-PLANO.ancho / 2} y={-PLANO.alto / 2} width={PLANO.ancho} height={PLANO.alto} rx={28} fill="#24272d" filter="url(#planoSombra)" />
    {MANZANAS.map((m, k) => (
      <g key={k}>
        <rect x={m.x} y={m.y + 5} width={m.w} height={m.h} rx={6} fill="#1a1c20" />
        <rect x={m.x} y={m.y} width={m.w} height={m.h} rx={6} fill={m.tono > 0.85 ? "#2f4a3f" : `rgb(${60 + m.tono * 18},${63 + m.tono * 18},${70 + m.tono * 18})`} />
      </g>
    ))}
    <rect x={-PLANO.ancho / 2} y={-PLANO.alto / 2} width={PLANO.ancho} height={PLANO.alto} rx={28} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
  </g>
);
