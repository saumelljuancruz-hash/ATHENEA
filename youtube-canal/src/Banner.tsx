import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, DISPLAY, MONO } from "./theme";

// Banner del canal de YouTube: 2560 × 1440.
// Zona segura (lo único que se ve en el celular): 1546 × 423, centrada.
// En la compu se ve la franja completa de 2560 × 423; en la tele, todo.
export const W = 2560;
export const H = 1440;
export const SAFE = { x: (W - 1546) / 2, y: (H - 423) / 2, w: 1546, h: 423 };
const TEAL = "#3ee0c0";
const LOGO = { cx: SAFE.x + 190, cy: H / 2 };

/** Íconos de los temas del canal, en línea fina con brillo. */
const Icono: React.FC<{ tipo: string; size: number; color: string }> = ({ tipo, size, color }) => {
  const stroke = { fill: "none", stroke: color, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: `drop-shadow(0 0 14px ${color})` }}>
      {tipo === "rayo" ? <path d="M 58 6 L 24 56 H 48 L 40 94 L 76 40 H 52 Z" {...stroke} /> : null}
      {tipo === "pelota" ? (
        <g {...stroke}>
          <circle cx={50} cy={50} r={40} />
          <polygon points="50,32 66,44 60,63 40,63 34,44" />
          <path d="M 50 32 V 12 M 66 44 L 86 38 M 60 63 L 72 82 M 40 63 L 28 82 M 34 44 L 14 38" />
        </g>
      ) : null}
      {tipo === "moneda" ? (
        <g {...stroke}>
          <circle cx={50} cy={50} r={40} />
          <path d="M 42 28 V 72 M 54 28 V 72 M 36 34 H 58 C 70 34 70 50 58 50 H 36 M 58 50 C 72 50 72 66 58 66 H 36" />
        </g>
      ) : null}
      {tipo === "celular" ? (
        <g {...stroke}>
          <rect x={28} y={8} width={44} height={84} rx={10} />
          <path d="M 44 18 H 56" />
          <circle cx={50} cy={80} r={3} />
        </g>
      ) : null}
      {tipo === "lupa" ? (
        <g {...stroke}>
          <circle cx={42} cy={42} r={26} />
          <path d="M 61 61 L 88 88" strokeWidth={9} />
        </g>
      ) : null}
      {tipo === "ola" ? <path d="M 6 62 C 20 30 40 30 50 52 C 58 68 74 70 94 46 M 6 82 C 24 66 40 72 54 80 C 68 88 82 84 94 72" {...stroke} /> : null}
      {tipo === "espejo" ? (
        <g {...stroke}>
          <ellipse cx={50} cy={44} rx={28} ry={36} />
          <path d="M 50 80 V 94 M 36 94 H 64 M 38 30 L 50 20" />
        </g>
      ) : null}
      {tipo === "atomo" ? (
        <g {...stroke}>
          {[0, 60, 120].map((r) => (
            <ellipse key={r} cx={50} cy={50} rx={42} ry={15} transform={`rotate(${r} 50 50)`} />
          ))}
          <circle cx={50} cy={50} r={5} fill={color} />
        </g>
      ) : null}
    </svg>
  );
};

// Posiciones de los íconos: fuera de la zona segura (se ven en la compu y la tele).
const ICONOS: { tipo: string; x: number; y: number; s: number; r: number; color: string; o: number }[] = [
  { tipo: "rayo", x: 170, y: 560, s: 150, r: -12, color: C.yellow, o: 0.9 },
  { tipo: "moneda", x: 360, y: 760, s: 120, r: 10, color: TEAL, o: 0.75 },
  { tipo: "celular", x: 120, y: 820, s: 110, r: -8, color: TEAL, o: 0.6 },
  { tipo: "pelota", x: 2230, y: 560, s: 150, r: 14, color: TEAL, o: 0.85 },
  { tipo: "ola", x: 2130, y: 790, s: 130, r: -6, color: TEAL, o: 0.6 },
  { tipo: "espejo", x: 2390, y: 780, s: 110, r: 8, color: C.yellow, o: 0.7 },
  // Solo en la tele (arriba y abajo de la franja)
  { tipo: "atomo", x: 700, y: 230, s: 130, r: 0, color: TEAL, o: 0.35 },
  { tipo: "lupa", x: 1800, y: 210, s: 130, r: 0, color: C.yellow, o: 0.35 },
  { tipo: "rayo", x: 1980, y: 1120, s: 120, r: 18, color: TEAL, o: 0.3 },
  { tipo: "moneda", x: 560, y: 1130, s: 110, r: 0, color: C.yellow, o: 0.3 },
];

