import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, random, staticFile, useCurrentFrame } from "remotion";
import { chanceDeLocal, Crest, equipo, EQUIPOS, Estadio, NUESTRO } from "../components/Futbol";
import { TEAL } from "../components/Props";
import { SFX } from "../components/sfx";
import { easeInOut, mix, pop, ramp, window01 } from "../components/anim";
import { Background, fmt, Label, Panel, shake } from "../components/Ui";
import fixture from "../liga/fixture.json";
import serie from "../serie.json";
import { C, DISPLAY, MONO } from "../theme";
import { beats, wordAt } from "../timeline";

// El club de la serie primero; el resto en el orden de la lista.
const ORDEN = [NUESTRO, ...EQUIPOS.map((e) => e.id).filter((id) => id !== NUESTRO)];
const PRIMERO = fixture[0].partidos.find((p) => p.local === NUESTRO || p.visitante === NUESTRO) as { local: string; visitante: string };

export const S7Final: React.FC = () => {
  const frame = useCurrentFrame();
  const [, sinPartidos, clave] = beats("final");
  const diez = wordAt("final", "10");
  const fecha = wordAt("final", "fecha");
  const big = wordAt("final", "big");
  const agujero = wordAt("final", "agujero");
  const resultados = wordAt("final", "resultados");
  const gente = wordAt("final", "gente");
  const cancha = wordAt("final", "cancha");
  const fuerte = wordAt("final", "fuerte");
  const local = wordAt("final", "local");

  const partA = window01(frame, 0, sinPartidos - 6);
  const partB = window01(frame, sinPartidos - 4, clave - 6);
  const partC = ramp(frame, clave - 4, clave + 6);
  const card = ramp(frame, resultados - 6, resultados + 8, pop);

  const filas = [
    { hinchas: serie.hinchas, nivel: 0, at: gente, hoy: true },
    { hinchas: 1000, nivel: 1, at: cancha, hoy: false },
    { hinchas: 100000, nivel: 3, at: fuerte, hoy: false },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ ...shake(frame, [big, agujero, resultados, fuerte], 10) }}>
        <Background tint={frame < clave ? "#101a30" : "#0d2a1a"} />

        {partA > 0 ? (
          <AbsoluteFill style={{ opacity: partA }}>
            {ORDEN.map((id, i) => {
              const team = equipo(id);
              const col = i % 5;
              const row = Math.floor(i / 5);
              const at = diez - 6 + i * 2.5;
              const show = ramp(frame, at, at + 10, pop);
              const spot = id === "DBB" ? ramp(frame, big - 4, big + 8, pop) - ramp(frame, agujero - 8, agujero) : id === "RAN" ? ramp(frame, agujero - 4, agujero + 8, pop) : 0;
              return (
                <div key={id} style={{ position: "absolute", left: 60 + col * 196, top: 300 + row * 330, width: 176, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: show, scale: String(mix(show, 0.4, 1) * (1 + Math.max(0, spot) * 0.3)), zIndex: spot > 0 ? 3 : 1 }}>
                  <Crest team={team} size={140} blank={id === NUESTRO} glow={Math.max(0, spot)} />
                  <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 21, color: id === NUESTRO ? C.yellow : C.white, textAlign: "center", lineHeight: 1.1, height: 48 }}>{team.corto}</div>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 990, display: "flex", justifyContent: "center", opacity: ramp(frame, fecha - 4, fecha + 6), scale: String(mix(ramp(frame, fecha - 4, fecha + 10, pop), 0.5, 1)) }}>
              <Panel glow={C.yellow} style={{ padding: "12px 28px" }}>
                <Label size={44} color={C.yellow}>
                  1 FECHA POR DÍA · {fixture.length} FECHAS
                </Label>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}

        {partB > 0 ? (
          <AbsoluteFill style={{ opacity: partB }}>
            {/* Una tele sin señal: los partidos no se ven */}
            <div style={{ position: "absolute", left: 160, top: 260, width: 760, height: 430, borderRadius: 30, background: "#0a0d14", border: "10px solid #2a3245", overflow: "hidden", opacity: 1 - card * 0.7, scale: String(1 - card * 0.1) }}>
              <svg width={740} height={410} style={{ position: "absolute" }}>
                {new Array(140).fill(0).map((_, i) => (
                  <rect key={i} x={random(`nx${i}-${frame % 6}`) * 740} y={random(`ny${i}-${frame % 6}`) * 410} width={6 + random(`nw${i}`) * 30} height={3} fill="#fff" opacity={0.15 + random(`no${i}-${frame % 6}`) * 0.4} />
                ))}
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 56, color: C.white, background: "rgba(0,0,0,0.6)", padding: "10px 26px", borderRadius: 16 }}>SIN TRANSMISIÓN</div>
              </div>
            </div>
            {/* Solo el resultado */}
            <div style={{ position: "absolute", left: 70, right: 70, top: 600, opacity: card, translate: `0px ${mix(card, 200, 0)}px` }}>
              <Panel glow={C.yellow} style={{ padding: "26px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Label size={30} color={C.dim}>
                    FECHA 1 · MAÑANA
                  </Label>
                  <Label size={30} color={TEAL}>
                    RESULTADO
                  </Label>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {[PRIMERO.local, PRIMERO.visitante].map((id, k) => (
                    <React.Fragment key={id}>
                      {k === 1 ? <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 96, color: C.yellow }}>? – ?</div> : null}
                      <div style={{ width: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                        <Crest team={equipo(id)} size={120} blank={id === NUESTRO} />
                        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 26, color: id === NUESTRO ? C.yellow : C.white, textAlign: "center" }}>{equipo(id).corto}</div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </Panel>
            </div>
          </AbsoluteFill>
        ) : null}

        {partC > 0 ? (
          <AbsoluteFill style={{ opacity: partC }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center" }}>
              <Label size={44} color={C.white}>
                CHANCE DE GANAR DE LOCAL
              </Label>
            </div>
            {filas.map((f, i) => {
              const show = ramp(frame, f.at - 4, f.at + 8, pop);
              const value = chanceDeLocal(f.hinchas);
              const bar = ramp(frame, f.at, f.at + 16, easeInOut) * value;
              const hoy = f.hoy && frame >= local ? 1 : 0;
              return (
                <div key={f.hinchas} style={{ position: "absolute", left: 70, right: 70, top: 380 + i * 250, opacity: show, translate: `${mix(show, -120, 0)}px 0px` }}>
                  <Panel glow={f.hoy ? C.yellow : TEAL} style={{ padding: "20px 26px", display: "flex", alignItems: "center", gap: 24, boxShadow: hoy ? `0 0 60px ${C.yellow}66` : undefined }}>
                    <Estadio nivel={f.nivel} size={150} lit={f.hoy ? 1 : 0} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <Label size={34} color={f.hoy ? C.yellow : C.white}>
                          {fmt(f.hinchas)} HINCHAS{f.hoy ? " · HOY" : ""}
                        </Label>
                        <Label size={60} mono color={f.hoy ? C.yellow : TEAL}>
                          {Math.round(bar * 100)}%
                        </Label>
                      </div>
                      <div style={{ height: 22, borderRadius: 11, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        <div style={{ width: `${bar * 100}%`, height: "100%", background: f.hoy ? C.yellow : TEAL }} />
                      </div>
                    </div>
                  </Panel>
                </div>
              );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", opacity: ramp(frame, local, local + 10) }}>
              <Label size={26} color={C.dim}>
                Resultados sorteados con semilla pública · la hinchada suma de local
              </Label>
            </div>
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>
      <Audio from={diez} src={staticFile("sfx/whoosh.wav")} volume={SFX.whoosh} />
      <Audio from={big} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={agujero} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      <Audio from={sinPartidos} src={staticFile("sfx/chispa.wav")} volume={SFX.chispa * 0.6} />
      <Audio from={resultados} src={staticFile("sfx/ding.wav")} volume={SFX.ding} />
      {filas.map((f) => (
        <Audio key={f.hinchas} from={f.at} src={staticFile("sfx/toque.wav")} volume={SFX.toque} />
      ))}
      <Audio from={local} src={staticFile("sfx/silbato.wav")} volume={SFX.silbato * 0.8} />
    </AbsoluteFill>
  );
};
