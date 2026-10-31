import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { SFX } from "../components/sfx";
import { easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, Label, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

/** El reloj arranca: empieza la carrera entre los ladrones y los que los persiguen. */
export const S4Bucle1: React.FC = () => {
  const frame = useCurrentFrame();
  const carrera = wordAt("bucle1", "carrera");
  const enter = ramp(frame, 0, 10, pop);
  const seconds = ramp(frame, 4, 48, (t) => t) * 90;
  const alarm = 0.5 + 0.5 * Math.sin(frame * 0.6);
  const zoom = ramp(frame, carrera - 2, carrera + 10, easeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [carrera], 18) }}>
        <Background tint={`rgba(120, 20, 18, ${0.4 + alarm * 0.5})`} />
        {[0, 1, 2].map((i) => {
          const t = ((frame + i * 12) % 36) / 36;
          return <div key={i} style={{ position: "absolute", left: 540 - 200 - t * 300, top: 760 - 200 - t * 300, width: 400 + t * 600, height: 400 + t * 600, borderRadius: "50%", border: `6px solid ${C.positive}`, opacity: (1 - t) * 0.6 }} />;
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 460, display: "flex", justifyContent: "center", scale: String(mix(enter, 0.4, 1) * mix(zoom, 1, 1.12)) }}>
          <svg width={600} height={600} viewBox="-60 -66 120 126" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${30 + alarm * 30}px ${C.positive})` }}>
            <circle r={50} fill="#0b0f18" stroke="#fff" strokeWidth={6} />
            {new Array(12).fill(0).map((_, i) => (
              <line key={i} x1={0} y1={-44} x2={0} y2={-38} stroke="#fff" strokeWidth={3} transform={`rotate(${i * 30})`} />
            ))}
            <rect x={-8} y={-66} width={16} height={12} rx={3} fill="#fff" />
            <line x1={0} y1={0} x2={0} y2={-36} stroke={C.positive} strokeWidth={5} strokeLinecap="round" transform={`rotate(${seconds * 6})`} />
            <circle r={5} fill={C.positive} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", justifyContent: "center", opacity: enter }}>
          <Label size={80} mono color={C.positive}>
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(Math.floor(seconds % 60)).padStart(2, "0")}
          </Label>
        </div>
      </AbsoluteFill>
      <Flash at={carrera} color={C.positive} length={8} peak={0.35} />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={carrera} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
