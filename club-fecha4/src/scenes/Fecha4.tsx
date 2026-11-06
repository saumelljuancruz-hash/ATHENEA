import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Bengala, bengalasParaTope, chanceLocalVs, chanceVisitanteVs, Crest, equipo, NUESTRO, Potrero, TOPE_BENGALAS } from "../components/Futbol";
import { Finger } from "../components/Finger";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, lerpColor, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Flash, fmt, Label, Panel, shake } from "../components/Ui";
import estado from "../liga/estado.json";
import fecha from "../liga/fecha.json";
import redes from "../liga/redes.json";
import { SEGUIR } from "../serie";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const HOY = fecha.hinchas;
const AYER = estado.fechas.find((f) => f.fecha === fecha.fecha - 1)?.hinchas ?? HOY;
const PARTIDO = fecha.partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as (typeof fecha.partidos)[number];
const RIVAL = PARTIDO.local === NUESTRO ? PARTIDO.visitante : PARTIDO.local;
const POSICION = fecha.tabla.findIndex((f) => f.id === NUESTRO) + 1;
const PUNTERO = fecha.tabla[0];
const NUESTRA = fecha.tabla[POSICION - 1];
const PROXIMO = fecha.proximo as { fecha: number; local: string; visitante: string };
const PROXIMO_RIVAL = PROXIMO.local === NUESTRO ? PROXIMO.visitante : PROXIMO.local;
const PUESTO_RIVAL = fecha.tabla.findIndex((f) => f.id === PROXIMO_RIVAL) + 1;
// Las bengalas son los compartidos que pasa el usuario (redes.json); solo cuentan de local.
const BENGALAS = redes.bengalas.acumuladas;
const SIN = chanceLocalVs(PROXIMO_RIVAL, HOY);
const CON = chanceLocalVs(PROXIMO_RIVAL, HOY, BENGALAS);
const TOPE = bengalasParaTope(PROXIMO_RIVAL, HOY);
const FALTAN = TOPE - BENGALAS;
const AFUERA = chanceVisitanteVs(RIVAL);
const pct = (v: number) => Math.round(v * 100);

// Puesto en la fecha anterior, para que se vea la caída.
const ANTES = (() => {
  const previas = estado.fechas.filter((f) => f.fecha < fecha.fecha);
  const pts: Record<string, { pts: number; dg: number; gf: number }> = {};
  for (const f of previas) {
    for (const m of f.partidos) {
      for (const [id, a, b] of [
        [m.local, m.gl, m.gv],
        [m.visitante, m.gv, m.gl],
      ] as [string, number, number][]) {
        pts[id] = pts[id] ?? { pts: 0, dg: 0, gf: 0 };
        pts[id].pts += a > b ? 3 : a === b ? 1 : 0;
        pts[id].dg += a - b;
        pts[id].gf += a;
      }
    }
  }
  const orden = Object.entries(pts).sort(([, x], [, y]) => y.pts - x.pts || y.dg - x.dg || y.gf - x.gf);
  return orden.findIndex(([id]) => id === NUESTRO) + 1 || POSICION;
})();

const NARANJA = "#ff8a3d";
const ROJO = "#ff4d5e";
const GRIS = "#8a93a4";

/** Flecha de compartir, como la de los videos. */
const Compartir: React.FC<{ filled: number; size: number }> = ({ filled, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 58 14 L 92 42 L 58 70 V 54 C 36 54 20 62 8 84 C 12 56 28 34 58 30 Z" fill={filled > 0 ? NARANJA : "transparent"} fillOpacity={filled} stroke={filled > 0.5 ? NARANJA : C.white} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

const Candado: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ filter: `drop-shadow(0 0 12px ${color})` }}>
    <path d="M 30 46 V 32 C 30 12 70 12 70 32 V 46" fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
    <rect x={20} y={44} width={60} height={46} rx={10} fill={color} />
    <circle cx={50} cy={64} r={6} fill="#1a1400" />
  </svg>
);

