import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { Bolt } from "../components/Bolt";
import { Cloud } from "../components/Cloud";
import { Finger } from "../components/Finger";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, clamp, Flash, fmt, Label, Panel, Person, shake } from "../components/Ui";
import { C, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const FINGER_W = 230;
const TUBE = { x: 200, top: 260, bottom: 1100 };
const SUN_STEP = ((TUBE.bottom - TUBE.top) * 5500) / 30000;

/** El canal del rayo: una columna casi recta del ancho de un dedo. */
const Channel: React.FC<{ x: number; heat: number; width?: number; frame: number }> = ({ x, heat, width = FINGER_W, frame }) => {
  const pts = new Array(24).fill(0).map((_, i) => `${x + (random(`ch${i}-${Math.floor(frame / 3)}`) - 0.5) * 18},${-60 + i * 60}`);
  const edge = heat > 0 ? `rgb(${mix(heat, 127, 255)}, ${mix(heat, 220, 150)}, ${mix(heat, 255, 70)})` : C.electric;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <filter id="channel-glow" x="-100%" y="-10%" width="300%" height="120%">
          <feGaussianBlur stdDeviation={40} />
        </filter>
      </defs>
      <polyline points={pts.join(" ")} fill="none" stroke={edge} strokeWidth={width * 2.2} opacity={0.5} filter="url(#channel-glow)" />
      <polyline points={pts.join(" ")} fill="none" stroke={edge} strokeWidth={width} strokeLinejoin="round" />
      <polyline points={pts.join(" ")} fill="none" stroke={C.core} strokeWidth={width * 0.7} strokeLinejoin="round" />
    </svg>
  );
};

const Dimension: React.FC<{ x: number; y: number; w: number; opacity: number }> = ({ x, y, w, opacity }) => (
  <g opacity={opacity} strokeLinecap="round">
    <g stroke="#000" strokeWidth={14} opacity={0.6}>
      <line x1={x} y1={y} x2={x + w} y2={y} />
      <line x1={x} y1={y - 24} x2={x} y2={y + 40} />
      <line x1={x + w} y1={y - 24} x2={x + w} y2={y + 40} />
    </g>
    <g stroke={C.yellow} strokeWidth={6}>
      <line x1={x} y1={y} x2={x + w} y2={y} />
      <line x1={x} y1={y - 24} x2={x} y2={y + 40} />
      <line x1={x + w} y1={y - 24} x2={x + w} y2={y + 40} />
    </g>
    <rect x={x + w / 2 - 120} y={y - 112} width={240} height={74} rx={22} fill="rgba(4,8,18,0.88)" stroke={`${C.yellow}88`} strokeWidth={2} />
    <text x={x + w / 2} y={y - 58} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={50} fill={C.yellow}>
      ≈ 2 cm
    </text>
  </g>
);

const Sun: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle at 40% 38%, #fff4c2, #ffb627 45%, #ff6a00 100%)", boxShadow: "0 0 40px #ff9a1f, 0 0 90px #ff6a0066" }} />
);

const Stopwatch: React.FC<{ seconds: number; danger: number }> = ({ seconds, danger }) => {
  const color = danger > 0.5 ? C.positive : C.yellow;
  return (
    <Panel glow={color} style={{ display: "flex", alignItems: "center", gap: 26, padding: "18px 34px" }}>
      <svg width={120} height={120} viewBox="-60 -60 120 120">
        <circle r={50} fill="none" stroke="#fff" strokeWidth={7} />
        <rect x={-10} y={-68} width={20} height={14} rx={4} fill="#fff" />
        <line x1={0} y1={0} x2={0} y2={-38} stroke={color} strokeWidth={7} strokeLinecap="round" transform={`rotate(${seconds * 40})`} />
      </svg>
      <Label size={120} mono color={color}>
        {Math.floor(seconds)} s
      </Label>
    </Panel>
  );
};

