import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { Ball, Bengala, bonusHinchada, chanceLocalVs, Crest, equipo, NUESTRO, Potrero } from "../components/Futbol";
import { Finger } from "../components/Finger";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, easeOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, Flash, fmt, Label, Panel, shake } from "../components/Ui";
import estado from "../liga/estado.json";
import fecha from "../liga/fecha.json";
import fixture from "../liga/fixture.json";
import { SEGUIR } from "../serie";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

const HOY = fecha.hinchas;
const PARTIDO = fecha.partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as (typeof fecha.partidos)[number];
const RIVAL = PARTIDO.local === NUESTRO ? PARTIDO.visitante : PARTIDO.local;
const NUESTROS = PARTIDO.local === NUESTRO ? PARTIDO.gl : PARTIDO.gv;
const ELLOS = PARTIDO.local === NUESTRO ? PARTIDO.gv : PARTIDO.gl;
const POSICION = fecha.tabla.findIndex((f) => f.id === NUESTRO) + 1;
const PROXIMO = fecha.proximo as { fecha: number; local: string; visitante: string };
const PROXIMO_RIVAL = PROXIMO.local === NUESTRO ? PROXIMO.visitante : PROXIMO.local;
const PROXIMO_LOCAL = fixture.find((f) => f.fecha > fecha.fecha && f.partidos.some((p) => p.local === NUESTRO)) as (typeof fixture)[number];
const RIVAL_LOCAL = PROXIMO_LOCAL.partidos.find((p) => p.local === NUESTRO)?.visitante as string;
// Puesto en la fecha anterior, para que se vea la subida.
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

/** Flecha de compartir, como la de los videos. */
const Compartir: React.FC<{ filled: number; size: number }> = ({ filled, size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 58 14 L 92 42 L 58 70 V 54 C 36 54 20 62 8 84 C 12 56 28 34 58 30 Z" fill={filled > 0 ? NARANJA : "transparent"} fillOpacity={filled} stroke={filled > 0.5 ? NARANJA : C.white} strokeWidth={6} strokeLinejoin="round" />
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

export const G1Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const revancha = wordAt("gancho", "revancha");
  const slam = ramp(frame, 0, 10, easeOut);
  const stamp = ramp(frame, revancha - 2, revancha + 10, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [9, revancha], 22) }}>
        <Background tint="#0d2a1a" />
        {/* Papelitos turquesa y amarillos */}
        {frame > 8
          ? new Array(40).fill(0).map((_, i) => {
              const t = ((frame - 8) * (0.6 + random(`v${i}`) * 0.6)) / 60;
              return <div key={i} style={{ position: "absolute", left: random(`x${i}`) * 1080, top: -40 + t * 1400 + random(`y${i}`) * 200, width: 18, height: 30, background: i % 2 ? TEAL : C.yellow, rotate: `${t * 720 + i * 30}deg`, opacity: 0.85 }} />;
            })
          : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: 320, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
          <div style={{ opacity: ramp(frame, 6, 14), translate: `${mix(ramp(frame, 6, 16, easeOut), -300, 0)}px 0px` }}>
            <Crest team={equipo(NUESTRO)} size={210} glow={0.8} />
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 210, color: C.white, letterSpacing: -10, scale: String(mix(slam, 3, 1)), filter: `blur(${(1 - slam) * 6}px)`, textShadow: `0 0 60px ${TEAL}88` }}>
            <span style={{ color: C.yellow }}>{NUESTROS}</span>-{ELLOS}
          </div>
          <div style={{ opacity: ramp(frame, 6, 14), translate: `${mix(ramp(frame, 6, 16, easeOut), 300, 0)}px 0px` }}>
            <Crest team={equipo(RIVAL)} size={210} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 660, display: "flex", justifyContent: "center", opacity: stamp, scale: String(mix(stamp, 2.4, 1)), rotate: "-6deg" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 150, color: TEAL, textShadow: `0 0 60px ${TEAL}aa` }}>¡REVANCHA!</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", opacity: ramp(frame, revancha + 10, revancha + 20) }}>
          <Label size={36} color={C.dim}>
            AYER: BIG BANG 6-3 · HOY, DE LOCAL
          </Label>
        </div>
      </AbsoluteFill>
      <Flash at={9} color={TEAL} length={10} peak={0.4} />
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={9} src={staticFile("sfx/patada.wav")} volume={SFX.patada} />
      <Audio from={revancha} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato} />
    </AbsoluteFill>
  );
};

