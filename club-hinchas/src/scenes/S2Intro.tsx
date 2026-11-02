import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Potrero } from "../components/Futbol";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { mix, pop, ramp } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import { HINCHAS } from "../serie";
import { C, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

/** Un yuyo rodando por la cancha vacía. */
const Yuyo: React.FC<{ size: number; spin: number }> = ({ size, spin }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ rotate: `${spin}deg` }}>
    {new Array(9).fill(0).map((_, i) => (
      <ellipse key={i} rx={40 - (i % 3) * 6} ry={18 + (i % 4) * 5} fill="none" stroke="#b08a52" strokeWidth={3} transform={`rotate(${i * 20})`} opacity={0.8} />
    ))}
  </svg>
);

export const S2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const [, teaser] = beats("intro");
  const cien = wordAt("intro", "100");
  const vacia = wordAt("intro", "vacía");
  const counter = ramp(frame, cien - 4, cien + 8, pop);
  const roll = ramp(frame, vacia - 14, vacia + 40, (t) => t);
  const pill = ramp(frame, teaser - 2, teaser + 10, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 144], [1, 1.06])), ...shake(frame, [cien], 10) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 0, top: 330 }}>
          <Potrero hinchas={HINCHAS} frame={frame} />
        </div>
        {roll > 0 && roll < 1 ? (
          <div style={{ position: "absolute", left: mix(roll, -200, 1180), top: 1060 - Math.abs(Math.sin(roll * 14)) * 40 }}>
            <Yuyo size={150} spin={roll * 900} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 200, display: "flex", justifyContent: "center", opacity: counter, scale: String(mix(counter, 1.5, 1)) }}>
          <Panel glow={TEAL} style={{ padding: "14px 34px", display: "flex", alignItems: "baseline", gap: 18 }}>
            <Label size={84} mono color={TEAL}>
              {HINCHAS}
            </Label>
            <Label size={52} mono color={C.dim}>
              / 100
            </Label>
            <Label size={38} color={C.white} style={{ marginLeft: 10 }}>
              HINCHAS
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", opacity: pill, scale: String(mix(pill, 0.5, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "12px 28px" }}>
            <Label size={40} color={C.yellow}>
              AL FINAL: CÓMO ENTRÁS VOS
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330 + 260, display: "flex", justifyContent: "center", opacity: ramp(frame, vacia - 2, vacia + 8) * (1 - ramp(frame, teaser - 6, teaser)) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.white, background: "rgba(0,0,0,0.55)", padding: "8px 20px", borderRadius: 14 }}>
            {100 - HINCHAS} LUGARES LIBRES
          </div>
        </div>
      </AbsoluteFill>
      <Audio from={cien} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={vacia - 10} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={teaser} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
