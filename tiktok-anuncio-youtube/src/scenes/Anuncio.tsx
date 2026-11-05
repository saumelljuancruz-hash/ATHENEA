import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Finger } from "../components/Finger";
import { Icono, ROJO_YT } from "../components/Iconos";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp } from "../components/anim";
import { Background, Flash, Label, Panel, shake } from "../components/Ui";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const ROJO_TT = "#fe2c55";

/** El dedo gigante que toca un punto y se va. */
const Dedo: React.FC<{ frame: number; at: number; x: number; y: number; leave: number; desde?: number }> = ({ frame, at, x, y, leave, desde = 10 }) => {
  const press = ramp(frame, at, at + 3) - ramp(frame, at + 3, at + 10);
  if (frame < at - desde - 2 || frame > leave + 12) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 4,
        transformOrigin: "50% 0%",
        rotate: "-24deg",
        translate: `${mix(ramp(frame, at - desde, at, easeOut), 420, 0) + ramp(frame, leave, leave + 10, easeInOut) * 900}px ${mix(ramp(frame, at - desde, at, easeOut), 700, 0) + ramp(frame, leave, leave + 10, easeInOut) * 1500}px`,
        scale: String(1 - press * 0.04),
      }}
    >
      <Finger width={300} rim={0.5} />
    </div>
  );
};

