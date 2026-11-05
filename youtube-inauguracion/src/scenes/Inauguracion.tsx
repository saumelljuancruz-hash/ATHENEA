import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Finger } from "../components/Finger";
import { Icono, Japon, Persiana, ROJO_YT } from "../components/Iconos";
import { Phone, TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Flash, Label, Panel, shake } from "../components/Ui";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const PHONE = { w: 440, x: 540 - 220, y: 300 };
const SHUTTER = { x: 540, y: PHONE.y + PHONE.w * 2.05 - PHONE.w * 0.08 - PHONE.w * 0.1 };

/** El dedo gigante que toca un punto y se va. */
const Dedo: React.FC<{ frame: number; at: number; x: number; y: number; leave: number; desde?: number }> = ({ frame, at, x, y, leave, desde = 10 }) => {
  const press = ramp(frame, at, at + 3) - ramp(frame, at + 3, at + 10);
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

/** ¡CLIC! grande que sale del celular. */
const Clic: React.FC<{ show: number; size?: number; color?: string }> = ({ show, size = 150, color = C.white }) => (
  <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: size, color, opacity: show, scale: String(mix(show, 0.4, 1.1)), rotate: "-8deg", textShadow: `0 0 50px ${color}88` }}>¡CLIC!</div>
);

export const Y1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const miente = wordAt("gancho", "miente");
  const tap = 8;
  const stamp = ramp(frame, miente - 2, miente + 10, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, miente], 18) }}>
        <Background tint="#1a1030" />
        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, scale: String(mix(ramp(frame, 0, 20, easeOut), 1.12, 1)) }}>
          <Phone width={PHONE.w} ui={1}>
            <div style={{ width: PHONE.w, height: PHONE.w * 2.05, background: "radial-gradient(60% 40% at 50% 40%, #2a3a55, #080b12)" }}>
              {/* Marco de enfoque */}
              <svg width={PHONE.w} height={PHONE.w * 1.4} viewBox="0 0 440 616" style={{ position: "absolute", top: 80 }}>
                <path d="M 120 200 V 170 H 150 M 290 170 H 320 V 200 M 320 380 V 410 H 290 M 150 410 H 120 V 380" fill="none" stroke={C.yellow} strokeWidth={6} />
              </svg>
            </div>
          </Phone>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
          <Clic show={window01(frame, tap, miente - 4, 3, 6)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", opacity: stamp, scale: String(mix(stamp, 2.2, 1)), rotate: "-10deg" }}>
          <div style={{ padding: "14px 36px", border: `10px solid ${C.positive}`, borderRadius: 24, fontFamily: DISPLAY, fontWeight: 900, fontSize: 120, color: C.positive, textShadow: `0 0 40px ${C.positive}88`, background: "rgba(0,0,0,0.4)" }}>¿MENTIRA?</div>
        </div>
      </AbsoluteFill>
      <Dedo frame={frame} at={tap} x={SHUTTER.x + 20} y={SHUTTER.y + 30} leave={tap + 14} desde={8} />
      <Flash at={tap} color="#ffffff" length={8} peak={0.7} />
      <Audio from={tap} src={staticFile("sfx/obturador.wav")} volume={SFX.obturador} />
      <Audio from={miente} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const Y2Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const [, antes] = beats("intro");
  const final = wordAt("intro", "final");
  const youtube = wordAt("intro", "youtube");
  const promesa = window01(frame, 0, antes - 4, 6, 8);
  const logo = ramp(frame, antes - 2, antes + 14, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [youtube], 14) }}>
        <Background tint="#0c2a2e" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: promesa, scale: String(mix(ramp(frame, 0, 10, pop), 0.6, 1)) }}>
          <Label size={70} color={C.yellow}>
            TE LO MUESTRO
          </Label>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 140, color: C.white, textShadow: `0 0 40px ${C.yellow}55`, opacity: ramp(frame, final - 4, final + 4) }}>AL FINAL ↓</div>
        </div>
        <div style={{ position: "absolute", left: 540 - 170, top: 360, width: 340, height: 340, borderRadius: "50%", overflow: "hidden", border: `6px solid ${TEAL}`, boxShadow: `0 0 80px ${TEAL}66`, opacity: logo, scale: String(mix(logo, 0.3, 1)) }}>
          <Img src={staticFile("logo.png")} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, opacity: logo }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, lineHeight: 1, color: C.white, letterSpacing: -2 }}>NADIE TE LO</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, lineHeight: 1, color: C.yellow, letterSpacing: -2, textShadow: `0 0 40px ${C.yellow}66` }}>EXPLICÓ</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", opacity: ramp(frame, youtube - 4, youtube + 6), scale: String(mix(ramp(frame, youtube - 4, youtube + 12, pop), 1.8, 1)) }}>
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
      <Audio from={final} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={antes} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={youtube} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