export const S7Final: React.FC = () => {
  const frame = useCurrentFrame();
  const [, hot, boom, count, closer] = beats("final");
  const ancho = wordAt("final", "ancho");
  const llega = wordAt("final", "llega");
  const grados = wordAt("final", "grados");
  const cinco = wordAt("final", "cinco");
  const sol = wordAt("final", "sol");
  const explota = wordAt("final", "explota");
  const trueno = wordAt("final", "trueno");
  const escucharlo = wordAt("final", "escucharlo");
  const dividi = wordAt("final", "dividí");
  const tres = wordAt("final", "tres");
  const km = wordAt("final", "kilómetros");
  const numero = wordAt("final", "número");
  const baja = wordAt("final", "baja");
  const vos = wordAt("final", "vos");

  // A · del ancho de tu dedo
  const fingerIn = ramp(frame, 0, 14, easeOut);
  const fingerOut = ramp(frame, hot, hot + 12, easeInOut);
  // B · 30.000 grados, cinco veces el Sol
  const temp = ramp(frame, llega - 4, grados + 6, easeInOut);
  const thermo = Math.min(ramp(frame, hot, hot + 10), 1 - ramp(frame, boom - 4, boom + 6));
  const channelX = interpolate(frame, [hot, hot + 14, boom - 4, boom + 8], [760, 900, 900, 540], { ...clamp, easing: easeInOut });
  // C · el aire explota
  const blast = ramp(frame, explota - 2, explota + 30, easeOut);
  const boomScene = Math.min(ramp(frame, boom - 4, boom + 4), 1 - ramp(frame, count - 4, count + 4));
  // D · contá y dividí por tres · E · si baja, viene hacia vos
  const ruler = ramp(frame, count - 4, count + 6);
  const counting = ramp(frame, count + 4, escucharlo + 6, (t) => t);
  const step1 = ramp(frame, numero, numero + 8, easeInOut);
  const step2 = ramp(frame, baja + 4, baja + 12, easeInOut);
  const seconds = frame < closer ? counting * 9 : 9 - 3 * Math.round(step1) - 3 * Math.round(step2);
  const kmNow = seconds / 3;
  const danger = ramp(frame, baja, vos + 4);
  const cloudShift = (step1 + step2) * 187;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [explota, explota + 4], 44, 9) }}>
        <Background tint={danger > 0 ? `rgb(${mix(danger, 12, 60)}, ${mix(danger, 23, 10)}, ${mix(danger, 48, 20)})` : "#0c1730"} rain={0.3} />

        {/* A y B: canal del rayo */}
        {frame < count ? <Channel x={channelX} heat={Math.max(temp, ramp(frame, boom, boom + 10))} frame={frame} width={mix(fingerOut, FINGER_W, 180)} /> : null}

        {/* A · el dedo al lado del canal */}
        {fingerOut < 1 ? (
          <div style={{ position: "absolute", left: 330 - FINGER_W / 2, top: 380, translate: `${mix(fingerOut, mix(fingerIn, -500, 0), -700)}px 0px` }}>
            <Finger width={FINGER_W} rim={0.7} />
          </div>
        ) : null}
        {fingerOut < 1 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", opacity: 1 - ramp(frame, hot - 8, hot + 2) }}>
            <Dimension x={330 - FINGER_W / 2} y={340} w={FINGER_W} opacity={ramp(frame, ancho - 4, ancho + 6)} />
            <Dimension x={760 - FINGER_W / 2} y={340} w={FINGER_W} opacity={ramp(frame, ancho + 2, ancho + 12)} />
            <text x={545} y={300} textAnchor="middle" fontFamily={MONO} fontWeight={800} fontSize={90} fill="#fff" opacity={ramp(frame, ancho + 8, ancho + 16)}>
              =
            </text>
          </svg>
        ) : null}

        {/* B · termómetro y cinco soles */}
        {thermo > 0 ? (
          <AbsoluteFill style={{ opacity: thermo }}>
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              <rect x={TUBE.x - 36} y={TUBE.top - 30} width={72} height={TUBE.bottom - TUBE.top + 60} rx={36} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.4)" strokeWidth={4} />
              <circle cx={TUBE.x} cy={TUBE.bottom + 60} r={70} fill={C.heat} />
              <rect x={TUBE.x - 22} y={mix(temp, TUBE.bottom, TUBE.top)} width={44} height={mix(temp, 40, TUBE.bottom - TUBE.top + 40)} rx={22} fill={C.heat} />
              {[0, 10000, 20000, 30000].map((v) => {
                const y = TUBE.bottom - ((TUBE.bottom - TUBE.top) * v) / 30000;
                return (
                  <g key={v}>
                    <line x1={TUBE.x - 50} x2={TUBE.x - 36} y1={y} y2={y} stroke="#fff" strokeWidth={4} />
                    <text x={TUBE.x - 58} y={y + 12} textAnchor="end" fontFamily={MONO} fontWeight={800} fontSize={30} fill="#fff" opacity={0.7}>
                      {v === 0 ? "0" : `${v / 1000}k`}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div style={{ position: "absolute", left: 120, top: 150 + (1 - temp) * 840 }}>
              <Panel glow={C.heat} style={{ padding: "8px 18px" }}>
                <Label size={54} mono color={C.heat}>
                  {fmt(temp * 30000)} °C
                </Label>
              </Panel>
            </div>
            {new Array(5).fill(0).map((_, k) => (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: 420,
                  top: TUBE.bottom - SUN_STEP * (k + 1) + 8,
                  scale: String(ramp(frame, cinco + k * 5, cinco + k * 5 + 10, pop)),
                }}
              >
                <Sun size={SUN_STEP - 16} />
              </div>
            ))}
            <div style={{ position: "absolute", left: 580, top: TUBE.bottom - SUN_STEP + 10, opacity: ramp(frame, cinco + 2, cinco + 10) }}>
              <Label size={30} color="#ffcf7a">SOL</Label>
              <Label size={36} mono color="#ffcf7a" style={{ marginTop: 6 }}>5.500 °C</Label>
            </div>
            <div style={{ position: "absolute", left: 590, top: TUBE.top + 160, opacity: ramp(frame, sol - 6, sol + 4), scale: String(mix(ramp(frame, sol - 6, sol + 10, pop), 2, 1)) }}>
              <Label size={130} color={C.yellow}>×5</Label>
            </div>
          </AbsoluteFill>
        ) : null}

        {/* C · el aire explota: el trueno */}
        {boomScene > 0 ? (
          <svg width={1080} height={1920} style={{ position: "absolute", opacity: boomScene }}>
            {new Array(6).fill(0).map((_, i) => {
              const t = ramp(frame, explota + i * 5, explota + i * 5 + 34, easeOut);
              return t > 0 && t < 1 ? <ellipse key={i} cx={540} cy={760} rx={mix(t, 100, 1100)} ry={mix(t, 400, 1500)} fill="none" stroke="#ffe2b8" strokeWidth={mix(t, 30, 3)} opacity={1 - t} /> : null;
            })}
            {new Array(90).fill(0).map((_, i) => {
              const a = random(`ma${i}`) * Math.PI * 2;
              const d0 = 140 + random(`md${i}`) * 260;
              const d = d0 + blast * (500 + random(`mv${i}`) * 500);
              return <circle key={i} cx={540 + Math.cos(a) * d} cy={760 + Math.sin(a) * d * 1.3} r={7 + random(`mr${i}`) * 6} fill="#9fd8ff" opacity={0.8} />;
            })}
            {frame >= trueno - 2
              ? [0, 1, 2].map((i) => (
                  <g key={i} opacity={ramp(frame, trueno + i * 3, trueno + i * 3 + 6) * (1 - ramp(frame, count - 6, count))}>
                    <path d={`M ${760 + i * 60} ${600 - i * 40} Q ${830 + i * 70} 760 ${760 + i * 60} ${920 + i * 40}`} fill="none" stroke={C.yellow} strokeWidth={12} strokeLinecap="round" />
                    <path d={`M ${320 - i * 60} ${600 - i * 40} Q ${250 - i * 70} 760 ${320 - i * 60} ${920 + i * 40}`} fill="none" stroke={C.yellow} strokeWidth={12} strokeLinecap="round" />
                  </g>
                ))
              : null}
          </svg>
        ) : null}

        {/* D y E · contá los segundos y dividí por tres */}
        {ruler > 0 ? (
          <AbsoluteFill style={{ opacity: ruler }}>
            <div style={{ position: "absolute", left: 20 + cloudShift, top: 470 }}>
              <Cloud width={360} seed="final-nube" flash={frame - count < 5 ? 1 : danger * (frame % 10 < 2 ? 1 : 0)} />
            </div>
            <svg width={1080} height={1920} style={{ position: "absolute" }}>
              {frame - count < 8 ? <Bolt seed="final-rayo" from={[200 + cloudShift, 860]} to={[230 + cloudShift, 1060]} segments={8} jitter={24} branches={1} width={8} /> : null}
              <line x1={0} y1={1060} x2={1080} y2={1060} stroke="rgba(255,255,255,0.25)" strokeWidth={3} />
              <line x1={300 + cloudShift} y1={1130} x2={860} y2={1130} stroke="#fff" strokeWidth={5} strokeDasharray="16 14" opacity={0.8} />
              <line x1={300 + cloudShift} y1={1105} x2={300 + cloudShift} y2={1155} stroke="#fff" strokeWidth={5} />
              <line x1={860} y1={1105} x2={860} y2={1155} stroke="#fff" strokeWidth={5} />
              {/* El sonido viajando hacia vos */}
              {frame >= count + 4 && frame < escucharlo + 10
                ? [0, 1, 2].map((i) => {
                    const x = mix(ramp(frame, count + 4 + i * 6, escucharlo + 4 + i * 6, (t) => t), 330 + cloudShift, 820);
                    return <path key={i} d={`M ${x} 900 Q ${x + 40} 960 ${x} 1020`} fill="none" stroke={C.yellow} strokeWidth={8} strokeLinecap="round" opacity={0.8} />;
                  })
                : null}
              {danger > 0 ? <circle cx={890} cy={960} r={mix(((frame - baja) % 20) / 20, 80, 190)} fill="none" stroke={C.positive} strokeWidth={8} opacity={1 - ((frame - baja) % 20) / 20} /> : null}
            </svg>
            <div style={{ position: "absolute", left: 830, top: 860 }}>
              <Person size={100} color={danger > 0.5 ? "#ffb3ad" : C.white} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", scale: String(mix(ramp(frame, count - 2, count + 10, pop), 0.6, 1)) }}>
              <Stopwatch seconds={seconds} danger={danger} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", gap: 26 }}>
              <div style={{ opacity: ramp(frame, dividi - 2, dividi + 4) }}>
                <Label size={80} mono>{Math.floor(seconds)} s</Label>
              </div>
              <div style={{ opacity: ramp(frame, tres - 2, tres + 4), scale: String(mix(ramp(frame, tres - 2, tres + 10, pop), 1.8, 1)) }}>
                <Label size={80} mono color={C.yellow}>÷ 3</Label>
              </div>
              <div style={{ opacity: ramp(frame, km - 2, km + 4), scale: String(mix(ramp(frame, km - 2, km + 10, pop), 1.8, 1)) }}>
                <Label size={80} mono color={danger > 0.5 ? C.positive : C.electric}>= {fmt(kmNow)} km</Label>
              </div>
            </div>
            <div style={{ position: "absolute", left: 480 + cloudShift / 2, top: 1070, opacity: ramp(frame, km, km + 8) }}>
              <Label size={40} mono color={danger > 0.5 ? C.positive : C.white}>{fmt(kmNow)} km</Label>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>

      <Flash at={hot} color="#ffd39a" length={10} peak={0.5} />
      <Flash at={explota} color="#ffe6c4" length={14} peak={0.9} />
      <Flash at={count} length={6} peak={0.6} />
      <Audio from={0} src={staticFile("sfx/chispa.wav")} volume={0.28} />
      <Audio from={explota - 2} src={staticFile("sfx/trueno.wav")} volume={0.42} />
      <Audio from={count} src={staticFile("sfx/chispa.wav")} volume={0.35} />
      <Audio from={escucharlo} src={staticFile("sfx/trueno.wav")} volume={0.17} />
      <Audio from={numero} src={staticFile("sfx/toque.wav")} volume={0.42} />
      <Audio from={baja + 4} src={staticFile("sfx/toque.wav")} volume={0.42} />
      <Audio from={vos - 4} src={staticFile("sfx/trueno.wav")} volume={0.24} />
    </AbsoluteFill>
  );
};
