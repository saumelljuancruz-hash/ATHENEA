import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Face } from "../components/Face";
import { Mirror, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, mix, pop, ramp } from "../components/anim";
import { Background, clamp, Label, Panel } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

const MIRROR_W = 780;

export const S1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const espejo = wordAt("gancho", "espejo");
  // La cara se da vuelta: al derecho → espejada → al derecho otra vez.
  const angle = interpolate(frame, [-10, 20, espejo + 2, 72], [0, 180, 180, 360], { ...clamp, easing: easeInOut });
  const speed = Math.abs(interpolate(frame + 1, [-10, 20, espejo + 2, 72], [0, 180, 180, 360], { ...clamp, easing: easeInOut }) - angle);
  const mirrored = Math.cos((angle * Math.PI) / 180) < 0;
  const glow = ramp(frame, espejo - 4, espejo + 6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 73], [1.12, 1])) }}>
        <Background tint="#0c2a2e" />
        <div style={{ position: "absolute", left: 540 - MIRROR_W / 2, top: 236 }}>
          <Mirror width={MIRROR_W} glow={glow}>
            <div style={{ perspective: 1600, marginBottom: -40 }}>
              <div style={{ rotate: `y ${angle}deg`, filter: `blur(${Math.min(8, speed * 0.6)}px)` }}>
                <Face width={690} />
              </div>
            </div>
          </Mirror>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", scale: String(mix(ramp(frame, espejo - 4, espejo + 8, pop), 1, 1.08)) }}>
          <Panel glow={mirrored ? TEAL : C.white} style={{ padding: "12px 30px" }}>
            <Label size={46} color={mirrored ? TEAL : C.white}>
              {mirrored ? "ASÍ TE VES VOS" : "ASÍ TE VEN LOS DEMÁS"}
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={espejo + 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={espejo - 2} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
