import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Cloud } from "../components/Cloud";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, clamp, Flash, Label, Panel, shake } from "../components/Ui";
import { C, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const GROUND = 1180;
const PX_PER_KM = 52;
const EVEREST_KM = 8.849;

const Everest: React.FC<{ width: number; height: number }> = ({ width, height }) => (
  <svg width={width} height={height} viewBox="0 0 300 460" preserveAspectRatio="none" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="rock" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#3b4763" />
        <stop offset="1" stopColor="#111827" />
      </linearGradient>
    </defs>
    <path d="M0 460 L 40 390 L 62 372 L 90 318 L 112 300 L 135 228 L 150 210 L 170 0 L 196 96 L 214 120 L 236 200 L 262 260 L 280 330 L 300 460 Z" fill="url(#rock)" stroke="rgba(255,255,255,0.55)" strokeWidth={3} />
    <path d="M 150 210 L 170 0 L 196 96 L 214 120 L 228 176 L 206 150 L 190 180 L 174 140 L 160 196 Z" fill="#eef5ff" />
  </svg>
);

const Crystal: React.FC<{ x: number; y: number; r: number; rot: number; color?: string; opacity?: number }> = ({ x, y, r, rot, color = "#e4f7ff", opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
    {[0, 60, 120].map((a) => (
      <line key={a} x1={-r} y1={0} x2={r} y2={0} stroke={color} strokeWidth={Math.max(2, r * 0.22)} strokeLinecap="round" transform={`rotate(${a})`} />
    ))}
    <circle r={r * 0.3} fill={color} />
  </g>
);

const Graupel: React.FC<{ x: number; y: number; r: number; opacity?: number; id: string }> = ({ x, y, r, opacity = 1, id }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <defs>
      <radialGradient id={`gr-${id}`} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.6" stopColor="#b9c6dc" />
        <stop offset="1" stopColor="#5d6b86" />
      </radialGradient>
    </defs>
    <path
      d={new Array(12)
        .fill(0)
        .map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const rr = r * (0.88 + random(`${id}-${i}`) * 0.2);
          return `${i === 0 ? "M" : "L"}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
        })
        .join(" ") + " Z"}
      fill={`url(#gr-${id})`}
      strokeLinejoin="round"
    />
  </g>
);

const Charge: React.FC<{ x: number; y: number; sign: "+" | "−"; scale: number; size?: number }> = ({ x, y, sign, scale, size = 64 }) => {
  const color = sign === "+" ? C.positive : C.negative;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={Math.min(1, scale)}>
      <circle r={size * 0.62} fill={color} opacity={0.25} />
      <circle r={size * 0.48} fill={color} stroke="#fff" strokeWidth={3} />
      <text y={size * 0.2} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={size * 0.62} fill="#fff">
        {sign}
      </text>
    </g>
  );
};

/** Viento ascendente: rayas que suben rápido. */
const Updraft: React.FC<{ frame: number; opacity: number }> = ({ frame, opacity }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", opacity }}>
    {new Array(46).fill(0).map((_, i) => {
      const speed = 34 + random(`up${i}`) * 30;
      const len = 120 + random(`ul${i}`) * 220;
      const x = random(`ux${i}`) * 1080;
      const y = 2100 - ((random(`uy${i}`) * 2300 + frame * speed) % 2300);
      return <line key={i} x1={x} y1={y} x2={x} y2={y + len} stroke="#cfeaff" strokeWidth={2 + random(`uw${i}`) * 4} strokeLinecap="round" opacity={0.12 + random(`uo${i}`) * 0.3} />;
    })}
  </svg>
);

const Fog: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: "radial-gradient(100% 70% at 50% 40%, #1c2f5c 0%, #0a1430 55%, #040812 100%)" }}>
    {new Array(7).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,150,210,0.28), transparent 70%)",
          left: random(`fx${i}`) * 900 - 300 + Math.sin(frame / 40 + i) * 60,
          top: random(`fy${i}`) * 1800 - 300 - frame * (1 + random(`fs${i}`) * 2),
        }}
      />
    ))}
  </AbsoluteFill>
);

