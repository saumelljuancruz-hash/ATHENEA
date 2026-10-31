import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Coin, ExchangeScreen, Stopwatch } from "../components/Crypto";
import { Finger } from "../components/Finger";
import { Phone } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

const PHONE_W = 500;
const PHONE_TOP = 300;
const BUTTON = { x: 540, y: PHONE_TOP + PHONE_W * 2.05 * 0.86 };
const SYMBOLS = ["ETH", "BTC", "USDT", "USDC", "XRP", "SOL", "TRX"];

export const S1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const mayor = wordAt("gancho", "mayor");
  const minutos = wordAt("gancho", "minutos");
  const tap = 6;
  // El saldo se vacía: 6.300 millones en "20 minutos" comprimidos.
  const drain = ramp(frame, tap + 2, minutos + 20, easeInOut);
  const balance = 6.3e9 * (1 - drain);
  const enter = ramp(frame, -8, tap, easeOut);
  const exit = ramp(frame, tap + 12, tap + 28, easeInOut);
  const pressed = ramp(frame, tap, tap + 3) - ramp(frame, tap + 3, tap + 10);
  const stamp = ramp(frame, mayor - 4, mayor + 8, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 160], [1.1, 1])), ...shake(frame, [tap, mayor], 16) }}>
        <Background tint={`rgb(${mix(drain, 12, 60)}, ${mix(drain, 20, 10)}, ${mix(drain, 40, 18)})`} />
        <div style={{ position: "absolute", left: 540 - PHONE_W / 2, top: PHONE_TOP }}>
          <Phone width={PHONE_W} ui={0}>
            <ExchangeScreen width={PHONE_W} balance={balance} pressed={pressed} />
          </Phone>
        </div>
        {/* Monedas saliendo del celular */}
        {new Array(60).fill(0).map((_, i) => {
          const start = tap + 2 + i * 1.6;
          const t = ramp(frame, start, start + 34, (x) => x);
          if (t <= 0 || t >= 1) {
            return null;
          }
          const a = -Math.PI / 2 + (random(`ca${i}`) - 0.5) * 3.4;
          const d = 60 + t * (380 + random(`cd${i}`) * 200);
          return (
            <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * d - 55, top: PHONE_TOP + 560 + Math.sin(a) * d * 1.2 - 55, opacity: 1 - t ** 3, scale: String(0.5 + t * 0.7), rotate: `${t * 300}deg` }}>
              <Coin symbol={SYMBOLS[i % SYMBOLS.length]} size={110} />
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 60, top: 220, opacity: ramp(frame, tap, tap + 8) }}>
          <Stopwatch minutes={20 * drain} size={56} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", justifyContent: "center", opacity: stamp, scale: String(mix(stamp, 2, 1)), rotate: "-4deg" }}>
          <Panel glow={C.positive} style={{ padding: "14px 28px" }}>
            <Label size={46} color={C.positive}>
              EL MAYOR ROBO CRIPTO DE LA HISTORIA
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      {/* El dedo toca RETIRAR */}
      <div
        style={{
          position: "absolute",
          left: BUTTON.x - 150,
          top: BUTTON.y - 10,
          transformOrigin: "50% 0%",
          rotate: "-22deg",
          translate: `${mix(enter, 300, 0) + exit * 700}px ${mix(enter, 500, 0) + exit * 1000}px`,
          scale: String(1 - pressed * 0.04),
          filter: `blur(${(1 - enter) * 4}px)`,
        }}
      >
        <Finger width={300} rim={0.5} rimColor={C.yellow} />
      </div>
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tap + 2} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={mayor} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
