import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AnomalyThermometer } from "../components/Gauges";
import { easeInOut, mix, ramp } from "../components/anim";
import { Background, clamp, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

export const S6Bucle2: React.FC = () => {
  const frame = useCurrentFrame();
  const ahora = wordAt("bucle2", "ahora");
  const no = wordAt("bucle2", "no");
  const arriba = wordAt("bucle2", "arriba");
  const value = interpolate(frame, [no - 4, arriba + 6, arriba + 30], [0.5, 1.5, 1.6], { ...clamp, easing: easeInOut });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(mix(ramp(frame, 0, 100, easeInOut), 1, 1.12)), ...shake(frame, [arriba], 10, 12) }}>
        <Background tint="#2a0d0d" />
        <div style={{ position: "absolute", top: 370, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: ramp(frame, ahora, ahora + 8) }}>
          <Panel glow={C.positive} style={{ padding: "12px 28px" }}>
            <Label size={40} color={C.positive}>
              AHORA · OCTUBRE 2026
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 340, top: 470 }}>
          <AnomalyThermometer value={value} height={760} showValue={false} hideScale={ramp(frame, no - 2, no + 10)} />
        </div>
        <div style={{ position: "absolute", left: 610, top: 600, opacity: ramp(frame, no, no + 10), rotate: `${Math.sin(frame / 4) * 6}deg` }}>
          <Label size={200} color={C.yellow}>
            ?
          </Label>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={0.1} />
      <Audio from={no} src={staticFile("sfx/viento.wav")} volume={0.06} />
      <Audio from={arriba} src={staticFile("sfx/chispa.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
