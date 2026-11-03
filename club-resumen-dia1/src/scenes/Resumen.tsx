import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Crest, equipo, NUESTRO, Potrero } from "../components/Futbol";
import { Finger } from "../components/Finger";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Flash, fmt, Label, Panel, shake } from "../components/Ui";
import fecha from "../liga/fecha.json";
import redes from "../liga/redes.json";
import { SEGUIR } from "../serie";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const HOY = redes.instagram + redes.tiktok;
const AYER = 912;
const AZUL_CLUB = "#2050f3";
const PARTIDO = fecha.partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as (typeof fecha.partidos)[number];
const RIVAL = PARTIDO.local === NUESTRO ? PARTIDO.visitante : PARTIDO.local;
const POSICION = fecha.tabla.findIndex((f) => f.id === NUESTRO) + 1;
const PROXIMO_RIVAL = fecha.proximo ? (fecha.proximo.local === NUESTRO ? fecha.proximo.visitante : fecha.proximo.local) : RIVAL;

/** Aro que late alrededor de un punto: para marcar los "me gusta" de las capturas. */
const Ring: React.FC<{ x: number; y: number; r: number; show: number; frame: number }> = ({ x, y, r, show, frame }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", border: `6px solid ${C.yellow}`, boxShadow: `0 0 30px ${C.yellow}`, opacity: show, scale: String(mix(show, 1.8, 1) * (1 + Math.sin(frame * 0.4) * 0.05)) }} />
);

const Check: React.FC<{ show: number; children: React.ReactNode }> = ({ show, children }) => (
  <div style={{ opacity: show, translate: `${mix(show, -120, 0)}px 0px`, display: "flex", alignItems: "center", gap: 18 }}>
    <svg width={54} height={54} viewBox="0 0 54 54">
      <circle cx={27} cy={27} r={25} fill={TEAL} />
      <path d="M 14 28 L 23 37 L 40 18" fill="none" stroke="#04231e" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <Label size={58} color={C.white}>
      {children}
    </Label>
  </div>
);

export const R1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const nombre = wordAt("gancho", "nombre");
  const escudo = wordAt("gancho", "escudo");
  const gano = wordAt("gancho", "ganó");
  const fly = ramp(frame, 0, 16, easeOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [15, gano], 18) }}>
        <Background tint="#0c1a3a" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", opacity: ramp(frame, 4, 12) }}>
          <Panel glow={C.yellow} style={{ padding: "8px 26px" }}>
            <Label size={40} mono color={C.yellow}>
              DÍA 1
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 540 - 190, top: 330, scale: String(mix(fly, 3.2, 1)), rotate: `${mix(fly, -40, 0)}deg`, filter: `blur(${(1 - fly) * 5}px)` }}>
          <Crest team={equipo(NUESTRO)} size={380} glow={0.6} />
        </div>
        <div style={{ position: "absolute", left: 230, top: 830, display: "flex", flexDirection: "column", gap: 24 }}>
          <Check show={ramp(frame, nombre - 4, nombre + 8, pop)}>NOMBRE</Check>
          <Check show={ramp(frame, escudo - 4, escudo + 8, pop)}>ESCUDO</Check>
          <Check show={ramp(frame, gano - 4, gano + 8, pop)}>
            GANÓ {NUESTRO === PARTIDO.local ? `${PARTIDO.gl}-${PARTIDO.gv}` : `${PARTIDO.gv}-${PARTIDO.gl}`}
          </Check>
        </div>
      </AbsoluteFill>
      <Flash at={15} color={AZUL_CLUB} length={10} peak={0.4} />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={15} src={staticFile("sfx/patada.wav")} volume={SFX.patada} />
      {[nombre, escudo].map((f) => (
        <Audio key={f} from={f} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      ))}
      <Audio from={gano} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
    </AbsoluteFill>
  );
};

