import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Dormitorio } from "../../comun/personajes/Lugares";
import { Cabeza } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { ticParpado } from "../componentes/Ojo";
import { TEXTOS } from "../guion-parpado";
import { MarcasParpado } from "../linea-parpado";
import { CaraConTic, ESTILO } from "./Hook";

export type PropsTranqui = { marcas: MarcasParpado["tranqui"]; duracion: number };

export const Tranqui: React.FC<PropsTranqui> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.tranqui;
  const s = (seg: number) => seg * fps;

  const pasan = entre(frame, m.dias - s(0.3), m.medico - s(0.4));
  const dia = 1 + Math.floor(pasan * 3.99);
  const tarjeta = resorte(frame, fps, m.medico, { damping: 12 });
  const guino = resorte(frame, fps, m.guinando, { damping: 10 });

  const dias = (
    <AbsoluteFill>
      <CaraConTic frame={frame} expresion={pasan > 0.7 ? "sonrisa" : "neutra"} tic={ticParpado(frame) * (1 - pasan)} />
      <div
        style={{
          position: "absolute",
          left: 110,
          right: 150,
          top: 330,
          display: "flex",
          gap: 18,
          justifyContent: "center",
        }}
      >
        {[1, 2, 3, 4].map((d) => (
          <div
            key={d}
            style={{
              width: 150,
              padding: "14px 0",
              borderRadius: 22,
              textAlign: "center",
              fontFamily: FUENTE.inter,
              fontWeight: 800,
              fontSize: 34,
              color: d <= dia ? "#fff" : "#7a2e55",
              background: d <= dia ? COLOR.verde : "rgba(255,255,255,0.6)",
              scale: String(d === dia ? 1.08 : 1),
            }}
          >
            día {d}
            {d < dia || (d === 4 && pasan > 0.95) ? " ✓" : ""}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );

  const medico = (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #c9f1ff 0%, #e6dcff 100%)" }}>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 900 + flotar(frame, 160, 6),
          translate: "-50% -50%",
          scale: String(tarjeta),
          width: 760,
          padding: "50px 40px",
          borderRadius: 48,
          background: "#fff",
          boxShadow: "0 30px 60px rgba(90,60,140,0.25)",
          textAlign: "center",
          fontFamily: FUENTE.inter,
        }}
      >
        <div style={{ fontSize: 150 }}>🩺</div>
        <div style={{ fontWeight: 800, fontSize: 54, color: "#5b3a8c", marginTop: 10 }}>{T.medico}</div>
      </div>
    </AbsoluteFill>
  );

  const guinando = (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffd1e0 0%, #ffc9a8 100%)" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g
          transform={`translate(540 1000) scale(${4.2 + 0.2 * guino}) rotate(${6 * Math.sin(frame / 6) * entre(frame, m.guinando + s(0.5), m.guinando + s(0.7))})`}
        >
          <Cabeza
            {...ESTILO}
            expresion="sonrisa"
            frame={frame}
            semilla={ESTILO.semilla}
            tic={frame < m.guinando + s(0.5) ? 1.5 * guino : 0}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );

  const descanso = (
    <AbsoluteFill
      style={{
        scale: String(
          interpolate(frame, [m.descanso, m.descanso + s(2)], [1.15, 1.05], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        ),
      }}
    >
      <Dormitorio frame={frame}>
        <g transform="translate(400 1030) rotate(-80) scale(1.25)">
          <Cabeza {...ESTILO} expresion="dormido" frame={frame} semilla={ESTILO.semilla} />
        </g>
        <path d="M 470 1060 Q 760 1000 1020 1060 L 1020 1310 L 470 1310 Z" fill="#7b8cff" />
        {["z", "z", "Z"].map((z, k) => (
          <text
            key={k}
            x={470 + k * 50}
            y={880 - k * 60 - 10 * Math.sin(frame / 15 + k)}
            fill="#fff4cf"
            fontFamily={FUENTE.inter}
            fontWeight={800}
            fontSize={50 + k * 18}
            opacity={0.85}
          >
            {z}
          </text>
        ))}
      </Dormitorio>
    </AbsoluteFill>
  );

  return (
    <Escena fondo={false} name="Tranqui">
      <Sfx efecto="ding" desde={m.dias + s(0.5)} volumen={0.25} />
      <Sfx efecto="pop" desde={m.medico} volumen={0.3} />
      <Sfx efecto="tap" desde={m.guinando} volumen={0.35} />
      <Sfx efecto="brillo" desde={m.descanso} volumen={0.3} />
      <Planos
        planos={[
          { desde: 0, contenido: dias },
          { desde: m.medico - s(0.1), contenido: medico },
          { desde: m.guinando - s(0.1), contenido: guinando },
          { desde: m.descanso - s(0.1), contenido: descanso },
        ]}
      />
      <HudEtiqueta
        ancla={{ x: 600, y: 900 }}
        caja={{ x: 110, y: 520 }}
        texto={T.dias}
        color={COLOR.verde}
        aparece={m.dias + s(0.3)}
        desaparece={m.medico - s(0.1)}
        tamano={30}
      />
      <HudEtiqueta
        ancla={{ x: 560, y: 980 }}
        caja={{ x: 110, y: 520 }}
        texto={T.descanso}
        color="#7b6cff"
        aparece={m.descanso + s(0.4)}
        tamano={30}
      />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={dia} color={COLOR.verde} aparece={m.dias} sale={m.medico} />
    </Escena>
  );
};
