import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { Face, FACE } from "../components/Face";
import { Brain, Phone, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";

/** Punto de un rasgo en pantalla, para una cara dibujada en (left, top) con ancho `width`. */
const at = (p: readonly [number, number], left: number, top: number, width: number, mirrored = false): [number, number] => [
  left + ((mirrored ? FACE.width - p[0] : p[0]) / FACE.width) * width,
  top + (p[1] / FACE.width) * width,
];

/** Marco con una cara adentro: dorado para el espejo, blanco para la foto. */
const FaceCard: React.FC<{ left: number; top: number; mirrored: boolean; label: string; frame: "espejo" | "foto"; opacity: number }> = ({ left, top, mirrored, label, frame, opacity }) => (
  <div style={{ position: "absolute", left, top, opacity }}>
    <div
      style={{
        width: 420,
        height: 520,
        borderRadius: frame === "espejo" ? "50%" : 18,
        padding: 14,
        background: frame === "espejo" ? "linear-gradient(140deg, #f6e7c1, #b48a4a 40%, #f2d9a0 60%, #8a6630)" : "#f4efe6",
        boxShadow: "0 30px 70px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: frame === "espejo" ? "50%" : 8, overflow: "hidden", background: "radial-gradient(circle at 50% 40%, #2c4a55, #0d1a20 75%)" }}>
        <div style={{ position: "absolute", left: 16, top: 70 }}>
          <Face width={360} mirrored={mirrored} />
        </div>
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 18 }}>
      <Label size={44} color={frame === "espejo" ? TEAL : C.white}>
        {label}
      </Label>
    </div>
  </div>
);

export const S3Cuerpo1: React.FC = () => {
  const frame = useCurrentFrame();
  const [, sym, life, camera] = beats("cuerpo1");
  const reves = wordAt("cuerpo1", "revés");
  const simetrica = wordAt("cuerpo1", "simétrica");
  const ojo = wordAt("cuerpo1", "ojo");
  const sonrisa = wordAt("cuerpo1", "sonrisa");
  const raya = wordAt("cuerpo1", "raya");
  const cerebro = wordAt("cuerpo1", "cerebro");
  const mal = wordAt("cuerpo1", "mal");

  // A · espejo contra foto: el lunar cambia de lado
  const cards = 1 - ramp(frame, sym - 6, sym + 2);
  const markMirror = at(FACE.mark, 60 + 14 + 16, 360 + 14 + 70, 360, true);
  const markPhoto = at(FACE.mark, 600 + 14 + 16, 360 + 14 + 70, 360);
  const arrow = ramp(frame, reves - 6, reves + 10, easeInOut);

  // B · la cara grande con sus asimetrías
  const big = { left: 240, top: 330, width: 600 };
  const face = window01(frame, sym - 4, life - 4);
  const eyeL = at(FACE.eyeL, big.left, big.top, big.width);
  const eyeR = at(FACE.eyeR, big.left, big.top, big.width);
  const mL = at(FACE.mouthL, big.left, big.top, big.width);
  const mR = at(FACE.mouthR, big.left, big.top, big.width);
  const part = at(FACE.part, big.left, big.top, big.width);

  // C · toda la vida frente al espejo · D · la cámara te muestra al derecho
  const grid = window01(frame, life - 4, camera - 4, 6, 6);
  const phone = ramp(frame, camera - 4, camera + 8);
  const alarm = ramp(frame, mal - 2, mal + 4);
  const glitch = frame >= mal ? 1 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [mal], 24) }}>
        <Background tint="#0c2a2e" />

        {cards > 0 ? (
          <AbsoluteFill style={{ opacity: cards }}>
            <FaceCard left={60} top={360} mirrored label="ESPEJO" frame="espejo" opacity={ramp(frame, 0, 8)} />
            <FaceCard left={600} top={360} mirrored={false} label="FOTO" frame="foto" opacity={ramp(frame, 4, 12)} />
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              {[markMirror, markPhoto].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={mix(ramp(frame, reves - 8, reves), 0, 30)} fill="none" stroke={C.yellow} strokeWidth={6} />
              ))}
              <path
                d={`M ${markMirror[0]} ${markMirror[1] - 40} C ${markMirror[0] + 120} ${markMirror[1] - 260}, ${markPhoto[0] - 120} ${markPhoto[1] - 260}, ${markPhoto[0]} ${markPhoto[1] - 40}`}
                fill="none"
                stroke={C.yellow}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={`${900 * arrow} 2000`}
              />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: arrow }}>
              <Panel glow={C.yellow} style={{ padding: "10px 24px" }}>
                <Label size={40} color={C.yellow}>
                  EL LUNAR CAMBIA DE LADO
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}

        {face > 0 ? (
          <AbsoluteFill style={{ opacity: face, scale: String(mix(ramp(frame, sym, life, easeInOut), 1, 1.06)) }}>
            <div style={{ position: "absolute", left: big.left, top: big.top }}>
              <Face width={big.width} />
            </div>
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              <line x1={540} y1={big.top - 20} x2={540} y2={big.top - 20 + 820 * ramp(frame, simetrica - 4, simetrica + 10)} stroke="#fff" strokeWidth={4} strokeDasharray="16 12" opacity={0.8} />
              <g opacity={ramp(frame, ojo - 2, ojo + 6)} stroke={C.yellow} strokeWidth={5}>
                <line x1={eyeL[0] - 90} y1={eyeL[1]} x2={eyeL[0] + 70} y2={eyeL[1]} />
                <line x1={eyeR[0] - 70} y1={eyeR[1]} x2={eyeR[0] + 90} y2={eyeR[1]} />
              </g>
              <g opacity={ramp(frame, sonrisa - 2, sonrisa + 6)}>
                <line x1={mL[0] - 40} y1={mL[1]} x2={mR[0] + 60} y2={mL[1]} stroke="#fff" strokeWidth={4} strokeDasharray="10 8" />
                <line x1={mL[0] - 40} y1={mL[1] + ((mR[1] - mL[1]) * -40) / (mR[0] - mL[0])} x2={mR[0] + 60} y2={mR[1] + ((mR[1] - mL[1]) * 60) / (mR[0] - mL[0])} stroke={C.yellow} strokeWidth={6} />
              </g>
              <g opacity={ramp(frame, raya - 2, raya + 6)} stroke={C.yellow} strokeWidth={7} fill="none" strokeLinecap="round">
                <path d={`M ${part[0] - 190} ${part[1] - 90} Q ${part[0] - 90} ${part[1] - 110} ${part[0] - 14} ${part[1] - 10}`} />
                <path d={`M ${part[0] - 40} ${part[1] - 12} L ${part[0] - 12} ${part[1] - 8} L ${part[0] - 24} ${part[1] - 36}`} />
              </g>
            </svg>
            {[
              { text: "UN OJO MÁS ALTO", x: 740, y: 560, from: ojo },
              { text: "SONRISA TORCIDA", x: 540, y: 1120, from: sonrisa },
              { text: "RAYA DEL PELO", x: 230, y: 330, from: raya },
            ].map((c) => (
              <div key={c.text} style={{ position: "absolute", left: c.x, top: c.y, translate: "-50% -50%", opacity: ramp(frame, c.from - 2, c.from + 6), scale: String(mix(ramp(frame, c.from - 2, c.from + 10, pop), 0.5, 1)) }}>
                <Panel glow={C.yellow} style={{ padding: "8px 20px" }}>
                  <Label size={36} color={C.yellow}>
                    {c.text}
                  </Label>
                </Panel>
              </div>
            ))}
          </AbsoluteFill>
        ) : null}

        {grid > 0 ? (
          <AbsoluteFill style={{ opacity: grid }}>
            {new Array(20).fill(0).map((_, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              const appear = ramp(frame, life + i * 1.6, life + i * 1.6 + 8, pop);
              return (
                <div key={i} style={{ position: "absolute", left: 60 + col * 245, top: 250 + row * 200, width: 220, height: 186, borderRadius: "50%", padding: 6, background: "linear-gradient(140deg, #f6e7c1, #b48a4a 40%, #f2d9a0 60%, #8a6630)", scale: String(appear), rotate: `${(random(`g${i}`) - 0.5) * 10}deg` }}>
                  <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", overflow: "hidden", background: "#1a3038" }}>
                    <div style={{ position: "absolute", left: 30, top: 10 }}>
                      <Face width={150} mirrored />
                    </div>
                  </div>
                </div>
              );
            })}
          </AbsoluteFill>
        ) : null}

        {phone > 0 ? (
          <AbsoluteFill style={{ opacity: phone }}>
            <div style={{ position: "absolute", left: 540 - 210, top: 470, scale: String(mix(ramp(frame, camera - 4, camera + 12, pop), 0.85, 1)) }}>
              <Phone width={420} ui={0}>
                <div style={{ position: "absolute", bottom: -24, translate: `${glitch * (random(`gx${Math.floor(frame / 2)}`) - 0.5) * 40}px 0px` }}>
                  <Face width={400} />
                </div>
                {glitch ? (
                  <div style={{ position: "absolute", bottom: -24, translate: "14px 0px", mixBlendMode: "screen", opacity: 0.6, filter: "sepia(1) saturate(8) hue-rotate(-40deg)" }}>
                    <Face width={400} />
                  </div>
                ) : null}
              </Phone>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 400, display: "flex", justifyContent: "center", opacity: ramp(frame, camera + 6, camera + 14) * (1 - alarm) }}>
              <Panel style={{ padding: "8px 22px" }}>
                <Label size={38}>AL DERECHO</Label>
              </Panel>
            </div>
            <div style={{ position: "absolute", left: 540 - 130, top: 200, opacity: ramp(frame, cerebro - 4, cerebro + 4), scale: String(mix(ramp(frame, cerebro - 4, cerebro + 10, pop), 0.4, 1) * (1 + alarm * 0.08)) }}>
              <Brain size={260} alarm={alarm} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", opacity: alarm, scale: String(mix(alarm, 2, 1)) }}>
              <Panel glow={C.positive} style={{ padding: "12px 30px", rotate: "-6deg" }}>
                <Label size={64} color={C.positive}>
                  ERROR
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={reves - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={ojo} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={sonrisa} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={raya} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={life} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={cerebro} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={mal} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};
