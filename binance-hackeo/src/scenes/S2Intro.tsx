import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { mix, pop, ramp } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import { C, DISPLAY } from "../theme";
import { beats, wordAt } from "../timeline";

export const S2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const [, money] = beats("intro");
  const binance = wordAt("intro", "binance");
  const name = ramp(frame, binance - 4, binance + 8, pop);
  const teaser = ramp(frame, money - 2, money + 10, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [binance], 14) }}>
        <Background tint="#2a1f05" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 190, letterSpacing: -6, color: C.yellow, textShadow: `0 0 60px ${C.yellow}66`, opacity: name, scale: String(mix(name, 1.6, 1)) }}>
          BINANCE
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 20, opacity: ramp(frame, binance + 4, binance + 12) }}>
          <Panel style={{ padding: "10px 22px" }}>
            <Label size={38} mono>
              29 · OCT · 2026
            </Label>
          </Panel>
          <Panel glow={C.positive} style={{ padding: "10px 22px" }}>
            <Label size={38} mono color={C.positive}>
              20:05 UTC
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", opacity: teaser, scale: String(mix(teaser, 0.5, 1)) }}>
          <Panel glow={TEAL} style={{ padding: "14px 30px" }}>
            <Label size={44} color={TEAL}>
              AL FINAL: ¿QUÉ PASA CON TU PLATA?
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={binance - 2} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={money} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};
