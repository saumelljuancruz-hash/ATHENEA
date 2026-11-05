import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Bengala, capacidadPara, chanceLocalVs, Crest, equipo, NUESTRO, Potrero } from "../components/Futbol";
import { TEAL } from "../components/Props";
import { Background, fmt, Label, Panel, Watermark } from "../components/Ui";
import liga from "../liga/equipos.json";
import fecha from "../liga/fecha.json";
import fixture from "../liga/fixture.json";
import redes from "../liga/redes.json";
import { C, DISPLAY, MONO } from "../theme";

// Slides de 1080 × 1350 para el carrusel diario de resultados.
// Se arman solos con src/liga/fecha.json (lo escribe scripts/liga.mjs jugar).

export const W = 1080;
export const H = 1350;
// Qué slides lleva el carrusel de hoy, en orden (los puntitos de avance salen de acá).
const DIAPOSITIVAS: string[] = redes.diapositivas ?? ["partido", "eligieron", "resultados", "tabla", "cancha"];
const TOTAL = DIAPOSITIVAS.length;
const indice = (id: string) => Math.max(0, DIAPOSITIVAS.indexOf(id));
const siguiente = (id: string) => DIAPOSITIVAS[DIAPOSITIVAS.indexOf(id) + 1];
const NOMBRE_SLIDE: Record<string, string> = { partido: "PARTIDO", eligieron: "LO ELIGIERON", resultados: "RESULTADOS", tabla: "TABLA", bengalas: "BENGALAS", cancha: "LA CANCHA" };
/** El próximo partido de local del club: ahí cuentan las bengalas. */
const PROXIMO_LOCAL = fixture.find((f) => f.fecha > fecha.fecha && f.partidos.some((p) => p.local === NUESTRO));
const RIVAL_LOCAL = PROXIMO_LOCAL?.partidos.find((p) => p.local === NUESTRO)?.visitante;
const flecha = (id: string) => (siguiente(id) ? `${NOMBRE_SLIDE[siguiente(id)]} →` : "");

type Partido = (typeof fecha.partidos)[number];
const NUESTRO_PARTIDO = fecha.partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as Partido;
const DE_LOCAL = NUESTRO_PARTIDO.local === NUESTRO;
const NUESTROS = DE_LOCAL ? NUESTRO_PARTIDO.gl : NUESTRO_PARTIDO.gv;
const ELLOS = DE_LOCAL ? NUESTRO_PARTIDO.gv : NUESTRO_PARTIDO.gl;
const VEREDICTO = NUESTROS > ELLOS ? "¡GANAMOS!" : NUESTROS === ELLOS ? "EMPATAMOS" : "PERDIMOS";
const VEREDICTO_COLOR = NUESTROS > ELLOS ? TEAL : NUESTROS === ELLOS ? C.yellow : C.positive;
const nombre = (id: string) => equipo(id).corto;
/** El club de la serie sin escudo todavía se dibuja con el "?". */
const sinEscudo = (id: string) => id === NUESTRO && !(equipo(id) as { escudo?: string }).escudo;
const PROXIMO = fecha.proximo;
const RIVAL_PROXIMO = PROXIMO ? (PROXIMO.local === NUESTRO ? PROXIMO.visitante : PROXIMO.local) : null;

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
  const proximo = PROXIMO;
  const rivalProximo = RIVAL_PROXIMO;
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
                  <Crest team={equipo(id)} size={190} blank={sinEscudo(id)} />
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
            {fmt(fecha.hinchas)}
          </Label>
          <Label size={24} color={DE_LOCAL ? C.yellow : C.dim}>
            {DE_LOCAL ? `LOCALÍA +${String(fecha.bonusHinchada).replace(".", ",")}` : "DE VISITANTE: SIN EXTRA"}
          </Label>
          {DE_LOCAL && (fecha.bengalas ?? 0) > 0 ? (
            <Label size={24} color="#ff8a3d">
              + {fmt(fecha.bengalas)} BENGALAS (+{String(fecha.extraBengalas).replace(".", ",")} % DE CHANCE)
            </Label>
          ) : null}
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
      <Dots index={indice("partido")} />
      <Footer text={flecha("partido")} />
    </AbsoluteFill>
  );
};

