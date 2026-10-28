import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Finger } from "../components/Finger";
import { easeOut, mix, ramp } from "../components/anim";
import { Background, Flash, Label, Panel, shake } from "../components/Ui";
import { C, MONO } from "../theme";

// Punto donde el dedo toca la pantalla del espectador.
const P = { x: 540, y: 700 };
const TOUCH = 11;

const ELECTRONS = new Array(34).fill(0).map((_, i) => {
  const angle = random(`ea${i}`) * Math.PI * 2;
  const dist = 320 + random(`ed${i}`) * 700;
  return { angle, dist, delay: random(`et${i}`) * 50, speed: 18 + random(`es${i}`) * 14 };
});

/** La pantalla del celular vista desde adentro: la grilla del sensor táctil. */
const SensorGrid: React.FC<{ glow: number; radius: number }> = ({ glow, radius }) => (
  <svg width={1080} height={1920} style={{ position: "absolute" }}>
    <defs>
      <radialGradient id="grid-mask-grad" cx={P.x} cy={P.y} r={radius} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#fff" stopOpacity="1" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <mask id="grid-mask">
        <rect width={1080} height={1920} fill="url(#grid-mask-grad)" />
      </mask>
      <pattern id="grid" width={72} height={72} patternUnits="userSpaceOnUse" x={P.x % 72} y={P.y % 72}>
        <path d="M 72 0 L 0 0 0 72" fill="none" stroke={C.electric} strokeWidth={2} />
      </pattern>
    </defs>
    <rect width={1080} height={1920} fill="url(#grid)" opacity={0.07} />
    <rect width={1080} height={1920} fill="url(#grid)" opacity={glow} mask="url(#grid-mask)" />
  </svg>
);

export const S1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const touched = frame >= TOUCH;
  const approach = ramp(frame, 0, TOUCH, easeOut);
  const press = interpolate(frame, [TOUCH, TOUCH + 3, TOUCH + 10], [0, 1, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = touched ? 0.55 + Math.sin(frame * 0.6) * 0.12 : 0;
  const volts = 4.9 + Math.sin(frame * 1.7) * 0.12 + Math.sin(frame * 3.1) * 0.06;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ scale: interpolate(frame, [0, 90], [1.12, 1.0]), ...shake(frame, [TOUCH], 30) }}>
        <Background tint="#0b1a33" />
        <SensorGrid glow={glow} radius={mix(ramp(frame, TOUCH, TOUCH + 30), 60, 720)} />

        {/* Reflejo del vidrio barriendo la pantalla */}
        <AbsoluteFill
          style={{
            background: "linear-gradient(115deg, transparent 40%, rgba(160,220,255,0.10) 48%, transparent 56%)",
            translate: `${interpolate(frame, [0, 40], [-900, 900], { extrapolateRight: "clamp" })}px 0px`,
          }}
        />

        {/* Ondas de contacto */}
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {[0, 7, 14, 30, 50].map((delay, i) => {
            const t = ramp(frame, TOUCH + delay, TOUCH + delay + 34);
            if (t <= 0 || t >= 1) {
              return null;
            }
            return <circle key={i} cx={P.x} cy={P.y} r={mix(t, 40, 760)} fill="none" stroke={C.electric} strokeWidth={mix(t, 14, 2)} opacity={(1 - t) * 0.8} />;
          })}
          {/* Electrones viajando hacia la yema del dedo */}
          {ELECTRONS.map((e, i) => {
            const local = (frame - TOUCH - e.delay) * e.speed;
            if (local < 0) {
              return null;
            }
            const d = Math.max(0, e.dist - local);
            if (d <= 10) {
              return null;
            }
            const x = P.x + Math.cos(e.angle) * d;
            const y = P.y + Math.sin(e.angle) * d * 0.9;
            return (
              <g key={i} opacity={Math.min(1, d / 120)}>
                <line x1={x} y1={y} x2={P.x + Math.cos(e.angle) * (d + 60)} y2={P.y + Math.sin(e.angle) * (d + 60) * 0.9} stroke={C.electric} strokeWidth={5} opacity={0.5} strokeLinecap="round" />
                <circle cx={x} cy={y} r={18} fill={C.electricDeep} stroke={C.core} strokeWidth={3} />
                <text x={x} y={y + 9} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={30} fill={C.core}>
                  −
                </text>
              </g>
            );
          })}
          {/* Chispas en el punto de contacto */}
          {touched
            ? new Array(9).fill(0).map((_, i) => {
                const a = random(`sp${i}-${Math.floor(frame / 3)}`) * Math.PI * 2;
                const len = 50 + random(`spl${i}-${Math.floor(frame / 3)}`) * 110 * (frame < TOUCH + 12 ? 1.8 : 0.8);
                return (
                  <polyline
                    key={i}
                    points={`${P.x},${P.y} ${P.x + Math.cos(a + 0.4) * len * 0.5},${P.y + Math.sin(a + 0.4) * len * 0.5} ${P.x + Math.cos(a) * len},${P.y + Math.sin(a) * len}`}
                    fill="none"
                    stroke={C.core}
                    strokeWidth={4}
                    opacity={0.9}
                  />
                );
              })
            : null}
          <circle cx={P.x} cy={P.y} r={mix(press, 30, 120)} fill={C.electric} opacity={touched ? 0.35 : 0} />
        </svg>

        {/* Sombra del dedo acercándose al vidrio */}
        <div
          style={{
            position: "absolute",
            left: P.x - 160,
            top: P.y - 40,
            width: 320,
            height: 900,
            borderRadius: 200,
            background: "rgba(0,0,0,0.6)",
            filter: `blur(${mix(approach, 70, 24)}px)`,
            rotate: "-24deg",
            transformOrigin: "50% 0%",
            translate: `${mix(approach, 260, 40)}px ${mix(approach, 120, 30)}px`,
            opacity: mix(approach, 0.3, 0.8),
          }}
        />

        {/* El dedo gigante */}
        <div
          style={{
            position: "absolute",
            left: P.x - 160,
            top: P.y - 6,
            transformOrigin: "50% 0%",
            rotate: `${mix(approach, -30, -24)}deg`,
            translate: `${mix(approach, 70, 0)}px ${mix(approach, 110, 0)}px`,
            scale: String(mix(approach, 1.4, 1) - press * 0.03),
            filter: `blur(${mix(approach, 7, 0)}px)`,
          }}
        >
          <Finger width={320} rim={0.35 + glow * 0.9} />
        </div>

        {/* Lectura del instrumento */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 80,
            opacity: ramp(frame, TOUCH + 2, TOUCH + 10),
            translate: `0px ${mix(ramp(frame, TOUCH + 2, TOUCH + 14), 40, 0)}px`,
          }}
        >
          <Panel>
            <Label size={30} color={C.electric} mono>
              TU DEDO · PANTALLA TÁCTIL
            </Label>
            <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 10 }}>
              <Label size={96} mono>
                ≈{volts.toFixed(1).replace(".", ",")}
              </Label>
              <Label size={60} color={C.yellow} mono>
                V
              </Label>
            </div>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={TOUCH} color={C.electric} length={8} peak={0.55} />
      <Audio from={TOUCH - 2} src={staticFile("sfx/toque.wav")} volume={0.63} />
      <Audio from={TOUCH} src={staticFile("sfx/chispa.wav")} volume={0.49} />
    </AbsoluteFill>
  );
};
