import React, { useLayoutEffect, useRef } from "react";

/** Canvas de 1080×1920 que se redibuja en cada frame con `dibujar`. */
export const Lienzo: React.FC<{
  dibujar: (ctx: CanvasRenderingContext2D) => void;
  style?: React.CSSProperties;
}> = ({ dibujar, style }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 1080, 1920);
    dibujar(ctx);
  });
  return <canvas ref={ref} width={1080} height={1920} style={{ position: "absolute", inset: 0, ...style }} />;
};
