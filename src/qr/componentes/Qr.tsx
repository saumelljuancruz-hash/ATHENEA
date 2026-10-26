import QRCode from "qrcode";
import React from "react";
import { random, staticFile } from "remotion";
import { COLOR, FUENTE } from "../../comun/tema";
import { CONTENIDO_QR, CUENTA } from "../guion-qr";

/** Matriz real del QR (nivel H: hasta ~30 % de daño). */
const QR = QRCode.create(CONTENIDO_QR, { errorCorrectionLevel: "H" });
export const N = QR.modules.size;
export const oscuro = (r: number, c: number) => QR.modules.data[r * N + c] === 1;
/** Módulos fijos (esquinas, temporización, formato): no llevan datos. */
export const reservado = (r: number, c: number) => (QR.modules as unknown as { reservedBit: Uint8Array }).reservedBit[r * N + c] === 1;

/** Centros de las tres marcas de posición (en módulos). */
export const ESQUINAS: [number, number][] = [
  [3, 3],
  [3, N - 4],
  [N - 4, 3],
];

export type Disposicion = { cx: number; cy: number; modulo: number; rot: number; escala: number };

export const DISPOSICION: Disposicion = { cx: 505, cy: 760, modulo: 18, rot: 0, escala: 1 };

/** Centro de un módulo (fila, columna) en pantalla. */
export const aPantallaQR = (r: number, c: number, d: Disposicion) => {
  const lado = N * d.modulo;
  const x = (c + 0.5) * d.modulo - lado / 2;
  const y = (r + 0.5) * d.modulo - lado / 2;
  const a = (d.rot * Math.PI) / 180;
  return {
    x: d.cx + (x * Math.cos(a) - y * Math.sin(a)) * d.escala,
    y: d.cy + (x * Math.sin(a) + y * Math.cos(a)) * d.escala,
  };
};

const esEsquina = (r: number, c: number) =>
  (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);

export type OpcionesQr = {
  /** 0..1: aparición en ola diagonal. */
  revelado?: number;
  /** 0..1: brillo verde agua en las tres esquinas. */
  esquinas?: number;
  /** 0..1: tinte de módulos de respaldo (azul) vs. datos (verde agua). */
  respaldo?: number;
  /** Zona dañada: centro (en módulos), radio y cuánto (0..1). */
  dano?: { r: number; c: number; radio: number; nivel: number };
  /** 0..1: reconstrucción de la zona dañada. */
  reconstruccion?: number;
  /** 0..1: logo de la cuenta en el centro. */
  logo?: number;
  frame?: number;
};

/** Qué módulos son "respaldo" (aprox. 64 % en versión 4-H): reparto determinista. */
const ES_RESPALDO = Array.from({ length: N * N }, (_, i) => random(`qrr${i}`) < 0.64);

