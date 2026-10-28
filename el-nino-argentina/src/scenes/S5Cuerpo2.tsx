import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { AnomalyThermometer } from "../components/Gauges";
import { latY, lonX, NINO34, PacificMap } from "../components/Pacific";
import { easeInOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, fmt, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";

const MAP_TOP = 230;
const KM_PER_DEG = 111;

export const S5Cuerpo2: React.FC = () => {
  const frame = useCurrentFrame();
  const [, declare] = beats("cuerpo2");
  const vuelve = wordAt("cuerpo2", "vuelve");
  const meses = wordAt("cuerpo2", "meses");
  const medio = wordAt("cuerpo2", "medio");
  const grado = wordAt("cuerpo2", "grado");
  const meses2 = wordAt("cuerpo2", "meses", 1);
  const nino = wordAt("cuerpo2", "niño");

  // La montaña de agua caliente viaja de 150°E a 110°W: más de 10.000 km.
  const k = ramp(frame, vuelve - 8, meses + 12, easeInOut);
  const bulgeLon = mix(k, 150, 250);
  const focus = mix(ramp(frame, vuelve - 8, meses + 20, easeInOut), 165, 240);
  const box = ramp(frame, medio - 4, grado + 12, easeInOut);
  const anomaly = mix(ramp(frame, medio, meses2 + 8, easeInOut), 0, 0.5);
  const boxHeat = ramp(frame, meses2, nino);
  const stamp = ramp(frame, nino - 4, nino + 8, pop);
  const panels = 1 - ramp(frame, declare - 8, declare);
  const boxX = 540 - lonX(focus) + NINO34.x;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [nino], 22) }}>
        <Background tint="#0b1730" />
        <div style={{ position: "absolute", top: MAP_TOP, left: 540 - lonX(focus) }}>
          <PacificMap
            warmLon={mix(k, 150, 200)}
            warmRx={mix(k, 400, 560)}
            warmHeat={mix(k, 1, 0.85)}
            cold={mix(k, 1, 0.15)}
            bulgeLon={bulgeLon}
            bulge={Math.min(ramp(frame, vuelve - 8, vuelve + 4), 1 - 0.6 * ramp(frame, meses + 6, meses + 30))}
            box={box}
            boxHeat={boxHeat}
          />
        </div>
        {/* Cuánto recorrió y cuánto tardó */}
        <div style={{ position: "absolute", left: 60, top: 1030, opacity: ramp(frame, vuelve, vuelve + 8) * panels }}>
          <Panel glow={C.heat}>
            <Label size={28} color={C.dim}>
              RECORRIDO
            </Label>
            <Label size={64} mono color={C.heat} style={{ marginTop: 8 }}>
              {fmt(k * (250 - 150) * KM_PER_DEG)} km
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", right: 60, top: 1030, opacity: ramp(frame, vuelve, vuelve + 8) * panels }}>
          <Panel>
            <Label size={28} color={C.dim}>
              TIEMPO
            </Label>
            <Label size={64} mono style={{ marginTop: 8 }}>
              {Math.round(k * 8)} sem.
            </Label>
          </Panel>
        </div>
        {/* Medio grado de más: se declara El Niño */}
        <div style={{ position: "absolute", right: 30, top: 250, opacity: ramp(frame, medio - 6, medio + 6), translate: `${mix(ramp(frame, medio - 6, medio + 12, pop), 120, 0)}px 0px` }}>
          <AnomalyThermometer value={anomaly} height={720} />
        </div>
        <div
          style={{
            position: "absolute",
            left: boxX + NINO34.w / 2,
            top: MAP_TOP + latY(0),
            translate: "-50% -50%",
            rotate: "-12deg",
            opacity: stamp,
            scale: String(mix(stamp, 2.4, 1)),
            border: `10px solid ${C.positive}`,
            borderRadius: 24,
            padding: "10px 30px",
            background: "rgba(40,6,6,0.55)",
          }}
        >
          <Label size={96} color={C.positive}>
            EL NIÑO
          </Label>
        </div>
      </AbsoluteFill>
      <Flash at={nino} color={C.positive} length={10} peak={0.35} />
      <Audio from={vuelve - 8} src={staticFile("sfx/whoosh.wav")} volume={0.12} />
      <Audio from={vuelve} src={staticFile("sfx/ola.wav")} volume={0.08} />
      <Audio from={meses} src={staticFile("sfx/toque.wav")} volume={0.5} />
      <Audio from={medio} src={staticFile("sfx/toque.wav")} volume={0.5} />
      <Audio from={nino - 2} src={staticFile("sfx/trueno.wav")} volume={0.15} />
    </AbsoluteFill>
  );
};