const ADELANTOS = [
  { tipo: "rayo", color: C.yellow, dato: "300.000.000 V", pregunta: "¿POR QUÉ?" },
  { tipo: "espejo", color: TEAL, dato: "TU CARA AL REVÉS", pregunta: "¿POR QUÉ?" },
  { tipo: "moneda", color: "#f7931a", dato: "US$ 6.300 M · 20 MIN", pregunta: "¿CÓMO?" },
];

export const Y3Cuerpo1: React.FC = () => {
  const frame = useCurrentFrame();
  const [, s2, s3, s4] = beats("cuerpo1");
  const dias = wordAt("cuerpo1", "días");
  const tiempos = [s2, s3, s4];
  const partA = window01(frame, 0, s2 - 6, 1, 8);
  const cosas = ["celular", "wifi", "cargador", "lupa", "espejo", "rayo"];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, tiempos, 10) }}>
        <Background tint="#101a30" />
        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 120, right: 120, top: 380, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 70 }}>
              {cosas.map((c, i) => {
                const show = ramp(frame, 6 + i * 6, 16 + i * 6, pop);
                return (
                  <div key={c} style={{ opacity: show, scale: String(mix(show, 0.3, 1)), rotate: `${(random(`r${i}`) - 0.5) * 20}deg` }}>
                    <Icono tipo={c} size={190} color={i % 2 ? C.yellow : TEAL} />
                  </div>
                );
              })}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", opacity: ramp(frame, dias - 4, dias + 6) }}>
              <Panel glow={TEAL} style={{ padding: "10px 26px" }}>
                <Label size={42} color={TEAL}>
                  LO QUE USÁS TODOS LOS DÍAS
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
        {ADELANTOS.map((a, i) => {
          const at = tiempos[i];
          const fin = tiempos[i + 1] ?? 417;
          const entra = ramp(frame, at - 6, at + 8, easeOut);
          const sale = ramp(frame, fin - 6, fin + 4, easeInOut);
          if (entra <= 0 || sale >= 1) {
            return null;
          }
          return (
            <div key={a.tipo} style={{ position: "absolute", left: 90, right: 90, top: 330, translate: `${mix(entra, 900, 0) - sale * 1100}px 0px`, rotate: `${(1 - entra) * 8}deg` }}>
              <Panel glow={a.color} style={{ padding: "40px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
                <Icono tipo={a.tipo} size={300} color={a.color} grosor={5} />
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 62, color: C.white }}>{a.dato}</div>
                <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 110, color: a.color, textShadow: `0 0 40px ${a.color}88` }}>{a.pregunta}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 20px", borderRadius: 20, background: "rgba(255,31,61,0.15)", border: `2px solid ${ROJO_YT}` }}>
                  <svg width={30} height={30} viewBox="0 0 50 50">
                    <path d="M 16 10 L 40 25 L 16 40 Z" fill={ROJO_YT} />
                  </svg>
                  <Label size={30} color="#ff8a9a">
                    VIDEO YA EN EL CANAL
                  </Label>
                </div>
              </Panel>
            </div>
          );
        })}
      </AbsoluteFill>
      <Audio from={6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      {tiempos.map((t) => (
        <Audio key={t} from={t - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      ))}
      {tiempos.map((t) => (
        <Audio key={`d${t}`} from={t + 40} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      ))}
    </AbsoluteFill>
  );
};

