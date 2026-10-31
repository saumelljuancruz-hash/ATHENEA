import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { Coin, Hacker, KoreaMap, Stopwatch, Wallet } from "../components/Crypto";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, fmt, Label, Panel, shake } from "../components/Ui";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

// Montos robados por red, según TRM Labs (millones de US$).
const CHAINS: { name: string; coins: string[]; amount: number; count: number }[] = [
  { name: "ETHEREUM", coins: ["ETH"], amount: 3790, count: 1 },
  { name: "BITCOIN", coins: ["BTC"], amount: 1470, count: 1 },
  { name: "TRON", coins: ["TRX"], amount: 628, count: 1 },
  { name: "XRP", coins: ["XRP"], amount: 296, count: 1 },
  { name: "SOLANA", coins: ["SOL"], amount: 96, count: 1 },
  { name: "ARB · OP · BASE", coins: ["ARB", "OP", "BASE"], amount: 39, count: 3 },
  { name: "AVALANCHE", coins: ["AVAX"], amount: 28, count: 1 },
  { name: "POLYGON", coins: ["POL"], amount: 10, count: 1 },
];

const Chip: React.FC<{ show: number; color: string; children: React.ReactNode; size?: number }> = ({ show, color, children, size = 36 }) => (
  <div style={{ opacity: show, scale: String(mix(show, 0.6, 1)) }}>
    <Panel glow={color} style={{ padding: "10px 22px" }}>
      <Label size={size} color={color}>
        {children}
      </Label>
    </Panel>
  </div>
);

