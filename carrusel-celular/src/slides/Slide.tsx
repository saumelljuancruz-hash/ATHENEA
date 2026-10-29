import React from "react";
import { AbsoluteFill } from "remotion";
import { Background, Watermark } from "../components/Ui";
import { TEAL } from "../components/Props";
import { C, DISPLAY, MONO } from "../theme";

export const W = 1080;
export const H = 1350;
export const TOTAL = 8;

/** "El *CLIC* es *FALSO*": lo que va entre asteriscos sale en amarillo. */
export const Highlight: React.FC<{ text: string; size: number; color?: string; accent?: string }> = ({ text, size, color = C.white, accent = C.yellow }) => (
  <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: size, lineHeight: 1.04, letterSpacing: -1.5, color }}>
    {text.split(/(\*[^*]+\*)/).map((part, i) =>
      part.startsWith("*") ? (
        <span key={i} style={{ color: accent, textShadow: `0 0 36px ${accent}66` }}>
          {part.slice(1, -1)}
        </span>
      ) : (
        <React.Fragment key={i}>{part}</React.Fragment>
      ),
    )}
  </span>
);

/** Puntos de avance: cuántos slides van. */
const Progress: React.FC<{ index: number }> = ({ index }) => (
  <div style={{ position: "absolute", left: 70, bottom: 62, display: "flex", gap: 12 }}>
    {new Array(TOTAL).fill(0).map((_, i) => (
      <div key={i} style={{ width: i === index ? 40 : 14, height: 14, borderRadius: 7, background: i === index ? C.yellow : "rgba(255,255,255,0.25)" }} />
    ))}
  </div>
);

export const SwipeHint: React.FC<{ side?: "left" | "right" }> = ({ side = "right" }) => (
  <div style={{ position: "absolute", [side]: 70, bottom: 48, display: "flex", alignItems: "center", gap: 14, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, color: "rgba(255,255,255,0.75)" }}>
    DESLIZÁ
    <svg width={90} height={30} viewBox="0 0 90 30">
      <path d="M 2 15 H 84 M 70 3 L 86 15 L 70 27" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

type FactSlideProps = {
  index: number;
  number: number;
  title: string;
  body: string;
  tint: string;
  children: React.ReactNode;
};

/** Un dato por slide: número, título con palabra clave, ilustración y explicación corta. */
export const FactSlide: React.FC<FactSlideProps> = ({ index, number, title, body, tint, children }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
    <Background tint={tint} />
    <div style={{ position: "absolute", left: 70, top: 56, display: "flex", alignItems: "baseline", gap: 6, padding: "10px 22px", borderRadius: 24, background: "rgba(0,0,0,0.38)", border: `2px solid ${C.yellow}55` }}>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 44, color: C.yellow }}>{number}</span>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.dim }}>/6</span>
    </div>
    <Watermark top={58} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
      <Highlight text={title} size={title.replace(/\*/g, "").length > 48 ? 66 : 80} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>{children}</div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1020, fontFamily: DISPLAY, fontWeight: 600, fontSize: 38, lineHeight: 1.32, color: "rgba(255,255,255,0.82)" }}>
      {body.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") ? (
          <span key={i} style={{ color: TEAL, fontWeight: 800 }}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </div>
    <Progress index={index} />
    <SwipeHint />
  </AbsoluteFill>
);
