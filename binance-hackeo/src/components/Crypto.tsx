import React from "react";
import korea from "../korea.json";
import { fmt, Label, Panel } from "./Ui";
import { TEAL } from "./Props";
import { C, DISPLAY, MONO } from "../theme";

export const COINS: Record<string, { color: string; text?: string }> = {
  BTC: { color: "#f7931a" },
  ETH: { color: "#627eea" },
  USDT: { color: "#26a17b" },
  USDC: { color: "#2775ca" },
  XRP: { color: "#2b3138" },
  SOL: { color: "#9945ff" },
  TRX: { color: "#e5262d" },
  AVAX: { color: "#e84142" },
  POL: { color: "#8247e5" },
  ARB: { color: "#28a0f0" },
  OP: { color: "#ff0420" },
  BASE: { color: "#0052ff" },
};

export const Coin: React.FC<{ symbol: string; size: number; style?: React.CSSProperties }> = ({ symbol, size, style }) => {
  const coin = COINS[symbol] ?? { color: "#555" };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, ${coin.color}, ${coin.color}cc 60%, #00000066 100%)`,
        border: `${size * 0.06}px solid rgba(255,255,255,0.35)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontWeight: 800,
        fontSize: size * (symbol.length > 3 ? 0.24 : 0.3),
        color: "#fff",
        boxShadow: `0 0 ${size * 0.3}px ${coin.color}88`,
        ...style,
      }}
    >
      {symbol}
    </div>
  );
};

/** Pantalla de un exchange genérico: saldo, monedas y botón de retirar. */
export const ExchangeScreen: React.FC<{ balance: number; pressed?: number; width: number }> = ({ balance, pressed = 0, width }) => (
  <div style={{ width, height: width * 2.05, background: "linear-gradient(180deg, #11161f, #07090e)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: width * 0.2, gap: width * 0.04 }}>
    <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: width * 0.05, color: C.dim, letterSpacing: 2 }}>BILLETERA CALIENTE</div>
    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: width * 0.085, color: balance > 1e9 ? C.white : C.positive }}>US$ {fmt(balance)}</div>
    <div style={{ width: width * 0.86, display: "flex", flexDirection: "column", gap: width * 0.025, marginTop: width * 0.04 }}>
      {["ETH", "BTC", "USDT", "USDC", "XRP", "SOL"].map((s) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: width * 0.04, padding: `${width * 0.02}px ${width * 0.03}px`, borderRadius: width * 0.03, background: "rgba(255,255,255,0.05)" }}>
          <Coin symbol={s} size={width * 0.11} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: width * 0.05, color: C.white, flex: 1 }}>{s}</div>
          <div style={{ width: width * 0.3, height: width * 0.03, borderRadius: width * 0.015, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{ width: `${Math.max(0, Math.min(1, balance / 6.3e9)) * 100}%`, height: "100%", background: COINS[s].color }} />
          </div>
        </div>
      ))}
    </div>
    <div
      style={{
        marginTop: width * 0.05,
        width: width * 0.7,
        height: width * 0.16,
        borderRadius: width * 0.05,
        background: C.yellow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: width * 0.07,
        color: "#1a1400",
        scale: String(1 - pressed * 0.06),
        boxShadow: `0 0 ${30 + pressed * 40}px ${C.yellow}88`,
      }}
    >
      RETIRAR
    </div>
  </div>
);

export const Laptop: React.FC<{ width: number; infected: number }> = ({ width, infected }) => (
  <svg width={width} height={width * 0.7} viewBox="0 0 400 280" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${40 * infected}px rgba(255,90,78,${infected}))` }}>
    <rect x={50} y={20} width={300} height={190} rx={14} fill="#1a2030" stroke={infected > 0.5 ? C.positive : "#5a6680"} strokeWidth={8} />
    <rect x={66} y={36} width={268} height={158} rx={6} fill="#05070c" />
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <rect key={i} x={84 + (i % 2) * 20} y={54 + i * 22} width={120 + ((i * 37) % 90)} height={8} rx={4} fill={infected > 0.5 ? C.positive : TEAL} opacity={0.75} />
    ))}
    <path d="M 20 222 H 380 L 360 252 H 40 Z" fill="#2a3245" />
    {infected > 0 ? (
      <g opacity={infected} transform="translate(270 90)">
        <path d="M 0 -42 L 40 30 H -40 Z" fill={C.positive} stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
        <rect x={-4} y={-18} width={8} height={26} rx={3} fill="#fff" />
        <circle cx={0} cy={18} r={5} fill="#fff" />
      </g>
    ) : null}
  </svg>
);