export const G2Partido: React.FC = () => {
  const frame = useCurrentFrame();
  const numero = wordAt("partido", "1175");
  const metimos = wordAt("partido", "metimos");
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [metimos + NUESTROS * 4], 12) }}>
        <Background tint="#0f1c30" />
        <div style={{ position: "absolute", left: 140, top: 280, opacity: window01(frame, 0, metimos - 10, 8, 8) }}>
          <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={800} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", opacity: ramp(frame, numero - 4, numero + 6) * (1 - ramp(frame, metimos - 10, metimos - 2)) }}>
          <Panel glow={TEAL} style={{ padding: "10px 28px", display: "flex", alignItems: "baseline", gap: 14 }}>
            <Label size={76} mono color={TEAL}>
              {fmt(HOY)}
            </Label>
            <Label size={34} color={C.white}>
              HINCHAS · +{String(Math.round(bonusHinchada(HOY) * 10) / 10).replace(".", ",")} DE LOCAL
            </Label>
          </Panel>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 400, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 30 }}>
          {new Array(NUESTROS).fill(0).map((_, i) => {
            const show = ramp(frame, metimos - 4 + i * 4, metimos + 4 + i * 4, pop);
            return (
              <div key={i} style={{ opacity: show, scale: String(mix(show, 0.2, 1)), filter: `drop-shadow(0 0 22px ${C.yellow})` }}>
                <Ball size={190} spin={frame * 3 + i * 40} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 940, display: "flex", justifyContent: "center", opacity: ramp(frame, metimos + NUESTROS * 4, metimos + NUESTROS * 4 + 10) }}>
          <Label size={90} color={C.yellow}>
            {NUESTROS} GOLES
          </Label>
        </div>
      </AbsoluteFill>
      <Audio from={numero} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      {new Array(NUESTROS).fill(0).map((_, i) => (
        <Audio key={i} from={metimos - 2 + i * 4} src={staticFile("sfx/toque.wav")} volume={SFX.toque * 0.7} />
      ))}
      <Audio from={metimos + NUESTROS * 4} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const G3Tabla: React.FC = () => {
  const frame = useCurrentFrame();
  const cuarto = wordAt("tabla", "cuarto");
  const sube = ramp(frame, cuarto - 8, cuarto + 6, easeInOut);
  const lugar = mix(sube, ANTES, POSICION);
  const otros = fecha.tabla.filter((f) => f.id !== NUESTRO);
  const nuestra = fecha.tabla[POSICION - 1];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [cuarto + 6], 12) }}>
        <Background tint="#1a1430" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
          <Label size={44} color={C.white}>
            TABLA · FECHA {fecha.fecha}
          </Label>
        </div>
        <div style={{ position: "absolute", left: 120, right: 120, top: 330, height: 860 }}>
          {otros.map((f, k) => {
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
          <div style={{ position: "absolute", left: -10, right: -10, top: (lugar - 1) * 84 - 4, height: 80, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", borderRadius: 18, background: "rgba(62,224,192,0.16)", border: `3px solid ${TEAL}`, boxShadow: `0 0 40px ${TEAL}55` }}>
            <Label size={34} mono color={TEAL} style={{ width: 40 }}>
              {Math.round(lugar)}
            </Label>
            <Crest team={equipo(NUESTRO)} size={52} />
            <Label size={32} color={TEAL} style={{ flex: 1 }}>
              {equipo(NUESTRO).nombre}
            </Label>
            <Label size={34} mono color={TEAL}>
              {nuestra.pts}
            </Label>
          </div>
        </div>
      </AbsoluteFill>
      <Audio from={cuarto - 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={cuarto + 6} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const G4Bengalas: React.FC = () => {
  const frame = useCurrentFrame();
  const [, cada] = beats("bengalas");
  const titulo = wordAt("bengalas", "bengalas");
  const comparte = wordAt("bengalas", "compartís") + 4;
  const prende = wordAt("bengalas", "bengala");
  const big = ramp(frame, titulo - 4, titulo + 10, pop);
  const partA = window01(frame, -10, cada - 6, 1, 8);
  const partB = ramp(frame, cada - 4, cada + 6);
  const vuelo = ramp(frame, comparte + 6, prende, easeInOut);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [titulo, prende], 16) }}>
        <Background tint="#3a120a" />
        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 20, opacity: big }}>
              {[0, 1, 2].map((k) => (
                <div key={k} style={{ rotate: `${(k - 1) * 16}deg`, marginTop: k === 1 ? -40 : 0, scale: String(mix(big, 0.3, 1)) }}>
                  <Bengala size={200} frame={frame} seed={k} />
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", opacity: big, scale: String(mix(big, 2, 1)) }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 150, color: NARANJA, textShadow: `0 0 60px ${NARANJA}aa` }}>BENGALAS</div>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 240, display: "flex", justifyContent: "center", opacity: ramp(frame, 10, 20) }}>
              <Panel glow={NARANJA} style={{ padding: "8px 24px" }}>
                <Label size={38} color={NARANJA}>
                  NUEVO DESDE HOY
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}
        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            <div style={{ position: "absolute", left: 140, top: 560 }}>
              <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={800} bengalas={frame >= prende ? 1 : 0} />
            </div>
            <div style={{ position: "absolute", left: 540 - 130, top: 260, scale: String(1 + (ramp(frame, comparte, comparte + 4) - ramp(frame, comparte + 4, comparte + 12)) * 0.25) }}>
              <Compartir filled={ramp(frame, comparte, comparte + 4)} size={260} />
            </div>
            {vuelo > 0 ? (
              <div style={{ position: "absolute", left: mix(vuelo, 540, 720) - 50, top: mix(vuelo, 420, 760) - Math.sin(vuelo * Math.PI) * 150 - 80, rotate: `${(1 - vuelo) * 360}deg`, filter: vuelo >= 1 ? "drop-shadow(0 0 30px #ff4d2d)" : undefined }}>
                <Bengala size={100} frame={frame} seed={4} />
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, top: 1210, display: "flex", justifyContent: "center", opacity: ramp(frame, prende - 2, prende + 8) }}>
              <Panel glow={NARANJA} style={{ padding: "8px 24px" }}>
                <Label size={38} color={NARANJA}>
                  1 COMPARTIDO = 1 BENGALA
                </Label>
              </Panel>
            </div>
            <Dedo frame={frame} at={comparte} x={560} y={400} leave={comparte + 16} />
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Flash at={prende} color={NARANJA} length={10} peak={0.35} />
      <Audio from={titulo} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={comparte - 1} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={comparte + 6} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={prende} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const G5Regla: React.FC = () => {
  const frame = useCurrentFrame();
  const suma = wordAt("regla", "suma");
  const local = wordAt("regla", "local");
  const miedo = wordAt("regla", "miedo");
  const temblor = ramp(frame, miedo - 4, miedo + 4);
  const susto = temblor * (Math.sin(frame * 2.6) * 10);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [miedo], 12) }}>
        <Background tint="#3a120a" />
        <div style={{ position: "absolute", left: 60, top: 300 }}>
          <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={960} bengalas={Math.floor(ramp(frame, 0, local) * 120)} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", gap: 16 }}>
          <div style={{ opacity: ramp(frame, suma - 4, suma + 6), scale: String(mix(ramp(frame, suma - 4, suma + 10, pop), 1.6, 1)) }}>
            <Panel glow={NARANJA} style={{ padding: "10px 22px" }}>
              <Label size={42} color="#ffb27a">
                1 BENGALA = +0,05%
              </Label>
            </Panel>
          </div>
          <div style={{ opacity: ramp(frame, local - 4, local + 6), scale: String(mix(ramp(frame, local - 4, local + 10, pop), 1.6, 1)) }}>
            <Panel glow={C.yellow} style={{ padding: "10px 22px" }}>
              <Label size={42} color={C.yellow}>
                SOLO DE LOCAL
              </Label>
            </Panel>
          </div>
        </div>
        <div style={{ position: "absolute", left: 540 - 140, top: 560, opacity: ramp(frame, miedo - 10, miedo - 2), scale: String(mix(ramp(frame, miedo - 10, miedo + 2, pop), 0.4, 1) * (1 - temblor * 0.1)), translate: `${susto}px 0px` }}>
          <Crest team={equipo(RIVAL_LOCAL)} size={280} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center", opacity: ramp(frame, miedo - 2, miedo + 8) }}>
          <Label size={56} color={C.positive}>
            EL RIVAL ENTRA CON MIEDO
          </Label>
        </div>
      </AbsoluteFill>
      <Audio from={suma} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={local} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={miedo} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
    </AbsoluteFill>
  );
};