const Gauge: React.FC<{ value: number }> = ({ value }) => {
  const angle = mix(value / 120, -120, 120);
  return (
    <Panel style={{ width: 330, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={260} height={170} viewBox="-130 -130 260 170">
        <path d="M -110 0 A 110 110 0 1 1 110 0" transform="rotate(-30)" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={16} strokeLinecap="round" />
        {new Array(13).fill(0).map((_, i) => (
          <line key={i} x1={0} y1={-96} x2={0} y2={i % 3 === 0 ? -76 : -86} stroke="#fff" strokeWidth={i % 3 === 0 ? 5 : 3} opacity={0.6} transform={`rotate(${-120 + i * 20})`} />
        ))}
        <line x1={0} y1={14} x2={0} y2={-96} stroke={C.yellow} strokeWidth={8} strokeLinecap="round" transform={`rotate(${angle})`} />
        <circle r={14} fill={C.yellow} />
      </svg>
      <Label size={52} mono color={C.yellow}>
        {Math.round(value)} km/h
      </Label>
      <Label size={26} color={C.dim} style={{ marginTop: 8 }}>
        VIENTO HACIA ARRIBA
      </Label>
    </Panel>
  );
};

export const S3Cuerpo1: React.FC = () => {
  const frame = useCurrentFrame();
  const [, inside, collide, sort, battery] = beats("cuerpo1");
  const kmWord = wordAt("cuerpo1", "kilómetros");
  const secondEverest = wordAt("cuerpo1", "dos");
  const windWord = wordAt("cuerpo1", "vientos");
  const hundred = wordAt("cuerpo1", "100");
  const impact = wordAt("cuerpo1", "arranca");
  const como = wordAt("cuerpo1", "como");
  const polvo = wordAt("cuerpo1", "polvo");
  const arriba = wordAt("cuerpo1", "arriba");
  const abajo = wordAt("cuerpo1", "abajo");
  const pila = wordAt("cuerpo1", "pila");

  // A · la torre de 15 km
  const grow = mix(ramp(frame, 0, kmWord + 8, easeInOut), 0.22, 1);
  const zoomIn = ramp(frame, inside - 8, inside + 6, easeInOut);
  const towerOpacity = 1 - ramp(frame, inside - 2, inside + 6);
  const cloudH = 15 * PX_PER_KM;
  const cloudW = (cloudH / 900) * 800;
  const everestH = EVEREST_KM * PX_PER_KM;
  const drop = ramp(frame, secondEverest - 6, secondEverest + 8, pop);

  // B · adentro de la nube
  const interior = Math.min(ramp(frame, inside - 2, inside + 6), 1 - ramp(frame, collide - 4, collide + 4));
  const speed = interpolate(frame, [windWord, hundred + 6], [0, 100], { ...clamp, easing: easeOut });

  // C · el choque y la estática
  const macro = Math.min(ramp(frame, collide - 4, collide + 4), 1 - ramp(frame, como - 4, como + 4));
  const hit = ramp(frame, collide, impact, easeInOut);
  const after = ramp(frame, impact, impact + 24, easeOut);
  const phone = Math.min(ramp(frame, como - 4, como + 6), 1 - ramp(frame, sort - 4, sort + 4));
  const wipe = ramp(frame, como + 2, como + 22, easeInOut);
  const attract = ramp(frame, polvo - 14, polvo + 10, easeInOut);

  // D · cargas separadas y E · pila gigante
  const charges = ramp(frame, sort - 4, sort + 6);
  const outline = ramp(frame, pila - 8, pila + 10, easeInOut);
  const cloudTop = 170;
  const bigCloudW = 860;
  const bigCloudH = (bigCloudW / 800) * 900;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* A · torre */}
      <AbsoluteFill style={{ opacity: towerOpacity, scale: String(mix(zoomIn, mix(grow, 1.3, 1), 3.4)), transformOrigin: "48% 55%" }}>
        <Background tint="#0c1730" rain={0.5} />
        <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, bottom: 0, background: "linear-gradient(#0d1424, #03050b)", borderTop: "3px solid rgba(255,255,255,0.25)" }} />
        <div style={{ position: "absolute", left: 520 - cloudW / 2, top: GROUND - cloudH }}>
          <Cloud width={cloudW} grow={grow} flash={frame % 40 < 3 ? 0.5 : 0.05} seed="torre" />
        </div>
        {/* Regla de altura */}
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <line x1={150} y1={GROUND} x2={150} y2={GROUND - cloudH * grow} stroke={C.electric} strokeWidth={5} />
          {new Array(16).fill(0).map((_, km) =>
            km * PX_PER_KM <= cloudH * grow ? (
              <g key={km}>
                <line x1={150} x2={km % 5 === 0 ? 112 : 130} y1={GROUND - km * PX_PER_KM} y2={GROUND - km * PX_PER_KM} stroke={C.electric} strokeWidth={km % 5 === 0 ? 5 : 3} />
                {km % 5 === 0 && km > 0 ? (
                  <text x={104} y={GROUND - km * PX_PER_KM + 12} textAnchor="end" fontFamily={MONO} fontWeight={800} fontSize={34} fill={C.electric}>
                    {km}
                  </text>
                ) : null}
              </g>
            ) : null,
          )}
        </svg>
        <div style={{ position: "absolute", left: 170, top: GROUND - cloudH * grow - 46 }}>
          <Panel style={{ padding: "8px 18px" }}>
            <Label size={48} mono color={C.yellow}>
              {(15 * grow).toFixed(0)} km
            </Label>
          </Panel>
        </div>
        {/* Dos Everest apilados */}
        <div style={{ position: "absolute", left: 770, top: GROUND - everestH, opacity: ramp(frame, 50, 60) }}>
          <Everest width={280} height={everestH} />
        </div>
        <div style={{ position: "absolute", left: 770, top: GROUND - everestH * 2, translate: `0px ${mix(drop, -900, 0)}px`, opacity: drop > 0 ? 1 : 0 }}>
          <Everest width={280} height={everestH} />
        </div>
        <div style={{ position: "absolute", left: 790, top: GROUND - everestH / 2, opacity: ramp(frame, 55, 65) }}>
          <Label size={30} mono>EVEREST</Label>
          <Label size={30} mono color={C.yellow}>8,8 km</Label>
        </div>
        <div style={{ position: "absolute", left: 790, top: GROUND - everestH * 1.5, opacity: drop }}>
          <Label size={30} mono color={C.yellow}>+8,8 km</Label>
        </div>
      </AbsoluteFill>

      {/* B · adentro: viento e hielo */}
      {interior > 0 ? (
        <AbsoluteFill style={{ opacity: interior, scale: String(mix(ramp(frame, inside, collide), 1.15, 1)) }}>
          <Fog frame={frame} />
          <Updraft frame={frame} opacity={ramp(frame, windWord - 6, windWord + 6)} />
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {new Array(34).fill(0).map((_, i) => {
              const sp = 16 + random(`cs${i}`) * 12;
              const y = 2000 - ((random(`cy${i}`) * 2100 + frame * sp) % 2100);
              return <Crystal key={`c${i}`} x={random(`cx${i}`) * 1080 + Math.sin(frame / 9 + i) * 20} y={y} r={12 + random(`cr${i}`) * 12} rot={frame * (3 + i % 5)} />;
            })}
            {new Array(12).fill(0).map((_, i) => {
              const y = ((random(`gy${i}`) * 1900 + frame * (2 + random(`gs${i}`) * 3)) % 1900) - 60;
              return <Graupel key={`g${i}`} id={`g${i}`} x={random(`gx${i}`) * 1000 + 40 + Math.sin(frame / 14 + i) * 30} y={y} r={30 + random(`grr${i}`) * 16} />;
            })}
            {new Array(10).fill(0).map((_, i) => {
              const slot = Math.floor((frame + i * 7) / 6);
              const age = (frame + i * 7) % 6;
              const x = random(`spx${i}-${slot}`) * 1000 + 40;
              const y = random(`spy${i}-${slot}`) * 1100 + 200;
              const r = (1 - age / 6) * 34;
              return frame > wordAt("cuerpo1", "chocar") - 4 ? (
                <g key={`s${i}`} opacity={1 - age / 6}>
                  <path d={`M ${x - r} ${y} L ${x + r} ${y} M ${x} ${y - r} L ${x} ${y + r} M ${x - r * 0.6} ${y - r * 0.6} L ${x + r * 0.6} ${y + r * 0.6} M ${x - r * 0.6} ${y + r * 0.6} L ${x + r * 0.6} ${y - r * 0.6}`} stroke={C.yellow} strokeWidth={4} strokeLinecap="round" />
                </g>
              ) : null;
            })}
          </svg>
          <div style={{ position: "absolute", top: 250, left: 70, opacity: ramp(frame, windWord - 4, windWord + 6), translate: `${mix(ramp(frame, windWord - 4, windWord + 10), -60, 0)}px 0px` }}>
            <Gauge value={speed} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* C1 · un choque arranca carga */}
      {macro > 0 ? (
        <AbsoluteFill style={{ opacity: macro, ...shake(frame, [impact], 22) }}>
          <Fog frame={frame} />
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            <Graupel id="macro-g" x={mix(after, 560, 640)} y={mix(after, 640, 860)} r={170} />
            <Crystal x={mix(after, mix(hit, 420, 470), 230)} y={mix(after, mix(hit, 1380, 840), 430)} r={90} rot={frame * 2} />
            {frame >= impact && frame < impact + 10
              ? new Array(14).fill(0).map((_, i) => {
                  const a = (i / 14) * Math.PI * 2;
                  const r1 = 30 + (frame - impact) * 22;
                  return <line key={i} x1={480 + Math.cos(a) * r1 * 0.4} y1={820 + Math.sin(a) * r1 * 0.4} x2={480 + Math.cos(a) * r1} y2={820 + Math.sin(a) * r1} stroke={C.yellow} strokeWidth={8} strokeLinecap="round" opacity={1 - (frame - impact) / 10} />;
                })
              : null}
            {/* El electrón que pasa del cristal al granizo */}
            {after > 0 && after < 1 ? (
              <g transform={`translate(${mix(after, 470, 620)} ${mix(after, 830, 760)})`} opacity={1 - after}>
                <circle r={26} fill={C.negative} stroke="#fff" strokeWidth={3} />
                <text y={10} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={30} fill="#fff">
                  e⁻
                </text>
              </g>
            ) : null}
            <Charge x={230 + 110} y={430 - 90} sign="+" scale={ramp(frame, impact + 6, impact + 18, pop)} size={90} />
            <Charge x={640 + 150} y={860 - 150} sign="−" scale={ramp(frame, impact + 10, impact + 22, pop)} size={90} />
          </svg>
          <div style={{ position: "absolute", left: 120, top: 540, opacity: ramp(frame, impact + 10, impact + 20) }}>
            <Label size={34} color={C.positive}>CRISTAL DE HIELO</Label>
          </div>
          <div style={{ position: "absolute", left: 500, top: 1060, opacity: ramp(frame, impact + 12, impact + 22) }}>
            <Label size={34} color={C.negative}>GRANIZO BLANDO</Label>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* C2 · la misma estática que junta polvo en tu pantalla */}
      {phone > 0 ? (
        <AbsoluteFill style={{ opacity: phone, scale: String(mix(ramp(frame, como - 4, como + 12, pop), 0.85, 1)) }}>
          <Background tint="#13203d" />
          <div
            style={{
              position: "absolute",
              left: 280,
              top: 240,
              width: 520,
              height: 920,
              borderRadius: 70,
              background: "linear-gradient(160deg, #1b2335, #05070c 60%)",
              border: "10px solid #2a3245",
              boxShadow: "0 40px 90px rgba(0,0,0,0.7), inset 0 0 0 2px rgba(255,255,255,0.08)",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.10) 45%, transparent 60%)" }} />
            <div style={{ position: "absolute", top: 22, left: 220, width: 60, height: 18, borderRadius: 10, background: "#000" }} />
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {/* Cargas que deja el paño */}
            {new Array(14).fill(0).map((_, i) => {
              const x = 320 + random(`px${i}`) * 440;
              const y = 300 + random(`py${i}`) * 800;
              const shown = wipe * 520 + 280 > x;
              return shown ? (
                <text key={i} x={x} y={y} fontFamily={MONO} fontWeight={800} fontSize={44} fill={C.positive} opacity={0.85} textAnchor="middle">
                  +
                </text>
              ) : null;
            })}
            {/* Polvo atraído por la estática */}
            {new Array(70).fill(0).map((_, i) => {
              const sx = random(`dx${i}`) * 1080;
              const sy = random(`dy${i}`) * 1250 + 100 + Math.sin(frame / 12 + i) * 16;
              const tx = 310 + random(`dtx${i}`) * 460;
              const ty = 270 + random(`dty${i}`) * 860;
              const t = Math.min(1, attract * (1 + random(`dd${i}`) * 0.6));
              return <circle key={i} cx={mix(t, sx, tx)} cy={mix(t, sy, ty)} r={3 + random(`dr${i}`) * 5} fill="#c7c1b4" opacity={0.75} />;
            })}
          </svg>
          {/* El paño */}
          <div
            style={{
              position: "absolute",
              left: mix(wipe, -420, 1100),
              top: 520 + Math.sin(wipe * Math.PI * 3) * 120,
              width: 380,
              height: 260,
              borderRadius: 40,
              background: "repeating-linear-gradient(45deg, #6f7c96 0 10px, #5b6780 10px 20px)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              rotate: "-12deg",
              opacity: wipe > 0 && wipe < 1 ? 1 : 0,
            }}
          />
        </AbsoluteFill>
      ) : null}

      {/* D · arriba positivo, abajo negativo · E · una pila gigante */}
      {charges > 0 ? (
        <AbsoluteFill style={{ opacity: charges, scale: String(mix(ramp(frame, battery, battery + 40, easeInOut), 1, 1.06)) }}>
          <Background tint="#0c1730" rain={0.35} />
          <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, bottom: 0, background: "linear-gradient(#0d1424, #03050b)", borderTop: "3px solid rgba(255,255,255,0.2)" }} />
          <div style={{ position: "absolute", left: 540 - bigCloudW / 2, top: cloudTop }}>
            <Cloud width={bigCloudW} seed="cargas" flash={frame % 50 < 3 ? 0.4 : 0.08} />
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {new Array(16).fill(0).map((_, i) => {
              const x = 180 + random(`p+x${i}`) * 720;
              const y = cloudTop + 60 + random(`p+y${i}`) * 260;
              return <Charge key={`p${i}`} x={x} y={y} sign="+" scale={ramp(frame, arriba + i * 1.2, arriba + i * 1.2 + 10, pop)} size={58} />;
            })}
            {new Array(16).fill(0).map((_, i) => {
              const x = 230 + random(`n-x${i}`) * 620;
              const y = cloudTop + bigCloudH - 330 + random(`n-y${i}`) * 220;
              return <Charge key={`n${i}`} x={x} y={y} sign="−" scale={ramp(frame, abajo + i * 1.2, abajo + i * 1.2 + 10, pop)} size={58} />;
            })}
            {/* Contorno de pila */}
            <rect x={90} y={290} width={900} height={870} rx={70} fill="none" stroke={C.yellow} strokeWidth={12} strokeDasharray={3600} strokeDashoffset={3600 * (1 - outline)} />
            <rect x={430} y={240} width={220} height={50} rx={14} fill={C.yellow} opacity={ramp(frame, pila + 4, pila + 10)} />
            <g opacity={ramp(frame, pila + 6, pila + 14)}>
              <text x={540} y={232} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={110} fill={C.positive}>
                +
              </text>
              <text x={540} y={1240} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={110} fill={C.negative}>
                −
              </text>
            </g>
            {new Array(4).fill(0).map((_, i) => (
              <rect key={i} x={1010} y={1080 - i * 90} width={26} height={70} rx={8} fill={C.yellow} opacity={ramp(frame, pila + 8 + i * 4, pila + 12 + i * 4)} />
            ))}
          </svg>
        </AbsoluteFill>
      ) : null}

      <Flash at={inside} color={C.electric} length={8} peak={0.35} />
      <Flash at={impact} color={C.yellow} length={8} peak={0.4} />
      <Flash at={pila + 2} color={C.yellow} length={10} peak={0.3} />
      <Audio from={0} src={staticFile("sfx/trueno.wav")} volume={0.13} />
      <Audio from={inside - 8} src={staticFile("sfx/whoosh.wav")} volume={0.32} />
      <Audio from={impact - 1} src={staticFile("sfx/chispa.wav")} volume={0.49} />
      <Audio from={como - 2} src={staticFile("sfx/whoosh.wav")} volume={0.21} />
      <Audio from={arriba} src={staticFile("sfx/toque.wav")} volume={0.35} />
      <Audio from={abajo} src={staticFile("sfx/toque.wav")} volume={0.35} />
      <Audio from={pila} src={staticFile("sfx/chispa.wav")} volume={0.42} />
    </AbsoluteFill>
  );
};
