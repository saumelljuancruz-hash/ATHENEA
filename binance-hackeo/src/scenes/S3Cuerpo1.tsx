import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Fingerprint, Laptop, Signer } from "../components/Crypto";
import { Phone, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import { C, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

export const S3Cuerpo1: React.FC = () => {
  const frame = useCurrentFrame();
  const [, path, sigs, match] = beats("cuerpo1");
  const laptop = wordAt("cuerpo1", "laptop");
  const sistema = wordAt("cuerpo1", "sistema");
  const huella = wordAt("cuerpo1", "huella");
  const firmas = wordAt("cuerpo1", "firmas");
  const sirvio = wordAt("cuerpo1", "sirvió");

  // A y B · la laptop y el camino al sistema que firma
  const infected = ramp(frame, laptop - 2, laptop + 12);
  const moveLeft = ramp(frame, path - 6, path + 12, easeInOut);
  const route = ramp(frame, path + 4, sistema + 6, easeInOut);
  const chain = window01(frame, 0, sigs - 4);
  // C y D · 50 firmas, una sola alcanza
  const grid = ramp(frame, sigs - 4, sigs + 6);
  const winner = 37;
  const pick = ramp(frame, match + 10, sirvio - 4, easeInOut);
  const done = ramp(frame, sirvio - 2, sirvio + 8, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [laptop, sirvio], 16) }}>
        <Background tint="#1a0d14" />

        {chain > 0 ? (
          <AbsoluteFill style={{ opacity: chain }}>
            <div style={{ position: "absolute", left: mix(moveLeft, 540 - 260, 60), top: mix(moveLeft, 480, 380), scale: String(mix(moveLeft, 1, 0.75)), transformOrigin: "0 0" }}>
              <Laptop width={520} infected={infected} />
            </div>
            <div style={{ position: "absolute", left: mix(moveLeft, 0, 60), right: mix(moveLeft, 0, 600), top: mix(moveLeft, 880, 680), display: "flex", justifyContent: "center", opacity: ramp(frame, laptop, laptop + 8) }}>
              <Panel glow={C.positive} style={{ padding: "8px 20px" }}>
                <Label size={34} color={C.positive}>
                  LAPTOP DE UN INGENIERO
                </Label>
              </Panel>
            </div>
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              <path d="M 400 500 C 520 420 600 420 700 470" fill="none" stroke={C.positive} strokeWidth={8} strokeDasharray="20 16" strokeDashoffset={-frame * 3} opacity={route} pathLength={1} />
            </svg>
            <div style={{ position: "absolute", left: 690, top: 330, opacity: ramp(frame, sistema - 6, sistema + 4), scale: String(mix(ramp(frame, sistema - 6, sistema + 10, pop), 0.5, 1)) }}>
              <Signer width={300} hot={ramp(frame, sistema + 4, sistema + 12)} />
              <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                <Label size={32} color={C.yellow}>
                  SISTEMA DE FIRMAS
                </Label>
              </div>
            </div>
            {/* Como tu huella al pagar */}
            <div style={{ position: "absolute", left: 540 - 120, top: 730, opacity: ramp(frame, huella - 6, huella + 4), scale: String(mix(ramp(frame, huella - 6, huella + 10, pop), 0.5, 1)) }}>
              <Phone width={240} ui={0}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <Fingerprint size={150} />
                  <Label size={30} color={TEAL}>
                    PAGAR
                  </Label>
                </div>
              </Phone>
            </div>
          </AbsoluteFill>
        ) : null}

        {grid > 0 ? (
          <AbsoluteFill style={{ opacity: grid }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center" }}>
              <Panel glow={C.yellow} style={{ padding: "10px 24px" }}>
                <Label size={44} color={C.yellow}>
                  {done > 0.5 ? "1 DE 50 ALCANZÓ" : "50 FIRMAS POR ADELANTADO"}
                </Label>
              </Panel>
            </div>
            {new Array(50).fill(0).map((_, i) => {
              const col = i % 5;
              const row = Math.floor(i / 5);
              const appear = ramp(frame, firmas - 6 + i * 0.5, firmas + 2 + i * 0.5, pop);
              const isWinner = i === winner;
              const fade = isWinner ? 0 : pick;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 115 + col * 175,
                    top: 360 + row * 82,
                    width: 150,
                    height: 66,
                    borderRadius: 12,
                    background: isWinner && pick > 0.5 ? TEAL : "rgba(255,255,255,0.08)",
                    border: `3px solid ${isWinner && pick > 0.5 ? TEAL : "rgba(255,255,255,0.25)"}`,
                    boxShadow: isWinner && pick > 0.5 ? `0 0 ${30 + done * 40}px ${TEAL}` : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontWeight: 800,
                    fontSize: 26,
                    color: isWinner && pick > 0.5 ? "#04231e" : C.dim,
                    scale: String(appear * (isWinner ? 1 + done * 0.25 : 1)),
                    opacity: 1 - fade * 0.75,
                    zIndex: isWinner ? 2 : 1,
                  }}
                >
                  FIRMA {i + 1}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center", opacity: done, scale: String(mix(done, 1.8, 1)) }}>
              <Panel glow={C.positive} style={{ padding: "10px 26px", rotate: "-4deg" }}>
                <Label size={44} color={C.positive}>
                  LA BILLETERA ES DE ELLOS
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={laptop} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={sistema} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={huella} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={firmas} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={sirvio} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