export const G6Numeros: React.FC = () => {
  const frame = useCurrentFrame();
  const [, con] = beats("numeros");
  const f5 = wordAt("numeros", "fecha");
  const sin = wordAt("numeros", "44%");
  const quinientas = wordAt("numeros", "69%");
  const mil = wordAt("numeros", "90%");
  const filas = [
    { b: 0, at: sin, label: "SIN BENGALAS" },
    { b: 500, at: quinientas, label: "CON 500 BENGALAS" },
    { b: 1000, at: mil, label: "CON 1.000 (TOPE)" },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [quinientas, mil], 14) }}>
        <Background tint="#2a0e08" />
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, opacity: ramp(frame, 0, 10) }}>
          <Crest team={equipo(RIVAL_LOCAL)} size={110} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <Label size={44} color={C.white}>
              vs {equipo(RIVAL_LOCAL).corto}
            </Label>
            <Label size={30} color={C.yellow} style={{ opacity: ramp(frame, f5 - 4, f5 + 6) }}>
              FECHA {PROXIMO_LOCAL.fecha} · DE LOCAL
            </Label>
          </div>
        </div>
        {filas.map((r, i) => {
          const show = ramp(frame, r.at - 8, r.at + 4, pop);
          const v = chanceLocalVs(RIVAL_LOCAL, HOY, r.b);
          const fill = ramp(frame, r.at - 4, r.at + 14, easeInOut);
          return (
            <div key={r.b} style={{ position: "absolute", left: 80, right: 80, top: 430 + i * 230, opacity: show, translate: `${mix(show, -120, 0)}px 0px` }}>
              <Panel glow={r.b ? NARANJA : "#8a93a4"} style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 120, display: "flex", justifyContent: "center" }}>
                  {r.b ? <Bengala size={84} frame={frame} seed={i} /> : <Label size={60} color={C.dim}>–</Label>}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Label size={36} color={r.b ? "#ffb27a" : C.white}>
                      {r.label}
                    </Label>
                    <Label size={84} mono color={r.b ? "#ffb27a" : C.white}>
                      {Math.round(v * 100 * fill)}%
                    </Label>
                  </div>
                  <div style={{ height: 24, borderRadius: 12, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${v * 100 * fill}%`, height: "100%", background: r.b ? `linear-gradient(90deg, #ff4d2d, #ffb27a)` : "#8a93a4" }} />
                  </div>
                </div>
              </Panel>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: ramp(frame, con, con + 10) }}>
          <Label size={30} color={C.dim}>
            CHANCE DE GANAR · CON {fmt(HOY)} HINCHAS
          </Label>
        </div>
      </AbsoluteFill>
      <Audio from={sin} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={quinientas} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={mil} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa} />
      <Audio from={mil + 10} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
    </AbsoluteFill>
  );
};

