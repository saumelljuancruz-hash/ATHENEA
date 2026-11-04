import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Ball, bonusHinchada, Crest, equipo, NUESTRO, Potrero } from "../components/Futbol";
import { Finger } from "../components/Finger";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Flash, fmt, Label, Panel, shake } from "../components/Ui";
import estado from "../liga/estado.json";
import fecha from "../liga/fecha.json";
import { SEGUIR } from "../serie";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const HOY = fecha.hinchas;
const AYER = estado.fechas.find((f) => f.fecha === fecha.fecha - 1)?.hinchas ?? HOY;
const PARTIDO = fecha.partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as (typeof fecha.partidos)[number];
const RIVAL = PARTIDO.local === NUESTRO ? PARTIDO.visitante : PARTIDO.local;
const NUESTROS = PARTIDO.local === NUESTRO ? PARTIDO.gl : PARTIDO.gv;
const ELLOS = PARTIDO.local === NUESTRO ? PARTIDO.gv : PARTIDO.gl;
const POSICION = fecha.tabla.findIndex((f) => f.id === NUESTRO) + 1;
const PROXIMO = fecha.proximo as { fecha: number; local: string; visitante: string };
const PROXIMO_RIVAL = PROXIMO.local === NUESTRO ? PROXIMO.visitante : PROXIMO.local;
const ROJO = "#ff3b3b";

/** Misma cuenta que scripts/liga.mjs: chance de ganarle de local a un rival con tantos hinchas. */
const chanceVs = (rival: string, hinchas: number) => {
  const d = (equipo(NUESTRO).fuerza + 3 + bonusHinchada(hinchas) - equipo(rival).fuerza) / 25;
  const lh = 1.35 * Math.exp(d);
  const la = 1.05 * Math.exp(-d);
  const p = (l: number, k: number) => {
    let r = Math.exp(-l);
    for (let i = 1; i <= k; i++) {
      r *= l / i;
    }
    return r;
  };
  let w = 0;
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < i; j++) {
      w += p(lh, i) * p(la, j);
    }
  }
  return w;
};

