import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { CrossSection, surfaceAt } from "../components/Ocean";
import { latY, lonX, PacificMap } from "../components/Pacific";
import { easeInOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, clamp, Label, Panel } from "../components/Ui";
import { C, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const MAP_TOP = 230;
const PANEL = { top: 1010, height: 230, width: 1000 };

export const S3Cuerpo1: React.FC = () => {
  const frame = useCurrentFrame();
  const [, empuja, frente] = beats("cuerpo1");
  const asia = wordAt("cuerpo1", "asia");
  const caliente = wordAt("cuerpo1", "caliente");
  const apila = wordAt("cuerpo1", "apila");
  const medio = wordAt("cuerpo1", "medio");
  const fria = wordAt("cuerpo1", "fría");

  // La cámara sigue al viento hacia el oeste y después vuelve a Perú.
  const focus = interpolate(frame, [0, asia + 10, empuja + 20, frente - 4, frente + 20], [268, 168, 152, 152, 262], { ...clamp, easing: easeInOut });
  const panel = ramp(frame, empuja - 4, empuja + 10);
  const tiltPx = 46;
  const west = surfaceAt(0, PANEL.height, 1, tiltPx);
  const east = surfaceAt(1, PANEL.height, 1, tiltPx);
  const ruler = ramp(frame, medio - 4, medio + 8);
  const upwelling = ramp(frame, frente, fria + 6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background tint="#0b1730" />
      <div style={{ position: "absolute", top: MAP_TOP, left: 540 - lonX(focus) }}>
        <PacificMap
          windDistance={frame * 14}
          wind={1}
          warmRx={mix(ramp(frame, empuja, apila + 10), 240, 430)}
          warmHeat={mix(ramp(frame, empuja, caliente + 6), 0.5, 1)}
          cold={upwelling}
        />
      </div>
      <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: window01(frame, 6, empuja - 6) }}>
        <Panel style={{ padding: "12px 26px" }}>
          <Label size={40} color={C.white}>
            ← VIENTOS ALISIOS
          </Label>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 540 - 110, top: MAP_TOP + latY(0) - 150, opacity: window01(frame, caliente - 2, frente - 6), scale: String(mix(ramp(frame, caliente - 2, caliente + 10, pop), 0.5, 1)) }}>
        <Panel glow={C.heat} style={{ padding: "8px 20px" }}>
          <Label size={44} mono color={C.heat}>
            +28 °C
          </Label>
        </Panel>
      </div>
      {/* Corte del océano: el agua apilada en el oeste y el agua fría que sube en el este */}
      <div style={{ position: "absolute", left: 40, top: PANEL.top, width: PANEL.width, height: PANEL.height, opacity: panel, borderRadius: 26, overflow: "hidden", border: "2px solid rgba(127,220,255,0.3)", background: "#06122a" }}>
        <CrossSection id="cuerpo1" width={PANEL.width} height={PANEL.height} frame={frame} tilt={1} tiltPx={tiltPx} waves={3} upwelling={upwelling} />
        <svg width={PANEL.width} height={PANEL.height} style={{ position: "absolute", left: 0, top: 0, opacity: ruler }}>
          <line x1={90} y1={east} x2={PANEL.width - 20} y2={east} stroke="#fff" strokeWidth={3} strokeDasharray="10 8" opacity={0.7} />
          <line x1={90} y1={west} x2={90} y2={east} stroke={C.yellow} strokeWidth={6} />
          <line x1={74} y1={west} x2={106} y2={west} stroke={C.yellow} strokeWidth={6} />
          <line x1={74} y1={east} x2={106} y2={east} stroke={C.yellow} strokeWidth={6} />
          <text x={124} y={(west + east) / 2 + 14} fontFamily={MONO} fontWeight={800} fontSize={42} fill={C.yellow} stroke="#03050b" strokeWidth={8} paintOrder="stroke">
            +50 cm
          </text>
        </svg>
        <div style={{ position: "absolute", left: 18, bottom: 12, fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#fff", opacity: 0.85 }}>INDONESIA</div>
        <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: MONO, fontWeight: 800, fontSize: 24, color: "#fff", opacity: 0.85 }}>PERÚ</div>
        <div style={{ position: "absolute", right: 150, top: 150, opacity: upwelling, fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.negative, whiteSpace: "nowrap" }}>AGUA FRÍA ↑</div>
      </div>
      <Audio from={0} src={staticFile("sfx/viento.wav")} volume={0.07} />
      <Audio from={empuja - 6} src={staticFile("sfx/ola.wav")} volume={0.07} />
      <Audio from={caliente} src={staticFile("sfx/toque.wav")} volume={0.5} />
      <Audio from={medio} src={staticFile("sfx/toque.wav")} volume={0.5} />
      <Audio from={frente - 6} src={staticFile("sfx/whoosh.wav")} volume={0.1} />
      <Audio from={fria} src={staticFile("sfx/ola.wav")} volume={0.07} />
    </AbsoluteFill>
  );
};
