import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bolt, buildBolt, type Pt } from "../components/Bolt";
import { Cloud } from "../components/Cloud";
import { easeInOut, mix, pop, ramp } from "../components/anim";
import { Background, clamp, Flash, fmt, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";

const GROUND = 1180;
const FROM: Pt = [610, 300];
const TREE_TOP: Pt = [300, 990];
const LEADER = { seed: "lider", from: FROM, to: TREE_TOP, segments: 14, jitter: 55, branches: 5 };

const Landscape: React.FC = () => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}>
    <rect x={0} y={GROUND} width={1080} height={740} fill="#060a14" />
    <line x1={0} y1={GROUND} x2={1080} y2={GROUND} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
    {/* Árbol */}
    <rect x={288} y={1080} width={24} height={100} fill="#0b1220" />
    <path d="M 300 990 L 380 1100 L 220 1100 Z" fill="#101a2e" />
    <path d="M 300 1030 L 395 1140 L 205 1140 Z" fill="#101a2e" />
    {/* Casa */}
    <path d="M 700 1080 L 800 1010 L 900 1080 V 1180 H 700 Z" fill="#101a2e" />
    <rect x={770} y={1110} width={40} height={40} fill="#ffd36b" opacity={0.5} />
  </svg>
);

const Arrow: React.FC<{ color: string }> = ({ color }) => (
  <svg width={260} height={520} viewBox="0 0 220 460">
    <path d="M 70 0 H 150 V 300 H 215 L 110 455 L 5 300 H 70 Z" fill={color} />
  </svg>
);

export const S5Cuerpo2: React.FC = () => {
  const frame = useCurrentFrame();
  const [, leaderStart] = beats("cuerpo2");
  const baja = wordAt("cuerpo2", "baja");
  const sube = wordAt("cuerpo2", "sube");
  const cae = wordAt("cuerpo2", "cae");
  const saltos = wordAt("cuerpo2", "saltos");
  const tocar = wordAt("cuerpo2", "tocar");
  const destello = wordAt("cuerpo2", "destello");
  const speedWord = wordAt("cuerpo2", "sube", 1);
  const touch = tocar + 6;
  const stroke = destello + 2;

  const flip = ramp(frame, sube - 2, sube + 12, pop);
  const arrowScene = 1 - ramp(frame, leaderStart - 4, leaderStart + 4);
  const steps = 10;
  const leader = Math.floor(ramp(frame, cae - 6, touch, (t) => t) * steps) / steps;
  const leaderFlicker = 0.55 + ((frame * 7) % 5) * 0.06;
  const returnStroke = ramp(frame, stroke, stroke + 6, (t) => t);
  const speed = ramp(frame, speedWord, wordAt("cuerpo2", "kilómetros") + 4, easeInOut);
  const { main } = buildBolt(LEADER.seed, LEADER.from, LEADER.to, LEADER.segments, LEADER.jitter, LEADER.branches);
  const pulseIndex = Math.min(main.length - 1, Math.floor((1 - returnStroke) * (main.length - 1)));

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* A · no baja: sube */}
      {arrowScene > 0 ? (
        <AbsoluteFill style={{ opacity: arrowScene }}>
          <Background tint="#0d1838" rain={0.4} />
          <div style={{ position: "absolute", left: 410, top: 360, rotate: `${mix(flip, 0, 180)}deg`, scale: String(mix(ramp(frame, 0, 10, pop), 0.7, 1)) }}>
            <Arrow color={flip > 0.5 ? C.yellow : C.white} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <Label size={110} color={flip > 0.5 ? C.yellow : C.white}>
                {flip > 0.5 ? "SUBE" : "BAJA"}
              </Label>
              {flip <= 0.5 ? <div style={{ position: "absolute", left: -20, top: 48, height: 14, borderRadius: 7, background: C.positive, width: mix(ramp(frame, baja + 2, baja + 8), 0, 360) }} /> : null}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* B · líder escalonado · C · descarga de retorno */}
      {arrowScene < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - arrowScene, ...shake(frame, [stroke], 36) }}>
          <Background tint="#0c1730" rain={0.45} />
          <div style={{ position: "absolute", left: -60, top: -885 }}>
            <Cloud width={1200} seed="cuerpo2" flash={interpolate(frame, [stroke, stroke + 4, stroke + 30], [0, 1, 0.1], clamp)} />
          </div>
          <Landscape />
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {frame < stroke ? <Bolt {...LEADER} width={8} progress={leader} intensity={leaderFlicker} color="#9fd8ff" /> : null}
            {frame >= touch && frame < stroke ? (
              <line x1={TREE_TOP[0]} y1={TREE_TOP[1]} x2={TREE_TOP[0] + 8} y2={TREE_TOP[1] - mix(ramp(frame, touch, stroke), 0, 60)} stroke={C.electric} strokeWidth={6} opacity={0.6} />
            ) : null}
            {frame >= stroke ? (
              <>
                <Bolt {...LEADER} width={16} progress={returnStroke} reverse intensity={interpolate(frame, [stroke + 6, stroke + 40], [1, 0.75], clamp)} />
                {returnStroke < 1 ? <circle cx={main[pulseIndex][0]} cy={main[pulseIndex][1]} r={46} fill={C.core} opacity={0.95} /> : null}
              </>
            ) : null}
          </svg>
          <div style={{ position: "absolute", left: 640, top: 380, opacity: Math.min(ramp(frame, saltos - 6, saltos + 4), 1 - ramp(frame, stroke - 6, stroke)) }}>
            <Panel style={{ padding: "12px 22px" }}>
              <Label size={34} color={C.electric}>CADA SALTO</Label>
              <Label size={60} mono style={{ marginTop: 8 }}>
                ≈ 50 m
              </Label>
            </Panel>
          </div>
          {/* Flecha hacia arriba sobre la descarga */}
          <div style={{ position: "absolute", left: 420, top: 560, opacity: ramp(frame, stroke + 6, stroke + 12), scale: String(mix(ramp(frame, stroke + 6, stroke + 18, pop), 0.4, 0.55)), rotate: "180deg" }}>
            <Arrow color={C.yellow} />
          </div>
          <div style={{ position: "absolute", right: 60, top: 270, opacity: ramp(frame, speedWord - 4, speedWord + 4) }}>
            <Panel glow={C.yellow} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Label size={66} mono color={C.yellow}>
                {fmt(speed * 100000)}
              </Label>
              <Label size={34} mono style={{ marginTop: 6 }}>
                km por segundo
              </Label>
              <Label size={24} color={C.dim} style={{ marginTop: 10 }}>
                1/3 DE LA VELOCIDAD DE LA LUZ
              </Label>
            </Panel>
          </div>
          <div style={{ position: "absolute", left: 150, top: 1050, opacity: Math.min(ramp(frame, touch, touch + 4), 1 - ramp(frame, stroke + 20, stroke + 30)) }}>
            <Label size={34} color={C.electric}>¡TOCÓ EL SUELO!</Label>
          </div>
        </AbsoluteFill>
      ) : null}

      <Flash at={stroke} length={14} peak={1} />
      <Audio from={sube - 3} src={staticFile("sfx/whoosh.wav")} volume={0.28} />
      <Audio from={leaderStart} src={staticFile("sfx/chispa.wav")} volume={0.24} />
      <Audio from={touch} src={staticFile("sfx/toque.wav")} volume={0.42} />
      <Audio from={stroke - 1} src={staticFile("sfx/trueno.wav")} volume={0.35} />
    </AbsoluteFill>
  );
};