export const R2Nombre: React.FC = () => {
  const frame = useCurrentFrame();
  const [, propuso] = beats("nombre");
  const fc = wordAt("nombre", "fc");
  const nadie = wordAt("nombre", "nadie");
  const likes = wordAt("nombre", "69");
  const c = redes.eligieron.nombre;
  const W = 960;
  const H = (W * c.alto) / c.ancho;
  const k = W / c.ancho;
  const letras = ["N", "T", "L", "E"];
  const palabras = ["NADIE", "TE", "LO", "EXPLICÓ"];
  const shot = ramp(frame, propuso - 10, propuso + 4, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [fc, likes], 12) }}>
        <Background tint="#0c1a3a" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: ramp(frame, fc - 4, fc + 6), scale: String(mix(ramp(frame, fc - 4, fc + 12, pop), 1.6, 1)) }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 170, color: C.white, letterSpacing: -4, textShadow: `0 0 60px ${AZUL_CLUB}` }}>
            FC <span style={{ color: C.yellow }}>NTLE</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 560, display: "flex", justifyContent: "center", gap: 18 }}>
          {letras.map((l, i) => {
            const show = ramp(frame, nadie - 6 + i * 6, nadie + 4 + i * 6, pop);
            return (
              <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: show, translate: `0px ${mix(show, 40, 0)}px` }}>
                <div style={{ width: 120, height: 120, borderRadius: 24, background: AZUL_CLUB, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 80, color: C.white, boxShadow: `0 0 30px ${AZUL_CLUB}` }}>{l}</div>
                <Label size={30} color={C.white}>
                  {palabras[i]}
                </Label>
              </div>
            );
          })}
        </div>
        {/* El comentario de verdad, con los "me gusta" marcados */}
        <div style={{ position: "absolute", left: 60, top: 860, opacity: shot, translate: `0px ${mix(shot, 200, 0)}px` }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: C.yellow, marginBottom: 12 }}>LO PROPUSO {c.autor}</div>
          <div style={{ position: "relative", width: W, height: H, borderRadius: 24, overflow: "hidden", border: `3px solid ${C.yellow}88` }}>
            <Img src={staticFile(c.imagen)} style={{ width: W, height: H, display: "block" }} />
          </div>
          <Ring x={945 * k} y={168 * k + 54} r={70} show={ramp(frame, likes - 4, likes + 8, pop)} frame={frame} />
        </div>
      </AbsoluteFill>
      <Audio from={fc} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      {letras.map((l, i) => (
        <Audio key={l} from={nadie + i * 6} src={staticFile("sfx/toque.wav")} volume={SFX.toque * 0.7} />
      ))}
      <Audio from={propuso - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={likes} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const R3Escudo: React.FC = () => {
  const frame = useCurrentFrame();
  const rami = wordAt("escudo", "rami");
  const likes = wordAt("escudo", "28");
  const c = redes.eligieron.escudo;
  const W = 660;
  const H = (W * c.alto) / c.ancho;
  const k = W / c.ancho;
  const shot = ramp(frame, 0, 12, pop);
  const big = ramp(frame, likes + 6, likes + 22, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [likes + 8], 14) }}>
        <Background tint="#0c1a3a" />
        <div style={{ position: "absolute", left: 210, top: 250, opacity: shot, scale: String(mix(shot, 0.6, 1)) }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: C.yellow, marginBottom: 12 }}>LO TRAJO {c.autor.toUpperCase()}</div>
          <div style={{ position: "relative", width: W, height: H, borderRadius: 24, overflow: "hidden", border: `3px solid ${C.yellow}88` }}>
            <Img src={staticFile(c.imagen)} style={{ width: W, height: H, display: "block" }} />
          </div>
          <Ring x={90 * k} y={85 * k + 54} r={50} show={window01(frame, rami - 4, likes - 6)} frame={frame} />
          <Ring x={945 * k} y={670 * k + 54} r={46} show={ramp(frame, likes - 4, likes + 8, pop)} frame={frame} />
        </div>
        <div style={{ position: "absolute", left: 540 - 170, top: 760, opacity: big, scale: String(mix(big, 0.3, 1)), rotate: `${mix(big, -20, 0)}deg` }}>
          <Crest team={equipo(NUESTRO)} size={340} glow={big} />
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={likes} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={likes + 8} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const R4Hinchada: React.FC = () => {
  const frame = useCurrentFrame();
  const sumamos = wordAt("hinchada", "sumamos");
  const cien = wordAt("hinchada", "100");
  const mil = wordAt("hinchada", "mil");
  const t = ramp(frame, sumamos - 4, mil + 2, easeInOut);
  const hinchas = Math.round(mix(t, AYER, HOY));
  const lleno = hinchas >= 1000;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [mil], 18) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 16, opacity: ramp(frame, 0, 10) }}>
          <Panel glow="#2f8cff" style={{ padding: "8px 20px" }}>
            <Label size={32} color="#7cb8ff">
              INSTAGRAM {fmt(redes.instagram)}
            </Label>
          </Panel>
          <Panel glow="#fe2c55" style={{ padding: "8px 20px" }}>
            <Label size={32} color="#ff6f8a">
              TIKTOK {fmt(redes.tiktok)}
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, top: 380 }}>
          <Potrero hinchas={Math.min(1000, hinchas)} frame={frame} capacidad={1000} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center" }}>
          <Panel glow={lleno ? C.yellow : TEAL} style={{ padding: "12px 32px", display: "flex", alignItems: "baseline", gap: 16 }}>
            <Label size={90} mono color={lleno ? C.yellow : TEAL}>
              {fmt(hinchas)}
            </Label>
            <Label size={40} color={C.white}>
              HINCHAS
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", opacity: ramp(frame, cien - 4, cien + 6), scale: String(mix(ramp(frame, cien - 4, cien + 10, pop), 0.5, 1)) }}>
          <Panel glow={TEAL} style={{ padding: "8px 22px" }}>
            <Label size={38} mono color={TEAL}>
              +{HOY - AYER} EN UN DÍA
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={mil} color={C.yellow} length={10} peak={0.3} />
      <Audio from={sumamos} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={cien} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={mil} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const R5Mudanza: React.FC = () => {
  const frame = useCurrentFrame();
  const lleno = wordAt("mudanza", "llenó");
  const mudamos = wordAt("mudanza", "mudamos");
  const estadio = wordAt("mudanza", "estadio");
  const diezMil = wordAt("mudanza", "10000");
  const stamp = ramp(frame, lleno - 2, lleno + 10, pop);
  const swap = ramp(frame, mudamos - 6, mudamos + 10, easeInOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [lleno, mudamos], 16) }}>
        <Background tint={swap < 0.5 ? "#0d2a1a" : "#0f1c30"} />
        <div style={{ position: "absolute", left: 0, top: 380, opacity: 1 - swap, scale: String(mix(swap, 1, 0.4)) }}>
          <Potrero hinchas={1000} frame={frame} capacidad={1000} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", opacity: stamp * (1 - swap), scale: String(mix(stamp, 2, 1)), rotate: "-6deg" }}>
          <Panel glow={C.yellow} style={{ padding: "14px 36px" }}>
            <Label size={90} color={C.yellow}>
              LLENO
            </Label>
          </Panel>
        </div>
        {swap > 0 ? (
          <div style={{ position: "absolute", left: 60, top: 360, opacity: swap, scale: String(mix(swap, 2.2, 1)) }}>
            <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={960} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: ramp(frame, estadio - 4, estadio + 6), scale: String(mix(ramp(frame, estadio - 4, estadio + 10, pop), 0.5, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
            <Label size={44} color={C.yellow}>
              NUEVA CANCHA: ESTADIO
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: ramp(frame, diezMil - 4, diezMil + 6) }}>
          <Panel glow={TEAL} style={{ padding: "8px 26px", display: "flex", alignItems: "baseline", gap: 12 }}>
            <Label size={50} mono color={TEAL}>
              {fmt(HOY)}
            </Label>
            <Label size={34} mono color={C.dim}>
              / 10.000
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={mudamos} color={C.white} length={10} peak={0.4} />
      <Audio from={lleno} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={mudamos - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={mudamos} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={diezMil} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

export const R6Partido: React.FC = () => {
  const frame = useCurrentFrame();
  const debut = wordAt("partido", "debut");
  const ganamos = wordAt("partido", "ganamos");
  const dos = wordAt("partido", "2");
  const ferro = wordAt("partido", "ferro");
  const card = ramp(frame, 0, 12, pop);
  const nuestros = NUESTRO === PARTIDO.local ? PARTIDO.gl : PARTIDO.gv;
  const ellos = NUESTRO === PARTIDO.local ? PARTIDO.gv : PARTIDO.gl;
  // El marcador sube gol por gol hasta el resultado.
  const goles = Math.min(nuestros, Math.floor(ramp(frame, ganamos - 4, dos + 2) * nuestros + (frame >= dos ? 1 : 0)));
  const stamp = ramp(frame, ganamos - 2, ganamos + 10, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [ganamos, dos], 16) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", opacity: ramp(frame, debut - 4, debut + 6) }}>
          <Panel glow={C.yellow} style={{ padding: "8px 24px" }}>
            <Label size={38} color={C.yellow}>
              DEBUT · FECHA 1 · DE LOCAL
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 380, opacity: card, translate: `0px ${mix(card, 200, 0)}px` }}>
          <Panel glow={TEAL} style={{ padding: "34px 26px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Crest team={equipo(NUESTRO)} size={220} />
              <Label size={36} color={C.yellow}>
                {equipo(NUESTRO).corto}
              </Label>
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 160, color: C.white, letterSpacing: -6 }}>
              {goles}-{ellos}
            </div>
            <div style={{ width: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <Crest team={equipo(RIVAL)} size={220} />
              <Label size={32} color={C.white}>
                {equipo(RIVAL).corto}
              </Label>
            </div>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", opacity: stamp, scale: String(mix(stamp, 2, 1)), rotate: "-5deg" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 130, color: TEAL, textShadow: `0 0 50px ${TEAL}88` }}>¡GANAMOS!</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", opacity: ramp(frame, ferro - 4, ferro + 8) }}>
          <Panel glow={TEAL} style={{ padding: "8px 24px" }}>
            <Label size={36} color={C.white}>
              {POSICION}° EN LA TABLA · 3 PUNTOS
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={dos} color={TEAL} length={8} peak={0.3} />
      <Audio from={debut} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={ganamos} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
      <Audio from={dos} src={staticFile("sfx/patada.wav")} volume={SFX.patada} />
      <Audio from={dos + 4} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const R7Manana: React.FC = () => {
  const frame = useCurrentFrame();
  const dificil = wordAt("manana", "difícil");
  const visitante = wordAt("manana", "visitante");
  const big = wordAt("manana", "big");
  const fuerte = wordAt("manana", "fuerte");
  const alarm = ramp(frame, dificil - 2, dificil + 8) * (0.5 + 0.5 * Math.sin(frame * 0.5));
  const rival = equipo(PROXIMO_RIVAL);
  const crest = ramp(frame, big - 6, big + 8, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [dificil, big], 16) }}>
        <Background tint={`rgba(120, 20, 18, ${0.3 + alarm * 0.4})`} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: ramp(frame, 0, 8) }}>
          <Panel glow={C.positive} style={{ padding: "8px 24px" }}>
            <Label size={40} color={C.positive}>
              MAÑANA · FECHA 2
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 100, top: 450, opacity: ramp(frame, 0, 10) }}>
          <Crest team={equipo(NUESTRO)} size={220} />
        </div>
        <div style={{ position: "absolute", left: 380, top: 560, width: 160, display: "flex", justifyContent: "center" }}>
          <Label size={70} color={C.dim}>
            VS
          </Label>
        </div>
        <div style={{ position: "absolute", left: 620, top: 400, opacity: crest, scale: String(mix(crest, 2.4, 1.1)) }}>
          <Crest team={rival} size={300} glow={0.8 + alarm * 0.5} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", gap: 16, opacity: ramp(frame, visitante - 4, visitante + 6) }}>
          <Panel glow={C.positive} style={{ padding: "8px 22px" }}>
            <Label size={36} color={C.white}>
              DE VISITANTE: LA HINCHADA NO SUMA
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 980, display: "flex", justifyContent: "center", opacity: ramp(frame, fuerte - 4, fuerte + 8), scale: String(mix(ramp(frame, fuerte - 4, fuerte + 12, pop), 0.5, 1)) }}>
          <Panel glow={C.positive} style={{ padding: "10px 26px" }}>
            <Label size={40} color={C.positive}>
              {rival.corto} · FUERZA {rival.fuerza}, LA MÁS ALTA
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={dificil} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={big} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={fuerte} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