export const G7Manana: React.FC = () => {
  const frame = useCurrentFrame();
  const gravedad = wordAt("manana", "gravedad");
  const crest = ramp(frame, gravedad - 8, gravedad + 4, pop);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Background tint="#101a30" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", opacity: ramp(frame, 0, 8) }}>
        <Panel glow="#8a93a4" style={{ padding: "8px 24px" }}>
          <Label size={40} color={C.white}>
            MAÑANA · FECHA {PROXIMO.fecha} · DE VISITANTE
          </Label>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 100, top: 440, scale: String(mix(ramp(frame, 0, 12, pop), 0.5, 1)) }}>
        <Crest team={equipo(NUESTRO)} size={260} />
      </div>
      <div style={{ position: "absolute", left: 400, top: 560, width: 280, display: "flex", justifyContent: "center" }}>
        <Label size={70} color={C.dim}>
          VS
        </Label>
      </div>
      <div style={{ position: "absolute", left: 700, top: 440, opacity: crest, scale: String(mix(crest, 0.4, 1)) }}>
        <Crest team={equipo(PROXIMO_RIVAL)} size={260} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center", opacity: ramp(frame, gravedad, gravedad + 10) }}>
        <Label size={34} color={C.dim}>
          {equipo(PROXIMO_RIVAL).nombre.toUpperCase()} · FUERZA {equipo(PROXIMO_RIVAL).fuerza}
        </Label>
      </div>
      <Audio from={0} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={gravedad - 4} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
    </AbsoluteFill>
  );
};