/** Candado que se abre (0 cerrado → 1 abierto). */
const Candado: React.FC<{ size: number; abierto: number }> = ({ size, abierto }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${20 + abierto * 40}px ${C.yellow})` }}>
    <path d={`M 28 ${52 - abierto * 22} V ${32 - abierto * 22} A 22 22 0 0 1 72 ${32 - abierto * 22} V ${40 - abierto * 6}`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
    <rect x={16} y={50} width={68} height={60} rx={12} fill="#1d2433" stroke={C.yellow} strokeWidth={7} />
    <circle cx={50} cy={76} r={7} fill={C.yellow} />
    <rect x={47} y={78} width={6} height={16} rx={3} fill={C.yellow} />
  </svg>
);

export const A1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const video = wordAt("gancho", "video");
  const tap = 6;
  const abre = ramp(frame, video - 4, video + 8, pop);
  const temblor = (1 - abre) * Math.sin(frame * 2.2) * 6;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, video], 18) }}>
        <Background tint="#2a2205" />
        <div style={{ position: "absolute", left: 540 - 170, top: 420, rotate: `${temblor}deg`, scale: String(mix(ramp(frame, 0, 12, easeOut), 1.3, 1)) }}>
          <Candado size={340} abierto={abre} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", opacity: abre }}>
          {new Array(10).fill(0).map((_, i) => {
            const a = (i / 10) * Math.PI * 2;
            const d = mix(abre, 40, 320);
            return <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * d - 8, top: 260 + Math.sin(a) * d, width: 16, height: 16, borderRadius: "50%", background: i % 2 ? C.yellow : TEAL, opacity: 1 - ramp(frame, video + 10, video + 24) }} />;
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", opacity: ramp(frame, 14, 22) }}>
          <Label size={56} color={C.yellow}>
            NOTICIA
          </Label>
        </div>
      </AbsoluteFill>
      <Dedo frame={frame} at={tap} x={560} y={720} leave={tap + 14} desde={6} />
      <Flash at={video} color={C.yellow} length={8} peak={0.3} />
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={video} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const A2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const youtube = wordAt("intro", "youtube");
  const logo = ramp(frame, 0, 14, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [youtube], 16) }}>
        <Background tint="#0c2a2e" />
        <div style={{ position: "absolute", left: 540 - 170, top: 330, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", border: `6px solid ${TEAL}`, boxShadow: `0 0 80px ${TEAL}66`, opacity: logo, scale: String(mix(logo, 0.3, 1)) }}>
          <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 710, display: "flex", flexDirection: "column", alignItems: "center", opacity: logo }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, lineHeight: 1, color: C.white, letterSpacing: -2 }}>NADIE TE LO</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, lineHeight: 1, color: C.yellow, letterSpacing: -2, textShadow: `0 0 40px ${C.yellow}66` }}>EXPLICÓ</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 980, display: "flex", justifyContent: "center", opacity: ramp(frame, youtube - 4, youtube + 6), scale: String(mix(ramp(frame, youtube - 4, youtube + 12, pop), 1.8, 1)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "16px 34px", borderRadius: 26, background: ROJO_YT, boxShadow: `0 0 50px ${ROJO_YT}88` }}>
            <svg width={50} height={50} viewBox="0 0 50 50">
              <path d="M 16 10 L 40 25 L 16 40 Z" fill="#fff" />
            </svg>
            <Label size={52} color="#ffffff">
              AHORA EN YOUTUBE
            </Label>
          </div>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={youtube} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const A3Cuerpo: React.FC = () => {
  const frame = useCurrentFrame();
  const largos = wordAt("cuerpo", "largos");
  const historia = wordAt("cuerpo", "historia");
  const estira = ramp(frame, largos - 10, largos + 16, easeInOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [largos], 12) }}>
        <Background tint="#2a0e14" />
        <div style={{ position: "absolute", left: 90, top: 480, display: "flex", flexDirection: "column", gap: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, opacity: ramp(frame, 4, 14) }}>
            <div style={{ width: 140, height: 50, borderRadius: 25, background: TEAL, boxShadow: `0 0 30px ${TEAL}` }} />
            <Label size={42} color={TEAL}>
              LOS DE SIEMPRE · &lt; 1 MIN
            </Label>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ width: mix(estira, 140, 900), height: 50, borderRadius: 25, background: `linear-gradient(90deg, ${ROJO_YT}, #ff8a9a)`, boxShadow: `0 0 40px ${ROJO_YT}`, opacity: ramp(frame, largos - 14, largos - 6) }} />
            <Label size={54} color="#ff8a9a" style={{ opacity: estira }}>
              VIDEOS LARGOS · 10+ MIN
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 920, display: "flex", justifyContent: "center", opacity: ramp(frame, historia - 4, historia + 8), scale: String(mix(ramp(frame, historia - 4, historia + 12, pop), 0.5, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
            <Label size={44} color={C.yellow}>
              LA HISTORIA COMPLETA
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={largos - 8} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={historia} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const A4Bucle: React.FC = () => {
  const frame = useCurrentFrame();
  const miente = wordAt("bucle", "miente");
  const card = ramp(frame, 0, 14, pop);
  const lock = ramp(frame, miente + 10, miente + 22, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [miente], 14) }}>
        <Background tint="#1a1030" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: ramp(frame, 0, 10) }}>
          <Panel glow={ROJO_YT} style={{ padding: "8px 24px" }}>
            <Label size={38} color="#ff8a9a">
              1.ER VIDEO · YA EN YOUTUBE
            </Label>
          </Panel>
        </div>
        {/* Miniatura del primer video */}
        <div style={{ position: "absolute", left: 90, right: 90, top: 360, opacity: card, scale: String(mix(card, 0.7, 1)) }}>
          <div style={{ position: "relative", height: 500, borderRadius: 28, overflow: "hidden", background: "radial-gradient(70% 60% at 50% 45%, #2a3a55, #080b12)", border: "3px solid rgba(255,255,255,0.2)" }}>
            <div style={{ position: "absolute", left: 300, top: 60, width: 300, height: 380, borderRadius: 40, border: "8px solid #2a3245", background: "#0b0f17" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 190, display: "flex", justifyContent: "center", rotate: "-10deg", opacity: ramp(frame, miente - 4, miente + 4) }}>
              <div style={{ padding: "8px 26px", border: `8px solid ${C.positive}`, borderRadius: 20, fontFamily: DISPLAY, fontWeight: 900, fontSize: 90, color: C.positive, background: "rgba(0,0,0,0.5)" }}>¿MENTIRA?</div>
            </div>
            <div style={{ position: "absolute", right: 24, bottom: 20, padding: "4px 12px", borderRadius: 8, background: "rgba(0,0,0,0.7)", fontFamily: MONO, fontWeight: 800, fontSize: 28, color: C.white }}>0:45</div>
            {/* La respuesta queda bloqueada: hay que verla en YouTube */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(3,5,11,0.6)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, opacity: lock }}>
              <Icono tipo="play" size={150} color={ROJO_YT} />
              <Label size={40} color={C.white}>
                LA RESPUESTA ESTÁ EN YOUTUBE
              </Label>
            </div>
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 40, color: C.white, marginTop: 20, lineHeight: 1.2 }}>Tu celular te miente cada vez que sacás una foto</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, color: C.dim, marginTop: 8 }}>Nadie Te Lo Explicó</div>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={miente} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={miente + 10} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