export const Banner: React.FC<{ zonas?: boolean }> = ({ zonas = false }) => (
  <AbsoluteFill style={{ backgroundColor: "#04070c", width: W, height: H, overflow: "hidden" }}>
    {/* Brillo turquesa detrás del logo y franja central un poco más clara */}
    <AbsoluteFill style={{ background: `radial-gradient(900px 700px at ${LOGO.cx}px ${LOGO.cy}px, #0d3a36 0%, transparent 70%)` }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 25%, rgba(62,224,192,0.05) 50%, transparent 75%)" }} />
    {/* El radar del logo, gigante */}
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {[260, 420, 600, 800, 1020, 1260, 1520].map((r, i) => (
        <circle key={r} cx={LOGO.cx} cy={LOGO.cy} r={r} fill="none" stroke={TEAL} strokeWidth={i < 2 ? 4 : 3} opacity={0.22 - i * 0.025} />
      ))}
      {[
        [LOGO.cx, LOGO.cy - 300, LOGO.cx, LOGO.cy - 250],
        [LOGO.cx, LOGO.cy + 250, LOGO.cx, LOGO.cy + 300],
        [LOGO.cx - 300, LOGO.cy, LOGO.cx - 250, LOGO.cy],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b95a8" strokeWidth={5} opacity={0.6} />
      ))}
      {/* Barrido del radar */}
      <path d={`M ${LOGO.cx} ${LOGO.cy} L ${LOGO.cx + 1600} ${LOGO.cy - 620} A 1716 1716 0 0 1 ${LOGO.cx + 1700} ${LOGO.cy - 160} Z`} fill="url(#barrido)" />
      <defs>
        <linearGradient id="barrido" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={TEAL} stopOpacity={0.12} />
          <stop offset="1" stopColor={TEAL} stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* Puntitos de "datos" en el radar */}
      {[
        [1180, 420, 6],
        [1500, 1010, 5],
        [2010, 470, 7],
        [860, 1000, 5],
        [2300, 1000, 6],
        [420, 400, 5],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={TEAL} opacity={0.7} />
      ))}
    </svg>
    {ICONOS.map((ic, i) => (
      <div key={i} style={{ position: "absolute", left: ic.x - ic.s / 2, top: ic.y - ic.s / 2, rotate: `${ic.r}deg`, opacity: ic.o }}>
        <Icono tipo={ic.tipo} size={ic.s} color={ic.color} />
      </div>
    ))}

    {/* Zona segura: logo + nombre + bajada */}
    <div style={{ position: "absolute", left: LOGO.cx - 170, top: LOGO.cy - 170, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", border: `6px solid ${TEAL}`, boxShadow: `0 0 80px ${TEAL}66, 0 0 0 14px rgba(62,224,192,0.12)` }}>
      <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%" }} />
    </div>
    <div style={{ position: "absolute", left: SAFE.x + 430, top: SAFE.y + 6, display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 132, lineHeight: 0.98, letterSpacing: -3, color: C.white, textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>NADIE TE LO</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 132, lineHeight: 0.98, letterSpacing: -3, color: C.yellow, textShadow: `0 0 50px ${C.yellow}66, 0 8px 30px rgba(0,0,0,0.8)` }}>EXPLICÓ</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 40, color: "rgba(255,255,255,0.85)", marginTop: 16 }}>Cómo funcionan las cosas que usás todos los días</div>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        {["SHORTS", "VIDEOS LARGOS"].map((t) => (
          <div key={t} style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: TEAL, padding: "8px 18px", borderRadius: 30, border: `2px solid ${TEAL}88`, background: "rgba(0,0,0,0.35)" }}>{t}</div>
        ))}
      </div>
    </div>

    {zonas ? (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: SAFE.y, height: SAFE.h, border: "4px dashed #ff9f43" }} />
        <div style={{ position: "absolute", left: SAFE.x, top: SAFE.y, width: SAFE.w, height: SAFE.h, border: "6px solid #ff3b5c" }} />
        <div style={{ position: "absolute", left: SAFE.x + 10, top: SAFE.y + SAFE.h + 10, fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: "#ff3b5c" }}>CELULAR (se ve solo esto)</div>
        <div style={{ position: "absolute", left: 20, top: SAFE.y - 50, fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: "#ff9f43" }}>COMPU (franja completa)</div>
        <div style={{ position: "absolute", left: 20, top: 20, fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: "#ffffff" }}>TELE (todo)</div>
      </>
    ) : null}
  </AbsoluteFill>
);