export const Y4Bucle1: React.FC = () => {
  const frame = useCurrentFrame();
  const minuto = wordAt("bucle1", "minuto");
  const roto = ramp(frame, minuto - 2, minuto + 8, easeOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [minuto], 20) }}>
        <Background tint="#2a0e14" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
          <div style={{ position: "relative", fontFamily: MONO, fontWeight: 800, fontSize: 260, color: C.white, opacity: 1 - roto * 0.6, scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1)) }}>
            0:59
            <div style={{ position: "absolute", left: -20, right: -20, top: "50%", height: 22, background: C.positive, rotate: "-12deg", scale: `${roto} 1`, borderRadius: 11 }} />
          </div>
        </div>
      </AbsoluteFill>
      <Audio from={minuto} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const Y5Cuerpo2: React.FC = () => {
  const frame = useCurrentFrame();
  const largos = wordAt("cuerpo2", "largos");
  const historia = wordAt("cuerpo2", "historia");
  const estira = ramp(frame, largos - 10, largos + 16, easeInOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [largos], 12) }}>
        <Background tint="#2a0e14" />
        <div style={{ position: "absolute", left: 90, top: 520, display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 140, height: 46, borderRadius: 23, background: TEAL, boxShadow: `0 0 30px ${TEAL}` }} />
            <Label size={40} color={TEAL}>
              SHORTS · &lt; 1 MIN
            </Label>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ width: mix(estira, 140, 900), height: 46, borderRadius: 23, background: `linear-gradient(90deg, ${ROJO_YT}, #ff8a9a)`, boxShadow: `0 0 40px ${ROJO_YT}` }} />
            <Label size={52} color="#ff8a9a" style={{ opacity: estira }}>
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

