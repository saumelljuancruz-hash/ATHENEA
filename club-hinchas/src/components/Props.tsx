import React from "react";
import { DISPLAY, MONO } from "../theme";

export const TEAL = "#3ee0c0";

/** Celular con la cámara frontal abierta. */
export const Phone: React.FC<{ width: number; children?: React.ReactNode; ui?: number; zoomLabel?: string; style?: React.CSSProperties; lensGlow?: number }> = ({
  width,
  children,
  ui = 1,
  zoomLabel,
  style,
  lensGlow = 0,
}) => {
  const height = width * 2.05;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: width * 0.14,
        background: "#0b0f17",
        border: `${width * 0.03}px solid #2a3245`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.06)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
      {/* Cámara frontal */}
      <div
        style={{
          position: "absolute",
          top: width * 0.05,
          left: "50%",
          translate: "-50% 0",
          width: width * 0.075,
          height: width * 0.075,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #4a6b9a, #05070c 60%)",
          boxShadow: lensGlow > 0 ? `0 0 ${30 * lensGlow}px ${12 * lensGlow}px rgba(255,80,80,${0.8 * lensGlow})` : "none",
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: width * 0.08, display: "flex", flexDirection: "column", alignItems: "center", gap: width * 0.04, opacity: ui }}>
        {zoomLabel ? (
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: width * 0.06, color: "#fff", background: "rgba(0,0,0,0.5)", borderRadius: 40, padding: `${width * 0.012}px ${width * 0.035}px` }}>{zoomLabel}</div>
        ) : null}
        <div style={{ display: "flex", gap: width * 0.06, fontFamily: DISPLAY, fontWeight: 800, fontSize: width * 0.045, color: "rgba(255,255,255,0.6)" }}>
          <span>VIDEO</span>
          <span style={{ color: "#ffd84d" }}>FOTO</span>
          <span>RETRATO</span>
        </div>
        <div style={{ width: width * 0.2, height: width * 0.2, borderRadius: "50%", border: `${width * 0.015}px solid #fff`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: width * 0.16, height: width * 0.16, borderRadius: "50%", background: "#fff" }} />
        </div>
      </div>
    </div>
  );
};

/** Espejo ovalado con marco y brillo del vidrio. */
export const Mirror: React.FC<{ width: number; children?: React.ReactNode; glow?: number }> = ({ width, children, glow = 0 }) => {
  const height = width * 1.3;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: "50%",
        padding: width * 0.035,
        background: "linear-gradient(140deg, #f6e7c1, #b48a4a 40%, #f2d9a0 60%, #8a6630)",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 ${60 * glow}px rgba(62,224,192,${0.7 * glow})`,
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle at 50% 40%, #2c4a55, #0d1a20 75%)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        {children}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 30%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.12) 100%)" }} />
      </div>
    </div>
  );
};

/** Foto impresa, estilo polaroid. */
export const Polaroid: React.FC<{ width: number; caption: string; children?: React.ReactNode; sepia?: number }> = ({ width, caption, children, sepia = 0 }) => (
  <div style={{ width, padding: `${width * 0.06}px ${width * 0.06}px ${width * 0.2}px`, background: "#f4efe6", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,0.55)", position: "relative" }}>
    <div style={{ width: "100%", height: width * 0.98, background: "#2a3a40", overflow: "hidden", display: "flex", alignItems: "flex-end", justifyContent: "center", filter: sepia ? `sepia(${sepia})` : undefined }}>{children}</div>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: width * 0.05, textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: width * 0.1, color: "#28323a" }}>{caption}</div>
  </div>
);

/** Ícono de cerebro; `alarm` lo pone en rojo. */
export const Brain: React.FC<{ size: number; alarm?: number; color?: string }> = ({ size, alarm = 0, color = TEAL }) => {
  const stroke = alarm > 0.5 ? "#ff5a4e" : color;
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 220 180" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${18 + alarm * 20}px ${stroke})` }}>
      <path
        d="M 110 22 C 90 4 52 8 44 34 C 18 36 6 62 18 82 C 4 100 12 130 36 138 C 40 162 72 172 92 156 C 100 166 108 168 110 166 C 112 168 120 166 128 156 C 148 172 180 162 184 138 C 208 130 216 100 202 82 C 214 62 202 36 176 34 C 168 8 130 4 110 22 Z"
        fill={alarm > 0.5 ? "rgba(255,90,78,0.18)" : "rgba(62,224,192,0.12)"}
        stroke={stroke}
        strokeWidth={8}
        strokeLinejoin="round"
      />
      <g fill="none" stroke={stroke} strokeWidth={6} strokeLinecap="round">
        <path d="M 110 26 L 110 160" />
        <path d="M 58 54 C 72 60 76 76 66 88" />
        <path d="M 40 100 C 58 98 70 110 66 126" />
        <path d="M 162 54 C 148 60 144 76 154 88" />
        <path d="M 180 100 C 162 98 150 110 154 126" />
        <path d="M 86 120 C 92 132 88 142 80 146" />
        <path d="M 134 120 C 128 132 132 142 140 146" />
      </g>
    </svg>
  );
};

/** Cabeza de perfil mirando a la derecha. La punta de la nariz queda en (262, 150). */
export const ProfileHead: React.FC<{ height: number; ghost?: boolean; mirrored?: boolean }> = ({ height, ghost = false, mirrored = false }) => (
  <svg width={(height / 360) * 300} height={height} viewBox="0 0 300 360" style={{ overflow: "visible", scale: mirrored ? "-1 1" : undefined, opacity: ghost ? 0.45 : 1 }}>
    <path
      d="M 70 360 L 82 300 C 50 280 34 236 40 190 C 24 150 30 70 96 38 C 160 8 236 30 240 100 C 242 118 246 128 262 150 C 252 160 244 162 242 172 C 250 182 246 190 238 194 C 244 204 240 214 230 218 C 234 240 222 262 190 262 L 182 300 L 196 360 Z"
      fill={ghost ? "none" : "#e7ad89"}
      stroke={ghost ? TEAL : "#c98a68"}
      strokeWidth={ghost ? 5 : 3}
      strokeDasharray={ghost ? "12 10" : undefined}
    />
    {ghost ? null : <path d="M 40 190 C 24 150 30 70 96 38 C 160 8 236 30 236 76 C 200 60 160 70 140 96 C 120 120 120 150 104 170 C 80 170 60 180 40 190 Z" fill="#2b1a12" />}
    <circle cx={206} cy={118} r={7} fill={ghost ? TEAL : "#3a2418"} />
  </svg>
);
