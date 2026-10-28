import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Cloud } from "../components/Cloud";
import { AnomalyThermometer, Donut, WeatherWidget } from "../components/Gauges";
import { MapLabel, PLACES, SouthAmericaMap } from "../components/SouthAmerica";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, clamp, Flash, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";
import { RainUnder } from "./S2Intro";

const ZOOM = 1.85;

export const S7Final: React.FC = () => {
  const frame = useCurrentFrame();
  const [, moist, rain, odds] = beats("final");
  const grados = wordAt("final", "grados");
  const cambia = wordAt("final", "cambia");
  const humedad = wordAt("final", "humedad");
  const litoral = wordAt("final", "litoral");
  const pampa = wordAt("final", "pampa");
  const mas = wordAt("final", "más");
  const crecer = wordAt("final", "crecer");
  const parana = wordAt("final", "paraná");
  const uruguay = wordAt("final", "uruguay");
  const pct = wordAt("final", "83%");

  // A · el número real: +2,1 °C
  const value = interpolate(frame, [2, 26], [1.6, 2.1], { ...clamp, easing: easeOut });
  const thermo = 1 - ramp(frame, moist - 6, moist + 4);
  // B · la humedad baja hacia el Litoral · C · lluvia y ríos
  const map = ramp(frame, moist - 6, moist + 4);
  const zoom = ramp(frame, rain - 8, rain + 14, easeInOut);
  const lit = PLACES.litoral;
  const pam = PLACES.pampa;
  // D · 83 %
  const donut = ramp(frame, odds - 6, odds + 6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [6], 30) }}>
        {thermo > 0 ? (
          <AbsoluteFill style={{ opacity: thermo }}>
            <Background tint="#2a0d0d" />
            <div style={{ position: "absolute", left: 200, top: 300 }}>
              <AnomalyThermometer value={value} height={860} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", opacity: ramp(frame, grados - 4, grados + 6), scale: String(mix(ramp(frame, grados - 4, grados + 12, pop), 1.6, 1)) }}>
              <Panel glow={C.yellow} style={{ padding: "12px 26px" }}>
                <Label size={44} color={C.yellow}>
                  MÁS DE 4 VECES EL UMBRAL
                </Label>
              </Panel>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", opacity: ramp(frame, 10, 20) }}>
              <Label size={26} mono color={C.dim}>
                NIÑO 3.4 · NOAA · 8 OCT 2026
              </Label>
            </div>
          </AbsoluteFill>
        ) : null}

        {map > 0 ? (
          <AbsoluteFill style={{ opacity: map }}>
            <Background tint="#0b1730" rain={ramp(frame, rain, rain + 20) * 0.5} />
            <AbsoluteFill style={{ scale: String(mix(zoom, 1, ZOOM)), transformOrigin: `${lit[0]}px ${lit[1] + 40}px`, translate: `0px ${mix(zoom, 0, -120)}px` }}>
              <SouthAmericaMap frame={frame} moisture={ramp(frame, cambia, humedad + 6)} region={ramp(frame, litoral - 6, pampa + 10)} rivers={ramp(frame, crecer - 6, parana + 10)} />
              <MapLabel at={PLACES.chaco} dy={-90} text="HUMEDAD ↓" opacity={ramp(frame, humedad - 2, humedad + 8) * (1 - zoom)} color="#bfefff" size={40} />
              {[
                { at: lit, seed: "fl", w: 150, from: litoral },
                { at: pam, seed: "fp", w: 140, from: pampa },
              ].map((c) => (
                <React.Fragment key={c.seed}>
                  <div style={{ position: "absolute", left: c.at[0] - c.w / 2, top: c.at[1] - c.w * 0.95, scale: String(ramp(frame, c.from - 4, c.from + 8, pop)) }}>
                    <Cloud width={c.w} seed={c.seed} flash={frame % 29 < 2 ? 0.7 : 0} />
                  </div>
                  <RainUnder x={c.at[0] - c.w * 0.35} y={c.at[1] - 10} w={c.w * 0.7} h={90} frame={frame} seed={c.seed} opacity={ramp(frame, c.from + 4, c.from + 12)} />
                </React.Fragment>
              ))}
              <MapLabel at={lit} dy={-150} text="LITORAL" opacity={ramp(frame, litoral - 2, litoral + 8)} size={22} />
              <MapLabel at={pam} dy={-142} text="PAMPA" opacity={ramp(frame, pampa - 2, pampa + 8)} size={22} />
              <MapLabel at={PLACES.santaFe} dy={-10} text="PARANÁ" opacity={ramp(frame, parana - 2, parana + 8)} color="#8fd0ff" size={20} />
              <MapLabel at={PLACES.posadas} dy={30} text="URUGUAY" opacity={ramp(frame, uruguay - 2, uruguay + 8)} color="#8fd0ff" size={20} />
            </AbsoluteFill>
            <div style={{ position: "absolute", top: 240, left: 40, opacity: ramp(frame, mas - 6, mas + 4) * (1 - donut), scale: String(mix(ramp(frame, mas - 6, mas + 8, pop), 0.6, 1)), transformOrigin: "0 0" }}>
              <WeatherWidget title="PRIMAVERA · VERANO" months={["NOV", "DIC", "ENE"]} rain={ramp(frame, mas - 2, mas + 16)} frame={frame} />
            </div>
          </AbsoluteFill>
        ) : null}

        {donut > 0 ? (
          <AbsoluteFill style={{ backgroundColor: `rgba(3,5,11,${0.72 * donut})` }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", opacity: donut, scale: String(mix(ramp(frame, odds - 6, odds + 10, pop), 0.7, 1)) }}>
              <Donut percent={mix(ramp(frame, pct - 4, pct + 26, easeOut), 0, 83)} size={520} />
              <Label size={44} style={{ marginTop: 28, textAlign: "center", whiteSpace: "normal", width: 860 }}>
                de chances de ser el más fuerte desde 1950
              </Label>
              <Label size={26} mono color={C.dim} style={{ marginTop: 18 }}>
                NOAA · PRONÓSTICO DEL 8 OCT 2026
              </Label>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Flash at={6} color="#ffd39a" length={12} peak={0.6} />
      <Audio from={4} src={staticFile("sfx/trueno.wav")} volume={0.6} />
      <Audio from={moist - 6} src={staticFile("sfx/whoosh.wav")} volume={0.45} />
      <Audio from={cambia} src={staticFile("sfx/viento.wav")} volume={0.35} />
      <Audio from={rain - 6} src={staticFile("sfx/ambiente-lluvia.mp3")} volume={(f) => 0.6 * Math.min(1, f / 20) * (1 - ramp(f, odds - rain, odds - rain + 30))} />
      <Audio from={litoral} src={staticFile("sfx/trueno.wav")} volume={0.25} />
      <Audio from={parana} src={staticFile("sfx/toque.wav")} volume={0.5} />
      <Audio from={uruguay} src={staticFile("sfx/toque.wav")} volume={0.5} />
      <Audio from={odds} src={staticFile("sfx/whoosh.wav")} volume={0.35} />
      <Audio from={pct + 20} src={staticFile("sfx/ding.wav")} volume={0.5} />
    </AbsoluteFill>
  );
};
