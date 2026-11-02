import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Ball } from "../components/Futbol";
import { SFX } from "../components/sfx";
import { easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

/** La pelota en el punto del medio y el silbato: arranca la liga. */
export const S6Bucle2: React.FC = () => {
  const frame = useCurrentFrame();
  const juega = wordAt("bucle2", "juega");
  const enter = ramp(frame, 0, 10, pop);
  const kick = ramp(frame, juega, juega + 20, easeOut);
  const chip = ramp(frame, juega - 4, juega + 8, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [juega], 16) }}>
        <Background tint="#0d2a1a" />
        {/* Cancha vista desde arriba */}
        <svg width={1080} height={1920} style={{ position: "absolute", scale: String(mix(enter, 1.3, 1)) }}>
          <defs>
            <pattern id="franjas" width="1080" height="200" patternUnits="userSpaceOnUse">
              <rect width={1080} height={100} fill="#1f7a3a" />
              <rect y={100} width={1080} height={100} fill="#1a6a32" />
            </pattern>
          </defs>
          <rect x={80} y={230} width={920} height={1010} rx={10} fill="url(#franjas)" stroke="#fff" strokeOpacity={0.7} strokeWidth={6} />
          <line x1={80} y1={735} x2={1000} y2={735} stroke="#fff" strokeOpacity={0.7} strokeWidth={6} />
          <circle cx={540} cy={735} r={150} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={6} />
          <circle cx={540} cy={735} r={10} fill="#fff" />
          <rect x={330} y={230} width={420} height={150} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={6} />
          <rect x={330} y={1090} width={420} height={150} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={6} />
        </svg>
        <div style={{ position: "absolute", left: 540 - 90, top: mix(kick, 735, 360) - 90, scale: String(mix(kick, 1, 0.7) * mix(enter, 0.4, 1)) }}>
          <Ball size={180} spin={kick * 720} />
        </div>
        {/* Ondas del silbato */}
        {frame >= juega
          ? [0, 1, 2].map((i) => {
              const t = ramp(frame, juega + i * 4, juega + i * 4 + 16);
              return <div key={i} style={{ position: "absolute", left: 540 - 120 - t * 260, top: 735 - 120 - t * 260, width: 240 + t * 520, height: 240 + t * 520, borderRadius: "50%", border: `6px solid ${C.yellow}`, opacity: (1 - t) * 0.7 }} />;
            })
          : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", opacity: chip, scale: String(mix(chip, 0.5, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "12px 30px" }}>
            <Label size={50} color={C.yellow}>
              MAÑANA · FECHA 1
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={juega} color={C.yellow} length={6} peak={0.2} />
      <Audio from={juega} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
      <Audio from={juega + 2} src={staticFile("sfx/patada.wav")} volume={SFX.patada} />
    </AbsoluteFill>
  );
};
