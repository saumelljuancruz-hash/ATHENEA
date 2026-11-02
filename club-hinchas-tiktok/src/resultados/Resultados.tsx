import React from "react";
import { AbsoluteFill } from "remotion";
import { capacidadPara, Crest, equipo, NUESTRO, Potrero } from "../components/Futbol";
import { TEAL } from "../components/Props";
import { Background, fmt, Label, Panel, Watermark } from "../components/Ui";
import liga from "../liga/equipos.json";
import fecha from "../liga/fecha.json";
import { C, DISPLAY, MONO } from "../theme";

// Slides de 1080 × 1350 para el carrusel diario de resultados.
// Se arman solos con src/liga/fecha.json (lo escribe scripts/liga.mjs jugar).

export const W = 1080;
export const H = 1350;
const TOTAL = 3;

type Partido = (typeof fecha.partidos)[number];
const NUESTRO_PARTIDO = fecha.partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as Partido;
const DE_LOCAL = NUESTRO_PARTIDO.local === NUESTRO;
const NUESTROS = DE_LOCAL ? NUESTRO_PARTIDO.gl : NUESTRO_PARTIDO.gv;
const ELLOS = DE_LOCAL ? NUESTRO_PARTIDO.gv : NUESTRO_PARTIDO.gl;
const VEREDICTO = NUESTROS > ELLOS ? "¡GANAMOS!" : NUESTROS === ELLOS ? "EMPATAMOS" : "PERDIMOS";
const VEREDICTO_COLOR = NUESTROS > ELLOS ? TEAL : NUESTROS === ELLOS ? C.yellow : C.positive;
const nombre = (id: string) => equipo(id).corto;

const Header: React.FC<{ title: string }> = ({ title }) => (
  <>
    <div style={{ position: "absolute", left: 70, top: 56, display: "flex", alignItems: "center", gap: 14, padding: "10px 22px", borderRadius: 24, background: "rgba(0,0,0,0.38)", border: `2px solid ${C.yellow}55` }}>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 32, color: C.yellow }}>FECHA {fecha.fecha}</span>
      <span style={{ fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.dim }}>/ {fecha.totalFechas}</span>
    </div>
    <Watermark top={58} />
    <div style={{ position: "absolute", left: 70, right: 70, top: 160, display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: TEAL, letterSpacing: 1 }}>
        {liga.liga.toUpperCase()} · TEMPORADA {liga.temporada}
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 74, color: C.white, letterSpacing: -1.5, lineHeight: 1 }}>{title}</div>
    </div>
  </>
);

const Dots: React.FC<{ index: number }> = ({ index }) => (
  <div style={{ position: "absolute", left: 70, bottom: 62, display: "flex", gap: 12 }}>
    {new Array(TOTAL).fill(0).map((_, i) => (
      <div key={i} style={{ width: i === index ? 40 : 14, height: 14, borderRadius: 7, background: i === index ? C.yellow : "rgba(255,255,255,0.25)" }} />
    ))}
  </div>
);

const Footer: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", right: 70, bottom: 50, fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: "rgba(255,255,255,0.75)" }}>{text}</div>
);

/** Slide 1: nuestro partido, grande. */
export const SlidePartido: React.FC = () => {
  const local = NUESTRO_PARTIDO.local;
  const visitante = NUESTRO_PARTIDO.visitante;
  const proximo = fecha.proximo;
  const rivalProximo = proximo ? (proximo.local === NUESTRO ? proximo.visitante : proximo.local) : null;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
      <Background tint="#0d2a1a" />
      <Header title="NUESTRO PARTIDO" />
      <div style={{ position: "absolute", left: 60, right: 60, top: 360 }}>
        <Panel glow={VEREDICTO_COLOR} style={{ padding: "36px 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            {[local, visitante].map((id, k) => (
              <React.Fragment key={id}>
                {k === 1 ? (
                  <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 150, color: C.white, letterSpacing: -6, textShadow: `0 0 40px ${VEREDICTO_COLOR}55` }}>
                    {NUESTRO_PARTIDO.gl}-{NUESTRO_PARTIDO.gv}
                  </div>
                ) : null}
                <div style={{ width: 280, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  <Crest team={equipo(id)} size={190} blank={id === NUESTRO} />
                  <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 32, color: id === NUESTRO ? C.yellow : C.white, textAlign: "center", lineHeight: 1.05 }}>{nombre(id)}</div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, color: C.dim }}>{k === 0 ? "LOCAL" : "VISITANTE"}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          <Label size={84} color={VEREDICTO_COLOR}>
            {VEREDICTO}
          </Label>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 930, display: "flex", gap: 24 }}>
        <Panel glow={TEAL} style={{ flex: 1, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 8 }}>
          <Label size={26} color={C.dim}>
            HINCHAS EN LA CANCHA
          </Label>
          <Label size={54} mono color={TEAL}>
            {fecha.hinchas}
          </Label>
          <Label size={24} color={DE_LOCAL ? C.yellow : C.dim}>
            {DE_LOCAL ? `LOCALÍA +${String(fecha.bonusHinchada).replace(".", ",")}` : "DE VISITANTE: SIN EXTRA"}
          </Label>
        </Panel>
        <Panel glow={C.yellow} style={{ flex: 1.3, padding: "18px 22px", display: "flex", flexDirection: "column", gap: 10 }}>
          <Label size={26} color={C.dim}>
            {proximo ? `PRÓXIMA · FECHA ${proximo.fecha}` : "FIN DE LA TEMPORADA"}
          </Label>
          {rivalProximo && proximo ? (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Crest team={equipo(rivalProximo)} size={70} />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label size={32} color={C.white}>
                  vs {equipo(rivalProximo).corto}
                </Label>
                <Label size={24} color={proximo.local === NUESTRO ? C.yellow : C.dim}>
                  {proximo.local === NUESTRO ? "DE LOCAL: ¡TRAÉ GENTE!" : "DE VISITANTE"}
                </Label>
              </div>
            </div>
          ) : null}
        </Panel>
      </div>
      <Dots index={0} />
      <Footer text="RESULTADOS Y TABLA →" />
    </AbsoluteFill>
  );
};