export const F1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const pero = wordAt("gancho", "pero");
  const tres = wordAt("gancho", "3", 1);
  const fuerte = wordAt("gancho", "fuerte");
  const slam = ramp(frame, 0, 10, easeOut);
  const flip = ramp(frame, pero - 4, pero + 8, easeInOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [9, tres], 22) }}>
        <Background tint={flip < 0.5 ? "#3a0c0c" : "#0c1a3a"} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <div style={{ opacity: ramp(frame, 6, 14), translate: `${mix(ramp(frame, 6, 16, easeOut), -300, 0)}px 0px` }}>
            <Crest team={equipo(RIVAL)} size={210} />
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 210, color: C.white, letterSpacing: -10, scale: String(mix(slam, 3, 1)), filter: `blur(${(1 - slam) * 6}px)`, textShadow: `0 0 60px ${flip < 0.5 ? ROJO : TEAL}88` }}>
            {ELLOS}-<span style={{ color: flip > 0.5 ? C.yellow : C.white }}>{NUESTROS}</span>
          </div>
          <div style={{ opacity: ramp(frame, 6, 14), translate: `${mix(ramp(frame, 6, 16, easeOut), 300, 0)}px 0px` }}>
            <Crest team={equipo(NUESTRO)} size={210} glow={flip} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", opacity: 1 - flip }}>
          <Label size={80} color={ROJO}>
            PERDIMOS
          </Label>
        </div>
        {/* Nuestros 3 goles, en amarillo */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", gap: 40 }}>
          {new Array(NUESTROS).fill(0).map((_, i) => {
            const show = ramp(frame, tres - 10 + i * 5, tres + i * 5, pop);
            return (
              <div key={i} style={{ opacity: show, scale: String(mix(show, 0.2, 1)), rotate: `${(1 - show) * 200}deg`, filter: `drop-shadow(0 0 20px ${C.yellow})` }}>
                <Ball size={150} spin={frame * 3 + i * 40} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 930, display: "flex", justifyContent: "center", opacity: ramp(frame, fuerte - 4, fuerte + 6), scale: String(mix(ramp(frame, fuerte - 4, fuerte + 12, pop), 0.5, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "10px 26px" }}>
            <Label size={42} color={C.yellow}>
              {NUESTROS} GOLES AL MÁS FUERTE (FUERZA {equipo(RIVAL).fuerza})
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={9} color={ROJO} length={10} peak={0.4} />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={9} src={staticFile("sfx/patada.wav")} volume={SFX.patada} />
      {new Array(NUESTROS).fill(0).map((_, i) => (
        <Audio key={i} from={tres - 4 + i * 5} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      ))}
      <Audio from={fuerte} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const F2Partido: React.FC = () => {
  const frame = useCurrentFrame();
  const visitante = wordAt("partido", "visitante");
  const nueve = wordAt("partido", "nueve");
  const loco = wordAt("partido", "loco");
  const total = NUESTROS + ELLOS;
  const otros = fecha.partidos.filter((p) => p !== PARTIDO);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [nueve + total * 3], 14) }}>
        <Background tint="#1a1030" />
        {/* La tribuna de visitante, vacía: la hinchada no viaja */}
        <div style={{ position: "absolute", left: 0, top: 360, opacity: window01(frame, 0, nueve - 18, 10, 8) * 0.9 }}>
          <Potrero hinchas={0} frame={frame} capacidad={1000} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 16, opacity: ramp(frame, visitante - 4, visitante + 6) }}>
          <Panel glow={ROJO} style={{ padding: "8px 22px" }}>
            <Label size={38} color={C.white}>
              DE VISITANTE · SIN HINCHADA
            </Label>
          </Panel>
        </div>
        {/* Los 9 goles, uno por uno */}
        <div style={{ position: "absolute", left: 90, right: 90, top: 380, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22 }}>
          {new Array(total).fill(0).map((_, i) => {
            const nuestro = i % 3 === 2;
            const show = ramp(frame, nueve - 14 + i * 3, nueve - 6 + i * 3, pop);
            return (
              <div key={i} style={{ position: "relative", opacity: show, scale: String(mix(show, 0.2, 1)) }}>
                <Ball size={150} spin={frame * 2 + i * 30} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: -34, textAlign: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 22, color: nuestro ? C.yellow : ROJO }}>{nuestro ? "NTLE" : "DBB"}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 830, display: "flex", justifyContent: "center", opacity: ramp(frame, nueve - 2, nueve + 8), scale: String(mix(ramp(frame, nueve - 2, nueve + 12, pop), 1.8, 1)) }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 120, color: C.yellow, textShadow: `0 0 50px ${C.yellow}88` }}>{total} GOLES</div>
        </div>
        <div style={{ position: "absolute", left: 140, right: 140, top: 1000, display: "flex", flexDirection: "column", gap: 8, opacity: ramp(frame, loco - 6, loco + 6) }}>
          <Label size={30} color={C.dim} style={{ textAlign: "center" }}>
            EL RESTO DE LA FECHA
          </Label>
          <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
            {otros.map((p) => (
              <Panel key={p.semilla} glow="#5a6680" style={{ padding: "6px 14px" }}>
                <Label size={32} mono color={C.dim}>
                  {p.gl}-{p.gv}
                </Label>
              </Panel>
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Audio from={visitante} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      {new Array(total).fill(0).map((_, i) => (
        <Audio key={i} from={nueve - 12 + i * 3} src={staticFile("sfx/toque.wav")} volume={SFX.toque * 0.6} />
      ))}
      <Audio from={nueve} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={loco} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const F3Tabla: React.FC = () => {
  const frame = useCurrentFrame();
  const sexto = wordAt("tabla", "sexto");
  const baja = ramp(frame, sexto - 8, sexto + 6, easeInOut);
  // Tabla de la fecha anterior (para que se vea la caída) y la de hoy.
  const filas = fecha.tabla;
  const antes = 3;
  const lugar = mix(baja, antes, POSICION);
  const otros = filas.filter((f) => f.id !== NUESTRO);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [sexto + 6], 12) }}>
        <Background tint="#1a1430" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
          <Label size={44} color={C.white}>
            TABLA · FECHA {fecha.fecha}
          </Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 330, height: 860 }}>
          {otros.map((f, k) => {
            // Los demás se acomodan alrededor del lugar que ocupa el club.
            const pos = k + 1 >= lugar ? k + 2 : k + 1;
            return (
              <div key={f.id} style={{ position: "absolute", left: 0, right: 0, top: (pos - 1) * 84, height: 72, display: "flex", alignItems: "center", gap: 18, padding: "0 20px", borderRadius: 16, background: "rgba(255,255,255,0.05)" }}>
                <Label size={30} mono color={C.dim} style={{ width: 40 }}>
                  {pos}
                </Label>
                <Crest team={equipo(f.id)} size={44} />
                <Label size={28} color={C.white} style={{ flex: 1 }}>
                  {equipo(f.id).nombre}
                </Label>
                <Label size={30} mono color={C.white}>
                  {f.pts}
                </Label>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: -10, right: -10, top: (lugar - 1) * 84 - 4, height: 80, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", borderRadius: 18, background: "rgba(255,225,77,0.16)", border: `3px solid ${C.yellow}`, boxShadow: `0 0 40px ${C.yellow}55` }}>
            <Label size={34} mono color={C.yellow} style={{ width: 40 }}>
              {Math.round(lugar)}
            </Label>
            <Crest team={equipo(NUESTRO)} size={52} />
            <Label size={32} color={C.yellow} style={{ flex: 1 }}>
              {equipo(NUESTRO).nombre}
            </Label>
            <Label size={34} mono color={C.yellow}>
              {filas[POSICION - 1].pts}
            </Label>
          </div>
        </div>
      </AbsoluteFill>
      <Audio from={sexto - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
    </AbsoluteFill>
  );
};

export const F4Hinchada: React.FC = () => {
  const frame = useCurrentFrame();
  const crecer = wordAt("hinchada", "crecer");
  const numero = wordAt("hinchada", "1131");
  const t = ramp(frame, crecer - 10, numero + 10, easeInOut);
  const hinchas = Math.round(mix(t, AYER, HOY));
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [numero], 14) }}>
        <Background tint="#0f1c30" />
        <div style={{ position: "absolute", left: 60, top: 300 }}>
          <Potrero hinchas={hinchas} frame={frame} capacidad={10000} width={960} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", justifyContent: "center", gap: 16 }}>
          <Panel glow={TEAL} style={{ padding: "10px 30px", display: "flex", alignItems: "baseline", gap: 12 }}>
            <Label size={80} mono color={TEAL}>
              {fmt(hinchas)}
            </Label>
            <Label size={36} color={C.white}>
              HINCHAS
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: ramp(frame, numero - 2, numero + 8), scale: String(mix(ramp(frame, numero - 2, numero + 12, pop), 0.5, 1)) }}>
          <Panel glow={TEAL} style={{ padding: "8px 24px" }}>
            <Label size={40} mono color={TEAL}>
              +{HOY - AYER} DESDE AYER
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={crecer - 8} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={numero} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const F5Manana: React.FC = () => {
  const frame = useCurrentFrame();
  const local = wordAt("manana", "local");
  const tsunami = wordAt("manana", "tsunami");
  const rival = equipo(PROXIMO_RIVAL);
  const crest = ramp(frame, tsunami - 18, tsunami - 4, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [local], 14) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", opacity: ramp(frame, 0, 8) }}>
          <Panel glow={C.yellow} style={{ padding: "8px 24px" }}>
            <Label size={40} color={C.yellow}>
              MAÑANA · FECHA {PROXIMO.fecha}
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 90, top: 420, scale: String(mix(ramp(frame, 0, 12, pop), 0.5, 1)) }}>
          <Crest team={equipo(NUESTRO)} size={300} glow={ramp(frame, local - 2, local + 8)} />
        </div>
        <div style={{ position: "absolute", left: 420, top: 560, width: 240, display: "flex", justifyContent: "center" }}>
          <Label size={70} color={C.dim}>
            VS
          </Label>
        </div>
        <div style={{ position: "absolute", left: 690, top: 440, opacity: crest, scale: String(mix(crest, 0.4, 1)) }}>
          <Crest team={rival} size={280} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", opacity: ramp(frame, local - 2, local + 8), scale: String(mix(ramp(frame, local - 2, local + 12, pop), 1.6, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "12px 30px" }}>
            <Label size={56} color={C.yellow}>
              DE LOCAL: LA HINCHADA SUMA
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", opacity: ramp(frame, tsunami, tsunami + 10) }}>
          <Label size={34} color={C.white}>
            {rival.nombre.toUpperCase()} · FUERZA {rival.fuerza}
          </Label>
        </div>
      </AbsoluteFill>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={local} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
      <Audio from={tsunami - 6} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

