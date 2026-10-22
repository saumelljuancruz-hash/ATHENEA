import React from "react";
import { COLOR } from "../../comun/tema";

/**
 * Avioncito visto desde arriba, con sombra desplazada en el piso para que se
 * lea "en altura" sobre la maqueta. Se dibuja dentro de un <svg>.
 * `angulo` en grados (0 = apunta a la derecha).
 */
export const Avion: React.FC<{
  x: number;
  y: number;
  angulo: number;
  tamano?: number;
  color?: string;
  altura?: number;
  opacidad?: number;
}> = ({ x, y, angulo, tamano = 58, color = "#ffffff", altura = 22, opacidad = 1 }) => {
  const s = tamano / 100;
  const forma =
    "M50 0 C55 0 58 8 58 18 L58 38 L98 60 L98 70 L58 58 L58 80 L70 90 L70 97 L50 92 L30 97 L30 90 L42 80 L42 58 L2 70 L2 60 L42 38 L42 18 C42 8 45 0 50 0 Z";
  const cuerpo = (relleno: string, extra?: React.SVGProps<SVGPathElement>) => (
    <path d={forma} transform={`translate(-50 -50)`} fill={relleno} {...extra} />
  );
  return (
    <g opacity={opacidad}>
      <g transform={`translate(${x + altura * 0.6} ${y + altura}) rotate(${angulo + 90}) scale(${s})`} opacity={0.35}>
        {cuerpo("#000")}
      </g>
      <g transform={`translate(${x} ${y}) rotate(${angulo + 90}) scale(${s})`}>
        {cuerpo(color, { stroke: "rgba(0,0,0,0.35)", strokeWidth: 2 })}
        <rect x={-4} y={-40} width={8} height={10} rx={3} fill={COLOR.verde} />
      </g>
    </g>
  );
};
