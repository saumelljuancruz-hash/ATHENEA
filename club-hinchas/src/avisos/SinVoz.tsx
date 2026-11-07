import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Bengala, equipo, NUESTRO } from "../components/Futbol";
import { TEAL } from "../components/Props";
import { Background, fmt, Panel, Watermark } from "../components/Ui";
import fixture from "../liga/fixture.json";
import redes from "../liga/redes.json";
import { C, DISPLAY } from "../theme";

// Aviso 9:16 para TikTok: hoy no hay video porque no quedan créditos para la voz.
const ROJO = "#ff4d5e";
const NARANJA = "#ff8a3d";
const BENGALAS = redes.bengalas.acumuladas;
const PARTIDO = fixture.find((f) => f.fecha === redes.bengalas.fecha)?.partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO);
const RIVAL = PARTIDO ? (PARTIDO.local === NUESTRO ? PARTIDO.visitante : PARTIDO.local) : null;

/** Micrófono tachado: "sin voz". */
const MicSinVoz: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <g fill="none" stroke={TEAL} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 14px ${TEAL})` }}>
      <rect x={37} y={10} width={26} height={48} rx={13} />
      <path d="M 25 44 C 25 72 75 72 75 44" />
      <path d="M 50 70 V 84 M 36 88 H 64" />
      <path d="M 43 24 H 57 M 43 33 H 57 M 43 42 H 57" strokeWidth={3} opacity={0.6} />
    </g>
    <path d="M 14 12 L 86 90" stroke={C.bg} strokeWidth={14} strokeLinecap="round" />
    <path d="M 14 12 L 86 90" stroke={ROJO} strokeWidth={7} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${ROJO})` }} />
  </svg>
);

export const AvisoSinVoz: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Background tint="#141a34" />
    <Watermark />
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(62,224,192,0.14), rgba(62,224,192,0) 70%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <MicSinVoz size={280} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 180, color: C.yellow, letterSpacing: -4, lineHeight: 1, textShadow: `0 0 60px ${C.yellow}66` }}>PERDÓN</div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 74, color: C.white, letterSpacing: -1.5, lineHeight: 1 }}>HOY NO HAY VIDEO</div>
    </div>
    <div style={{ position: "absolute", left: 120, right: 120, top: 1000 }}>
      <Panel glow={TEAL} style={{ padding: "34px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: C.white, lineHeight: 1.3 }}>
          Me quedé <span style={{ color: ROJO }}>sin créditos para la voz</span> que narra los videos.
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 36, color: C.dim, lineHeight: 1.35, marginTop: 18 }}>
          Apenas los recargo, vuelven.
          <br />
          Gracias por bancar.
        </div>
      </Panel>
    </div>
    {RIVAL && BENGALAS > 0 ? (
      <div style={{ position: "absolute", left: 120, right: 120, top: 1340, display: "flex", alignItems: "center", gap: 22, padding: "18px 28px", borderRadius: 26, background: "rgba(255,138,61,0.1)", border: `2px solid ${NARANJA}66` }}>
        <Bengala size={56} frame={6} seed={1} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, color: "#ffb27a", lineHeight: 1.3 }}>
          Tranqui: las {fmt(BENGALAS)} bengalas del FC NTLE siguen guardadas para el partido contra {equipo(RIVAL).nombre}.
        </div>
      </div>
    ) : null}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1540, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
      <Img src={staticFile("logo.png")} style={{ width: 96, height: 96, borderRadius: "50%", border: `3px solid ${TEAL}` }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 42, color: C.white }}>@nadietelo.explico</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, color: C.dim }}>Seguime para no perderte la vuelta</div>
      </div>
    </div>
  </AbsoluteFill>
);
