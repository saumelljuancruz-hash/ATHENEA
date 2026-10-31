import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Coin, COINS, Hacker, Ice, Lock, Progress, Snowflake } from "../components/Crypto";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, fmt, Label, Panel, shake } from "../components/Ui";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const ICE = "#bfeaff";

const Chip: React.FC<{ show: number; color: string; children: React.ReactNode; size?: number; style?: React.CSSProperties }> = ({ show, color, children, size = 36, style }) => (
  <div style={{ opacity: show, scale: String(mix(show, 0.6, 1)), ...style }}>
    <Panel glow={color} style={{ padding: "10px 22px" }}>
      <Label size={size} color={color}>
        {children}
      </Label>
    </Panel>
  </div>
);

const Row: React.FC<{ children: React.ReactNode; top: number; style?: React.CSSProperties }> = ({ children, top, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, ...style }}>{children}</div>
);

export const S7Final: React.FC = () => {
  const frame = useCurrentFrame();
  const [, freezeBeat, escapeBeat, moneyBeat] = beats("final");
  const mitad = wordAt("final", "mitad");
  const dolares = wordAt("final", "dólares");
  const tether = wordAt("final", "tether");
  const circle = wordAt("final", "circle");
  const congelar = wordAt("final", "congelarlos");
  const hora = wordAt("final", "hora");
  const tres = wordAt("final", "3000");
  const congelan = wordAt("final", "congelan");
  const dosCuatro = wordAt("final", "2400");
  const hackers = wordAt("final", "hackers");
  const repuso = wordAt("final", "repuso");
  const noventa = wordAt("final", "90%");
  const fondos = wordAt("final", "fondos");
  const binance = wordAt("final", "binance");

  // A · más de la mitad eran stablecoins (3.400 de 6.360 millones, TRM Labs)
  const partA = window01(frame, 0, freezeBeat - 6);
  const split = ramp(frame, mitad - 4, dolares + 8, easeInOut);
  const share = 3400 / 6360;
  // B · Tether y Circle congelan
  const partB = window01(frame, freezeBeat - 4, escapeBeat - 6);
  const ice = ramp(frame, congelar - 2, congelar + 18, easeOut);
  const frozen = ramp(frame, tres - 6, tres + 30, easeOut) * 3000;
  // C · bitcoin y ether no se congelan
  const partC = window01(frame, escapeBeat - 4, moneyBeat - 6);
  const run = ramp(frame, congelan - 6, dosCuatro + 4, easeInOut);
  // D · ¿y tu plata?
  const partD = ramp(frame, moneyBeat - 4, moneyBeat + 6);
  const refill = ramp(frame, repuso - 4, noventa + 8, easeInOut) * 0.9;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [congelar, hackers, noventa], 14) }}>
        <Background tint={frame < escapeBeat ? "#0a2236" : frame < moneyBeat ? "#2a0d0c" : "#0b2a26"} />

        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <Row top={360}>
              <Label size={40} color={C.dim}>
                LO ROBADO: US$ 6.360 MILLONES
              </Label>
            </Row>
            <div style={{ position: "absolute", left: 80, top: 450, width: 920, height: 220, borderRadius: 34, overflow: "hidden", background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", display: "flex" }}>
              <div style={{ width: `${share * 100 * split}%`, height: "100%", background: `linear-gradient(90deg, ${COINS.USDT.color}, ${COINS.USDC.color})`, boxShadow: "inset 0 0 40px rgba(255,255,255,0.25)" }} />
              <div style={{ flex: 1, height: "100%", background: `linear-gradient(90deg, ${COINS.BTC.color}88, ${COINS.ETH.color}88)`, opacity: split }} />
            </div>
            {/* La línea de la mitad */}
            <div style={{ position: "absolute", left: 540 - 3, top: 420, width: 6, height: 280, background: C.white, opacity: 0.85 * split, borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 80, width: 920 * share, top: 520, display: "flex", justifyContent: "center", opacity: split }}>
              <Label size={70} mono color="#fff">
                3.400 M
              </Label>
            </div>
            <Row top={730}>
              <div style={{ opacity: ramp(frame, dolares - 4, dolares + 6), display: "flex", gap: 20, alignItems: "center" }}>
                <Coin symbol="USDT" size={110} />
                <Coin symbol="USDC" size={110} />
              </div>
            </Row>
            <Row top={880}>
              <Chip show={ramp(frame, dolares, dolares + 10, pop)} color={TEAL} size={46}>
                + DE LA MITAD: DÓLARES DIGITALES
              </Chip>
            </Row>
            <Row top={980}>
              <Label size={30} color={C.dim} style={{ opacity: ramp(frame, dolares + 10, dolares + 20) }}>
                STABLECOINS: 1 MONEDA = 1 DÓLAR
              </Label>
            </Row>
          </AbsoluteFill>
        ) : null}

        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            {[
              { s: "USDT", name: "TETHER", at: tether, time: "21:01 UTC", amount: "1.770 M" },
              { s: "USDC", name: "CIRCLE", at: circle, time: "21:04 UTC", amount: "825 M" },
            ].map((c, i) => {
              const show = ramp(frame, c.at - 4, c.at + 8, pop);
              return (
                <div key={c.s} style={{ position: "absolute", left: 110 + i * 460, top: 290, width: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: show, scale: String(mix(show, 0.5, 1)) }}>
                  <Label size={50} color={C.white}>
                    {c.name}
                  </Label>
                  <div style={{ position: "relative", width: 260, height: 260 }}>
                    <Coin symbol={c.s} size={260} />
                    <Ice amount={ice} width={260} height={260} radius={130} />
                    {ice > 0.4 ? (
                      <div style={{ position: "absolute", left: 80, top: 80, opacity: ramp(frame, congelar + 6, congelar + 14), scale: String(ramp(frame, congelar + 6, congelar + 16, pop)) }}>
                        <Lock size={100} />
                      </div>
                    ) : null}
                  </div>
                  <div style={{ opacity: ramp(frame, hora - 2, hora + 8) }}>
                    <Label size={36} mono color={ICE}>
                      {c.time}
                    </Label>
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 490, top: 440, opacity: ice, rotate: `${frame * 1.5}deg` }}>
              <Snowflake size={100} />
            </div>
            <Row top={760}>
              <Chip show={ramp(frame, hora - 4, hora + 8, pop)} color={ICE} size={42}>
                ROBO 20:05 → CONGELADO EN &lt; 1 HORA
              </Chip>
            </Row>
            <Row top={880} style={{ flexDirection: "column", gap: 6, opacity: ramp(frame, tres - 8, tres + 2) }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: ICE, textShadow: `0 0 40px ${ICE}88` }}>≈ US$ {fmt(frozen)} M</div>
              <Label size={44} color={C.white}>
                TRABADOS
              </Label>
            </Row>
            <Row top={1120}>
              <Label size={26} color={C.dim} style={{ opacity: ramp(frame, tres + 10, tres + 20) }}>
                Binance: ~3.000 M · Chainalysis: 2.800 M · TRM Labs: 2.700 M
              </Label>
            </Row>
          </AbsoluteFill>
        ) : null}

        {partC > 0 ? (
          <AbsoluteFill style={{ opacity: partC }}>
            {[
              { s: "BTC", at: escapeBeat, x: 140, y: 330 },
              { s: "ETH", at: wordAt("final", "ether"), x: 140, y: 620 },
            ].map((c) => {
              const show = ramp(frame, c.at - 4, c.at + 8, pop);
              return (
                <div key={c.s} style={{ position: "absolute", left: mix(run, c.x, 680), top: mix(run, c.y, 560), scale: String(mix(show, 0.4, 1) * mix(run, 1, 0.55)), opacity: show * (1 - ramp(frame, dosCuatro + 4, dosCuatro + 14)) }}>
                  <Coin symbol={c.s} size={240} />
                </div>
              );
            })}
            {/* No se pueden congelar: el copo tachado */}
            <div style={{ position: "absolute", left: 460, top: 360, opacity: ramp(frame, congelan - 4, congelan + 6), scale: String(mix(ramp(frame, congelan - 4, congelan + 10, pop), 0.4, 1)) }}>
              <div style={{ position: "relative", width: 160, height: 160, opacity: 1 - run * 0.6 }}>
                <Snowflake size={160} />
                <div style={{ position: "absolute", left: -10, top: 72, width: 180, height: 16, borderRadius: 8, background: C.positive, rotate: "-40deg" }} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 640, top: 520, scale: String(1 + (ramp(frame, dosCuatro + 2, dosCuatro + 6) - ramp(frame, dosCuatro + 6, dosCuatro + 16)) * 0.1) }}>
              <Hacker size={340} />
            </div>
            <Row top={260}>
              <Chip show={ramp(frame, congelan - 2, congelan + 10, pop)} color={C.positive} size={40} style={{ marginLeft: 260 }}>
                NO SE PUEDEN CONGELAR
              </Chip>
            </Row>
            <Row top={930} style={{ flexDirection: "column", gap: 8, opacity: ramp(frame, dosCuatro - 6, dosCuatro + 4) }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 110, color: C.positive, textShadow: `0 0 40px ${C.positive}88` }}>US$ 2.400 M</div>
              <Label size={44} color={C.white}>
                SIGUEN CON LOS HACKERS
              </Label>
            </Row>
            <Row top={1140}>
              <Label size={28} color={C.dim} style={{ opacity: ramp(frame, hackers, hackers + 10) }}>
                18.270 BTC + MÁS DE 420.000 ETH (TRM LABS)
              </Label>
            </Row>
          </AbsoluteFill>
        ) : null}

        {partD > 0 ? (
          <AbsoluteFill style={{ opacity: partD }}>
            <Row top={300}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 120, color: C.yellow, letterSpacing: -3, textShadow: `0 0 50px ${C.yellow}55`, scale: String(mix(ramp(frame, moneyBeat - 4, moneyBeat + 8, pop), 1.5, 1)) }}>¿Y TU PLATA?</div>
            </Row>
            <div style={{ position: "absolute", left: 90, right: 90, top: 520, opacity: ramp(frame, binance - 4, binance + 6), scale: String(mix(ramp(frame, binance - 4, binance + 10, pop), 0.7, 1)) }}>
              <Panel glow={TEAL} style={{ padding: "34px 40px", display: "flex", flexDirection: "column", gap: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <Label size={40} color={C.white}>
                    REPUESTO POR BINANCE
                  </Label>
                  <Label size={84} mono color={TEAL}>
                    {Math.round(refill * 100)}%
                  </Label>
                </div>
                <Progress value={refill} width={720} />
              </Panel>
            </div>
            <Row top={880}>
              <Chip show={ramp(frame, fondos - 4, fondos + 8, pop)} color={C.yellow} size={34}>
                FONDOS PROPIOS: SAFU + SEGURO + TESORERÍA
              </Chip>
            </Row>
            <Row top={1000}>
              <Label size={26} color={C.dim} style={{ opacity: ramp(frame, fondos + 6, fondos + 16) }}>
                Retiros: reapertura prevista el 1/11 · Datos al 31/10/2026
              </Label>
            </Row>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={dolares} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tether} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={circle} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={congelar} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={tres} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={congelan - 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={hackers} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={moneyBeat} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={noventa} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
