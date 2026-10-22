import { Easing, interpolate, spring } from "remotion";

export const SUAVE = Easing.bezier(0.16, 1, 0.3, 1);
export const ENTRA_SALE = Easing.bezier(0.65, 0, 0.35, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0 → 1 entre los frames a y b. */
export const entre = (frame: number, a: number, b: number, easing = SUAVE) =>
  interpolate(frame, [a, Math.max(a + 1, b)], [0, 1], { ...clamp, easing });

/** Resorte que arranca en `desde`. */
export const resorte = (
  frame: number,
  fps: number,
  desde: number,
  config: { damping?: number; stiffness?: number; mass?: number } = {},
) => spring({ frame: frame - desde, fps, config: { damping: 14, stiffness: 140, ...config } });

/** Formato numérico argentino: 10.875 / 2,2 */
export const formatear = (n: number, decimales = 0) => {
  const fijo = Math.abs(n).toFixed(decimales);
  const [entero, dec] = fijo.split(".");
  const conPuntos = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${n < 0 ? "−" : ""}${conPuntos}${dec ? `,${dec}` : ""}`;
};

/** Oscilación suave para que nada quede quieto. */
export const flotar = (frame: number, periodo = 180, amplitud = 6, fase = 0) =>
  Math.sin(((frame + fase) / periodo) * Math.PI * 2) * amplitud;
