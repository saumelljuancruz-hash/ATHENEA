import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Bolt } from "../components/Bolt";
import { mix, pop, ramp } from "../components/anim";
import { Background, clamp, Flash, Label, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

const Content: React.FC<{ frame: number; enganya: number }> = ({ frame, enganya }) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <Bolt seed="bucle1" from={[640, -80]} to={[600, 1200]} segments={20} jitter={80} branches={6} width={16} progress={ramp(frame, 0, 5)} intensity={interpolate(frame, [0, 5, 12, 40], [1, 1, 0.75, 0.9], clamp)} />
    </svg>
    <div style={{ position: "absolute", left: 120, top: 380, display: "flex", flexDirection: "column", alignItems: "center", opacity: ramp(frame, 4, 10), scale: String(mix(ramp(frame, 4, 14, pop), 0.6, 1)) }}>
      <svg width={220} height={460} viewBox="0 0 220 460">
        <path d="M 70 0 H 150 V 300 H 215 L 110 455 L 5 300 H 70 Z" fill={C.white} />
      </svg>
      <Label size={64} style={{ marginTop: 18 }}>
        ¿BAJA?
      </Label>
    </div>
    <div style={{ position: "absolute", left: 140, top: 360, opacity: ramp(frame, enganya + 1, enganya + 4), scale: String(mix(ramp(frame, enganya + 1, enganya + 12, pop), 2.2, 1)), rotate: "-10deg" }}>
      <Label size={420} color={C.positive}>
        ?
      </Label>
    </div>
  </AbsoluteFill>
);

export const S4Bucle1: React.FC = () => {
  const frame = useCurrentFrame();
  const enganya = wordAt("bucle1", "engaña");
  const glitch = frame >= enganya ? 1 : 0;
  const slot = Math.floor(frame / 2);
  const off = glitch * (10 + random(`gl${slot}`) * 26);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 43], [1, 1.14])), ...shake(frame, [1, enganya], 30) }}>
        <Background tint="#0d1838" rain={0.5} />
        <Content frame={frame} enganya={enganya} />
        {glitch ? (
          <>
            <AbsoluteFill style={{ translate: `${off}px 0px`, mixBlendMode: "screen", opacity: 0.7, filter: "sepia(1) saturate(8) hue-rotate(-40deg)" }}>
              <Content frame={frame} enganya={enganya} />
            </AbsoluteFill>
            <AbsoluteFill style={{ translate: `${-off}px 0px`, mixBlendMode: "screen", opacity: 0.7, filter: "sepia(1) saturate(8) hue-rotate(150deg)" }}>
              <Content frame={frame} enganya={enganya} />
            </AbsoluteFill>
            {new Array(5).fill(0).map((_, i) => {
              const top = random(`st${slot}-${i}`) * 90;
              return (
                <AbsoluteFill key={i} style={{ clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - 4)}% 0)`, translate: `${(random(`sx${slot}-${i}`) - 0.5) * 140}px 0px`, backgroundColor: C.bg }}>
                  <Background tint="#0d1838" />
                  <Content frame={frame} enganya={enganya} />
                </AbsoluteFill>
              );
            })}
          </>
        ) : null}
      </AbsoluteFill>
      <Flash at={1} length={10} peak={0.85} />
      <Audio from={0} src={staticFile("sfx/trueno.wav")} volume={0.24} />
      <Audio from={enganya} src={staticFile("sfx/chispa.wav")} volume={0.56} />
    </AbsoluteFill>
  );
};