const Dedo: React.FC<{ frame: number; at: number; x: number; y: number; leave: number }> = ({ frame, at, x, y, leave }) => {
  const press = ramp(frame, at, at + 3) - ramp(frame, at + 3, at + 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x - 150,
        top: y - 4,
        transformOrigin: "50% 0%",
        rotate: "-24deg",
        translate: `${mix(ramp(frame, at - 10, at, easeOut), 420, 0) + ramp(frame, leave, leave + 10, easeInOut) * 900}px ${mix(ramp(frame, at - 10, at, easeOut), 700, 0) + ramp(frame, leave, leave + 10, easeInOut) * 1500}px`,
        scale: String(1 - press * 0.04),
      }}
    >
      <Finger width={300} rim={0.5} />
    </div>
  );
};

export const H1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const [, respuesta] = beats("gancho");
  const contra = wordAt("gancho", "contra");
  const tercero = wordAt("gancho", "tercero");
  const slam = ramp(frame, 0, 10, easeOut);
  const stamp = ramp(frame, contra - 2, contra + 10, pop);
  const sube = ramp(frame, tercero - 14, tercero + 2, easeInOut);
  const rival = ramp(frame, tercero - 6, tercero + 8, pop);
  const candado = ramp(frame, respuesta - 2, respuesta + 10, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [6, contra, tercero], 22) }}>
        <Background tint="#2a0a0e" rain={0.5} />
        {/* El 3-0 entra de golpe y después se achica para dejarle lugar al tercero. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: mix(sube, 360, 300), display: "flex", flexDirection: "column", alignItems: "center", scale: String(mix(sube, 1, 0.62)), transformOrigin: "50% 0%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
            <div style={{ opacity: ramp(frame, 4, 12), translate: `${mix(ramp(frame, 4, 14, easeOut), -300, 0)}px 0px` }}>
              <Crest team={equipo(PARTIDO.local)} size={210} />
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 210, color: C.white, letterSpacing: -10, scale: String(mix(slam, 3, 1)), filter: `blur(${(1 - slam) * 6}px)`, textShadow: `0 0 60px ${ROJO}88` }}>
              {PARTIDO.gl}-{PARTIDO.gv}
            </div>
            <div style={{ opacity: ramp(frame, 4, 12), translate: `${mix(ramp(frame, 4, 14, easeOut), 300, 0)}px 0px`, filter: "grayscale(0.6) brightness(0.8)" }}>
              <Crest team={equipo(NUESTRO)} size={210} />
            </div>
          </div>
          <div style={{ marginTop: 40, opacity: stamp, scale: String(mix(stamp, 2.4, 1)), rotate: "-6deg" }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 130, color: ROJO, textShadow: `0 0 60px ${ROJO}aa` }}>EN CONTRA</div>
          </div>
        </div>
        {/* El próximo rival, con un signo de pregunta que late. */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 670, display: "flex", justifyContent: "center", alignItems: "center", gap: 40, opacity: rival, scale: String(mix(rival, 0.4, 1)) }}>
          <div style={{ position: "relative" }}>
            <Crest team={equipo(PROXIMO_RIVAL)} size={260} />
            <div style={{ position: "absolute", right: -30, top: -20, width: 110, height: 110, borderRadius: "50%", background: C.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 52, color: "#1a1400", boxShadow: `0 0 30px ${C.yellow}` }}>
              {PUESTO_RIVAL}.º
            </div>
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 260, color: C.yellow, textShadow: `0 0 60px ${C.yellow}aa`, scale: String(1 + 0.06 * Math.sin(frame * 0.35)) }}>?</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", opacity: ramp(frame, tercero + 4, tercero + 14) }}>
          <Label size={36} color={C.dim}>
            MAÑANA · {equipo(PROXIMO_RIVAL).nombre.toUpperCase()}
          </Label>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1090, display: "flex", justifyContent: "center", opacity: candado, scale: String(mix(candado, 1.6, 1)) }}>
          <Panel glow={C.yellow} style={{ padding: "12px 28px", display: "flex", alignItems: "center", gap: 18 }}>
            <Candado size={54} color={C.yellow} />
            <Label size={40} color={C.yellow}>
              LA RESPUESTA, EN UNOS SEGUNDOS
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Flash at={6} color={ROJO} length={10} peak={0.35} />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={6} src={staticFile("sfx/patada.wav")} volume={SFX.patada} />
      <Audio from={contra} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
      <Audio from={tercero - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={tercero + 2} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={respuesta} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const H2Partido: React.FC = () => {
  const frame = useCurrentFrame();
  const hinchada = wordAt("partido", "hinchada");
  const gravedad = wordAt("partido", "gravedad");
  const seis = wordAt("partido", "6%");
  const apaga = ramp(frame, hinchada - 4, hinchada + 10);
  const partA = window01(frame, -10, gravedad - 4, 1, 8);
  const partB = ramp(frame, gravedad - 4, gravedad + 6);
  const barra = ramp(frame, seis - 4, seis + 16, easeInOut);
  const tramos = [
    { label: "GANAR", v: AFUERA.gana, color: TEAL },
    { label: "EMPATE", v: AFUERA.empata, color: GRIS },
    { label: "PERDER", v: AFUERA.pierde, color: ROJO },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [hinchada + 4, seis], 12) }}>
        <Background tint="#0f1c30" />
        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center" }}>
              <Panel glow={GRIS} style={{ padding: "8px 24px" }}>
                <Label size={40} color={C.white}>
                  FECHA {fecha.fecha} · DE VISITANTE
                </Label>
              </Panel>
            </div>
            <div style={{ position: "absolute", left: 140, top: 430, opacity: mix(apaga, 1, 0.45) }}>
              <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={800} color={lerpColor(TEAL, "#3a4256", apaga)} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", opacity: apaga, scale: String(mix(ramp(frame, hinchada - 4, hinchada + 10, pop), 1.6, 1)) }}>
              <Panel glow={ROJO} style={{ padding: "10px 28px" }}>
                <Label size={44} color={ROJO}>
                  HINCHADA: +0
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
              {[RIVAL, NUESTRO].map((id, k) => (
                <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, scale: String(mix(ramp(frame, gravedad - 4 + k * 4, gravedad + 8 + k * 4, pop), 0.4, 1)) }}>
                  <Crest team={equipo(id)} size={190} />
                  <Label size={34} mono color={id === NUESTRO ? TEAL : C.white}>
                    FUERZA {equipo(id).fuerza}
                  </Label>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", opacity: ramp(frame, seis - 6, seis + 2), scale: String(mix(ramp(frame, seis - 6, seis + 8, pop), 2, 1)) }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 170, color: TEAL, textShadow: `0 0 50px ${TEAL}88` }}>{pct(AFUERA.gana)}%</div>
            </div>
            <div style={{ position: "absolute", left: 80, right: 80, top: 920, opacity: ramp(frame, seis - 4, seis + 4) }}>
              <div style={{ display: "flex", height: 54, borderRadius: 27, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
                {tramos.map((t) => (
                  <div key={t.label} style={{ width: `${t.v * 100 * barra}%`, height: "100%", background: t.color }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
                {tramos.map((t) => (
                  <Label key={t.label} size={30} color={t.color}>
                    {t.label} {pct(t.v)}%
                  </Label>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", opacity: ramp(frame, seis + 12, seis + 22) }}>
              <Label size={30} color={C.dim}>
                CHANCES ANTES DEL PARTIDO
              </Label>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={hinchada} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={gravedad - 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={seis} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const H3Tabla: React.FC = () => {
  const frame = useCurrentFrame();
  const septimo = wordAt("tabla", "séptimo");
  const puntero = wordAt("tabla", "puntero");
  const baja = ramp(frame, septimo - 8, septimo + 6, easeInOut);
  const lugar = mix(baja, ANTES, POSICION);
  const otros = fecha.tabla.filter((f) => f.id !== NUESTRO);
  const marca = ramp(frame, puntero - 6, puntero + 6, pop);
  const FILA = 84;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [septimo + 6], 12) }}>
        <Background tint="#1a1430" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
          <Label size={40} color={C.white}>
            TABLA · FECHA {fecha.fecha}
          </Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 370, height: 860 }}>
          {otros.map((f, k) => {
            const pos = k + 1 >= lugar ? k + 2 : k + 1;
            const esPuntero = f.id === PUNTERO.id;
            return (
              <div
                key={f.id}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: (pos - 1) * FILA,
                  height: 72,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  padding: "0 20px",
                  borderRadius: 16,
                  background: esPuntero ? `rgba(255,225,77,${0.05 + marca * 0.12})` : "rgba(255,255,255,0.05)",
                  border: esPuntero ? `3px solid rgba(255,225,77,${marca})` : "3px solid transparent",
                }}
              >
                <Label size={30} mono color={C.dim} style={{ width: 40 }}>
                  {pos}
                </Label>
                <Crest team={equipo(f.id)} size={44} />
                <Label size={28} color={C.white} style={{ flex: 1 }}>
                  {equipo(f.id).nombre}
                </Label>
                <Label size={30} mono color={esPuntero ? C.yellow : C.white}>
                  {f.pts}
                </Label>
              </div>
            );
          })}
          <div style={{ position: "absolute", left: -10, right: -10, top: (lugar - 1) * FILA - 4, height: 80, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", borderRadius: 18, background: "rgba(62,224,192,0.16)", border: `3px solid ${TEAL}`, boxShadow: `0 0 40px ${TEAL}55` }}>
            <Label size={34} mono color={TEAL} style={{ width: 40 }}>
              {Math.round(lugar)}
            </Label>
            <Crest team={equipo(NUESTRO)} size={52} />
            <Label size={32} color={TEAL} style={{ flex: 1 }}>
              {equipo(NUESTRO).nombre}
            </Label>
            <div style={{ opacity: marca, scale: String(mix(marca, 0.4, 1)), padding: "6px 14px", borderRadius: 12, background: `${C.yellow}22`, border: `2px solid ${C.yellow}` }}>
              <Label size={24} color={C.yellow}>
                A {PUNTERO.pts - NUESTRA.pts} DEL 1.º
              </Label>
            </div>
            <Label size={34} mono color={TEAL}>
              {NUESTRA.pts}
            </Label>
          </div>
        </div>
      </AbsoluteFill>
      <Audio from={septimo - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={septimo + 6} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={puntero} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const H4Hinchas: React.FC = () => {
  const frame = useCurrentFrame();
  const somos = wordAt("hinchas", "1307");
  const mas = wordAt("hinchas", "132");
  const cuenta = Math.round(mix(ramp(frame, 8, somos + 4, easeInOut), AYER, HOY));
  const chip = ramp(frame, mas - 4, mas + 10, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [somos + 4, mas], 12) }}>
        <Background tint="#0d2a1a" />
        <div style={{ position: "absolute", left: 90, top: 330 }}>
          <Potrero hinchas={cuenta} frame={frame} capacidad={10000} width={900} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 150, color: C.white, textShadow: `0 0 40px ${TEAL}, 0 8px 30px rgba(0,0,0,0.9)`, scale: String(1 + (ramp(frame, somos, somos + 4) - ramp(frame, somos + 4, somos + 14)) * 0.12) }}>{fmt(cuenta)}</div>
          <Label size={40} color={TEAL}>
            HINCHAS
          </Label>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", opacity: chip, scale: String(mix(chip, 1.8, 1)) }}>
          <Panel glow={TEAL} style={{ padding: "10px 28px" }}>
            <Label size={46} color={TEAL}>
              +{HOY - AYER} DESDE AYER
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={8} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={somos + 4} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={mas} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

export const H5Bengalas: React.FC = () => {
  const frame = useCurrentFrame();
  const [, oSea] = beats("bengalas");
  const n1 = wordAt("bengalas", "421", 0);
  const compartidos = wordAt("bengalas", "compartidos");
  const titulo = wordAt("bengalas", "bengalas");
  const manana = wordAt("bengalas", "mañana");
  const partA = window01(frame, -10, oSea - 6, 1, 8);
  const partB = ramp(frame, oSea - 4, oSea + 6);
  const cuenta = Math.round(mix(ramp(frame, 6, n1 + 6, easeInOut), 0, BENGALAS));
  const prendidas = Math.round(mix(ramp(frame, oSea, titulo + 10, easeInOut), 0, BENGALAS));
  const big = ramp(frame, titulo - 6, titulo + 8, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [n1 + 6, titulo], 16) }}>
        <Background tint="#3a120a" />
        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", opacity: ramp(frame, 0, 8) }}>
              <Label size={36} color={C.dim}>
                EL VIDEO DE AYER
              </Label>
            </div>
            <div style={{ position: "absolute", left: 540 - 150, top: 420, scale: String(mix(ramp(frame, 0, 12, pop), 0.5, 1) * (1 + (ramp(frame, n1 + 6, n1 + 10) - ramp(frame, n1 + 10, n1 + 18)) * 0.2)) }}>
              <Compartir filled={ramp(frame, 4, n1 + 6)} size={300} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
              <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 200, color: NARANJA, textShadow: `0 0 50px ${NARANJA}aa` }}>{fmt(cuenta)}</div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center", opacity: ramp(frame, compartidos - 4, compartidos + 6) }}>
              <Label size={50} color={C.white}>
                COMPARTIDOS
              </Label>
            </div>
          </AbsoluteFill>
        ) : null}
        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: ramp(frame, oSea, oSea + 10) }}>
              <Label size={32} color={C.dim}>
                LO QUE PRENDIERON USTEDES
              </Label>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 350, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: big, scale: String(mix(big, 2, 1)) }}>
              <Bengala size={70} frame={frame} seed={1} />
              <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 110, color: NARANJA, textShadow: `0 0 60px ${NARANJA}aa` }}>{fmt(BENGALAS)} BENGALAS</div>
              <Bengala size={70} frame={frame} seed={2} />
            </div>
            <div style={{ position: "absolute", left: 140, top: 470 }}>
              <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={800} bengalas={prendidas} />
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", opacity: ramp(frame, manana - 4, manana + 6), scale: String(mix(ramp(frame, manana - 4, manana + 10, pop), 1.6, 1)) }}>
              <Panel glow={NARANJA} style={{ padding: "8px 24px" }}>
                <Label size={40} color={NARANJA}>
                  PRENDIDAS PARA LA FECHA {redes.bengalas.fecha}
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Flash at={titulo} color={NARANJA} length={10} peak={0.35} />
      <Audio from={4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={n1 + 6} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={oSea} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={titulo} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={manana} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

export const H6Numeros: React.FC = () => {
  const frame = useCurrentFrame();
  const local = wordAt("numeros", "local");
  const agujero = wordAt("numeros", "agujero");
  const sin = wordAt("numeros", "45%");
  const con = wordAt("numeros", "66%");
  const sello = ramp(frame, con + 6, con + 18, pop);
  const filas = [
    { b: 0, v: SIN, at: sin, label: "SIN BENGALAS" },
    { b: BENGALAS, v: CON, at: con, label: `CON ${fmt(BENGALAS)} BENGALAS` },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [con, con + 8], 16) }}>
        <Background tint="#2a0e08" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
          <div style={{ scale: String(mix(ramp(frame, 0, 12, pop), 0.4, 1)) }}>
            <Crest team={equipo(NUESTRO)} size={170} glow={0.6} />
          </div>
          <Label size={60} color={C.dim}>
            VS
          </Label>
          <div style={{ opacity: ramp(frame, agujero - 6, agujero + 2), scale: String(mix(ramp(frame, agujero - 6, agujero + 8, pop), 0.4, 1)) }}>
            <Crest team={equipo(PROXIMO_RIVAL)} size={170} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 530, display: "flex", justifyContent: "center", opacity: ramp(frame, local - 4, local + 6) }}>
          <Panel glow={C.yellow} style={{ padding: "8px 24px" }}>
            <Label size={36} color={C.yellow}>
              MAÑANA · FECHA {PROXIMO.fecha} · DE LOCAL
            </Label>
          </Panel>
        </div>
        {filas.map((r, i) => {
          const show = ramp(frame, r.at - 10, r.at + 2, pop);
          const fill = ramp(frame, r.at - 4, r.at + 16, easeInOut);
          const color = r.b ? "#ffb27a" : C.white;
          return (
            <div key={r.label} style={{ position: "absolute", left: 80, right: 80, top: 660 + i * 230, opacity: show, translate: `${mix(show, -120, 0)}px 0px`, scale: String(r.b ? 1 + sello * 0.04 : 1) }}>
              <Panel glow={r.b ? NARANJA : GRIS} style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 110, display: "flex", justifyContent: "center" }}>
                  {r.b ? <Bengala size={80} frame={frame} seed={3} /> : <Label size={60} color={C.dim}>–</Label>}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Label size={36} color={color}>
                      {r.label}
                    </Label>
                    <Label size={r.b ? 100 : 84} mono color={color}>
                      {Math.round(pct(r.v) * fill)}%
                    </Label>
                  </div>
                  <div style={{ height: 24, borderRadius: 12, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${r.v * 100 * fill}%`, height: "100%", background: r.b ? "linear-gradient(90deg, #ff4d2d, #ffb27a)" : GRIS }} />
                  </div>
                </div>
              </Panel>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", opacity: sello, scale: String(mix(sello, 2.4, 1)), rotate: "-5deg" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 96, color: C.yellow, textShadow: `0 0 50px ${C.yellow}aa` }}>¡SE PUEDE!</div>
        </div>
      </AbsoluteFill>
      <Flash at={con} color={NARANJA} length={12} peak={0.35} />
      <Audio from={agujero - 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={sin} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={con} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={con + 8} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const H7Faltan: React.FC = () => {
  const frame = useCurrentFrame();
  const [, faltan] = beats("faltan");
  const tope = wordAt("faltan", "905");
  const noventa = wordAt("faltan", "90%");
  const cuantas = wordAt("faltan", "484");
  const IZQ = 110;
  const ANCHO = 860;
  const ya = BENGALAS / TOPE;
  const fill = ramp(frame, 0, 14, easeOut) * ya;
  const fin = ramp(frame, tope - 6, tope + 6, pop);
  const hueco = ramp(frame, faltan - 4, faltan + 6);
  const late = 0.55 + 0.45 * Math.sin(frame * 0.4);
  const big = ramp(frame, cuantas - 6, cuantas + 8, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [noventa, cuantas], 14) }}>
        <Background tint="#2a1608" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", justifyContent: "center", opacity: ramp(frame, 0, 10) }}>
          <Label size={40} color={C.white}>
            EL TOPE DE LAS BENGALAS
          </Label>
        </div>
        {/* Chance arriba de cada marca. */}
        <div style={{ position: "absolute", left: IZQ + ANCHO * ya - 100, width: 200, top: 440, display: "flex", justifyContent: "center", opacity: ramp(frame, 4, 14) }}>
          <Label size={64} mono color="#ffb27a">
            {pct(CON)}%
          </Label>
        </div>
        <div style={{ position: "absolute", left: IZQ + ANCHO - 120, width: 240, top: 440, display: "flex", justifyContent: "center", opacity: ramp(frame, noventa - 4, noventa + 4), scale: String(mix(ramp(frame, noventa - 4, noventa + 10, pop), 1.8, 1)) }}>
          <Label size={64} mono color={C.yellow}>
            {pct(TOPE_BENGALAS)}%
          </Label>
        </div>
        {/* La barra de bengalas: lo que ya está prendido y lo que falta. */}
        <div style={{ position: "absolute", left: IZQ, width: ANCHO, top: 540, height: 70, borderRadius: 35, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.18)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 35, background: "linear-gradient(90deg, #ff4d2d, #ffb27a)", boxShadow: `0 0 ${20 + 10 * late}px #ff4d2d` }} />
          <div style={{ position: "absolute", left: `${ya * 100}%`, right: 0, top: -6, bottom: -6, borderRadius: 35, border: `4px dashed rgba(255,225,77,${hueco * late})`, background: `rgba(255,225,77,${hueco * 0.12 * late})` }} />
        </div>
        <div style={{ position: "absolute", left: IZQ + ANCHO * ya - 3, top: 520, width: 6, height: 110, background: C.white, opacity: ramp(frame, 4, 14) }} />
        <div style={{ position: "absolute", left: IZQ + ANCHO - 3, top: 520, width: 6, height: 110, background: C.yellow, opacity: fin }} />
        <div style={{ position: "absolute", left: IZQ + ANCHO * ya - 160, width: 320, top: 650, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: ramp(frame, 6, 16) }}>
          <Label size={48} mono color="#ffb27a">
            {fmt(BENGALAS)}
          </Label>
          <Label size={26} color={C.dim}>
            YA PRENDIDAS
          </Label>
        </div>
        <div style={{ position: "absolute", left: IZQ + ANCHO - 140, width: 280, top: 650, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: fin, scale: String(mix(fin, 1.6, 1)) }}>
          <Label size={48} mono color={C.yellow}>
            {fmt(TOPE)}
          </Label>
          <Label size={26} color={C.dim}>
            TOPE
          </Label>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: big, scale: String(mix(big, 2.2, 1)) }}>
          <Label size={56} color={C.white}>
            FALTAN
          </Label>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Bengala size={80} frame={frame} seed={5} />
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 190, color: C.yellow, textShadow: `0 0 60px ${C.yellow}aa`, lineHeight: 1 }}>{fmt(FALTAN)}</div>
            <Bengala size={80} frame={frame} seed={6} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: ramp(frame, cuantas + 14, cuantas + 24) }}>
          <Panel glow={C.yellow} style={{ padding: "8px 24px" }}>
            <Label size={38} color={C.yellow}>
              ¿LLEGAMOS ANTES DEL PARTIDO?
            </Label>
          </Panel>
        </div>
      </AbsoluteFill>
      <Audio from={tope - 4} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={noventa} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={cuantas} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={cuantas + 14} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const H8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const [, sigue] = beats("cta");
  const tap = wordAt("cta", "compartilo") + 6;
  const tapFollow = wordAt("cta", "seguí") + 6;
  const hincha = wordAt("cta", "hincha");
  const card = ramp(frame, sigue - 6, sigue + 10, pop);
  const followed = frame >= tapFollow + 2;
  const vuelo = ramp(frame, tap + 6, tap + 30, easeInOut);
  const llego = frame >= tap + 30;
  const press = (at: number) => ramp(frame, at, at + 3) - ramp(frame, at + 3, at + 10);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, tapFollow], 14) }}>
        <Background tint="#2a0e08" />
        <AbsoluteFill style={{ opacity: window01(frame, -10, sigue - 10, 1, 8) }}>
          <div style={{ position: "absolute", left: 540 - 140, top: 300, scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1) * (1 + press(tap) * 0.3)) }}>
            <Compartir filled={ramp(frame, tap, tap + 4)} size={280} />
          </div>
          <div style={{ position: "absolute", left: 240, top: 690 }}>
            <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={600} bengalas={BENGALAS + (llego ? 1 : 0)} />
          </div>
          {vuelo > 0 && !llego ? (
            <div style={{ position: "absolute", left: mix(vuelo, 540, 640) - 50, top: mix(vuelo, 440, 860) - Math.sin(vuelo * Math.PI) * 160 - 80, rotate: `${(1 - vuelo) * 360}deg` }}>
              <Bengala size={100} frame={frame} seed={7} />
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", opacity: ramp(frame, 6, 16) }}>
            <Panel glow={NARANJA} style={{ padding: "8px 22px", display: "flex", alignItems: "baseline", gap: 14 }}>
              <Label size={44} mono color={NARANJA} style={{ scale: String(1 + (ramp(frame, tap + 30, tap + 34) - ramp(frame, tap + 34, tap + 44)) * 0.3) }}>
                {fmt(BENGALAS + (llego ? 1 : 0))}
              </Label>
              <Label size={36} color={NARANJA}>
                BENGALAS
              </Label>
            </Panel>
          </div>
          <Dedo frame={frame} at={tap} x={560} y={440} leave={tap + 16} />
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
          <div style={{ marginTop: 40, width: 480, height: 110, borderRadius: 30, background: followed ? "rgba(255,255,255,0.14)" : SEGUIR, display: "flex", alignItems: "center", justifyContent: "center", gap: 16, scale: String(1 - press(tapFollow) * 0.08), boxShadow: followed ? "none" : `0 0 40px ${SEGUIR}aa` }}>
            {followed ? (
              <svg width={44} height={44} viewBox="0 0 44 44">
                <path d="M 8 23 L 18 33 L 37 11" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
            <Label size={50}>{followed ? "Siguiendo" : "Seguir"}</Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: ramp(frame, hincha - 4, hincha + 6), scale: String(mix(ramp(frame, hincha - 4, hincha + 10, pop), 0.5, 1)) }}>
          <Panel glow={TEAL} style={{ padding: "10px 26px" }}>
            <Label size={44} color={TEAL}>
              +1 HINCHA EN LA TRIBUNA
            </Label>
          </Panel>
        </div>
        {frame >= sigue ? <Dedo frame={frame} at={tapFollow} x={600} y={990} leave={tapFollow + 30} /> : null}
      </AbsoluteFill>
      <Flash at={tap + 30} color={NARANJA} length={8} peak={0.3} />
      <Audio from={tap - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tap + 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={tap + 30} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={sigue - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={tapFollow - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={tapFollow + 1} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      <Audio from={hincha} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