/** Ícono de compartir: una flecha curva saliendo de una caja. */
const Compartir: React.FC<{ filled: number; size: number }> = ({ filled, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 58 14 L 92 42 L 58 70 V 54 C 36 54 20 62 8 84 C 12 56 28 34 58 30 Z" fill={filled > 0 ? C.yellow : "transparent"} fillOpacity={filled} stroke={filled > 0.5 ? C.yellow : C.white} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

export const R8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const [, cada, sigue] = beats("cta");
  const tap = wordAt("cta", "compartilo") + 8;
  const fuertes = wordAt("cta", "fuertes");
  const tapFollow = wordAt("cta", "seguí") + 6;
  const tapped = ramp(frame, tap, tap + 4);
  const card = ramp(frame, sigue - 6, sigue + 10, pop);
  const followed = frame >= tapFollow + 2;
  const press = (at: number) => ramp(frame, at, at + 3) - ramp(frame, at + 3, at + 10);
  const finger = (at: number, x: number, y: number, leave: number) => (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 4,
        transformOrigin: "50% 0%",
        rotate: "-24deg",
        translate: `${mix(ramp(frame, at - 10, at, easeOut), 420, 0) + ramp(frame, leave, leave + 10, easeInOut) * 900}px ${mix(ramp(frame, at - 10, at, easeOut), 700, 0) + ramp(frame, leave, leave + 10, easeInOut) * 1500}px`,
        scale: String(1 - press(at) * 0.04),
      }}
    >
      <Finger width={300} rim={0.5} />
    </div>
  );
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, tapFollow], 14) }}>
        <Background tint="#0c1a3a" />
        <AbsoluteFill style={{ opacity: 1 - ramp(frame, sigue - 10, sigue - 2) }}>
          <div style={{ position: "absolute", left: 540 - 140, top: 300, scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1) * (1 + press(tap) * 0.3)) }}>
            <Compartir filled={tapped} size={280} />
          </div>
          {/* Los que se suman vuelan del botón de compartir al estadio */}
          {new Array(12).fill(0).map((_, i) => {
            const t = ramp(frame, cada - 24 + i * 6, cada + 2 + i * 6, easeInOut);
            if (t <= 0 || t >= 1) {
              return null;
            }
            const x = mix(t, 540, 300 + random(`dx${i}`) * 480);
            const y = mix(t, 440, 860 + random(`dy${i}`) * 160) - Math.sin(t * Math.PI) * 160;
            return (
              <div key={i} style={{ position: "absolute", left: x - 40, top: y - 60, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, color: C.yellow, opacity: Math.min(1, t * 3) }}>+1</div>
                <svg width={40} height={48} viewBox="-20 -36 40 48">
                  <rect x={-12} y={-16} width={24} height={24} rx={9} fill={C.yellow} />
                  <circle cx={0} cy={-26} r={10} fill={C.yellow} />
                </svg>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 240, top: 700 }}>
            <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={600} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", gap: 16, opacity: ramp(frame, cada - 4, cada + 6) }}>
            <Panel glow={TEAL} style={{ padding: "8px 22px" }}>
              <Label size={38} mono color={TEAL}>
                CADA UNO = +1 HINCHA
              </Label>
            </Panel>
            <Panel glow={C.yellow} style={{ padding: "8px 22px", opacity: ramp(frame, fuertes - 4, fuertes + 6) }}>
              <Label size={38} color={C.yellow}>
                + FUERZA DE LOCAL
              </Label>
            </Panel>
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            left: 90,
            right: 90,
            top: 520,
            opacity: card,
            translate: `0px ${mix(card, 200, 0)}px`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "50px 30px 46px",
            borderRadius: 48,
            background: "linear-gradient(160deg, rgba(24,38,72,0.95), rgba(6,10,22,0.95))",
            border: `2px solid ${C.electric}55`,
            boxShadow: `0 0 60px ${C.electric}33, 0 40px 80px rgba(0,0,0,0.6)`,
          }}
        >
          <Img src={staticFile("logo.png")} style={{ width: 200, height: 200, borderRadius: "50%", border: "5px solid #3ee0c0", boxShadow: "0 0 50px #3ee0c055" }} />
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 64, color: C.white, marginTop: 30, letterSpacing: -1 }}>@nadietelo.explico</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 34, color: C.dim, marginTop: 10 }}>Entrá a la tribuna del FC NTLE</div>
          <div
            style={{
              marginTop: 40,
              width: 480,
              height: 110,
              borderRadius: 30,
              background: followed ? "rgba(255,255,255,0.14)" : SEGUIR,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              scale: String(1 - press(tapFollow) * 0.08),
              boxShadow: followed ? "none" : `0 0 40px ${SEGUIR}aa`,
            }}
          >
            {followed ? (
              <svg width={44} height={44} viewBox="0 0 44 44">
                <path d="M 8 23 L 18 33 L 37 11" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
            <Label size={50}>{followed ? "Siguiendo" : "Seguir"}</Label>
          </div>
        </div>
        {finger(tap, 560, 420, tap + 16)}
        {frame >= sigue ? finger(tapFollow, 600, 990, tapFollow + 30) : null}
      </AbsoluteFill>
      <Flash at={tap} color={C.yellow} length={8} peak={0.3} />
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tap + 2} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={fuertes} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={sigue - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={tapFollow - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tapFollow + 1} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
