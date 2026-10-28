import { Easing, interpolate } from "remotion";

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const pop = Easing.spring({ damping: 11 });

/** 0 → 1 entre los frames a y b (a < b), con clamp. */
export const ramp = (frame: number, a: number, b: number, easing: (t: number) => number = easeOut) =>
  interpolate(frame, [a, Math.max(a + 1, b)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

/** Sube de 0 a 1 en [a, a+inLen] y vuelve a 0 en [b, b+outLen]. */
export const window01 = (frame: number, a: number, b: number, inLen = 8, outLen = 8) =>
  Math.min(ramp(frame, a, a + inLen), 1 - ramp(frame, b, b + outLen, easeInOut));

export const mix = (t: number, from: number, to: number) => from + (to - from) * t;