export const Y6Bucle2: React.FC = () => {
  const frame = useCurrentFrame();
  const mentira = wordAt("bucle2", "mentira");
  const zoom = ramp(frame, 0, 63, (t) => t * t);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [mentira], 16) }}>
        <Background tint="#1a1030" />
        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, transformOrigin: `220px ${PHONE.w * 0.09}px`, scale: String(mix(zoom, 1, 4)) }}>
          <Phone width={PHONE.w} ui={0} lensGlow={ramp(frame, mentira - 4, mentira + 6)}>
            <div style={{ width: PHONE.w, height: PHONE.w * 2.05, background: "radial-gradient(60% 40% at 50% 40%, #2a3a55, #080b12)" }} />
          </Phone>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", opacity: ramp(frame, mentira - 4, mentira + 6) }}>
          <Label size={80} color={C.yellow}>
            AHORA SÍ
          </Label>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={mentira} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const Y7Final: React.FC = () => {
  const frame = useCurrentFrame();
  const [, persiana, japon] = beats("final");
  const clic = wordAt("final", "clic");
  const grabacion = wordAt("final", "grabación");
  const apagarlo = wordAt("final", "apagarlo");
  const partA = window01(frame, 0, persiana - 6, 6, 8);
  const partB = window01(frame, persiana - 4, japon - 6, 8, 8);
  const partC = ramp(frame, japon - 4, japon + 6);
  const tachar = ramp(frame, persiana + 40, persiana + 52, easeOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [clic, grabacion, apagarlo], 14) }}>
        <Background tint="#0c2a2e" />
        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 480, display: "flex", justifyContent: "center" }}>
              <Clic show={ramp(frame, clic - 6, clic + 4, pop)} size={200} color={C.yellow} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center", opacity: ramp(frame, clic + 14, clic + 24), scale: String(mix(ramp(frame, clic + 14, clic + 28, pop), 1.8, 1)), rotate: "-6deg" }}>
              <div style={{ padding: "10px 30px", border: `8px solid ${C.positive}`, borderRadius: 20, fontFamily: DISPLAY, fontWeight: 900, fontSize: 90, color: C.positive }}>ES FALSO</div>
            </div>
          </AbsoluteFill>
        ) : null}
        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            <div style={{ position: "absolute", left: 120, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative" }}>
                <Persiana size={320} cierre={0.5 + 0.5 * Math.sin(frame * 0.3)} />
                <svg width={320} height={320} viewBox="0 0 320 320" style={{ position: "absolute", left: 0, top: 0 }}>
                  <path d="M 30 30 L 290 290 M 290 30 L 30 290" stroke={C.positive} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tachar} />
                </svg>
              </div>
              <Label size={34} color={C.white}>
                PERSIANA DE CÁMARA
              </Label>
              <Label size={34} color={C.positive} style={{ opacity: tachar }}>
                TU CELULAR NO TIENE
              </Label>
            </div>
            <div style={{ position: "absolute", left: 600, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity: ramp(frame, grabacion - 20, grabacion - 6) }}>
              <Icono tipo="parlante" size={280} color={C.yellow} />
              <Label size={40} color={C.yellow}>
                ¡CLIC! = AUDIO
              </Label>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", opacity: ramp(frame, grabacion - 4, grabacion + 6), scale: String(mix(ramp(frame, grabacion - 4, grabacion + 12, pop), 1.6, 1)) }}>
              <Panel glow={C.yellow} style={{ padding: "12px 30px" }}>
                <Label size={52} color={C.yellow}>
                  ES UNA GRABACIÓN
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
        {partC > 0 ? (
          <AbsoluteFill style={{ opacity: partC }}>
            <div style={{ position: "absolute", left: 540 - 220, top: 340, scale: String(mix(ramp(frame, japon - 4, japon + 12, pop), 0.5, 1)) }}>
              <Japon width={440} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center", gap: 40, alignItems: "center" }}>
              <Icono tipo="parlante" size={200} color={C.white} />
              <div style={{ position: "relative", padding: "18px 30px", borderRadius: 26, background: "rgba(255,255,255,0.1)", border: "3px solid rgba(255,255,255,0.4)", opacity: ramp(frame, apagarlo - 20, apagarlo - 8) }}>
                <Label size={44} color={C.white}>
                  SILENCIAR
                </Label>
                <div style={{ position: "absolute", left: -10, right: -10, top: "48%", height: 12, background: C.positive, rotate: "-8deg", borderRadius: 6, scale: `${ramp(frame, apagarlo - 4, apagarlo + 6)} 1` }} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", opacity: ramp(frame, apagarlo - 2, apagarlo + 8), scale: String(mix(ramp(frame, apagarlo - 2, apagarlo + 12, pop), 1.6, 1)) }}>
              <Panel glow={C.positive} style={{ padding: "12px 30px" }}>
                <Label size={50} color={C.positive}>
                  NO SE PUEDE APAGAR
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={clic - 2} src={staticFile("sfx/obturador.wav")} volume={SFX.obturador} />
      <Audio from={clic + 16} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={persiana + 40} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={grabacion} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={japon} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={apagarlo} src={staticFile("sfx/obturador.wav")} volume={SFX.obturador} />
    </AbsoluteFill>
  );
};

export const Y8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const tap = wordAt("cta", "suscribite") + 8;
  const campanita = wordAt("cta", "campanita") + 4;
  const suscripto = frame >= tap + 2;
  const bell = ramp(frame, campanita, campanita + 4);
  const ring = frame >= campanita ? Math.sin((frame - campanita) * 1.2) * 18 * Math.exp(-(frame - campanita) / 20) : 0;
  const card = ramp(frame, 0, 14, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, campanita], 12) }}>
        <Background tint="#2a0e14" />
        <div style={{ position: "absolute", left: 90, right: 90, top: 380, opacity: card, translate: `0px ${mix(card, 200, 0)}px`, display: "flex", flexDirection: "column", alignItems: "center", padding: "50px 30px 46px", borderRadius: 48, background: "linear-gradient(160deg, rgba(40,24,40,0.95), rgba(10,6,12,0.95))", border: `2px solid ${ROJO_YT}55`, boxShadow: `0 0 60px ${ROJO_YT}33, 0 40px 80px rgba(0,0,0,0.6)` }}>
          <Img src={staticFile("logo.png")} style={{ width: 200, height: 200, borderRadius: "50%", border: `5px solid ${TEAL}`, boxShadow: `0 0 50px ${TEAL}55` }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 60, color: C.white, marginTop: 26 }}>Nadie Te Lo Explicó</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, color: C.dim, marginTop: 6 }}>@nadietelo.explico</div>
          <div style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 40 }}>
            <div style={{ width: 420, height: 110, borderRadius: 55, background: suscripto ? "rgba(255,255,255,0.14)" : ROJO_YT, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 - (ramp(frame, tap, tap + 3) - ramp(frame, tap + 3, tap + 10)) * 0.08), boxShadow: suscripto ? "none" : `0 0 40px ${ROJO_YT}aa` }}>
              <Label size={46}>{suscripto ? "Suscripto" : "Suscribirse"}</Label>
            </div>
            <div style={{ width: 110, height: 110, borderRadius: "50%", background: bell > 0.5 ? C.yellow : "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", rotate: `${ring}deg`, opacity: ramp(frame, tap + 4, tap + 12), boxShadow: bell > 0.5 ? `0 0 40px ${C.yellow}` : "none" }}>
              <Icono tipo="campana" size={70} color={bell > 0.5 ? "#1a1400" : C.white} grosor={7} />
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", opacity: ramp(frame, campanita + 6, campanita + 14) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
            <Label size={40} color={C.yellow}>
              TE AVISA CADA VIDEO NUEVO
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Dedo frame={frame} at={tap} x={430} y={860} leave={campanita - 14} />
      {frame >= campanita - 12 ? <Dedo frame={frame} at={campanita} x={820} y={860} leave={campanita + 24} /> : null}
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tap + 1} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={campanita - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={campanita + 1} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
