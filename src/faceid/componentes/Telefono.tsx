import React from "react";
import { COLOR } from "../../comun/tema";
import { Candado } from "./Candado";

/** Tamaño del teléfono en coordenadas locales (origen en el centro). */
export const TEL = { ancho: 300, alto: 620 };

/** Sensores del notch en coordenadas locales. */
export const SENSORES = {
  camaraIR: [-58, -293] as [number, number],
  iluminador: [-34, -293] as [number, number],
  frontal: [36, -293] as [number, number],
  proyector: [60, -293] as [number, number],
};

export type Ubicacion = { x: number; y: number; rot: number; escala: number };

/** Convierte un punto local del teléfono a coordenadas del lienzo. */
export const aLienzo = ([lx, ly]: [number, number], u: Ubicacion): [number, number] => {
  const a = (u.rot * Math.PI) / 180;
  const x = lx * u.escala;
  const y = ly * u.escala;
  return [u.x + x * Math.cos(a) - y * Math.sin(a), u.y + x * Math.sin(a) + y * Math.cos(a)];
};

export type Pantalla = "apagada" | "bloqueado" | "desbloqueado";

/**
 * Teléfono de frente, con notch (cámara infrarroja, iluminador, cámara frontal
 * y proyector de puntos). `apertura` anima el candado de la pantalla.
 */
export const Telefono: React.FC<{
  ubicacion: Ubicacion;
  pantalla?: Pantalla;
  apertura?: number;
  /** 0..1: brillo de los emisores infrarrojos (se ven como un destello tenue). */
  emision?: number;
  /** Rayos X: muestra el chip por dentro de la pantalla. */
  children?: React.ReactNode;
}> = ({ ubicacion: u, pantalla = "bloqueado", apertura = 0, emision = 0, children }) => {
  const { ancho: W, alto: H } = TEL;
  const sensor = (pos: [number, number], r: number, color: string, brillo = 0) => (
    <g>
      {brillo > 0 ? <circle cx={pos[0]} cy={pos[1]} r={r * 3.2} fill={COLOR.magenta} opacity={0.35 * brillo} /> : null}
      <circle cx={pos[0]} cy={pos[1]} r={r} fill="#0b0c0e" stroke="#2c2f36" strokeWidth={1.2} />
      <circle cx={pos[0] - r * 0.3} cy={pos[1] - r * 0.3} r={r * 0.35} fill={color} opacity={0.8} />
    </g>
  );
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}
    >
      <defs>
        <linearGradient id="telCuerpo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4a4e57" />
          <stop offset="100%" stopColor="#1b1d22" />
        </linearGradient>
        <linearGradient id="telPantalla" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d2026" />
          <stop offset="100%" stopColor="#101114" />
        </linearGradient>
        <filter id="telSombra" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="18" dy="34" stdDeviation="22" floodColor="#000" floodOpacity="0.55" />
        </filter>
      </defs>
      <g transform={`translate(${u.x} ${u.y}) rotate(${u.rot}) scale(${u.escala})`}>
        <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={46} fill="url(#telCuerpo)" filter="url(#telSombra)" />
        <rect x={-W / 2 + 4} y={-H / 2 + 4} width={W - 8} height={H - 8} rx={42} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={2} />
        <rect x={-W / 2 + 12} y={-H / 2 + 12} width={W - 24} height={H - 24} rx={36} fill="url(#telPantalla)" />
        {pantalla !== "apagada" ? (
          <g transform={`translate(0 -30)`}>
            <Candado x={0} y={0} tamano={74} apertura={apertura} color={apertura > 0.5 ? COLOR.verde : COLOR.texto} />
          </g>
        ) : null}
        {children}
        {/* Notch */}
        <rect x={-82} y={-H / 2 + 10} width={164} height={30} rx={15} fill="#08090b" />
        <rect x={-14} y={-H / 2 + 22} width={30} height={5} rx={2.5} fill="#24272d" />
        {sensor(SENSORES.camaraIR, 6, "#5a3140")}
        {sensor(SENSORES.iluminador, 4.5, "#3c2a33", emision * 0.6)}
        {sensor(SENSORES.frontal, 6, "#2d4a66")}
        {sensor(SENSORES.proyector, 5.5, "#5a3140", emision)}
      </g>
    </svg>
  );
};