const PERFIL = { x: 300, y: 300, w: 480 };

export const A5Final: React.FC = () => {
  const frame = useCurrentFrame();
  const [, toca] = beats("final");
  const perfil = wordAt("final", "perfil");
  const foto = wordAt("final", "foto") + 4;
  const link = wordAt("final", "link", 1) + 4;
  const suscribite = wordAt("final", "suscribite");
  const telefono = ramp(frame, 0, 14, pop);
  const marca = ramp(frame, perfil - 4, perfil + 8, pop);
  const sub = ramp(frame, suscribite - 4, suscribite + 8, pop);
  const avatar = { x: PERFIL.x + PERFIL.w / 2, y: PERFIL.y + 150 };
  const fila = { x: PERFIL.x + PERFIL.w / 2, y: PERFIL.y + 560 };
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [perfil, foto, link], 10) }}>
        <Background tint="#0c1a3a" />
        {/* Un perfil genérico, como el de tu cuenta */}
        <div style={{ position: "absolute", left: PERFIL.x, top: PERFIL.y, width: PERFIL.w, height: 900, borderRadius: 60, background: "#0b0f17", border: "12px solid #2a3245", boxShadow: "0 40px 90px rgba(0,0,0,0.7)", opacity: telefono, scale: String(mix(telefono, 0.7, 1)), display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60, gap: 14, boxSizing: "border-box" }}>
          <div style={{ width: 150, height: 150, borderRadius: "50%", overflow: "hidden", border: `4px solid ${frame >= foto ? C.yellow : TEAL}`, scale: String(1 + (ramp(frame, foto, foto + 3) - ramp(frame, foto + 3, foto + 10)) * 0.1) }}>
            <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%" }} />
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 32, color: C.white }}>Nadie Te Lo Explicó</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, color: C.dim }}>@nadietelo.explico</div>
          <div style={{ display: "flex", gap: 30, marginTop: 6 }}>
            {[
              ["1.175", "Seguidores"],
              ["Seguir", ""],
            ].map(([a, b]) =>
              b ? (
                <div key={a} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.white }}>{a}</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 20, color: C.dim }}>{b}</div>
                </div>
              ) : (
                <div key={a} style={{ padding: "10px 34px", borderRadius: 10, background: ROJO_TT, fontFamily: DISPLAY, fontWeight: 900, fontSize: 26, color: C.white, alignSelf: "center" }}>
                  {a}
                </div>
              ),
            )}
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,0.8)", textAlign: "center", padding: "0 30px", lineHeight: 1.35, marginTop: 10 }}>Cómo funcionan las cosas que usás todos los días</div>
          {/* El link del perfil */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, padding: "10px 18px", borderRadius: 14, background: marca > 0.5 ? "rgba(255,225,77,0.15)" : "transparent", border: `3px solid ${marca > 0.5 ? C.yellow : "transparent"}`, boxShadow: marca > 0.5 ? `0 0 30px ${C.yellow}66` : "none", scale: String(1 + marca * 0.08 + (ramp(frame, link, link + 3) - ramp(frame, link + 3, link + 10)) * 0.08) }}>
            <svg width={28} height={28} viewBox="0 0 28 28">
              <path d="M 12 16 L 16 12 M 10 9 L 13 6 A 4.5 4.5 0 0 1 22 15 L 19 18 M 18 19 L 15 22 A 4.5 4.5 0 0 1 6 13 L 9 10" fill="none" stroke={C.yellow} strokeWidth={3} strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 22, color: C.yellow }}>youtube.com/@nadietelo.explico</div>
          </div>
          {/* Lo que se abre al tocar el link */}
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: sub, scale: String(mix(sub, 0.5, 1)) }}>
            <Icono tipo="play" size={90} color={ROJO_YT} />
            <div style={{ padding: "14px 44px", borderRadius: 40, background: ROJO_YT, fontFamily: DISPLAY, fontWeight: 900, fontSize: 32, color: C.white, boxShadow: `0 0 40px ${ROJO_YT}aa` }}>Suscribirse</div>
          </div>
        </div>
        {/* Flecha que señala el link */}
        <svg width={1080} height={1920} style={{ position: "absolute", opacity: marca * (1 - ramp(frame, toca, toca + 8)) }}>
          <path d={`M 160 ${fila.y + 140} C 160 ${fila.y + 40} 200 ${fila.y} ${PERFIL.x + 20} ${fila.y}`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" />
          <path d={`M ${PERFIL.x - 10} ${fila.y - 22} L ${PERFIL.x + 24} ${fila.y} L ${PERFIL.x - 10} ${fila.y + 22}`} fill="none" stroke={C.yellow} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", left: 40, top: fila.y + 160, opacity: marca * (1 - ramp(frame, toca, toca + 8)) }}>
          <Label size={40} color={C.yellow}>
            EL LINK
          </Label>
        </div>
      </AbsoluteFill>
      <Dedo frame={frame} at={foto} x={avatar.x + 10} y={avatar.y + 20} leave={foto + 10} />
      <Dedo frame={frame} at={link} x={fila.x + 60} y={fila.y + 10} leave={link + 14} />
      <Flash at={suscribite} color={ROJO_YT} length={8} peak={0.25} />
      <Audio from={perfil} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={foto - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={link - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={suscribite} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
    </AbsoluteFill>
  );
};

export const A6Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const seguime = wordAt("cta", "seguime");
  const ntle = wordAt("cta", "ntle");
  const tap = seguime + 8;
  const followed = frame >= tap + 2;
  const crest = ramp(frame, ntle - 10, ntle + 6, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, ntle], 12) }}>
        <Background tint="#0c1a3a" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", opacity: ramp(frame, 0, 10) }}>
          <div style={{ width: 460, height: 110, borderRadius: 30, background: followed ? "rgba(255,255,255,0.14)" : ROJO_TT, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, scale: String(1 - (ramp(frame, tap, tap + 3) - ramp(frame, tap + 3, tap + 10)) * 0.08), boxShadow: followed ? "none" : `0 0 40px ${ROJO_TT}aa` }}>
            {followed ? (
              <svg width={44} height={44} viewBox="0 0 44 44">
                <path d="M 8 23 L 18 33 L 37 11" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
            <Label size={50}>{followed ? "Siguiendo" : "Seguir"}</Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 540 - 160, top: 520, opacity: crest, scale: String(mix(crest, 0.3, 1)), filter: "drop-shadow(0 0 40px #2050f3)" }}>
          <Img src={staticFile("club/escudo-ntle.png")} style={{ width: 320, height: "auto" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", opacity: ramp(frame, ntle - 2, ntle + 8) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
            <Label size={42} color={C.yellow}>
              MAÑANA · FECHA 4
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Dedo frame={frame} at={tap} x={600} y={390} leave={tap + 16} />
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tap + 1} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={ntle} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
    </AbsoluteFill>
  );
};
