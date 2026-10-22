import { GeoProjection } from "d3-geo";
import React, { useId } from "react";
import { crearProyeccion, EstadoMapa, GRATICULA, TIERRA, trazar } from "../geo";
import { COLOR } from "../../comun/tema";

type Props = {
  estado: EstadoMapa;
  /** Capas extra (rutas, resaltados, aviones) dibujadas con la misma proyección. */
  children?: (p: GeoProjection) => React.ReactNode;
  mostrarGrilla?: boolean;
  ancho?: number;
  alto?: number;
  style?: React.CSSProperties;
};

/**
 * Mundo estilo maqueta: globo con sombreado esférico que se convierte en una
 * placa con espesor, continentes extruidos y sombra suave.
 */
export const MapaMaqueta: React.FC<Props> = ({
  estado,
  children,
  mostrarGrilla = true,
  ancho = 1080,
  alto = 1920,
  style,
}) => {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const p = crearProyeccion(estado);
  const esfera = trazar(p, { type: "Sphere" });
  const tierra = trazar(p, TIERRA);
  const grilla = mostrarGrilla ? trazar(p, GRATICULA) : "";

  const t = Math.min(1, Math.max(0, estado.aplanado));
  const R = estado.radioGlobo * estado.escala;
  const [cx, cy] = estado.centro;
  const globo = Math.pow(1 - t, 3);
  const grosor = 18 * t;

  return (
    <svg width={ancho} height={alto} viewBox={`0 0 ${ancho} ${alto}`} style={{ position: "absolute", inset: 0, ...style }}>
      <defs>
        <linearGradient id={`oc${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#272b33" />
          <stop offset="100%" stopColor={COLOR.oceano} />
        </linearGradient>
        <linearGradient id={`ti${id}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor={COLOR.tierraLuz} />
          <stop offset="100%" stopColor={COLOR.tierra} />
        </linearGradient>
        <radialGradient id={`gs${id}`} cx="36%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.16} />
          <stop offset="45%" stopColor="#ffffff" stopOpacity={0} />
          <stop offset="85%" stopColor="#000000" stopOpacity={0.45} />
          <stop offset="100%" stopColor="#000000" stopOpacity={0.7} />
        </radialGradient>
        <filter id={`bl${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={22} />
        </filter>
      </defs>

      {/* Sombra en el piso */}
      <ellipse
        cx={cx}
        cy={cy + R * 1.12}
        rx={R * 0.82}
        ry={R * 0.12}
        fill="#000"
        opacity={0.55 * globo}
        filter={`url(#bl${id})`}
      />
      <path d={esfera} transform="translate(16 38)" fill="#000" opacity={0.5 * t} filter={`url(#bl${id})`} />

      {/* Espesor de la placa */}
      {grosor > 0.5 ? <path d={esfera} transform={`translate(0 ${grosor})`} fill={COLOR.placaLado} /> : null}

      <path d={esfera} fill={`url(#oc${id})`} stroke={COLOR.oceanoBorde} strokeWidth={1.5} />
      {grilla ? <path d={grilla} fill="none" stroke={COLOR.grilla} strokeWidth={1} /> : null}

      {/* Continentes extruidos */}
      <path d={tierra} transform="translate(0 4)" fill={COLOR.tierraLado} />
      <path d={tierra} fill={`url(#ti${id})`} stroke="rgba(255,255,255,0.10)" strokeWidth={0.8} />

      {globo > 0.01 ? (
        <>
          <circle cx={cx} cy={cy} r={R} fill={`url(#gs${id})`} opacity={globo} />
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} opacity={globo} />
        </>
      ) : (
        <path d={esfera} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} />
      )}

      {children?.(p)}
    </svg>
  );
};