export const S5Cuerpo2: React.FC = () => {
  const frame = useCurrentFrame();
  const [, race, who] = beats("cuerpo2");
  const llevaron = wordAt("cuerpo2", "llevaron");
  const millones = wordAt("cuerpo2", "millones");
  const vaciaron = wordAt("cuerpo2", "vaciaron");
  const chains = wordAt("cuerpo2", "blockchains");
  const chainalysis = wordAt("cuerpo2", "chainalysis");
  const corea = wordAt("cuerpo2", "corea");

  // A · una sola transacción
  const partA = window01(frame, 0, race - 6);
  const flow = ramp(frame, llevaron - 4, millones + 6, easeInOut);
  const stolen = 2.5e9 * flow;
  // B · 10 redes en 20 minutos
  const partB = window01(frame, race - 4, who - 6);
  const clock = ramp(frame, race, chains + 8, easeInOut);
  const tileAt = (i: number) => vaciaron - 18 + i * 6;
  let counted = 0;
  CHAINS.forEach((c, i) => {
    if (frame >= tileAt(i)) {
      counted += c.count;
    }
  });
  // C · ¿quién fue?
  const partC = ramp(frame, who - 4, who + 8);
  const pulse = ((frame - who) % 30) / 30;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [millones, chains, corea], 14) }}>
        <Background tint={frame < who ? "#2a1206" : "#2a0a10"} />

        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, scale: String(mix(ramp(frame, 0, 12, pop), 0.6, 1)) }}>
              <Wallet width={300} open={flow} />
              <Label size={32} color={C.yellow}>
                BILLETERA DE BINANCE
              </Label>
            </div>
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              <path d="M 540 560 L 540 830" stroke={C.positive} strokeWidth={34} strokeLinecap="round" opacity={0.25 + flow * 0.5} />
              <path d="M 470 800 L 540 870 L 610 800" fill="none" stroke={C.positive} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" opacity={0.25 + flow * 0.5} />
            </svg>
            {new Array(14).fill(0).map((_, i) => {
              const t = ramp(frame, llevaron - 6 + i * 2.6, llevaron + 10 + i * 2.6, easeInOut);
              if (t <= 0 || t >= 1) {
                return null;
              }
              return (
                <div key={i} style={{ position: "absolute", left: 540 - 38 + (random(`fx${i}`) - 0.5) * 60, top: mix(t, 520, 900), opacity: Math.min(1, (1 - t) * 3), scale: String(mix(t, 1, 0.6)) }}>
                  <Coin symbol={["ETH", "USDT", "USDC"][i % 3]} size={76} />
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: ramp(frame, llevaron - 4, llevaron + 4) }}>
              <Panel glow={C.positive} style={{ padding: "14px 30px" }}>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 76, color: C.yellow, textShadow: `0 0 30px ${C.yellow}66` }}>US$ {fmt(stolen)}</div>
              </Panel>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 900, display: "flex", justifyContent: "center", gap: 30, alignItems: "center" }}>
              <Hacker size={250} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center" }}>
              <Chip show={ramp(frame, millones, millones + 10, pop)} color={C.positive}>
                1 SOLA TRANSACCIÓN
              </Chip>
            </div>
          </AbsoluteFill>
        ) : null}

        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            <div style={{ position: "absolute", left: 60, top: 250 }}>
              <Stopwatch minutes={20 * clock} size={58} />
            </div>
            <div style={{ position: "absolute", left: 80, right: 80, top: 370, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <Label size={30} color={C.dim}>
                ROBADO POR RED · US$
              </Label>
              <Label size={30} color={C.dim}>
                FUENTE: TRM LABS
              </Label>
            </div>
            {CHAINS.map((c, i) => {
              const col = i % 2;
              const row = Math.floor(i / 2);
              const at = tileAt(i);
              const show = ramp(frame, at, at + 8, pop);
              const drained = ramp(frame, at + 4, at + 30, easeOut);
              return (
                <div
                  key={c.name}
                  style={{
                    position: "absolute",
                    left: 80 + col * 470,
                    top: 420 + row * 170,
                    width: 450,
                    height: 150,
                    borderRadius: 26,
                    background: "linear-gradient(160deg, rgba(40,20,22,0.9), rgba(10,8,14,0.92))",
                    border: `2px solid ${C.positive}${drained > 0.9 ? "aa" : "44"}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "0 22px",
                    opacity: show,
                    scale: String(mix(show, 0.6, 1)),
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {c.coins.map((s, k) => (
                      <Coin key={s} symbol={s} size={c.coins.length > 1 ? 56 : 84} style={{ marginLeft: k ? -18 : 0 }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: c.coins.length > 1 ? 26 : 30, color: C.white }}>{c.name}</div>
                    <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 40, color: C.yellow }}>{fmt(c.amount)} M</div>
                    <div style={{ height: 10, borderRadius: 5, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                      <div style={{ width: `${(1 - drained) * 100}%`, height: "100%", background: TEAL }} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center" }}>
              <Panel glow={C.positive} style={{ padding: "10px 26px", scale: String(1 + (ramp(frame, chains, chains + 4) - ramp(frame, chains + 4, chains + 14)) * 0.15) }}>
                <Label size={46} color={counted >= 10 ? C.positive : C.white}>
                  {counted} / 10 BLOCKCHAINS
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}

        {partC > 0 ? (
          <AbsoluteFill style={{ opacity: partC }}>
            <div style={{ position: "absolute", left: 540 - 335, top: 420, scale: String(mix(ramp(frame, who - 4, who + 40, easeOut), 1.15, 1)) }}>
              <KoreaMap highlight={ramp(frame, corea - 6, corea + 6)} pulse={frame >= corea ? pulse : 0} scale={0.62} />
            </div>
            <div style={{ position: "absolute", left: 60, top: 250, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
              <Chip show={ramp(frame, who, who + 10, pop)} color={TEAL}>
                TRM LABS · ALTA CONFIANZA
              </Chip>
              <Chip show={ramp(frame, chainalysis - 4, chainalysis + 6, pop)} color={TEAL}>
                CHAINALYSIS · MISMA CONCLUSIÓN
              </Chip>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
              <Chip show={ramp(frame, corea - 2, corea + 10, pop)} color={C.positive} size={42}>
                COREA DEL NORTE
              </Chip>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1170, display: "flex", justifyContent: "center", opacity: ramp(frame, corea + 8, corea + 18) }}>
              <Label size={30} color={C.dim}>
                GRUPO TRADERTRAITOR, PARTE DE LAZARUS
              </Label>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={llevaron} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={millones} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      {CHAINS.map((c, i) => (
        <Audio key={c.name} from={tileAt(i)} src={staticFile("sfx/toque.wav")} volume={SFX.toque * 0.7} />
      ))}
      <Audio from={who - 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={corea} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
