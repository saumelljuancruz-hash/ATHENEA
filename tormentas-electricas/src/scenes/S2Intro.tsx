import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Bolt } from "../components/Bolt";
import { Cloud } from "../components/Cloud";
import { easeInOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, fmt, Label, Panel, Person, shake } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";


export const S2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const [, teaser] = beats("intro");
  const strike = wordAt("intro", "rayo") + 2;
  const countFrom = wordAt("intro", "300") - 4;
  const countTo = wordAt("intro", "voltios") + 6;

  const count = ramp(frame, countFrom, countTo, easeInOut);
  // Escala logarítmica: así se ven pasar todas las cifras.
  const volts = Math.pow(10, mix(count, Math.log10(5), Math.log10(300_000_000)));
  const out = ramp(frame, teaser - 4, teaser + 10, easeInOut);
  const tease = ramp(frame, teaser, teaser + 16, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [strike, strike + 3], 34) }}>
        <Background tint="#0d1a36" rain={0.6} />

        {/* Rayo cayendo sobre el número */}
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: 1 - out }}>
          <Bolt
            seed="intro-rayo"
            from={[620, -60]}
            to={[560, 470]}
            segments={16}
            jitter={70}
            branches={5}
            width={14}
            progress={ramp(frame, strike - 4, strike)}
            intensity={interpolate(frame, [strike, strike + 6, strike + 30, strike + 40], [1, 0.7, 0.9, 0.35], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
          />
        </svg>

        {/* Contador de voltios */}
        <div
          style={{
            position: "absolute",
            top: 520,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: 1 - out,
            scale: String(mix(out, 1, 0.6) * mix(ramp(frame, 0, 10), 0.85, 1)),
            translate: `0px ${mix(out, 0, -380)}px`,
          }}
        >
          <Label size={36} color={C.electric} mono>
            VOLTAJE
          </Label>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 12 }}>
            <Label size={count > 0.6 ? 112 : 140} mono color={count > 0.98 ? C.yellow : C.white}>
              {fmt(volts)}
            </Label>
            <Label size={80} mono color={C.yellow}>
              V
            </Label>
          </div>
        </div>

        {/* Comparación: tu dedo vs un rayo */}
        <div style={{ position: "absolute", top: 820, left: 90, right: 90, opacity: Math.min(ramp(frame, countFrom, countFrom + 8), 1 - out) }}>
          {[
            { label: "TU DEDO", value: "5 V", width: 14, color: C.electric },
            { label: "UN RAYO", value: "300.000.000 V", width: mix(count, 14, 1400), color: C.yellow },
          ].map((row) => (
            <div key={row.label} style={{ marginBottom: 34 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <Label size={40}>{row.label}</Label>
                <Label size={36} mono color={row.color}>
                  {row.value}
                </Label>
              </div>
              <div style={{ height: 40, borderRadius: 20, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                <div style={{ height: 40, width: row.width, borderRadius: 20, background: row.color, boxShadow: `0 0 30px ${row.color}` }} />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 6, opacity: ramp(frame, countTo - 4, countTo + 6), scale: String(mix(ramp(frame, countTo - 4, countTo + 10, pop), 0.4, 1)) }}>
            <Panel glow={C.yellow} style={{ padding: "14px 28px" }}>
              <Label size={50} color={C.yellow}>
                ×60.000.000
              </Label>
            </Panel>
          </div>
        </div>

        {/* Adelanto: al final vas a saber si viene hacia vos */}
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, height: 700, opacity: tease }}>
          <div style={{ position: "absolute", left: 70, top: 140, translate: `${mix(ramp(frame, teaser, teaser + 70, easeInOut), -40, 60)}px 0px` }}>
            <Cloud width={380} flash={frame % 24 < 3 ? 0.8 : 0.1} seed="intro-nube" />
          </div>
          <div style={{ position: "absolute", right: 110, top: 400, scale: String(mix(tease, 0.6, 1)) }}>
            <Person size={120} />
          </div>
          <svg width={1080} height={700} style={{ position: "absolute" }}>
            <line x1={360} y1={600} x2={880} y2={600} stroke={C.white} strokeWidth={5} strokeDasharray="18 16" strokeDashoffset={-frame * 3} opacity={0.7} />
            <polygon points="890,600 860,584 860,616" fill={C.white} opacity={0.7} />
          </svg>
          <div style={{ position: "absolute", left: 470, top: 500 }}>
            <Panel glow={C.yellow} style={{ padding: "10px 24px", rotate: `${Math.sin(frame / 5) * 3}deg` }}>
              <Label size={64} mono color={C.yellow}>
                ? km
              </Label>
            </Panel>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", scale: String(mix(ramp(frame, teaser + 4, teaser + 20, pop), 0.5, 1)) }}>
            <Panel glow={C.electric} style={{ padding: "14px 30px" }}>
              <Label size={44} color={C.electric}>
                AL FINAL DEL VIDEO ↓
              </Label>
            </Panel>
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={strike} length={12} peak={0.95} />
      <Audio from={strike - 1} src={staticFile("sfx/trueno.wav")} volume={0.28} />
      <Audio from={teaser - 6} src={staticFile("sfx/whoosh.wav")} volume={0.28} />
    </AbsoluteFill>
  );
};