export const F6Chance: React.FC = () => {
  const frame = useCurrentFrame();
  const [, cada] = beats("chance");
  const pct = wordAt("chance", "54%");
  const sube = wordAt("chance", "sube");
  const hoy = chanceVs(PROXIMO_RIVAL, HOY);
  const big = ramp(frame, pct - 10, pct + 10, easeOut);
  const filas = [
    { hinchas: 2000, at: cada + 6 },
    { hinchas: 10000, at: sube - 4 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [pct, sube], 12) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center" }}>
          <Label size={40} color={C.white}>
            CHANCE DE GANAR MAÑANA
          </Label>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", opacity: ramp(frame, pct - 10, pct) }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 260, color: C.yellow, textShadow: `0 0 70px ${C.yellow}88`, letterSpacing: -8 }}>{Math.round(hoy * 100 * big)}%</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center", opacity: ramp(frame, pct, pct + 10) }}>
          <Label size={36} color={C.dim}>
            CON {fmt(HOY)} HINCHAS (HOY)
          </Label>
        </div>
        {filas.map((f, i) => {
          const show = ramp(frame, f.at - 4, f.at + 8, pop);
          const v = chanceVs(PROXIMO_RIVAL, f.hinchas);
          return (
            <div key={f.hinchas} style={{ position: "absolute", left: 90, right: 90, top: 740 + i * 190, opacity: show, translate: `${mix(show, -120, 0)}px 0px` }}>
              <Panel glow={TEAL} style={{ padding: "18px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Label size={36} color={C.white}>
                    CON {fmt(f.hinchas)} HINCHAS
                  </Label>
                  <Label size={58} mono color={TEAL}>
                    {Math.round(v * 100 * ramp(frame, f.at, f.at + 14))}%
                  </Label>
                </div>
                <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <div style={{ width: `${v * 100 * ramp(frame, f.at, f.at + 14, easeInOut)}%`, height: "100%", background: TEAL }} />
                </div>
              </Panel>
            </div>
          );
        })}
      </AbsoluteFill>
      <Audio from={pct} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      {filas.map((f) => (
        <Audio key={f.hinchas} from={f.at} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      ))}
      <Audio from={sube} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

/** Ícono de compartir: una flecha curva. */
const Compartir: React.FC<{ filled: number; size: number }> = ({ filled, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 58 14 L 92 42 L 58 70 V 54 C 36 54 20 62 8 84 C 12 56 28 34 58 30 Z" fill={filled > 0 ? C.yellow : "transparent"} fillOpacity={filled} stroke={filled > 0.5 ? C.yellow : C.white} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

export const F7Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const [, sigue] = beats("cta");
  const tap = wordAt("cta", "compartilo") + 6;
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
        <AbsoluteFill style={{ opacity: window01(frame, -10, sigue - 10, 1, 8) }}>
          <div style={{ position: "absolute", left: 540 - 140, top: 280, scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1) * (1 + press(tap) * 0.3)) }}>
            <Compartir filled={tapped} size={280} />
          </div>
          {new Array(10).fill(0).map((_, i) => {
            const t = ramp(frame, tap + 4 + i * 4, tap + 26 + i * 4, easeInOut);
            if (t <= 0 || t >= 1) {
              return null;
            }
            const x = mix(t, 540, 300 + random(`dx${i}`) * 480);
            const y = mix(t, 420, 860 + random(`dy${i}`) * 160) - Math.sin(t * Math.PI) * 160;
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
          <div style={{ position: "absolute", left: 240, top: 690 }}>
            <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={600} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", opacity: ramp(frame, tap + 10, tap + 20) }}>
            <Panel glow={C.yellow} style={{ padding: "8px 22px" }}>
              <Label size={38} color={C.yellow}>
                LLENEMOS EL ESTADIO
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
        {finger(tap, 560, 400, tap + 16)}
        {frame >= sigue ? finger(tapFollow, 600, 990, tapFollow + 30) : null}
      </AbsoluteFill>
      <Flash at={tap} color={C.yellow} length={8} peak={0.3} />
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tap + 2} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={sigue - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={tapFollow - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tapFollow + 1} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};
