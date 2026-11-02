import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Crest, equipo, NUESTRO } from "../components/Futbol";
import { SFX } from "../components/sfx";
import { easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

/** El escudo vacío bajo un reflector: al club le falta todo. */
export const S4Bucle1: React.FC = () => {
  const frame = useCurrentFrame();
  const importante = wordAt("bucle1", "importante");
  const enter = ramp(frame, 0, 14, pop);
  const hit = ramp(frame, importante - 2, importante + 8, easeOut);
  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.35);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(mix(ramp(frame, 0, 71, easeOut), 1, 1.12)), ...shake(frame, [importante], 18) }}>
        <Background tint="#141a26" />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <defs>
            <radialGradient id="reflector" cx="0.5" cy="0" r="1">
              <stop offset="0" stopColor="#fff6c8" stopOpacity={0.45} />
              <stop offset="1" stopColor="#fff6c8" stopOpacity={0} />
            </radialGradient>
          </defs>
          <path d="M 540 0 L 160 1240 H 920 Z" fill="url(#reflector)" opacity={0.6 + pulse * 0.2} />
        </svg>
        <div style={{ position: "absolute", left: 540 - 230, top: 420, scale: String(mix(enter, 0.5, 1) * (1 + hit * 0.08)) }}>
          <Crest team={equipo(NUESTRO)} size={460} blank glow={hit} />
        </div>
      </AbsoluteFill>
      <Flash at={importante} color={C.yellow} length={8} peak={0.25} />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={importante} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
