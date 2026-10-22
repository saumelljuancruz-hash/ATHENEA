import { UbicacionMO } from "../componentes/Microondas";

/** Microondas centrado en el área segura, en el tercio medio del cuadro. */
export const MO_ESCENA: UbicacionMO = { x: 505, y: 760, escala: 1.08 };

/** Área donde se reparten las moléculas (deja libre la izquierda para el termómetro). */
export const AREA_MOLECULAS = { x0: 200, x1: 920, y0: 330, y1: 1200 };

/** Fase de un giro cuya frecuencia sube linealmente de f0 a f1 (Hz) en T segundos y luego se mantiene. */
export const faseAcelerada = (t: number, f0: number, f1: number, T: number) => {
  if (t <= 0) return 0;
  if (t < T) return 2 * Math.PI * (f0 * t + ((f1 - f0) * t * t) / (2 * T));
  return 2 * Math.PI * (f0 * T + ((f1 - f0) * T) / 2 + f1 * (t - T));
};
