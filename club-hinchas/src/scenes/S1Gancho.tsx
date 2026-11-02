import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Ball, Crest, equipo, NUESTRO, Potrero } from "../components/Futbol";
import { SFX } from "../components/sfx";
import { easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import serie from "../serie.json";
import { C } from "../theme";
import { wordAt } from "../timeline";

/** Un pelotazo contra la cámara y aparece el potrero casi vacío. */
export const S1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const futbol = wordAt("gancho", "fútbol");
  const vos = wordAt("gancho", "vos");
  // La pelota arranca gigante, pegada a la lente, y sale disparada hacia la cancha.
  const fly = ramp(frame, 0, 22, easeOut);
  const reveal = ramp(frame, 2, 18, easeOut);
  const crest = ramp(frame, futbol - 4, futbol + 8, pop);
  const seat = ramp(frame, vos - 6, vos + 6, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(mix(reveal, 1.25, 1)), ...shake(frame, [1, vos], 18) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 0, top: 330, opacity: reveal }}>
          <Potrero hinchas={serie.hinchas} vos={seat} frame={frame} />
        </div>
        <div style={{ position: "absolute", left: 60, top: 140, display: "flex", alignItems: "center", gap: 20, opacity: crest, scale: String(mix(crest, 0.4, 1)), transformOrigin: "0 50%" }}>
          <Crest team={equipo(NUESTRO)} size={120} blank />
          <Label size={44} color={C.white}>
            CLUB ???
          </Label>
        </div>
        {seat > 0 ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: seat, scale: String(mix(seat, 1.6, 1)) }}>
            <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
              <Label size={44} color={C.yellow}>
                ESTE LUGAR ES TUYO ↓
              </Label>
            </Panel>
          </div>
        ) : null}
      </AbsoluteFill>
      {/* La pelota en primer plano */}
      <div
        style={{
          position: "absolute",
          left: mix(fly, 540, 640) - 450,
          top: mix(fly, 980, 820) - 450,
          width: 900,
          height: 900,
          scale: String(mix(fly, 1.6, 0.08)),
          opacity: 1 - ramp(frame, 18, 24),
          filter: `blur(${(1 - fly) * 6}px)`,
        }}
      >
        <Ball size={900} spin={frame * 24} />
      </div>
      <Audio from={0} src={staticFile("sfx/patada.wav")} volume={SFX.patada} />
      <Audio from={2} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={futbol} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={vos} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
