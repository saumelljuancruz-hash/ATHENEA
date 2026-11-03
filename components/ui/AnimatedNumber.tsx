"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Número que se anima hasta `value`.
 * - startOnView: arranca cuando entra en pantalla (contadores).
 * - Si no, se anima cada vez que cambia el valor (calculadora, configurador).
 */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  duration = 0.8,
  startOnView = false,
  className,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  startOnView?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(startOnView ? 0 : value);
  const fromRef = useRef(startOnView ? 0 : value);

  useEffect(() => {
    if (startOnView && !inView) return;
    const from = fromRef.current;
    if (reduce || from === value) {
      fromRef.current = value;
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const v = from + (value - from) * easeOut(p);
      fromRef.current = v;
      setDisplay(v);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, inView, startOnView, reduce, duration]);

  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  );
}
