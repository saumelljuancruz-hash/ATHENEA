import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Finger } from "../components/Finger";
import { CrossSection } from "../components/Ocean";
import { easeInOut, easeOut, mix, ramp, wobble } from "../components/anim";
import { Background, clamp, Label, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

const SURFACE = 760;
const WATER_H = 1160;
const TIP_Y = 700;

/** El dedo que desliza el video: dónde está la yema y cuánto se levantó del vidrio. */
const fingerPose = (frame: number, swipeB: number) => {
  const x = interpolate(frame, [-4, 16, 22, swipeB - 6, swipeB, swipeB + 20, swipeB + 40], [940, 170, 190, 900, 900, 150, 420], { ...clamp, easing: easeInOut });
  const lift = interpolate(frame, [14, 22, swipeB - 8, swipeB, swipeB + 18, swipeB + 40], [0, 1, 1, 0, 0, 3], clamp);
  return { x, lift };
};

export const S1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const swipeB = wordAt("gancho", "desliza") - 6;
  const oceano = wordAt("gancho", "océano");
  const { x, lift } = fingerPose(frame, swipeB);
  const tilt = 0.5 * ramp(frame, -4, 16, easeInOut) + 0.5 * ramp(frame, swipeB, swipeB + 20, easeInOut) + wobble(frame, 16, 0.25) + wobble(frame, swipeB + 20, 0.3);
  const gusting = Math.max(
    interpolate(frame, [-4, 2, 14, 20], [1, 1, 1, 0], clamp),
    interpolate(frame, [swipeB - 2, swipeB + 4, swipeB + 18, swipeB + 26], [0, 1, 1, 0], clamp),
  );
  const reveal = ramp(frame, oceano - 6, oceano + 14, easeOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(mix(reveal, 1.16, 1)), ...shake(frame, [16, swipeB + 20], 10) }}>
        <Background tint="#0b1d3d" />
        <div style={{ position: "absolute", left: 0, right: 0, top: SURFACE + WATER_H * 0.68 - 2, height: 800, background: "#030c22" }} />
        <div style={{ position: "absolute", left: 0, top: SURFACE - WATER_H * 0.32 }}>
          <CrossSection id="gancho" width={1080} height={WATER_H} frame={frame} tilt={tilt} tiltPx={170} waves={9 + gusting * 8} />
        </div>
        {/* Viento: rayas que siguen al dedo hacia la izquierda */}
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: gusting }}>
          {new Array(22).fill(0).map((_, i) => {
            const y = 560 + random(`gy${i}`) * 170;
            const len = 90 + random(`gl${i}`) * 140;
            const px = ((random(`gx${i}`) * 1500 - frame * 46) % 1500 + 1500) % 1500 - 200;
            return <line key={i} x1={px} y1={y} x2={px + len} y2={y} stroke="#e8f6ff" strokeWidth={4 + random(`gw${i}`) * 4} strokeLinecap="round" opacity={0.3 + random(`go${i}`) * 0.5} />;
          })}
          {/* Salpicaduras contra la orilla del oeste */}
          {[16, swipeB + 20].flatMap((at, k) =>
            new Array(10).fill(0).map((_, i) => {
              const t = (frame - at) / 22;
              if (t < 0 || t > 1) {
                return null;
              }
              const vx = 4 + random(`sx${k}${i}`) * 10;
              const vy = -18 - random(`sy${k}${i}`) * 16;
              return <circle key={`${k}-${i}`} cx={40 + vx * t * 22} cy={SURFACE - 150 + vy * t * 22 + 0.9 * (t * 22) ** 2} r={7 + random(`sr${k}${i}`) * 7} fill="#ffb07a" opacity={1 - t} />;
            }),
          )}
        </svg>
        {/* Oeste y este: Asia y América */}
        <div style={{ position: "absolute", top: 250, left: 70, opacity: reveal, translate: `${mix(reveal, -60, 0)}px 0px` }}>
          <Label size={58}>← ASIA</Label>
        </div>
        <div style={{ position: "absolute", top: 250, right: 70, opacity: reveal, translate: `${mix(reveal, 60, 0)}px 0px` }}>
          <Label size={58}>AMÉRICA →</Label>
        </div>
        <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: reveal }}>
          <Label size={34} color={C.electric} mono>
            OCÉANO PACÍFICO
          </Label>
        </div>
      </AbsoluteFill>
      {/* El dedo gigante que desliza */}
      <div
        style={{
          position: "absolute",
          left: x - 150,
          top: TIP_Y,
          transformOrigin: "50% 0%",
          rotate: `${-10 + (x - 540) * 0.012}deg`,
          translate: `${lift * 60}px ${lift * 150}px`,
          scale: String(1 - Math.min(lift, 1) * 0.06),
          filter: `blur(${gusting * 3}px)`,
        }}
      >
        <Finger width={300} rim={0.5} />
      </div>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={0.12} />
      <Audio from={12} src={staticFile("sfx/ola.wav")} volume={0.1} />
      <Audio from={swipeB - 2} src={staticFile("sfx/whoosh.wav")} volume={0.12} />
      <Audio from={swipeB + 16} src={staticFile("sfx/ola.wav")} volume={0.1} />
    </AbsoluteFill>
  );
};
