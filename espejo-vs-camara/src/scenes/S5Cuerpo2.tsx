import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Face } from "../components/Face";
import { Polaroid, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, clamp, Flash, Label, Panel } from "../components/Ui";
import { C } from "../theme";
import { beats, wordAt } from "../timeline";

const POL_W = 400;
const POL_TOP = 620;
const LEFT = 70;
const RIGHT = 610;

/** Silueta simple de una persona; con pelo largo para "ellas". */
const Person: React.FC<{ size: number; hair?: boolean; color?: string }> = ({ size, hair = false, color = "#f4efe6" }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 100 140">
    {hair ? <path d="M 22 52 C 14 10 86 10 78 52 L 82 74 L 18 74 Z" fill={color} opacity={0.75} /> : null}
    <circle cx={50} cy={34} r={22} fill={color} />
    <path d="M 12 140 L 16 92 C 18 74 32 64 50 64 C 68 64 82 74 84 92 L 88 140 Z" fill={color} />
  </svg>
);

const Check: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={46} fill={color} />
    <path d="M 28 52 L 44 68 L 74 34" fill="none" stroke="#06231e" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const S5Cuerpo2: React.FC = () => {
  const frame = useCurrentFrame();
  const [, ellas, amigos, gusta] = beats("cuerpo2");
  const foto = wordAt("cuerpo2", "fotografiaron");
  const mujeres = wordAt("cuerpo2", "mujeres");
  const mostraron = wordAt("cuerpo2", "mostraron");
  const normal = wordAt("cuerpo2", "normal");
  const espejada = wordAt("cuerpo2", "espejada");
  const espejada2 = wordAt("cuerpo2", "espejada", 1);
  const normal2 = wordAt("cuerpo2", "normal", 1);
  const viste = wordAt("cuerpo2", "viste");

  // Viaje en el tiempo: 2026 → 1977
  const year = Math.round(interpolate(frame, [0, 22], [2026, 1977], { ...clamp, easing: easeOut }));
  const intro = 1 - ramp(frame, mostraron - 6, mostraron + 6);
  const sepia = 1 - ramp(frame, gusta - 10, gusta + 10);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background tint="#2a2316" />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, rgba(120,90,40,${0.25 * sepia}), transparent 70%)` }} />

      {intro > 0 ? (
        <AbsoluteFill style={{ opacity: intro }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", scale: String(mix(ramp(frame, 0, 10, pop), 0.6, 1)) }}>
            <Label size={220} mono color="#f2d9a0">
              {year}
            </Label>
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", gap: 40 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ opacity: ramp(frame, mujeres - 4 + i * 3, mujeres + 4 + i * 3), translate: `0px ${mix(ramp(frame, mujeres - 4 + i * 3, mujeres + 8 + i * 3, pop), 60, 0)}px` }}>
                <Person size={170} hair />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Las dos fotos: normal y espejada */}
      {[
        { left: LEFT, label: "NORMAL", mirrored: false, from: normal, chosen: normal2, by: "SUS AMIGOS", byFrom: amigos, hair: false },
        { left: RIGHT, label: "ESPEJADA", mirrored: true, from: espejada, chosen: espejada2, by: "ELLAS", byFrom: ellas, hair: true },
      ].map((p) => {
        const show = ramp(frame, p.from - 8, p.from + 6, pop);
        const pick = ramp(frame, p.chosen - 2, p.chosen + 10, pop);
        return (
          <React.Fragment key={p.label}>
            <div style={{ position: "absolute", left: p.left, top: POL_TOP, opacity: ramp(frame, p.from - 8, p.from), scale: String(mix(show, 0.6, 1) * (1 + pick * 0.04)), rotate: `${p.mirrored ? 4 : -4}deg` }}>
              <Polaroid width={POL_W} caption={p.label} sepia={0.45 * sepia}>
                <div style={{ marginBottom: -30 }}>
                  <Face width={360} mirrored={p.mirrored} />
                </div>
              </Polaroid>
              <div style={{ position: "absolute", right: -26, top: -26, opacity: pick, scale: String(mix(pick, 2, 1)) }}>
                <Check size={110} color={TEAL} />
              </div>
            </div>
            <div style={{ position: "absolute", left: p.left + POL_W / 2, top: POL_TOP - 150, translate: "-50% 0", opacity: ramp(frame, p.byFrom - 2, p.byFrom + 8), display: "flex", alignItems: "center", gap: 14 }}>
              <Person size={56} hair={p.hair} color={TEAL} />
              {p.hair ? null : <Person size={56} color={TEAL} />}
              <Label size={40} color={TEAL}>
                {p.by}
              </Label>
            </div>
          </React.Fragment>
        );
      })}

      {/* Te gusta la cara que más viste */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: ramp(frame, gusta - 2, gusta + 8), scale: String(mix(ramp(frame, gusta - 2, gusta + 12, pop), 0.6, 1)) }}>
        <Panel glow={TEAL} style={{ padding: "12px 26px" }}>
          <Label size={40} color={TEAL}>
            EFECTO DE MERA EXPOSICIÓN
          </Label>
        </Panel>
        <Label size={26} mono color={C.dim}>
          MITA, DERMER Y KNIGHT · 1977
        </Label>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {frame >= viste - 6
          ? new Array(10).fill(0).map((_, i) => {
              const t = ramp(frame, viste - 6 + i * 2, viste + 24 + i * 2, easeInOut);
              const x = RIGHT + 80 + random(`hx${i}`) * 260;
              const y = POL_TOP - 30 - t * (220 + random(`hy${i}`) * 140);
              const s = 26 + random(`hs${i}`) * 18;
              return <path key={i} d={`M ${x} ${y + s * 0.35} C ${x} ${y - s * 0.25}, ${x - s} ${y - s * 0.25}, ${x - s} ${y + s * 0.2} C ${x - s} ${y + s * 0.6}, ${x} ${y + s}, ${x} ${y + s} C ${x} ${y + s}, ${x + s} ${y + s * 0.6}, ${x + s} ${y + s * 0.2} C ${x + s} ${y - s * 0.25}, ${x} ${y - s * 0.25}, ${x} ${y + s * 0.35} Z`} fill="#ff5a7a" opacity={(1 - t) * 0.9} />;
            })
          : null}
      </svg>

      <Flash at={foto} length={8} peak={0.85} />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={foto} src={staticFile("sfx/obturador.wav")} volume={SFX.obturador} />
      <Audio from={mostraron} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={espejada2} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={normal2} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={gusta} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};