/** Slide 2: el nombre y el escudo, con los comentarios que ganaron. */
export const SlideEligieron: React.FC = () => {
  const { nombre: n, escudo: e } = redes.eligieron;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
      <Background tint="#0c1a3a" />
      <Header title="LO ELIGIERON USTEDES" />
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, display: "flex", alignItems: "center", gap: 28 }}>
        <Label size={34} color={C.yellow}>
          EL NOMBRE
        </Label>
        <Label size={26} color={C.dim}>
          comentario de {n.autor} · {n.likes} me gusta
        </Label>
      </div>
      <div style={{ position: "absolute", left: 70, top: 352, width: 940, borderRadius: 24, overflow: "hidden", border: `3px solid ${C.yellow}88`, boxShadow: `0 0 40px ${C.yellow}33` }}>
        <Img src={staticFile(n.imagen)} style={{ width: 940, height: (940 * n.alto) / n.ancho, display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 590, display: "flex", alignItems: "center", gap: 28 }}>
        <Label size={34} color={C.yellow}>
          EL ESCUDO
        </Label>
        <Label size={26} color={C.dim}>
          comentario de {e.autor} · {e.likes} me gusta
        </Label>
      </div>
      <div style={{ position: "absolute", left: 70, top: 642, width: 640, borderRadius: 24, overflow: "hidden", border: `3px solid ${C.yellow}88`, boxShadow: `0 0 40px ${C.yellow}33` }}>
        <Img src={staticFile(e.imagen)} style={{ width: 640, height: (640 * e.alto) / e.ancho, display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 730, top: 660, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <Crest team={equipo(NUESTRO)} size={260} />
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 34, color: C.white, textAlign: "center", lineHeight: 1.1 }}>{equipo(NUESTRO).nombre.toUpperCase()}</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1120, fontFamily: DISPLAY, fontWeight: 800, fontSize: 32, color: TEAL, lineHeight: 1.3 }}>
        ¡Gracias {n.autor} y {e.autor}! Lo que sigue también se vota en los comentarios.
      </div>
      <Dots index={indice("eligieron")} />
      <Footer text={flecha("eligieron")} />
    </AbsoluteFill>
  );
};

/** Slide 3: todos los resultados de la fecha. */
export const SlideResultados: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
    <Background tint="#101a30" />
    <Header title="RESULTADOS" />
    <div style={{ position: "absolute", left: 60, right: 60, top: 340, display: "flex", flexDirection: "column", gap: 22 }}>
      {fecha.partidos.map((p) => {
        const ours = p.local === NUESTRO || p.visitante === NUESTRO;
        return (
          <div key={p.semilla} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 24px", borderRadius: 26, background: ours ? "rgba(255,225,77,0.1)" : "rgba(255,255,255,0.05)", border: `2px solid ${ours ? C.yellow : "rgba(255,255,255,0.12)"}` }}>
            <Crest team={equipo(p.local)} size={74} blank={sinEscudo(p.local)} />
            <div style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: p.local === NUESTRO ? C.yellow : C.white, lineHeight: 1.05 }}>{nombre(p.local)}</div>
            <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 64, color: C.white, minWidth: 150, textAlign: "center" }}>
              {p.gl}-{p.gv}
            </div>
            <div style={{ flex: 1, fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: p.visitante === NUESTRO ? C.yellow : C.white, textAlign: "right", lineHeight: 1.05 }}>{nombre(p.visitante)}</div>
            <Crest team={equipo(p.visitante)} size={74} blank={sinEscudo(p.visitante)} />
          </div>
        );
      })}
    </div>
    <div style={{ position: "absolute", left: 70, right: 70, top: 1170, fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, color: C.dim }}>Los partidos no se ven: cada resultado sale de un sorteo con semilla pública. La hinchada del club suma de local.</div>
    <Dots index={indice("resultados")} />
    <Footer text={flecha("resultados")} />
  </AbsoluteFill>
);

