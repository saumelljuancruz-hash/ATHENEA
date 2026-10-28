import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Bolt } from "../components/Bolt";
import { Finger } from "../components/Finger";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, Label, shake } from "../components/Ui";
import { C, DISPLAY } from "../theme";
import { beats, wordAt } from "../timeline";

const SAVE = { x: 540, y: 640 };
const FOLLOW = { x: 540, y: 1030 };

/** El dedo gigante tocando un punto: entra desde abajo a la derecha. */
const TappingFinger: React.FC<{ frame: number; at: number; x: number; y: number; leave: number }> = ({ frame, at, x, y, leave }) => {
  const enter = ramp(frame, at - 10, at, easeOut);
  const press = ramp(frame, at, at + 3) - ramp(frame, at + 3, at + 10);
  const exit = ramp(frame, leave, leave + 10, easeInOut);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 4,
        transformOrigin: "50% 0%",
        rotate: "-24deg",
        translate: `${mix(enter, 420, 0) + exit * 900}px ${mix(enter, 700, 0) + exit * 1500}px`,
        scale: String(1 - press * 0.04),
      }}
    >
      <Finger width={300} rim={0.5} />
    </div>
  );
};

const Bookmark: React.FC<{ filled: number }> = ({ filled }) => (
  <svg width={260} height={340} viewBox="0 0 260 340">
    <path d="M 30 20 H 230 V 320 L 130 240 L 30 320 Z" fill={filled > 0 ? C.yellow : "transparent"} fillOpacity={filled} stroke={filled > 0.5 ? C.yellow : C.white} strokeWidth={22} strokeLinejoin="round" />
  </svg>
);

export const S8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const [, follow] = beats("cta");
  const tapSave = wordAt("cta", "guardalo") + 10;
  const tapFollow = wordAt("cta", "seguí") + 6;
  const saved = ramp(frame, tapSave, tapSave + 4);
  const card = ramp(frame, follow - 6, follow + 10, pop);
  const followed = frame >= tapFollow + 2;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tapSave, tapFollow], 14) }}>
        <Background tint="#0d1838" rain={0.35} />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {[0, 1, 2].map((i) => {
            const at = 20 + i * 47;
            return frame >= at && frame < at + 8 ? <Bolt key={i} seed={`cta${i}`} from={[i === 1 ? 900 : 160, -40]} to={[i === 1 ? 760 : 300, 520]} segments={10} jitter={40} branches={2} width={7} intensity={0.6 * (1 - (frame - at) / 8)} /> : null;
          })}
        </svg>

        {/* Guardar */}
        <div
          style={{
            position: "absolute",
            left: SAVE.x - 130,
            top: SAVE.y - 170,
            scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1) * (1 + (ramp(frame, tapSave, tapSave + 4) - ramp(frame, tapSave + 4, tapSave + 14, easeOut)) * 0.25) * mix(ramp(frame, follow - 8, follow + 6, easeInOut), 1, 0.42)),
            translate: `0px ${mix(ramp(frame, follow - 8, follow + 6, easeInOut), 0, -330)}px`,
          }}
        >
          <Bookmark filled={saved} />
        </div>
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: frame < follow ? 1 : 0 }}>
          {frame >= tapSave
            ? new Array(18).fill(0).map((_, i) => {
                const a = (i / 18) * Math.PI * 2;
                const d = mix(ramp(frame, tapSave, tapSave + 18, easeOut), 120, 360 + random(`cb${i}`) * 120);
                return <circle key={i} cx={SAVE.x + Math.cos(a) * d} cy={SAVE.y + Math.sin(a) * d} r={10} fill={i % 2 ? C.yellow : C.electric} opacity={1 - ramp(frame, tapSave + 10, tapSave + 22)} />;
              })
            : null}
        </svg>

        {/* Seguí a la cuenta */}
        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 560,
            opacity: card,
            translate: `0px ${mix(card, 200, 0)}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px 30px 46px",
            borderRadius: 48,
            background: "linear-gradient(160deg, rgba(24,38,72,0.95), rgba(6,10,22,0.95))",
            border: `2px solid ${C.electric}55`,
            boxShadow: `0 0 60px ${C.electric}33, 0 40px 80px rgba(0,0,0,0.6)`,
          }}
        >
          <Img src={staticFile("logo.png")} style={{ width: 200, height: 200, borderRadius: "50%", border: "5px solid #3ee0c0", boxShadow: "0 0 50px #3ee0c055" }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, color: C.white, marginTop: 30, letterSpacing: -1 }}>@nadietelo.explico</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, color: C.dim, marginTop: 10 }}>Datos curiosos, bien explicados</div>
          <div
            style={{
              marginTop: 40,
              width: 480,
              height: 110,
              borderRadius: 30,
              background: followed ? "rgba(255,255,255,0.14)" : C.electricDeep,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              scale: String(1 - (ramp(frame, tapFollow, tapFollow + 3) - ramp(frame, tapFollow + 3, tapFollow + 10)) * 0.08),
              boxShadow: followed ? "none" : `0 0 40px ${C.electricDeep}aa`,
            }}
          >
            {followed ? (
              <svg width={44} height={44} viewBox="0 0 44 44">
                <path d="M 8 23 L 18 33 L 37 11" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
            <Label size={50}>{followed ? "Siguiendo" : "Seguir"}</Label>
          </div>
        </div>

        <TappingFinger frame={frame} at={tapSave} x={SAVE.x + 20} y={SAVE.y + 40} leave={tapSave + 18} />
        {frame >= follow ? <TappingFinger frame={frame} at={tapFollow} x={FOLLOW.x + 60} y={FOLLOW.y + 50} leave={tapFollow + 30} /> : null}
      </AbsoluteFill>
      <Flash at={tapSave} color={C.yellow} length={8} peak={0.3} />
      <Audio from={tapSave - 1} src={staticFile("sfx/toque.wav")} volume={0.56} />
      <Audio from={tapSave} src={staticFile("sfx/ding.wav")} volume={0.42} />
      <Audio from={follow - 6} src={staticFile("sfx/whoosh.wav")} volume={0.1} />
      <Audio from={tapFollow - 1} src={staticFile("sfx/toque.wav")} volume={0.56} />
      <Audio from={tapFollow + 1} src={staticFile("sfx/ding.wav")} volume={0.35} />
    </AbsoluteFill>
  );
};
