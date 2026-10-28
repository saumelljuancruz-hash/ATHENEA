import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { MANOS, Personaje } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Escritorio, Semana, Taza, Tormenta, ticParpado } from "../componentes/Ojo";
import { TEXTOS } from "../guion-parpado";
import { MarcasParpado } from "../linea-parpado";
import { ESTILO } from "./Hook";

export type PropsCausas = { marcas: MarcasParpado["causas"]; duracion: number };

/** Etiqueta grande y redondeada de una causa. */
const Causa: React.FC<{ texto: string; x: number; y: number; e: number; color: string }> = ({
  texto,
  x,
  y,
  e,
  color,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      translate: "-50% -50%",
      scale: String(e),
      rotate: `${(x > 540 ? 1 : -1) * 4}deg`,
      fontFamily: FUENTE.inter,
      fontWeight: 800,
      fontSize: 40,
      color: "#fff",
      background: color,
      borderRadius: 999,
      padding: "12px 30px",
      boxShadow: "0 10px 24px rgba(120,50,30,0.25)",
      whiteSpace: "nowrap",
    }}
  >
    {texto}
  </div>
);

export const Causas: React.FC<PropsCausas> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.causas;
  const s = (seg: number) => seg * fps;

  const e = (t: number) => resorte(frame, fps, t, { damping: 11 });
  const cafes = Math.min(
    4,
    Math.max(
      0,
      Math.floor(
        interpolate(frame, [m.cafe - s(0.1), m.cafe + s(0.9)], [0, 4.99], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      ),
    ),
  );
  const dias = Math.min(
    7,
    Math.floor(
      interpolate(frame, [m.semana, m.semana + s(1)], [0, 7.99], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );

  const escena = (
    <AbsoluteFill style={{ scale: String(1.04 + 0.04 * Math.min(1, frame / s(4))) }}>
      <Escritorio frame={frame}>
        <Personaje
          x={420}
          y={1000}
          escala={1.0}
          {...ESTILO}
          expresion="aburrido"
          mirada={[0.8, 0.3]}
          manos={MANOS.costados}
          tic={ticParpado(frame)}
          frame={frame}
        />
        {/* Tazas de café que se acumulan sobre el escritorio */}
        {Array.from({ length: cafes }, (_, k) => (
          <Taza key={k} x={560 + k * 90} y={1060} escala={0.7} frame={frame + k * 10} />
        ))}
        {frame >= m.estres - s(0.1) ? <Tormenta x={420} y={520} escala={1.1 * e(m.estres)} frame={frame} /> : null}
      </Escritorio>
      <Causa texto={`😴 ${T.dormir}`} x={300} y={700} e={e(m.dormir)} color="#7b6cff" />
      <Causa texto={`⚡ ${T.estres}`} x={760} y={640} e={e(m.estres)} color="#8a8fba" />
      <Causa texto={`☕ ${T.cafe}`} x={790} y={780} e={e(m.cafe)} color="#a8683f" />
      <Causa texto={`📱 ${T.pantallas}`} x={330} y={860} e={e(m.pantallas)} color={COLOR.azul} />
    </AbsoluteFill>
  );

  const semana = (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffe6a8 0%, #ffb98f 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(540 880) scale(1.15) translate(-540 -880)">
          <Semana x={186} y={880} dias={dias} marcas={["😴", "☕", "📱", "😵", "☕", "📱", "😴"]} color="#ff7a3d" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 150,
          top: 600,
          textAlign: "center",
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 62,
          color: "#7a2e55",
          scale: String(e(m.semana + s(0.3))),
        }}
      >
        {T.semana} 🙃
      </div>
    </AbsoluteFill>
  );

  return (
    <Escena fondo={false} name="Causas">
      <Sfx efecto="pop" desde={m.dormir} volumen={0.3} />
      <Sfx efecto="pop" desde={m.estres} volumen={0.3} />
      <Sfx efecto="pop" desde={m.cafe} volumen={0.3} />
      <Sfx efecto="pop" desde={m.pantallas} volumen={0.3} />
      <Sfx efecto="ding" desde={m.semana + s(0.3)} volumen={0.3} />
      <Planos
        planos={[
          { desde: 0, contenido: escena },
          { desde: m.semana - s(0.1), contenido: semana },
        ]}
      />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={cafes} color="#a8683f" aparece={m.cafe} sale={m.semana} />
    </Escena>
  );
};
