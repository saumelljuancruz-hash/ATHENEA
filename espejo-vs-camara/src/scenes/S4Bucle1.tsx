import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { Face } from "../components/Face";
import { Brain, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { mix, pop, ramp } from "../components/anim";
import { Background, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

export const S4Bucle1: React.FC = () => {
  const frame = useCurrentFrame();
  const trampa = wordAt("bucle1", "trampa");
  const trick = ramp(frame, trampa - 2, trampa + 8, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(mix(ramp(frame, 0, 60), 1, 1.1)), ...shake(frame, [trampa], 18) }}>
        <Background tint="#1d1436" />
        {/* El cerebro rodeado de caras espejadas: elige la que más vio */}
        {new Array(6).fill(0).map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + frame * 0.05;
          return (
            <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 340 - 70, top: 760 + Math.sin(a) * 340 - 90, opacity: ramp(frame, i * 2, i * 2 + 8), scale: String(0.9 + Math.sin(frame / 5 + i) * 0.05) }}>
              <Face width={140} mirrored />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 540 - 220, top: 760 - 180, scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1) * (1 + trick * 0.1)) }}>
          <Brain size={440} color={trick > 0.5 ? "#b48cff" : TEAL} />
        </div>
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: trick }}>
          {new Array(16).fill(0).map((_, i) => {
            const a = random(`ta${i}`) * Math.PI * 2;
            const d = mix(ramp(frame, trampa, trampa + 20), 160, 360 + random(`td${i}`) * 140);
            const x = 540 + Math.cos(a) * d;
            const y = 760 + Math.sin(a) * d;
            const r = 12 + random(`tr${i}`) * 10;
            return <path key={i} d={`M ${x} ${y - r} L ${x + r * 0.3} ${y - r * 0.3} L ${x + r} ${y} L ${x + r * 0.3} ${y + r * 0.3} L ${x} ${y + r} L ${x - r * 0.3} ${y + r * 0.3} L ${x - r} ${y} L ${x - r * 0.3} ${y - r * 0.3} Z`} fill="#e2d3ff" opacity={1 - ramp(frame, trampa + 12, trampa + 26)} />;
          })}
        </svg>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={trampa} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
