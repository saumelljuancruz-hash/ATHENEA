import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { ComentarIcono } from "../components/Futbol";
import { Finger } from "../components/Finger";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, Label, shake } from "../components/Ui";
import { SEGUIR } from "../serie";
import { C, DISPLAY } from "../theme";
import { beats, wordAt } from "../timeline";

const ICON = { x: 540, y: 560 };
const FOLLOW = { x: 540, y: 1030 };
const TEXTO = "Club ";

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

export const S8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const [, follow] = beats("cta");
  const tapComment = wordAt("cta", "comentá") + 8;
  const tapFollow = wordAt("cta", "seguí") + 6;
  const tapped = ramp(frame, tapComment, tapComment + 4);
  const typed = Math.max(0, Math.min(TEXTO.length, Math.floor((frame - tapComment - 8) / 3)));
  const box = ramp(frame, tapComment + 4, tapComment + 14, pop) * (1 - ramp(frame, follow - 10, follow - 2));
  const card = ramp(frame, follow - 6, follow + 10, pop);
  const followed = frame >= tapFollow + 2;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tapComment, tapFollow], 14) }}>
        <Background tint="#0d2a1a" />

        {/* Comentá */}
        <div
          style={{
            position: "absolute",
            left: ICON.x - 150,
            top: ICON.y - 150,
            scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1) * (1 + (ramp(frame, tapComment, tapComment + 4) - ramp(frame, tapComment + 4, tapComment + 14, easeOut)) * 0.25)),
            opacity: 1 - ramp(frame, follow - 10, follow - 2),
          }}
        >
          <ComentarIcono filled={tapped} size={300} />
        </div>
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: frame < follow ? 1 : 0 }}>
          {frame >= tapComment
            ? new Array(18).fill(0).map((_, i) => {
                const a = (i / 18) * Math.PI * 2;
                const d = mix(ramp(frame, tapComment, tapComment + 18, easeOut), 120, 360 + random(`cb${i}`) * 120);
                return <circle key={i} cx={ICON.x + Math.cos(a) * d} cy={ICON.y + Math.sin(a) * d} r={10} fill={i % 2 ? C.yellow : C.electric} opacity={1 - ramp(frame, tapComment + 10, tapComment + 22)} />;
              })
            : null}
        </svg>
        <div style={{ position: "absolute", left: 90, right: 90, top: 820, opacity: box, translate: `0px ${mix(box, 80, 0)}px` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 28px", borderRadius: 40, background: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.25)" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "linear-gradient(135deg, #3ee0c0, #2f8cff)" }} />
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 44, color: C.white, flex: 1 }}>
              {TEXTO.slice(0, typed)}
              <span style={{ color: C.yellow, opacity: Math.floor(frame / 8) % 2 ? 1 : 0 }}>|</span>
            </div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 34, color: C.electric }}>Publicar</div>
          </div>
        </div>

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
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, color: C.dim, marginTop: 10 }}>Entrá a la cancha</div>
          <div
            style={{
              marginTop: 40,
              width: 480,
              height: 110,
              borderRadius: 30,
              background: followed ? "rgba(255,255,255,0.14)" : SEGUIR,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              scale: String(1 - (ramp(frame, tapFollow, tapFollow + 3) - ramp(frame, tapFollow + 3, tapFollow + 10)) * 0.08),
              boxShadow: followed ? "none" : `0 0 40px ${SEGUIR}aa`,
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

        <TappingFinger frame={frame} at={tapComment} x={ICON.x + 20} y={ICON.y + 40} leave={tapComment + 16} />
        {frame >= follow ? <TappingFinger frame={frame} at={tapFollow} x={FOLLOW.x + 60} y={FOLLOW.y + 50} leave={tapFollow + 30} /> : null}
      </AbsoluteFill>
      <Flash at={tapComment} color={C.yellow} length={8} peak={0.3} />
      <Audio from={tapComment - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tapComment} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={follow - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={tapFollow - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tapFollow + 1} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
