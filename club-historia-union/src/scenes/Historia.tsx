import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Crest, equipo, NUESTRO, Potrero } from "../components/Futbol";
import { Finger } from "../components/Finger";
import { Phone, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, Label, Panel, shake } from "../components/Ui";
import fixture from "../liga/fixture.json";
import serie from "../serie.json";
import { C, DISPLAY } from "../theme";
import { wordAt } from "../timeline";

const IG = serie.instagram;
const TT = serie.tiktok;
const TOTAL = IG + TT;
const AZUL = "#2f8cff";
const ROJO = "#fe2c55";

/** Las dos tribunas, una al lado de la otra, con su red y sus hinchas. */
const DosClubes: React.FC<{ frame: number; enter: number; glowIg: number; glowTt: number; merge: number }> = ({ frame, enter, glowIg, glowTt, merge }) => (
  <>
    {[
      { red: "INSTAGRAM", n: IG, color: AZUL, glow: glowIg, side: -1 },
      { red: "TIKTOK", n: TT, color: ROJO, glow: glowTt, side: 1 },
    ].map((c) => (
      <div
        key={c.red}
        style={{
          position: "absolute",
          left: c.side < 0 ? 30 : 550,
          top: 470,
          width: 500,
          translate: `${c.side * (mix(enter, 700, 0) - merge * 260)}px 0px`,
          opacity: 1 - merge,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Panel glow={c.color} style={{ padding: "10px 22px", boxShadow: c.glow > 0 ? `0 0 ${50 * c.glow}px ${c.color}` : undefined }}>
          <Label size={36} color={c.color === ROJO ? "#ff6f8a" : "#7cb8ff"}>
            {c.red}
          </Label>
        </Panel>
        <div style={{ borderRadius: 30, overflow: "hidden", border: `3px solid ${c.color}${c.glow > 0.5 ? "" : "66"}` }}>
          <Potrero hinchas={c.n} frame={frame} width={500} />
        </div>
        <Label size={60} mono color={C.white}>
          {c.n}
        </Label>
        <Label size={26} color={C.dim}>
          HINCHAS
        </Label>
      </div>
    ))}
  </>
);

export const H1Atencion: React.FC = () => {
  const frame = useCurrentFrame();
  const clubes = wordAt("atencion", "clubes");
  const enter = ramp(frame, 0, 16, easeOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [2, clubes], 14) }}>
        <Background tint="#0d2a1a" />
        <DosClubes frame={frame} enter={enter} glowIg={0} glowTt={0} merge={0} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", opacity: ramp(frame, clubes - 4, clubes + 6), scale: String(mix(ramp(frame, clubes - 4, clubes + 10, pop), 0.5, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
            <Label size={40} color={C.yellow}>
              2 CLUBES → 1
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
      <Audio from={2} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={clubes} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

export const H2Union: React.FC = () => {
  const frame = useCurrentFrame();
  const ig = wordAt("union", "instagram");
  const tt = wordAt("union", "tiktok");
  const uno = wordAt("union", "uno");
  const merge = ramp(frame, uno - 10, uno + 2, easeInOut);
  const big = ramp(frame, uno - 2, uno + 12, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [uno], 20) }}>
        <Background tint="#0d2a1a" />
        <DosClubes frame={frame} enter={1} glowIg={ramp(frame, ig - 2, ig + 6) * (1 - ramp(frame, tt - 2, tt + 6))} glowTt={ramp(frame, tt - 2, tt + 6)} merge={merge} />
        {big > 0 ? (
          <>
            <div style={{ position: "absolute", left: 60, top: 440, opacity: Math.min(1, big), scale: String(mix(big, 0.6, 1)) }}>
              <Potrero hinchas={TOTAL} frame={frame} width={960} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 340, display: "flex", justifyContent: "center", opacity: Math.min(1, big) }}>
              <Panel glow={TEAL} style={{ padding: "12px 28px", display: "flex", alignItems: "baseline", gap: 14 }}>
                <Label size={44} mono color="#7cb8ff">
                  {IG}
                </Label>
                <Label size={40} mono color={C.dim}>
                  +
                </Label>
                <Label size={44} mono color="#ff6f8a">
                  {TT}
                </Label>
                <Label size={40} mono color={C.dim}>
                  =
                </Label>
                <Label size={72} mono color={TEAL}>
                  {TOTAL}
                </Label>
                <Label size={34} color={C.white}>
                  HINCHAS
                </Label>
              </Panel>
            </div>
          </>
        ) : null}
      </AbsoluteFill>
      <Flash at={uno} color={C.yellow} length={10} peak={0.35} />
      <Audio from={ig} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tt} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={uno - 8} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={uno} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

