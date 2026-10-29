import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Face, FACE } from "../components/Face";
import { Phone, ProfileHead, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Label, Panel } from "../components/Ui";
import { C, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

/** Cota horizontal con su texto arriba. */
const Span: React.FC<{ x1: number; x2: number; y: number; text: string; opacity: number; color?: string }> = ({ x1, x2, y, text, opacity, color = C.yellow }) => (
  <g opacity={opacity}>
    <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={6} />
    <line x1={x1} y1={y - 18} x2={x1} y2={y + 18} stroke={color} strokeWidth={6} />
    <line x1={x2} y1={y - 18} x2={x2} y2={y + 18} stroke={color} strokeWidth={6} />
    <text x={(x1 + x2) / 2} y={y - 28} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={44} fill={color} stroke="#03050b" strokeWidth={8} paintOrder="stroke">
      {text}
    </text>
  </g>
);

const HEAD_H = 420;
const HEAD = { left: 70, top: 400 };
const NOSE = { x: HEAD.left + (262 / 360) * HEAD_H, y: HEAD.top + (150 / 360) * HEAD_H };
const PHONE_X = NOSE.x + 320;

export const S7Final: React.FC = () => {
  const frame = useCurrentFrame();
  const [, nose, mirror, trick] = beats("final");
  const angular = wordAt("final", "angular");
  const cm = wordAt("final", "centímetros");
  const pct = wordAt("final", "30%");
  const doble = wordAt("final", "doble");
  const aleja = wordAt("final", "alejá");
  const zoom = wordAt("final", "zoom");

  // A · gran angular a 30 cm
  const side = window01(frame, 0, nose - 4);
  const cone = ramp(frame, angular - 4, angular + 10, easeInOut);
  // B · la nariz un 30 % más ancha
  const faces = window01(frame, nose - 4, mirror - 4);
  const wide = mix(ramp(frame, pct - 6, pct + 14, easeInOut), 1, 1.3);
  // C · el espejo te ve desde el doble de lejos
  const mirrorScene = window01(frame, mirror - 4, trick - 4);
  const mirrorX = 540;
  const mHead = { left: 60, top: 520, h: 360 };
  const mNose = mHead.left + (262 / 360) * mHead.h;
  const ghostNose = mirrorX + (mirrorX - mNose);
  // D · el truco: más lejos y con zoom
  const trickScene = ramp(frame, trick - 4, trick + 6);
  const away = ramp(frame, aleja - 4, aleja + 14, easeInOut);
  const zoomed = ramp(frame, zoom - 2, zoom + 12, pop);
  const faceW = mix(zoomed, mix(away, 430, 300), 430);
  const trickNose = mix(away, 1.3, 1);

  const noseSpan = (left: number, width: number, n: number) => {
    const w = 74 * n * (width / FACE.width);
    const cx = left + width / 2;
    return [cx - w / 2 - 12, cx + w / 2 + 12] as const;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background tint="#0c2a2e" />

      {side > 0 ? (
        <AbsoluteFill style={{ opacity: side }}>
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            <path d={`M ${PHONE_X} ${NOSE.y} L ${NOSE.x - 260} ${NOSE.y - 330 * cone} L ${NOSE.x - 260} ${NOSE.y + 330 * cone} Z`} fill={TEAL} opacity={0.18} />
            <line x1={PHONE_X} y1={NOSE.y} x2={NOSE.x - 260} y2={NOSE.y - 330 * cone} stroke={TEAL} strokeWidth={4} opacity={cone} />
            <line x1={PHONE_X} y1={NOSE.y} x2={NOSE.x - 260} y2={NOSE.y + 330 * cone} stroke={TEAL} strokeWidth={4} opacity={cone} />
            <Span x1={NOSE.x} x2={PHONE_X} y={NOSE.y + 280} text="30 cm" opacity={ramp(frame, cm - 6, cm + 4)} />
          </svg>
          <div style={{ position: "absolute", left: HEAD.left, top: HEAD.top }}>
            <ProfileHead height={HEAD_H} />
          </div>
          <div style={{ position: "absolute", left: PHONE_X, top: NOSE.y - 170, width: 30, height: 340, borderRadius: 14, background: "#2a3245", border: "3px solid #4a5670" }}>
            <div style={{ position: "absolute", left: -6, top: 150, width: 12, height: 40, borderRadius: 6, background: TEAL }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: cone, scale: String(mix(ramp(frame, angular - 4, angular + 10, pop), 0.6, 1)) }}>
            <Panel glow={TEAL} style={{ padding: "12px 28px" }}>
              <Label size={46} color={TEAL}>
                GRAN ANGULAR
              </Label>
            </Panel>
          </div>
        </AbsoluteFill>
      ) : null}

      {faces > 0 ? (
        <AbsoluteFill style={{ opacity: faces }}>
          {[
            { left: 50, n: 1, label: "FOTO A 1,5 m" },
            { left: 570, n: wide, label: "SELFIE A 30 cm" },
          ].map((f) => {
            const [x1, x2] = noseSpan(f.left, 460, f.n);
            const y = 420 + ((FACE.noseY + 34) / FACE.width) * 460;
            return (
              <React.Fragment key={f.label}>
                <div style={{ position: "absolute", left: f.left, top: 420 }}>
                  <Face width={460} nose={f.n} />
                </div>
                <svg width={1080} height={1920} style={{ position: "absolute" }}>
                  <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.yellow} strokeWidth={5} />
                  <line x1={x1} y1={y - 14} x2={x1} y2={y + 14} stroke={C.yellow} strokeWidth={5} />
                  <line x1={x2} y1={y - 14} x2={x2} y2={y + 14} stroke={C.yellow} strokeWidth={5} />
                </svg>
                <div style={{ position: "absolute", left: f.left + 230, top: 360, translate: "-50% 0" }}>
                  <Label size={34} mono color={f.n > 1 ? C.yellow : C.white}>
                    {f.label}
                  </Label>
                </div>
              </React.Fragment>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", opacity: ramp(frame, pct - 4, pct + 6), scale: String(mix(ramp(frame, pct - 4, pct + 12, pop), 1.8, 1)) }}>
            <Panel glow={C.yellow} style={{ padding: "8px 26px" }}>
              <Label size={72} mono color={C.yellow}>
                NARIZ +{Math.round((wide - 1) * 100)}%
              </Label>
            </Panel>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1030, display: "flex", justifyContent: "center", opacity: ramp(frame, pct, pct + 10) }}>
            <Label size={26} mono color={C.dim}>
              WARD Y OTROS · JAMA FACIAL PLASTIC SURGERY · 2018
            </Label>
          </div>
        </AbsoluteFill>
      ) : null}

      {mirrorScene > 0 ? (
        <AbsoluteFill style={{ opacity: mirrorScene }}>
          <div style={{ position: "absolute", left: mHead.left, top: mHead.top }}>
            <ProfileHead height={mHead.h} />
          </div>
          <div style={{ position: "absolute", left: ghostNose - (38 / 360) * mHead.h, top: mHead.top, opacity: ramp(frame, mirror + 4, mirror + 14) }}>
            <ProfileHead height={mHead.h} ghost mirrored />
          </div>
          <div style={{ position: "absolute", left: mirrorX - 14, top: 380, width: 28, height: 620, borderRadius: 10, background: "linear-gradient(90deg, #8a6630, #f6e7c1 40%, #b48a4a)", boxShadow: `0 0 30px ${TEAL}66` }} />
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            <line x1={mHead.left + (206 / 360) * mHead.h} y1={mHead.top + (118 / 360) * mHead.h} x2={ghostNose + (56 / 360) * mHead.h} y2={mHead.top + (118 / 360) * mHead.h} stroke={TEAL} strokeWidth={4} strokeDasharray="14 10" opacity={ramp(frame, mirror + 6, mirror + 16)} />
            <Span x1={mNose} x2={mirrorX} y={1060} text="50 cm" opacity={ramp(frame, mirror + 8, mirror + 16)} color={C.white} />
            <Span x1={mirrorX} x2={ghostNose} y={1060} text="50 cm" opacity={ramp(frame, mirror + 14, mirror + 22)} color={C.white} />
            <Span x1={mNose} x2={ghostNose} y={1170} text="1 m" opacity={ramp(frame, doble - 4, doble + 6)} />
          </svg>
          <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: ramp(frame, doble - 4, doble + 6), scale: String(mix(ramp(frame, doble - 4, doble + 12, pop), 1.6, 1)) }}>
            <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
              <Label size={52} color={C.yellow}>
                EL DOBLE DE LEJOS
              </Label>
            </Panel>
          </div>
        </AbsoluteFill>
      ) : null}

      {trickScene > 0 ? (
        <AbsoluteFill style={{ opacity: trickScene }}>
          <div style={{ position: "absolute", left: 540 - 230, top: 300, scale: String(mix(away, 1, 0.9)) }}>
            <Phone width={460} ui={0}>
              <div style={{ position: "absolute", bottom: mix(zoomed, mix(away, -30, 120), -30) }}>
                <Face width={faceW} nose={trickNose} />
              </div>
              <div style={{ position: "absolute", top: 70, left: "50%", translate: "-50% 0", fontFamily: MONO, fontWeight: 800, fontSize: 34, color: zoomed > 0.5 ? C.yellow : "#fff", background: "rgba(0,0,0,0.55)", borderRadius: 30, padding: "4px 18px" }}>
                {zoomed > 0.5 ? "2×" : "1×"}
              </div>
            </Phone>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", gap: 20, opacity: ramp(frame, aleja - 2, aleja + 8) }}>
            <Panel style={{ padding: "8px 22px" }}>
              <Label size={38}>← MÁS LEJOS →</Label>
            </Panel>
            <Panel glow={C.yellow} style={{ padding: "8px 22px", opacity: zoomed }}>
              <Label size={38} color={C.yellow}>
                + ZOOM 2×
              </Label>
            </Panel>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", opacity: ramp(frame, zoom + 6, zoom + 14), scale: String(mix(ramp(frame, zoom + 6, zoom + 18, pop), 0.5, 1)) }}>
            <Panel glow={TEAL} style={{ padding: "10px 26px" }}>
              <Label size={44} color={TEAL}>
                ✓ SIN DEFORMAR
              </Label>
            </Panel>
          </div>
        </AbsoluteFill>
      ) : null}

      <Audio from={angular} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={cm} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={pct} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={mirror - 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={doble} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={trick - 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={zoom} src={staticFile("sfx/obturador.wav")} volume={SFX.obturador} />
      <Audio from={zoom + 8} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