export const G8Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const [, sigue] = beats("cta");
  const tap = wordAt("cta", "compartilo") + 6;
  const tapFollow = wordAt("cta", "seguí") + 6;
  const hincha = wordAt("cta", "hincha");
  const card = ramp(frame, sigue - 6, sigue + 10, pop);
  const followed = frame >= tapFollow + 2;
  const vuelo = ramp(frame, tap + 6, tap + 30, easeInOut);
  const press = (at: number) => ramp(frame, at, at + 3) - ramp(frame, at + 3, at + 10);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [tap, tapFollow], 14) }}>
        <Background tint="#2a0e08" />
        <AbsoluteFill style={{ opacity: window01(frame, -10, sigue - 10, 1, 8) }}>
          <div style={{ position: "absolute", left: 540 - 140, top: 280, scale: String(mix(ramp(frame, 0, 10, pop), 0.5, 1) * (1 + press(tap) * 0.3)) }}>
            <Compartir filled={ramp(frame, tap, tap + 4)} size={280} />
          </div>
          <div style={{ position: "absolute", left: 240, top: 690 }}>
            <Potrero hinchas={HOY} frame={frame} capacidad={10000} width={600} bengalas={frame >= tap + 30 ? 1 : 0} />
          </div>
          {vuelo > 0 ? (
            <div style={{ position: "absolute", left: mix(vuelo, 540, 640) - 50, top: mix(vuelo, 440, 860) - Math.sin(vuelo * Math.PI) * 160 - 80, rotate: `${(1 - vuelo) * 360}deg`, filter: vuelo >= 1 ? "drop-shadow(0 0 30px #ff4d2d)" : undefined }}>
              <Bengala size={100} frame={frame} seed={7} />
            </div>
          ) : null}
          <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", opacity: ramp(frame, tap + 24, tap + 34) }}>
            <Panel glow={NARANJA} style={{ padding: "8px 22px" }}>
              <Label size={38} color={NARANJA}>
                PRENDÉ BENGALAS
              </Label>
            </Panel>
          </div>
          <Dedo frame={frame} at={tap} x={560} y={420} leave={tap + 16} />
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