/** Servidor que firma los retiros. */
export const Signer: React.FC<{ width: number; hot: number }> = ({ width, hot }) => (
  <svg width={width} height={width * 1.1} viewBox="0 0 300 330" style={{ overflow: "visible" }}>
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <rect x={30} y={20 + i * 90} width={240} height={74} rx={14} fill="#1a2030" stroke={hot > 0.5 ? C.positive : "#5a6680"} strokeWidth={6} />
        <circle cx={66} cy={57 + i * 90} r={10} fill={hot > 0.5 ? C.positive : TEAL} />
        <rect x={96} y={50 + i * 90} width={140} height={12} rx={6} fill="#3a4560" />
      </g>
    ))}
    <path d="M 70 312 C 110 280 140 330 180 300 C 200 286 220 300 240 290" fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" />
  </svg>
);

export const Fingerprint: React.FC<{ size: number; color?: string }> = ({ size, color = TEAL }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120">
    {[14, 24, 34, 44, 54].map((r, i) => (
      <path key={r} d={`M ${-r} ${8 - i} A ${r} ${r * 1.15} 0 1 1 ${r} ${8 - i}`} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeDasharray={i % 2 ? "40 10" : undefined} />
    ))}
  </svg>
);

export const Stopwatch: React.FC<{ minutes: number; size?: number; color?: string }> = ({ minutes, size = 64, color = C.positive }) => {
  const m = Math.floor(minutes);
  const s = Math.floor((minutes - m) * 60);
  return (
    <Panel glow={color} style={{ display: "flex", alignItems: "center", gap: size * 0.3, padding: `${size * 0.15}px ${size * 0.4}px` }}>
      <svg width={size} height={size} viewBox="-60 -60 120 120">
        <circle r={48} fill="none" stroke="#fff" strokeWidth={8} />
        <rect x={-9} y={-66} width={18} height={14} rx={4} fill="#fff" />
        <line x1={0} y1={0} x2={0} y2={-36} stroke={color} strokeWidth={8} strokeLinecap="round" transform={`rotate(${minutes * 18})`} />
      </svg>
      <Label size={size * 1.05} mono color={color}>
        {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
      </Label>
    </Panel>
  );
};

/** Silueta encapuchada: los atacantes. */
export const Hacker: React.FC<{ size: number; color?: string }> = ({ size, color = "#1a1f2b" }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 200 220">
    <path d="M 100 8 C 150 8 176 48 176 96 L 176 150 C 196 162 200 190 200 220 H 0 C 0 190 4 162 24 150 L 24 96 C 24 48 50 8 100 8 Z" fill={color} stroke="#3a4560" strokeWidth={4} />
    <ellipse cx={100} cy={110} rx={50} ry={58} fill="#05070c" />
    <circle cx={80} cy={106} r={7} fill={C.positive} />
    <circle cx={120} cy={106} r={7} fill={C.positive} />
  </svg>
);

/** Península de Corea con Corea del Norte resaltada. */
export const KoreaMap: React.FC<{ highlight: number; pulse: number; scale?: number }> = ({ highlight, pulse, scale = 1 }) => (
  <svg width={1080 * scale} height={1240 * scale} viewBox="0 0 1080 1240" style={{ overflow: "visible" }}>
    <path d={korea.around} fill="#111a2c" stroke="#2b3a57" strokeWidth={2} />
    <path d={korea.south} fill="#1b2946" stroke="#5a6680" strokeWidth={3} />
    <path d={korea.north} fill={`rgba(255,90,78,${0.25 + 0.55 * highlight})`} stroke={C.positive} strokeWidth={4} />
    <circle cx={korea.pyongyang[0]} cy={korea.pyongyang[1]} r={14} fill={C.positive} />
    <circle cx={korea.pyongyang[0]} cy={korea.pyongyang[1]} r={14 + pulse * 60} fill="none" stroke={C.positive} strokeWidth={5} opacity={1 - pulse} />
  </svg>
);

export const Snowflake: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100">
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a})`} stroke="#e8f8ff" strokeWidth={7} strokeLinecap="round">
        <line x1={-42} y1={0} x2={42} y2={0} />
        <line x1={26} y1={0} x2={36} y2={-10} />
        <line x1={26} y1={0} x2={36} y2={10} />
        <line x1={-26} y1={0} x2={-36} y2={-10} />
        <line x1={-26} y1={0} x2={-36} y2={10} />
      </g>
    ))}
  </svg>
);

export const SendIcon: React.FC<{ filled: number; size: number }> = ({ filled, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 8 46 L 92 10 L 64 92 L 46 58 Z" fill={filled > 0 ? C.yellow : "transparent"} fillOpacity={filled} stroke={filled > 0.5 ? C.yellow : C.white} strokeWidth={7} strokeLinejoin="round" />
    <path d="M 46 58 L 92 10" stroke={filled > 0.5 ? "#1a1400" : C.white} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Billetera caliente: la de Binance que vaciaron. */
export const Wallet: React.FC<{ width: number; open?: number }> = ({ width, open = 0 }) => (
  <svg width={width} height={width * 0.72} viewBox="0 0 300 216" style={{ overflow: "visible" }}>
    <rect x={10} y={30} width={280} height={176} rx={26} fill="#1d2433" stroke={C.yellow} strokeWidth={8} />
    <path d={`M 10 ${70 - open * 40} Q 150 ${20 - open * 70} 290 ${70 - open * 40}`} fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" opacity={0.6} />
    <rect x={190} y={92} width={110} height={56} rx={16} fill="#2a3245" stroke={C.yellow} strokeWidth={7} />
    <circle cx={222} cy={120} r={11} fill={C.yellow} />
  </svg>
);

export const Lock: React.FC<{ size: number; color?: string }> = ({ size, color = "#e8f8ff" }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 30 46 V 32 A 20 20 0 0 1 70 32 V 46" fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
    <rect x={18} y={44} width={64} height={48} rx={10} fill={color} />
    <circle cx={50} cy={64} r={7} fill="#1b3a52" />
    <rect x={46} y={66} width={8} height={14} rx={3} fill="#1b3a52" />
  </svg>
);

/** Capa de hielo que se forma sobre algo: 0 nada, 1 congelado. */
export const Ice: React.FC<{ amount: number; width: number; height: number; radius?: number }> = ({ amount, width, height, radius = 30 }) => {
  if (amount <= 0) {
    return null;
  }
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id={`ice${width}${height}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dff6ff" stopOpacity={0.75} />
          <stop offset="0.5" stopColor="#7fd3ff" stopOpacity={0.45} />
          <stop offset="1" stopColor="#bfeaff" stopOpacity={0.7} />
        </linearGradient>
      </defs>
      <rect x={-12} y={-12} width={width + 24} height={height + 24} rx={radius} fill={`url(#ice${width}${height})`} stroke="#e8f8ff" strokeWidth={5} opacity={amount} />
      {[0.18, 0.42, 0.7].map((f, i) => (
        <path
          key={f}
          d={`M ${width * f} -12 L ${width * (f + 0.06)} ${height * 0.35} L ${width * (f - 0.03)} ${height * 0.6} L ${width * (f + 0.05)} ${height + 12}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth={3}
          opacity={amount * (0.5 + i * 0.15)}
          strokeDasharray={height * 1.4}
          strokeDashoffset={height * 1.4 * (1 - amount)}
        />
      ))}
    </svg>
  );
};

/** Barra de progreso con porcentaje. */
export const Progress: React.FC<{ value: number; width: number; color?: string }> = ({ value, width, color = TEAL }) => (
  <div style={{ width, height: 64, borderRadius: 32, background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", overflow: "hidden" }}>
    <div style={{ width: `${value * 100}%`, height: "100%", borderRadius: 32, background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 30px ${color}` }} />
  </div>
);