/** Slide 2: todos los resultados de la fecha. */
export const SlideResultados: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
    <Background tint="#101a30" />
    <Header title="RESULTADOS" />
    <div style={{ position: "absolute", left: 60, right: 60, top: 340, display: "flex", flexDirection: "column", gap: 22 }}>
      {fecha.partidos.map((p) => {
        const ours = p.local === NUESTRO || p.visitante === NUESTRO;
        return (
          <div key={p.semilla} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderRadius: 26, background: ours ? "rgba(255,225,77,0.1)" : "rgba(255,255,255,0.05)", border: `2px solid ${ours ? C.yellow : "rgba(255,255,255,0.12)"}` }}>
            <Crest team={equipo(p.local)} size={74} blank={p.local === NUESTRO} />
            <div style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: p.local === NUESTRO ? C.yellow : C.white, lineHeight: 1.05 }}>{nombre(p.local)}</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.white, minWidth: 150, textAlign: "center" }}>
              {p.gl}-{p.gv}
            </div>
            <div style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: p.visitante === NUESTRO ? C.yellow : C.white, textAlign: "right", lineHeight: 1.05 }}>{nombre(p.visitante)}</div>
            <Crest team={equipo(p.visitante)} size={74} blank={p.visitante === NUESTRO} />
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1170, fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, color: C.dim }}>Los partidos no se ven: cada resultado sale de un sorteo con semilla pública. La hinchada del club suma de local.</div>
    <Dots index={1} />
    <Footer text="TABLA →" />
  </AbsoluteFill>
);

/** Slide 3: tabla de posiciones. */
export const SlideTabla: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
    <Background tint="#1a1430" />
    <Header title="TABLA" />
    <div style={{ position: "absolute", left: 60, right: 60, top: 330 }}>
      <div style={{ display: "flex", padding: "0 22px 10px", fontFamily: MONO, fontWeight: 800, fontSize: 24, color: C.dim }}>
        <div style={{ width: 60 }}>#</div>
        <div style={{ flex: 1 }}>EQUIPO</div>
        <div style={{ width: 80, textAlign: "center" }}>PJ</div>
        <div style={{ width: 90, textAlign: "center" }}>DG</div>
        <div style={{ width: 100, textAlign: "center" }}>PTS</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {fecha.tabla.map((f, i) => {
          const ours = f.id === NUESTRO;
          return (
            <div key={f.id} style={{ display: "flex", alignItems: "center", padding: "6px 22px", borderRadius: 18, background: ours ? "rgba(255,225,77,0.12)" : i % 2 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)", border: `2px solid ${ours ? C.yellow : "transparent"}` }}>
              <div style={{ width: 60, fontFamily: MONO, fontWeight: 800, fontSize: 32, color: ours ? C.yellow : C.white }}>{i + 1}</div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 16 }}>
                <Crest team={equipo(f.id)} size={44} blank={ours} />
                <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: ours ? C.yellow : C.white }}>{equipo(f.id).nombre}</div>
              </div>
              <div style={{ width: 80, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.dim }}>{f.pj}</div>
              <div style={{ width: 90, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 30, color: C.dim }}>{f.dg > 0 ? `+${f.dg}` : f.dg}</div>
              <div style={{ width: 100, textAlign: "center", fontFamily: MONO, fontWeight: 800, fontSize: 36, color: ours ? C.yellow : C.white }}>{f.pts}</div>
            </div>
          );
        })}
      </div>
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1196, fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, color: TEAL }}>¿Todavía sin nombre? Comentá cómo se tiene que llamar el club.</div>
    <Dots index={2} />
  </AbsoluteFill>
);

/** Estado de la cancha, para historias: cuántos hinchas hay hoy. */
export const SlideCancha: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
    <Background tint="#0d2a1a" />
    <Header title="LA CANCHA HOY" />
    <div style={{ position: "absolute", left: 0, top: 330 }}>
      <Potrero hinchas={fecha.hinchas} frame={0} capacidad={capacidadPara(fecha.hinchas)} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1090, display: "flex", justifyContent: "center" }}>
      <Panel glow={TEAL} style={{ padding: "14px 34px", display: "flex", alignItems: "baseline", gap: 18 }}>
        <Label size={84} mono color={TEAL}>
          {fmt(fecha.hinchas)}
        </Label>
        <Label size={52} mono color={C.dim}>
          / {fmt(capacidadPara(fecha.hinchas))}
        </Label>
        <Label size={38} color={C.white} style={{ marginLeft: 10 }}>
          HINCHAS
        </Label>
      </Panel>
    </div>
  </AbsoluteFill>
);
