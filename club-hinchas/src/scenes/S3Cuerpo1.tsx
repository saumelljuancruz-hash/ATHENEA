import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Estadio, Potrero } from "../components/Futbol";
import { Finger } from "../components/Finger";
import { Phone, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Flash, fmt, Label, Panel, shake } from "../components/Ui";
import { HINCHAS, SEGUIR } from "../serie";
import { C, DISPLAY } from "../theme";
import { beats, wordAt } from "../timeline";

const PHONE = { x: 760, y: 780, w: 230 };
const BUTTON = { x: PHONE.x + PHONE.w / 2, y: PHONE.y + PHONE.w * 2.05 * 0.62 };

const NIVELES = [
  { nombre: "POTRERO", lugares: 100 },
  { nombre: "BARRIO", lugares: 1000 },
  { nombre: "ESTADIO", lugares: 10000 },
  { nombre: "MONUMENTAL", lugares: 100000 },
];

export const S3Cuerpo1: React.FC = () => {
  const frame = useCurrentFrame();
  const [, mudanza] = beats("cuerpo1");
  const sigue = wordAt("cuerpo1", "sigue");
  const hincha = wordAt("cuerpo1", "hincha");
  const mudamos = wordAt("cuerpo1", "mudamos");
  const steps = [mudanza + 4, wordAt("cuerpo1", "1000"), wordAt("cuerpo1", "10000"), wordAt("cuerpo1", "100000")];

  // A · tocás "Seguir" y aparecés en la tribuna
  const partA = window01(frame, 0, mudanza - 6);
  const tap = sigue + 4;
  const followed = frame >= tap + 2;
  const fly = ramp(frame, tap + 6, hincha + 4, easeInOut);
  const sentado = ramp(frame, hincha + 2, hincha + 10, pop);
  const fingerIn = ramp(frame, tap - 12, tap, easeOut);
  const fingerOut = ramp(frame, tap + 10, tap + 24, easeInOut);
  const press = ramp(frame, tap, tap + 3) - ramp(frame, tap + 3, tap + 10);
  // B · cuando se llena, nos mudamos
  const partB = ramp(frame, mudanza - 4, mudanza + 6);
  const lleno = ramp(frame, mudanza, mudamos - 2, easeInOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, hincha, ...steps.slice(1)], 12) }}>
        <Background tint="#0d2a1a" />

        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 81, top: 240 }}>
              <Potrero hinchas={HINCHAS} vos={sentado} frame={frame} width={918} />
            </div>
            <div style={{ position: "absolute", left: 60, top: 200 }}>
              <Panel glow={TEAL} style={{ padding: "8px 22px" }}>
                <Label size={40} mono color={TEAL}>
                  {sentado > 0.5 ? HINCHAS + 1 : HINCHAS} / 100
                </Label>
              </Panel>
            </div>
            <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, rotate: "6deg" }}>
              <Phone width={PHONE.w} ui={0}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 40 }}>
                  <Img src={staticFile("logo.png")} style={{ width: 110, height: 110, borderRadius: "50%", border: `3px solid ${TEAL}` }} />
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 19, color: C.white }}>@nadietelo.explico</div>
                  <div
                    style={{
                      marginTop: 18,
                      width: 160,
                      height: 50,
                      borderRadius: 14,
                      background: followed ? "rgba(255,255,255,0.16)" : SEGUIR,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scale: String(1 - press * 0.08),
                      fontFamily: DISPLAY,
                      fontWeight: 900,
                      fontSize: 24,
                      color: C.white,
                    }}
                  >
                    {followed ? "Siguiendo" : "Seguir"}
                  </div>
                </div>
              </Phone>
            </div>
            {/* El hincha nuevo vuela del celular a la tribuna */}
            {fly > 0 && fly < 1 ? (
              <div style={{ position: "absolute", left: mix(fly, BUTTON.x, 540) - 30, top: mix(fly, BUTTON.y, 520) - 160 * Math.sin(fly * Math.PI) - 30, scale: String(mix(fly, 1.6, 0.8)) }}>
                <svg width={60} height={70} viewBox="-30 -50 60 70">
                  <rect x={-16} y={-22} width={32} height={34} rx={12} fill={C.yellow} />
                  <circle cx={0} cy={-36} r={14} fill={C.yellow} />
                </svg>
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 60, top: 1010, opacity: sentado, scale: String(mix(sentado, 0.6, 1)), transformOrigin: "0 50%" }}>
              <Panel glow={C.yellow} style={{ padding: "10px 24px" }}>
                <Label size={40} color={C.yellow}>
                  1 SEGUIDOR = 1 HINCHA
                </Label>
              </Panel>
            </div>
            <div
              style={{
                position: "absolute",
                left: BUTTON.x - 140,
                top: BUTTON.y - 6,
                transformOrigin: "50% 0%",
                rotate: "-20deg",
                translate: `${mix(fingerIn, 380, 0) + fingerOut * 700}px ${mix(fingerIn, 700, 0) + fingerOut * 1100}px`,
                scale: String(1 - press * 0.04),
              }}
            >
              <Finger width={280} rim={0.5} />
            </div>
          </AbsoluteFill>
        ) : null}

        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            <div style={{ position: "absolute", left: 90, right: 90, top: 280 }}>
              <Panel glow={lleno > 0.98 ? C.yellow : TEAL} style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Label size={36} color={C.white}>
                    POTRERO
                  </Label>
                  <Label size={36} mono color={lleno > 0.98 ? C.yellow : TEAL}>
                    {Math.round(mix(lleno, HINCHAS, 100))} / 100 {lleno > 0.98 ? "· LLENO" : ""}
                  </Label>
                </div>
                <div style={{ height: 30, borderRadius: 15, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${mix(lleno, HINCHAS, 100)}%`, height: "100%", background: lleno > 0.98 ? C.yellow : TEAL }} />
                </div>
              </Panel>
            </div>
            {/* Flechas entre niveles: 1 → 2 → 3 → 4 en zigzag */}
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              {[
                { d: "M 430 640 H 650", at: steps[1] },
                { d: "M 790 820 L 330 900", at: steps[2] },
                { d: "M 430 1030 H 650", at: steps[3] },
              ].map((a) => (
                <path key={a.d} d={a.d} stroke={C.yellow} strokeWidth={8} strokeDasharray="16 12" strokeLinecap="round" fill="none" opacity={ramp(frame, a.at - 8, a.at) * 0.8} />
              ))}
            </svg>
            {NIVELES.map((n, i) => {
              const at = steps[i];
              const show = ramp(frame, at - 4, at + 8, pop);
              const size = [230, 260, 290, 330][i];
              const cx = i % 2 === 0 ? 290 : 790;
              const top = i < 2 ? 470 : 860;
              const active = i === 3 ? frame >= at : frame >= at && frame < steps[i + 1];
              return (
                <div key={n.nombre} style={{ position: "absolute", left: cx - size / 2, top, width: size, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: show, scale: String(mix(show, 0.3, 1)) }}>
                  <Estadio nivel={i} size={size} lit={active ? 1 : 0} />
                  <Label size={i === 3 ? 56 : 50} mono color={active ? C.yellow : C.white}>
                    {fmt(n.lugares)}
                  </Label>
                  <Label size={28} color={C.dim}>
                    {n.nombre}
                  </Label>
                  {i === 0 ? (
                    <Label size={26} color={TEAL} style={{ opacity: ramp(frame, steps[0] + 4, steps[0] + 12) }}>
                      HOY ESTAMOS ACÁ
                    </Label>
                  ) : null}
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Flash at={steps[3]} color={C.yellow} length={10} peak={0.25} />
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tap + 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={hincha + 2} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={mudamos - 4} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      {steps.slice(1).map((s) => (
        <Audio key={s} from={s} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      ))}
      <Audio from={steps[3]} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
