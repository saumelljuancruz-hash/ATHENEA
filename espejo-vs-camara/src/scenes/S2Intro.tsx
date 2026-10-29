import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Face } from "../components/Face";
import { Finger } from "../components/Finger";
import { Phone, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, Label, Panel } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";

const PHONE_W = 520;
const PHONE_TOP = 190;
const SHUTTER = { x: 540, y: PHONE_TOP + PHONE_W * 2.05 - PHONE_W * 0.18 };

export const S2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const [, trick] = beats("intro");
  const selfies = wordAt("intro", "selfies");
  const tap = 16;
  const enter = ramp(frame, 2, tap, easeOut);
  const exit = ramp(frame, tap + 10, tap + 26, easeInOut);
  const shot = ramp(frame, tap + 2, tap + 16, pop);
  const bubble = ramp(frame, selfies - 2, selfies + 10, pop);
  const teaser = ramp(frame, trick - 4, trick + 10, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background tint="#0c2a2e" />
      <div style={{ position: "absolute", left: 540 - PHONE_W / 2, top: PHONE_TOP, scale: String(mix(teaser, 1, 0.92)) }}>
        <Phone width={PHONE_W} ui={1 - shot}>
          <div style={{ position: "absolute", bottom: -30, opacity: 1 - shot }}>
            <Face width={500} mirrored />
          </div>
          <div style={{ position: "absolute", bottom: -30, opacity: shot }}>
            <Face width={500} expression="cringe" />
          </div>
        </Phone>
      </div>
      {/* Dedo que saca la foto */}
      <div
        style={{
          position: "absolute",
          left: SHUTTER.x - 150,
          top: SHUTTER.y - 10,
          transformOrigin: "50% 0%",
          rotate: "-22deg",
          translate: `${mix(enter, 420, 0) + exit * 600}px ${mix(enter, 700, 0) + exit * 900}px`,
          scale: String(1 - (ramp(frame, tap, tap + 3) - ramp(frame, tap + 3, tap + 9)) * 0.04),
        }}
      >
        <Finger width={300} rim={0.4} rimColor={TEAL} />
      </div>
      <div style={{ position: "absolute", right: 70, top: 300, opacity: bubble, scale: String(mix(bubble, 0.4, 1)), rotate: "6deg" }}>
        <Panel glow={C.positive} style={{ padding: "16px 26px", borderRadius: 34 }}>
          <Label size={52} color={C.positive}>
            ¿ESTE SOY YO?
          </Label>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", opacity: teaser, scale: String(mix(teaser, 0.5, 1)) }}>
        <Panel glow={TEAL} style={{ padding: "14px 30px" }}>
          <Label size={44} color={TEAL}>
            AL FINAL: EL TRUCO ↓
          </Label>
        </Panel>
      </div>
      <Flash at={tap + 1} length={10} peak={0.9} />
      <Audio from={tap} src={staticFile("sfx/obturador.wav")} volume={SFX.obturador} />
      <Audio from={selfies} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={trick} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};
