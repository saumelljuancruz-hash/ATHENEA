import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bolt } from "../components/Bolt";
import { easeInOut, mix, ramp } from "../components/anim";
import { Background, clamp } from "../components/Ui";
import { C } from "../theme";

export const S6Bucle2: React.FC = () => {
  const frame = useCurrentFrame();
  const dive = ramp(frame, 0, 50, easeInOut);
  const heat = ramp(frame, 20, 52);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(Math.exp(mix(dive, 0, Math.log(9)))), transformOrigin: "50% 50%" }}>
        <Background tint="#0d1838" />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <Bolt seed="bucle2" from={[560, -100]} to={[520, 2020]} segments={22} jitter={40} branches={3} width={20} color={heat > 0.5 ? C.heat : C.electric} />
        </svg>
      </AbsoluteFill>
      {/* Anillos del túnel que vienen hacia la cámara */}
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {new Array(8).fill(0).map((_, i) => {
          const t = ((frame + i * 6) % 48) / 48;
          const r = Math.pow(t, 2.2) * 1400;
          return <ellipse key={i} cx={540} cy={960} rx={r * 0.7} ry={r} fill="none" stroke={heat > 0.4 ? "#ffd7a0" : C.electric} strokeWidth={4 + t * 18} opacity={(1 - t) * 0.6 * ramp(frame, 6, 16)} />;
        })}
      </svg>
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 50%, #fff6e8 0%, #ffb35c 35%, rgba(255,120,40,0) 75%)",
          opacity: interpolate(frame, [26, 52], [0, 1], clamp),
          mixBlendMode: "screen",
        }}
      />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={0.42} />
      <Audio from={22} src={staticFile("sfx/whoosh.wav")} volume={0.35} />
    </AbsoluteFill>
  );
};