export const TarjetaQr: React.FC<{ d: Disposicion; o?: OpcionesQr; children?: React.ReactNode }> = ({ d, o = {}, children }) => {
  const { revelado = 1, esquinas = 0, respaldo = 0, dano, reconstruccion = 0, logo = 0, frame = 0 } = o;
  const M = d.modulo;
  const lado = N * M;
  const margen = 2.2 * M;
  const modulos: React.ReactNode[] = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const ola = Math.min(1, Math.max(0, (revelado * 1.5 - (r + c) / (2 * N)) * 4));
      if (ola <= 0) continue;
      let negro = oscuro(r, c);
      let color = "#15171b";
      let borde: string | undefined;
      const fijo = reservado(r, c);
      if (esEsquina(r, c) && esquinas > 0 && negro) color = mezclar("#15171b", COLOR.verde, esquinas);
      if (!fijo && respaldo > 0 && negro) color = mezclar("#15171b", ES_RESPALDO[r * N + c] ? COLOR.azul : COLOR.verde, respaldo * 0.85);
      if (dano && dano.nivel > 0) {
        const dist = Math.hypot(r - dano.r, c - dano.c);
        if (dist < dano.radio * dano.nivel) {
          const restaurado = reconstruccion > 0 && random(`rc${r}-${c}`) < reconstruccion;
          if (!restaurado) {
            // Módulos dañados: se invierten o desaparecen.
            negro = random(`dn${r}-${c}-${Math.floor(frame / 6)}`) < 0.5;
            color = "#5a3a2a";
          } else {
            borde = COLOR.verde;
          }
        }
      }
      if (!negro) {
        if (borde) modulos.push(<rect key={`${r}-${c}`} x={c * M + 2} y={r * M + 2} width={M - 4} height={M - 4} rx={3} fill="none" stroke={borde} strokeWidth={1.5} opacity={0.6} />);
        continue;
      }
      const t = M * 0.9 * ola;
      modulos.push(
        <rect
          key={`${r}-${c}`}
          x={c * M + (M - t) / 2}
          y={r * M + (M - t) / 2}
          width={t}
          height={t}
          rx={M * 0.18}
          fill={borde ? COLOR.verde : color}
        />,
      );
    }
  }
  return (
    <g transform={`translate(${d.cx} ${d.cy}) rotate(${d.rot}) scale(${d.escala}) translate(${-lado / 2} ${-lado / 2})`}>
      <defs>
        <filter id="qrSombra" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow dx="14" dy="28" stdDeviation="20" floodColor="#000" floodOpacity="0.55" />
        </filter>
        <radialGradient id="qrMancha">
          <stop offset="0%" stopColor="#6b4a2f" stopOpacity={0.95} />
          <stop offset="70%" stopColor="#7d5634" stopOpacity={0.85} />
          <stop offset="100%" stopColor="#7d5634" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Tarjeta con espesor */}
      <rect x={-margen} y={-margen + 14} width={lado + 2 * margen} height={lado + 2 * margen} rx={26} fill="#9aa0a8" />
      <rect x={-margen} y={-margen} width={lado + 2 * margen} height={lado + 2 * margen} rx={26} fill="#eef0f3" filter="url(#qrSombra)" />
      {modulos}
      {dano && dano.nivel > 0 ? (
        <circle
          cx={(dano.c + 0.5) * M}
          cy={(dano.r + 0.5) * M}
          r={dano.radio * M * dano.nivel * 1.15}
          fill="url(#qrMancha)"
          opacity={0.55 * (1 - reconstruccion * 0.8)}
        />
      ) : null}
      {logo > 0 ? (
        <g transform={`translate(${lado / 2} ${lado / 2}) scale(${logo})`}>
          <rect x={-4.6 * M} y={-4.6 * M} width={9.2 * M} height={9.2 * M} rx={18} fill="#eef0f3" />
          <image href={staticFile(CUENTA.logo)} x={-4 * M} y={-4 * M} width={8 * M} height={8 * M} />
        </g>
      ) : null}
      {children}
    </g>
  );
};

/** Visor de cámara (cuatro esquinas) y línea de escaneo. */
export const Visor: React.FC<{ cx: number; cy: number; lado: number; barrido: number; color?: string; opacidad?: number }> = ({
  cx,
  cy,
  lado,
  barrido,
  color = COLOR.verde,
  opacidad = 1,
}) => {
  const h = lado / 2;
  const l = lado * 0.16;
  const esquina = (sx: number, sy: number) => `M${cx + sx * h} ${cy + sy * (h - l)} V${cy + sy * h} H${cx + sx * (h - l)}`;
  const y = cy - h + lado * barrido;
  return (
    <g opacity={opacidad}>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sy], k) => (
        <path key={k} d={esquina(sx, sy)} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {barrido > 0 && barrido < 1 ? (
        <>
          <rect x={cx - h + 10} y={y - 40} width={lado - 20} height={40} fill={color} opacity={0.12} />
          <line x1={cx - h + 10} y1={y} x2={cx + h - 10} y2={y} stroke={color} strokeWidth={4} />
        </>
      ) : null}
    </g>
  );
};

/** Chip de resultado ("✓ QR leído", link). */
export const Chip: React.FC<{ x: number; y: number; texto: string; color: string; escala: number; mono?: boolean }> = ({ x, y, texto, color, escala, mono }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: String(escala),
      opacity: Math.min(1, escala * 1.5),
      background: "rgba(8,9,11,0.85)",
      border: `2px solid ${color}`,
      borderRadius: 999,
      padding: "12px 26px",
      fontFamily: mono ? FUENTE.mono : FUENTE.inter,
      fontWeight: 800,
      fontSize: mono ? 26 : 34,
      color,
      whiteSpace: "nowrap",
      boxShadow: `0 0 30px ${color}44`,
    }}
  >
    {texto}
  </div>
);

const mezclar = (a: string, b: string, t: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const [x, y] = [h(a), h(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * Math.min(1, Math.max(0, t)))).join(",")})`;
};