/** Un celular con el perfil y el botón "Seguir" del color de cada red. */
const PerfilPhone: React.FC<{ red: string; color: string; followed: boolean; press: number }> = ({ red, color, followed, press }) => (
  <Phone width={210} ui={0}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 30 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 18, color: color === ROJO ? "#ff6f8a" : "#7cb8ff", letterSpacing: 1 }}>{red}</div>
      <Img src={staticFile("logo.png")} style={{ width: 90, height: 90, borderRadius: "50%", border: `3px solid ${TEAL}` }} />
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, color: C.white }}>@nadietelo.explico</div>
      <div style={{ marginTop: 10, width: 140, height: 44, borderRadius: 12, background: followed ? "rgba(255,255,255,0.16)" : color, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 - press * 0.08), fontFamily: DISPLAY, fontWeight: 900, fontSize: 22, color: C.white }}>
        {followed ? "Siguiendo" : "Seguir"}
      </div>
    </div>
  </Phone>
);

const PHONES = [
  { red: "INSTAGRAM", color: AZUL, x: 90 },
  { red: "TIKTOK", color: ROJO, x: 780 },
];
const BTN_Y = 840 + 210 * 2.05 * 0.62;

export const H3Sumas: React.FC = () => {
  const frame = useCurrentFrame();
  const taps = [wordAt("sumas", "sigas", 0) + 4, wordAt("sumas", "sigas", 1) + 4];
  const cancha = wordAt("sumas", "cancha");
  const sumados = taps.filter((t) => frame >= t + 18).length;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, taps, 10) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 90, top: 300 }}>
          <Potrero hinchas={TOTAL + sumados} frame={frame} width={900} />
        </div>
        <div style={{ position: "absolute", left: 60, top: 250 }}>
          <Panel glow={TEAL} style={{ padding: "8px 22px" }}>
            <Label size={40} mono color={TEAL}>
              {TOTAL + sumados} / 100
            </Label>
          </Panel>
        </div>
        {PHONES.map((p, i) => {
          const t = taps[i];
          const press = ramp(frame, t, t + 3) - ramp(frame, t + 3, t + 10);
          const fly = ramp(frame, t + 4, t + 20, easeInOut);
          const cx = p.x + 105;
          return (
            <React.Fragment key={p.red}>
              <div style={{ position: "absolute", left: p.x, top: 840, rotate: i === 0 ? "-6deg" : "6deg" }}>
                <PerfilPhone red={p.red} color={p.color} followed={frame >= t + 2} press={press} />
              </div>
              {fly > 0 && fly < 1 ? (
                <div style={{ position: "absolute", left: mix(fly, cx, 540) - 30, top: mix(fly, BTN_Y, 600) - 180 * Math.sin(fly * Math.PI) - 30, scale: String(mix(fly, 1.5, 0.8)) }}>
                  <svg width={60} height={70} viewBox="-30 -50 60 70">
                    <rect x={-16} y={-22} width={32} height={34} rx={12} fill={C.yellow} />
                    <circle cx={0} cy={-36} r={14} fill={C.yellow} />
                  </svg>
                </div>
              ) : null}
              <div
                style={{
                  position: "absolute",
                  left: cx - 150,
                  top: BTN_Y - 6,
                  transformOrigin: "50% 0%",
                  rotate: "-20deg",
                  translate: `${mix(ramp(frame, t - 12, t, easeOut), 380, 0) + ramp(frame, t + 8, t + 20, easeInOut) * 700}px ${mix(ramp(frame, t - 12, t, easeOut), 700, 0) + ramp(frame, t + 8, t + 20, easeInOut) * 1100}px`,
                  scale: String(1 - press * 0.04),
                  opacity: frame > t - 14 && frame < t + 22 ? 1 : 0,
                }}
              >
                <Finger width={260} rim={0.5} />
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", opacity: ramp(frame, cancha - 4, cancha + 6), scale: String(mix(ramp(frame, cancha - 4, cancha + 10, pop), 0.5, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 22px" }}>
            <Label size={34} color={C.yellow}>
              LA MISMA CANCHA
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      {taps.map((t) => (
        <React.Fragment key={t}>
          <Audio from={t - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
          <Audio from={t + 18} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

export const H4Doble: React.FC = () => {
  const frame = useCurrentFrame();
  const dos = wordAt("doble", "dos");
  const doble = wordAt("doble", "doble");
  const lines = ramp(frame, dos - 4, dos + 10, easeInOut);
  const stamp = ramp(frame, doble - 2, doble + 10, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [doble], 18) }}>
        <Background tint="#2a2205" />
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          {[195, 885].map((x) => (
            <path key={x} d={`M ${x} 760 Q ${(x + 540) / 2} 560 540 600`} fill="none" stroke={C.yellow} strokeWidth={8} strokeDasharray="16 12" pathLength={1} opacity={lines} />
          ))}
        </svg>
        {PHONES.map((p, i) => (
          <div key={p.red} style={{ position: "absolute", left: p.x, top: 760, rotate: i === 0 ? "-6deg" : "6deg", scale: String(mix(ramp(frame, i * 4, 12 + i * 4, pop), 0.6, 1)) }}>
            <PerfilPhone red={p.red} color={p.color} followed press={0} />
          </div>
        ))}
        {/* Vos, grande, en el medio */}
        <div style={{ position: "absolute", left: 540 - 110, top: 380, scale: String(mix(ramp(frame, 0, 12, pop), 0.5, 1)) }}>
          <svg width={220} height={260} viewBox="-60 -110 120 140" style={{ overflow: "visible", filter: `drop-shadow(0 0 30px ${C.yellow}88)` }}>
            <rect x={-40} y={-48} width={80} height={76} rx={28} fill={C.yellow} />
            <circle cx={0} cy={-78} r={30} fill={C.yellow} />
          </svg>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
            <Label size={44} color={C.yellow}>
              VOS
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 650, top: 360, opacity: stamp, scale: String(mix(stamp, 2.2, 1)), rotate: "-8deg" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 170, color: C.yellow, textShadow: `0 0 60px ${C.yellow}aa, 0 8px 0 #7a5a00`, lineHeight: 1 }}>×2</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: ramp(frame, doble + 4, doble + 12) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 24px" }}>
            <Label size={36} color={C.yellow}>
              EN LAS DOS = 2 HINCHAS
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={doble} color={C.yellow} length={10} peak={0.3} />
      <Audio from={dos} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={doble} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

const PRIMERO = fixture[0].partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as { local: string; visitante: string };

export const H5Manana: React.FC = () => {
  const frame = useCurrentFrame();
  const fecha = wordAt("manana", "fecha");
  const todos = wordAt("manana", "todos");
  const card = ramp(frame, 0, 14, pop);
  const crowd = ramp(frame, todos - 2, todos + 10, pop);
  const rival = PRIMERO.local === NUESTRO ? PRIMERO.visitante : PRIMERO.local;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [todos], 14) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 70, right: 70, top: 340, opacity: card, translate: `0px ${mix(card, 160, 0)}px` }}>
          <Panel glow={C.yellow} style={{ padding: "28px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Label size={32} color={C.yellow} style={{ opacity: ramp(frame, fecha - 4, fecha + 4) }}>
                MAÑANA · FECHA 1
              </Label>
              <Label size={30} color={TEAL}>
                {PRIMERO.local === NUESTRO ? "DE LOCAL" : "DE VISITANTE"}
              </Label>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Crest team={equipo(NUESTRO)} size={150} blank />
                <Label size={30} color={C.yellow}>
                  CLUB ???
                </Label>
              </div>
              <Label size={70} color={C.dim}>
                VS
              </Label>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Crest team={equipo(rival)} size={150} />
                <Label size={30} color={C.white}>
                  {equipo(rival).corto}
                </Label>
              </div>
            </div>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 840, display: "flex", justifyContent: "center", opacity: crowd, scale: String(mix(crowd, 1.8, 1)) }}>
          <Panel glow={TEAL} style={{ padding: "14px 30px", display: "flex", alignItems: "baseline", gap: 16 }}>
            <Label size={84} mono color={TEAL}>
              {TOTAL}
            </Label>
            <Label size={38} color={C.white}>
              HINCHAS EMPUJANDO
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", opacity: ramp(frame, todos + 6, todos + 16) }}>
          <Label size={30} color={C.dim}>
            @nadietelo.explico · Instagram + TikTok
          </Label>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={todos} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
    </AbsoluteFill>
  );
};
