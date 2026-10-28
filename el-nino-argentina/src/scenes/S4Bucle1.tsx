import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { PacificMap, PAC } from "../components/Pacific";
import { easeInOut, mix, pop, ramp } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

const SCALE = 0.62;

export const S4Bucle1: React.FC = () => {
  const frame = useCurrentFrame();
  const viento = wordAt("bucle1", "viento");
  const frena = wordAt("bucle1", "frena");
  const speed = (f: number) => 1 - ramp(f, viento - 6, frena + 4, easeInOut);
  // Distancia acumulada: así el viento desacelera en vez de saltar.
  let distance = 0;
  for (let f = 0; f < frame; f++) {
    distance += speed(f) * 14;
  }
  const stopped = ramp(frame, frena, frena + 10, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(mix(ramp(frame, 0, 70), 1, 1.08)), ...shake(frame, [frena], 18) }}>
        <Background tint="#0b1730" />
        <div style={{ position: "absolute", left: 540 - (PAC.width * SCALE) / 2, top: 640, scale: String(SCALE), transformOrigin: "0 0" }}>
          <PacificMap windDistance={distance} wind={mix(ramp(frame, frena, frena + 16), 1, 0.12)} />
        </div>
        <div style={{ position: "absolute", left: 90, right: 90, top: 330 }}>
          <Panel style={{ padding: "18px 26px" }}>
            <Label size={34} color={C.dim}>
              VIENTOS ALISIOS
            </Label>
            <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.1)", marginTop: 14, overflow: "hidden" }}>
              <div style={{ height: 30, width: `${speed(frame) * 100}%`, borderRadius: 15, background: speed(frame) > 0.3 ? C.electric : C.positive }} />
            </div>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", gap: 34, opacity: stopped, scale: String(mix(stopped, 2, 1)) }}>
          <div style={{ width: 60, height: 150, borderRadius: 16, background: C.positive, boxShadow: `0 0 40px ${C.positive}` }} />
          <div style={{ width: 60, height: 150, borderRadius: 16, background: C.positive, boxShadow: `0 0 40px ${C.positive}` }} />
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/viento.wav")} volume={(f) => 0.45 * speed(f)} />
      <Audio from={frena} src={staticFile("sfx/toque.wav")} volume={0.8} />
      <Audio from={frena} src={staticFile("sfx/trueno.wav")} volume={0.25} />
    </AbsoluteFill>
  );
};
