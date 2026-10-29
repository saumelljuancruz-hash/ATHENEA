import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Face } from "../components/Face";
import { Phone } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, mix, ramp } from "../components/anim";
import { Background, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

const PHONE_W = 1200;
// La lente de la cámara frontal queda en el centro de la zona visible.
const LENS = { x: 540, y: 700 };

export const S6Bucle2: React.FC = () => {
  const frame = useCurrentFrame();
  const frontal = wordAt("bucle2", "frontal");
  const peor = wordAt("bucle2", "peor");
  const lensTop = PHONE_W * 0.05 + (PHONE_W * 0.075) / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [peor], 20) }}>
        <Background tint="#2a0d12" />
        <div
          style={{
            position: "absolute",
            left: LENS.x - PHONE_W / 2,
            top: LENS.y - lensTop,
            transformOrigin: `${PHONE_W / 2}px ${lensTop}px`,
            scale: String(Math.exp(mix(ramp(frame, frontal - 6, peor + 20, easeInOut), Math.log(0.55), Math.log(2.6)))),
          }}
        >
          <Phone width={PHONE_W} ui={0} lensGlow={ramp(frame, peor - 4, peor + 4)}>
            <div style={{ position: "absolute", bottom: -60 }}>
              <Face width={1100} />
            </div>
          </Phone>
        </div>
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${LENS.x}px ${LENS.y}px, transparent 18%, rgba(255,40,40,${0.35 * ramp(frame, peor, peor + 10)}) 70%)` }} />
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={peor} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
