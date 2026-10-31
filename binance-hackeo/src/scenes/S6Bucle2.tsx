import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Coin, Hacker, Ice, Snowflake } from "../components/Crypto";
import { SFX } from "../components/sfx";
import { easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, shake } from "../components/Ui";
import { C } from "../theme";
import { wordAt } from "../timeline";

const PILE = ["USDT", "USDC", "USDT", "USDC", "USDT", "USDC", "USDT"];

/** El ladrón con su pila de dólares digitales… que se empieza a congelar. */
export const S6Bucle2: React.FC = () => {
  const frame = useCurrentFrame();
  const salio = wordAt("bucle2", "salió");
  const querian = wordAt("bucle2", "querían");
  const enter = ramp(frame, 0, 12, pop);
  const frost = ramp(frame, salio - 4, querian + 4, easeOut);
  const flake = ramp(frame, querian - 2, querian + 10, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: String(mix(ramp(frame, 0, 63, easeOut), 1.08, 1)), ...shake(frame, [querian], 16) }}>
        <Background tint={`rgb(${mix(frost, 40, 10)}, ${mix(frost, 14, 40)}, ${mix(frost, 20, 60)})`} />
        <div style={{ position: "absolute", left: 120, top: 420, scale: String(mix(enter, 0.6, 1)), opacity: enter }}>
          <Hacker size={380} />
        </div>
        {/* La pila de monedas */}
        <div style={{ position: "absolute", left: 560, top: 560, width: 400, height: 560 }}>
          {PILE.map((s, i) => (
            <div key={i} style={{ position: "absolute", left: 60 + (i % 2) * 120 + (i === 6 ? 60 : 0), top: 440 - Math.floor(i / 2) * 140, scale: String(ramp(frame, 2 + i * 2, 12 + i * 2, pop)) }}>
              <Coin symbol={s} size={150} />
            </div>
          ))}
          <div style={{ position: "absolute", left: 30, top: 0, width: 340, height: 600 }}>
            <Ice amount={frost} width={340} height={600} radius={50} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 640, top: 360, opacity: flake, scale: String(mix(flake, 0.3, 1)), rotate: `${frame * 2}deg` }}>
          <Snowflake size={240} />
        </div>
      </AbsoluteFill>
      <Flash at={querian} color="#bfeaff" length={10} peak={0.4} />
      <Audio from={salio} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={querian} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