/** Las bengalas: cada compartido prende una en la tribuna para el próximo partido de local. */
export const SlideBengalas: React.FC = () => {
  const filas = [0, 100, 500, 1000];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
      <Background tint="#3a120a" />
      <Header title="NUEVO: BENGALAS" />
      <div style={{ position: "absolute", left: 50, top: 290, display: "flex", gap: 0 }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ rotate: `${(k - 1) * 14}deg`, marginTop: k === 1 ? -24 : 0 }}>
            <Bengala size={104} frame={k * 9} seed={k} />
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 380, right: 70, top: 320, fontFamily: DISPLAY, fontWeight: 800, fontSize: 38, color: C.white, lineHeight: 1.3 }}>
        Cada vez que <span style={{ color: "#ff8a3d" }}>compartís un video</span>, se prende una bengala en la tribuna.
      </div>
      <div style={{ position: "absolute", left: 380, right: 70, top: 500, fontFamily: DISPLAY, fontWeight: 600, fontSize: 28, color: C.dim, lineHeight: 1.35 }}>
        Cada una suma <span style={{ color: "#ffb27a" }}>0,05 % de chance de ganar</span>, solo de local. Cuentan los compartidos hasta el próximo partido en casa.
      </div>
      {RIVAL_LOCAL && PROXIMO_LOCAL ? (
        <>
          <div style={{ position: "absolute", left: 70, right: 70, top: 640, display: "flex", alignItems: "center", gap: 18 }}>
            <Crest team={equipo(RIVAL_LOCAL)} size={64} />
            <Label size={34} color={C.yellow}>
              FECHA {PROXIMO_LOCAL.fecha} · DE LOCAL vs {equipo(RIVAL_LOCAL).corto}
            </Label>
          </div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 740, display: "flex", flexDirection: "column", gap: 16 }}>
            {filas.map((b) => {
              const v = chanceLocalVs(RIVAL_LOCAL, fecha.hinchas, b);
              return (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 20, padding: "14px 24px", borderRadius: 22, background: b === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,138,61,0.1)", border: `2px solid ${b === 0 ? "rgba(255,255,255,0.14)" : "#ff8a3d66"}` }}>
                  <div style={{ width: 300, fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: b === 0 ? C.dim : "#ffb27a", whiteSpace: "nowrap" }}>{b === 0 ? "SIN BENGALAS" : `${fmt(b)} BENGALAS`}</div>
                  <div style={{ flex: 1, height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${v * 100}%`, height: "100%", background: b === 0 ? "#8a93a4" : "linear-gradient(90deg, #ff4d2d, #ffb27a)" }} />
                  </div>
                  <div style={{ width: 120, textAlign: "right", fontFamily: MONO, fontWeight: 800, fontSize: 44, color: b === 0 ? C.white : "#ffb27a" }}>{Math.round(v * 100)}%</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 70, right: 70, top: 1170, fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, color: C.dim }}>Chance de ganar con la hinchada de hoy ({fmt(fecha.hinchas)}). Cada bengala suma 0,05 %; con bengalas, el tope es 90 %.</div>
        </>
      ) : null}
      <Dots index={indice("bengalas")} />
      <Footer text={flecha("bengalas")} />
    </AbsoluteFill>
  );
};

/** Slide 4: tabla de posiciones. */
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
                <Crest team={equipo(f.id)} size={44} blank={sinEscudo(f.id)} />
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
    <div style={{ position: "absolute", left: 70, right: 70, top: 1196, fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, color: TEAL }}>
      {PROXIMO && RIVAL_PROXIMO ? `Fecha ${PROXIMO.fecha}: ${PROXIMO.local === NUESTRO ? "de local" : "de visitante"} contra ${equipo(RIVAL_PROXIMO).nombre}.` : "Fin de la temporada."}
    </div>
    <Dots index={indice("tabla")} />
    <Footer text={flecha("tabla")} />
  </AbsoluteFill>
);

/** Cuántos hinchas hay y en qué cancha: slide 5 del carrusel (y sirve para la historia). */
const CanchaHoy: React.FC<{ index?: number }> = ({ index }) => {
  const bengalas = DE_LOCAL ? (fecha.bengalas ?? 0) : 0;
  const cap = capacidadPara(fecha.hinchas);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, width: W, height: H }}>
      <Background tint="#0d2a1a" />
      <Header title={redes.mudanza || "LA CANCHA HOY"} />
      <div style={{ position: "absolute", left: 90, top: 330 }}>
        <Potrero hinchas={fecha.hinchas} frame={0} capacidad={cap} width={900} bengalas={bengalas} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 285, display: redes.mostrarRedes === false ? "none" : "flex", justifyContent: "center", gap: 16 }}>
        <Panel glow="#2f8cff" style={{ padding: "8px 20px" }}>
          <Label size={30} color="#7cb8ff">
            INSTAGRAM {fmt(redes.instagram)}
          </Label>
        </Panel>
        <Panel glow="#fe2c55" style={{ padding: "8px 20px" }}>
          <Label size={30} color="#ff6f8a">
            TIKTOK {fmt(redes.tiktok)}
          </Label>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1010, display: "flex", justifyContent: "center" }}>
        <Panel glow={TEAL} style={{ padding: "10px 30px", display: "flex", alignItems: "baseline", gap: 18 }}>
          <Label size={84} mono color={TEAL}>
            {fmt(fecha.hinchas)}
          </Label>
          <Label size={52} mono color={C.dim}>
            / {fmt(cap)}
          </Label>
          <Label size={38} color={C.white} style={{ marginLeft: 10 }}>
            HINCHAS
          </Label>
        </Panel>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1130, display: "flex", justifyContent: "center" }}>
        <Panel glow={C.yellow} style={{ padding: "12px 24px" }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: C.yellow, lineHeight: 1.3, textAlign: "center" }}>
            {DIAPOSITIVAS.includes("bengalas") && PROXIMO_LOCAL ? `Seguí para sumar hinchas y compartí para prender bengalas: cuentan en la fecha ${PROXIMO_LOCAL.fecha}.` : "Compartilo: cada seguidor nuevo es un hincha más en la tribuna."}
          </div>
        </Panel>
      </div>
      {index !== undefined ? <Dots index={index} /> : null}
    </AbsoluteFill>
  );
};

export const SlideCancha: React.FC = () => <CanchaHoy index={indice("cancha")} />;

/**
 * El mismo slide en 9:16 para TikTok: el contenido de 1080 × 1350 va centrado
 * (lejos de los botones de arriba y del texto de abajo) y el fondo se extiende.
 */
export const Vertical: React.FC<{ children: React.ReactNode; tint?: string }> = ({ children, tint = "#0d2a1a" }) => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Background tint={tint} />
    <div style={{ position: "absolute", left: 0, top: 190, width: W, height: H, maskImage: "linear-gradient(transparent, black 5%, black 95%, transparent)" }}>{children}</div>
  </AbsoluteFill>
);
/** La misma imagen sin los puntitos del carrusel, para la historia. */
export const HistoriaCancha: React.FC = () => <CanchaHoy />;
