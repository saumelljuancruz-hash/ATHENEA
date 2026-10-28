import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { Cloud } from "../components/Cloud";
import { WeatherWidget } from "../components/Gauges";
import { CrossSection } from "../components/Ocean";
import { PLACES, SouthAmericaMap } from "../components/SouthAmerica";
import { easeInOut, easeOut, mix, pop, ramp, wobble } from "../components/anim";
import { Background, Flash } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";

const SURFACE = 760;
const WATER_H = 1160;

/** Lluvia que cae debajo de una nube, en coordenadas del mapa. */
export const RainUnder: React.FC<{ x: number; y: number; w: number; h: number; frame: number; seed: string; opacity: number }> = ({ x, y, w, h, frame, seed, opacity }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity }}>
    {new Array(26).fill(0).map((_, i) => {
      const lx = x + random(`${seed}x${i}`) * w;
      const ly = y + ((random(`${seed}y${i}`) * h + frame * 22) % h);
      return <line key={i} x1={lx} y1={ly} x2={lx - 6} y2={ly + 26} stroke="#9fc4ff" strokeWidth={4} strokeLinecap="round" opacity={0.75} />;
    })}
  </svg>
);

export const S2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const [, stay] = beats("intro");
  const afloja = wordAt("intro", "afloja");
  const argentina = wordAt("intro", "argentina");

  // El viento afloja: el agua vuelve hacia América y chapotea.
  const back = ramp(frame, afloja - 4, afloja + 16, easeInOut);
  const tilt = mix(back, 1, -0.5) + wobble(frame, afloja + 16, 0.35);
  const map = ramp(frame, argentina - 4, argentina + 6);
  const widget = ramp(frame, stay - 4, stay + 10, pop);
  const lit = PLACES.litoral;
  const pampa = PLACES.pampa;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {map < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - map, scale: String(mix(map, 1, 1.6)) }}>
          <Background tint="#0b1d3d" />
          <div style={{ position: "absolute", left: 0, right: 0, top: SURFACE + WATER_H * 0.68 - 2, height: 800, background: "#030c22" }} />
        <div style={{ position: "absolute", left: 0, top: SURFACE - WATER_H * 0.32 }}>
            <CrossSection id="intro" width={1080} height={WATER_H} frame={frame} tilt={tilt} tiltPx={170} waves={10} />
          </div>
        </AbsoluteFill>
      ) : null}
      {map > 0 ? (
        <AbsoluteFill style={{ opacity: map }}>
          <Background tint="#0b1730" rain={0.25} />
          <AbsoluteFill style={{ scale: String(mix(ramp(frame, argentina - 4, argentina + 40, easeOut), 1.35, 1.5)), transformOrigin: `${lit[0]}px ${lit[1] + 60}px` }}>
            <SouthAmericaMap frame={frame} region={ramp(frame, argentina, argentina + 12)} />
            {[
              { at: lit, seed: "nl", w: 220 },
              { at: pampa, seed: "np", w: 200 },
            ].map((c) => (
              <React.Fragment key={c.seed}>
                <div style={{ position: "absolute", left: c.at[0] - c.w / 2, top: c.at[1] - c.w * 0.9, scale: String(ramp(frame, argentina + 2, argentina + 14, pop)) }}>
                  <Cloud width={c.w} seed={c.seed} flash={frame % 37 < 2 ? 0.6 : 0} />
                </div>
                <RainUnder x={c.at[0] - c.w * 0.35} y={c.at[1] + 10} w={c.w * 0.7} h={130} frame={frame} seed={c.seed} opacity={ramp(frame, argentina + 8, argentina + 16)} />
              </React.Fragment>
            ))}
          </AbsoluteFill>
          <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: widget, scale: String(mix(widget, 0.6, 1)) }}>
            <WeatherWidget title="PRONÓSTICO · VERANO 2026-27" months={["DIC", "ENE", "FEB"]} rain={0} frame={frame} />
          </div>
        </AbsoluteFill>
      ) : null}
      <Flash at={argentina - 1} color={C.electric} length={8} peak={0.4} />
      <Audio from={Math.max(0, afloja - 2)} src={staticFile("sfx/ola.wav")} volume={0.7} />
      <Audio from={argentina - 4} src={staticFile("sfx/whoosh.wav")} volume={0.45} />
      <Audio from={argentina} src={staticFile("sfx/ambiente-lluvia.mp3")} volume={(f) => mix(Math.min(1, f / 20), 0, 0.5) * (1 - ramp(f, 110 - argentina, 140 - argentina))} />
      <Audio from={stay} src={staticFile("sfx/toque.wav")} volume={0.6} />
    </AbsoluteFill>
  );
};
