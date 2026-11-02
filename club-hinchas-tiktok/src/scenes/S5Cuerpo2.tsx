import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, staticFile, useCurrentFrame } from "remotion";
import { Camiseta, Comentario, Crest, equipo, NUESTRO } from "../components/Futbol";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Label, Panel, shake } from "../components/Ui";
import { C, DISPLAY } from "../theme";
import { beats, wordAt } from "../timeline";

const COLORES = ["#3a4256", "#d62828", "#1f6feb", "#2a9d3f", "#f2c230", "#7b2cbf", "#111111", "#ff7a00"];
const PROPUESTAS = ["Club ...", "Atlético ...", "Deportivo ..."];

const Item: React.FC<{ show: number; label: string; children: React.ReactNode; x: number; y: number }> = ({ show, label, children, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: show, scale: String(mix(show, 0.4, 1)) }}>
    {children}
    <Panel glow={C.yellow} style={{ padding: "8px 20px" }}>
      <Label size={34} color={C.yellow}>
        {label}
      </Label>
    </Panel>
  </div>
);

export const S5Cuerpo2: React.FC = () => {
  const frame = useCurrentFrame();
  const [, votan] = beats("cuerpo2");
  const nombre = wordAt("cuerpo2", "nombre");
  const escudo = wordAt("cuerpo2", "escudo");
  const colores = wordAt("cuerpo2", "colores");
  const comentarios = wordAt("cuerpo2", "comentarios");
  const votado = wordAt("cuerpo2", "votado");

  const partA = window01(frame, 0, votan - 6);
  const partB = ramp(frame, votan - 4, votan + 6);
  const cursor = Math.floor(frame / 8) % 2 === 0;
  const color = COLORES[Math.floor(Math.max(0, frame - colores) / 5) % COLORES.length];
  const winner = ramp(frame, votado - 4, votado + 8, pop);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [nombre, escudo, colores, votado], 10) }}>
        <Background tint="#1a1430" />

        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 90, right: 90, top: 260, opacity: ramp(frame, nombre - 4, nombre + 6), scale: String(mix(ramp(frame, nombre - 4, nombre + 10, pop), 0.6, 1)) }}>
              <Panel glow={C.yellow} style={{ padding: "28px 34px", display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 76, color: C.white }}>CLUB</div>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.35)", marginTop: 50 }} />
                <div style={{ width: 8, height: 80, background: C.yellow, opacity: cursor ? 1 : 0 }} />
              </Panel>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                <Label size={34} color={C.yellow}>
                  NOMBRE: ?
                </Label>
              </div>
            </div>
            <Item show={ramp(frame, escudo - 4, escudo + 10, pop)} label="ESCUDO: ?" x={110} y={560}>
              <Crest team={equipo(NUESTRO)} size={300} blank />
            </Item>
            <Item show={ramp(frame, colores - 4, colores + 10, pop)} label="COLORES: ?" x={600} y={590}>
              <Camiseta size={340} color={frame >= colores ? color : COLORES[0]} />
            </Item>
          </AbsoluteFill>
        ) : null}

        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: ramp(frame, votan, votan + 8) }}>
              <Label size={40} color={C.dim}>
                COMENTARIOS
              </Label>
            </div>
            {PROPUESTAS.map((t, i) => {
              const at = comentarios - 18 + i * 8;
              const show = ramp(frame, at, at + 10, pop);
              const likes = Math.floor(ramp(frame, at + 4, votado + 4, easeOut) * [41, 17, 9][i]);
              const isWinner = i === 0;
              return (
                <div key={t} style={{ position: "absolute", left: 540 - 320, top: 340 + i * 150 - (isWinner ? winner * 20 : 0), opacity: show * (isWinner ? 1 : 1 - winner * 0.5), scale: String(mix(show, 0.6, 1) * (isWinner ? 1 + winner * 0.06 : 1)), zIndex: isWinner ? 2 : 1 }}>
                  <Comentario texto={t} likes={likes} corona={isWinner && winner > 0.5} />
                  {isWinner && winner > 0 ? (
                    <svg width={90} height={64} viewBox="0 0 90 64" style={{ position: "absolute", left: -30, top: -44, rotate: "-18deg", opacity: winner }}>
                      <path d="M 6 58 L 2 14 L 26 34 L 45 4 L 64 34 L 88 14 L 84 58 Z" fill={C.yellow} stroke="#1a1400" strokeWidth={3} strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 850, display: "flex", justifyContent: "center" }}>
              <div style={{ opacity: winner, scale: String(mix(winner, 1.6, 1)), rotate: "-3deg" }}>
                <Panel glow={C.yellow} style={{ padding: "12px 30px" }}>
                  <Label size={50} color={C.yellow}>
                    GANA EL MÁS VOTADO
                  </Label>
                </Panel>
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", opacity: ramp(frame, votado + 6, votado + 16) }}>
              <Label size={30} color={TEAL}>
                NOMBRE → ESCUDO → COLORES
              </Label>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={nombre} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={escudo} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={colores} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={votan} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={votado} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
