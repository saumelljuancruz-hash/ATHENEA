import React from "react";
import { COLOR, FUENTE } from "../../comun/tema";

export type App = { nombre: string; color: string };

/** Ícono de app genérico (cuadrado redondeado con la inicial). */
export const IconoApp: React.FC<{ x: number; y: number; tamano: number; app: App }> = ({ x, y, tamano, app }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-tamano / 2} y={-tamano / 2} width={tamano} height={tamano} rx={tamano * 0.24} fill={app.color} />
    <text x={0} y={tamano * 0.16} textAnchor="middle" fill="#16171a" fontFamily={FUENTE.inter} fontWeight={800} fontSize={tamano * 0.46}>
      {app.nombre[0].toUpperCase()}
    </text>
  </g>
);

/**
 * Tarjeta de app como en el selector de apps. `hielo` 0..1 la congela (dormida),
 * `trabada` 0..1 la pone en rojo con un indicador de carga que no avanza.
 */
export const TarjetaApp: React.FC<{
  x: number;
  y: number;
  ancho: number;
  alto: number;
  app: App;
  frame: number;
  hielo?: number;
  trabada?: number;
  rot?: number;
  opacidad?: number;
}> = ({ x, y, ancho, alto, app, frame, hielo = 0, trabada = 0, rot = 0, opacidad = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacidad}>
    <rect x={-ancho / 2 + 8} y={-alto / 2 + 14} width={ancho} height={alto} rx={ancho * 0.12} fill="#000" opacity={0.35} />
    <rect x={-ancho / 2} y={-alto / 2} width={ancho} height={alto} rx={ancho * 0.12} fill="#22252b" stroke={trabada > 0.5 ? COLOR.rojo : "rgba(255,255,255,0.15)"} strokeWidth={trabada > 0.5 ? 5 : 2} />
    <rect x={-ancho / 2} y={-alto / 2} width={ancho} height={alto * 0.16} rx={ancho * 0.12} fill={app.color} opacity={0.85} />
    <IconoApp x={-ancho / 2 + ancho * 0.16} y={-alto / 2 - ancho * 0.02} tamano={ancho * 0.2} app={app} />
    {[0, 1, 2, 3].map((k) => (
      <rect key={k} x={-ancho * 0.38} y={-alto * 0.18 + k * alto * 0.15} width={ancho * (0.76 - (k % 2) * 0.24)} height={alto * 0.07} rx={alto * 0.035} fill="#3a3d44" />
    ))}
    {hielo > 0 ? (
      <g opacity={hielo}>
        <rect x={-ancho / 2} y={-alto / 2} width={ancho} height={alto} rx={ancho * 0.12} fill="#9fd0ff" opacity={0.35} />
        <text x={0} y={alto * 0.08} textAnchor="middle" fontSize={ancho * 0.36}>
          ❄️
        </text>
        <text x={ancho * 0.3} y={-alto * 0.22 - 6 * Math.sin(frame / 12)} textAnchor="middle" fill="#cfe7ff" fontFamily={FUENTE.inter} fontWeight={800} fontSize={ancho * 0.16}>
          z
        </text>
        <text x={ancho * 0.38} y={-alto * 0.32 - 6 * Math.sin(frame / 12 + 1)} textAnchor="middle" fill="#cfe7ff" fontFamily={FUENTE.inter} fontWeight={800} fontSize={ancho * 0.11}>
          z
        </text>
      </g>
    ) : null}
    {trabada > 0 ? (
      <g opacity={trabada}>
        <circle cx={0} cy={alto * 0.12} r={ancho * 0.14} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={ancho * 0.04} />
        <circle
          cx={0}
          cy={alto * 0.12}
          r={ancho * 0.14}
          fill="none"
          stroke={COLOR.rojo}
          strokeWidth={ancho * 0.04}
          strokeDasharray={`${ancho * 0.22} ${ancho}`}
          transform={`rotate(${(frame * 9) % 360} 0 ${alto * 0.12})`}
        />
      </g>
    ) : null}
  </g>
);

/** Chip de memoria RAM con ranuras. */
export const Memoria: React.FC<{ x: number; y: number; ancho: number; alto: number }> = ({ x, y, ancho, alto }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-ancho / 2} y={-alto / 2} width={ancho} height={alto} rx={24} fill="#1f3a33" stroke={COLOR.verde} strokeOpacity={0.5} strokeWidth={3} />
    {Array.from({ length: 16 }, (_, k) => (
      <rect key={k} x={-ancho / 2 + 20 + k * ((ancho - 40) / 16)} y={alto / 2 - 4} width={(ancho - 40) / 16 - 8} height={22} fill="#c9a74a" />
    ))}
  </g>
);

/** Pedazos de una tarjeta que se rompe al cerrarla. `t` 0..1. */
export const Pedazos: React.FC<{ x: number; y: number; ancho: number; alto: number; color: string; t: number; inverso?: boolean }> = ({ x, y, ancho, alto, color, t, inverso = false }) => {
  const u = inverso ? 1 - t : t;
  return (
    <g>
      {Array.from({ length: 24 }, (_, k) => {
        const cx = (k % 4) - 1.5;
        const cy = Math.floor(k / 4) - 2.5;
        const dx = cx * ancho * 0.25 + cx * 260 * u + Math.sin(k * 7.3) * 120 * u;
        const dy = cy * alto * 0.16 + cy * 160 * u - 200 * u + Math.cos(k * 3.1) * 80 * u;
        return (
          <rect
            key={k}
            x={x + dx - ancho * 0.11}
            y={y + dy - alto * 0.07}
            width={ancho * 0.22}
            height={alto * 0.14}
            rx={8}
            fill={k % 5 === 0 ? color : "#3a3d44"}
            opacity={1 - 0.8 * u}
            transform={`rotate(${u * (k * 37 % 180 - 90)} ${x + dx} ${y + dy})`}
          />
        );
      })}
    </g>
  );
};
