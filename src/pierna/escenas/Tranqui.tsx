import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { flotar, resorte } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Bano } from "../../comun/personajes/Lugares";
import { MANOS, Personaje } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { TEXTOS } from "../guion-pierna";
import { MarcasPierna } from "../linea-pierna";
import { ESTILO } from "./Hook";

export type PropsTranqui = { marcas: MarcasPierna["tranqui"]; duracion: number };

/** Pantalla del celular con el tiempo en el baño (coordenadas de la escena). */
const PantallaTiempo: React.FC<{ minutos: number; frame: number }> = ({ minutos, frame }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #ffd9b8, #ffb08f)" }}>
    <div
      style={{
        position: "absolute",
        left: 540 - 230,
        top: 520 + flotar(frame, 160, 6),
        width: 460,
        height: 820,
        borderRadius: 60,
        background: "#22252b",
        border: "10px solid #3a3d44",
        boxShadow: "0 30px 60px rgba(120,60,30,0.35)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        rotate: `${-4 + 2 * Math.sin(frame / 30)}deg`,
      }}
    >
      <div style={{ fontFamily: FUENTE.mono, fontSize: 30, color: "#a7abb3" }}>tiempo de pantalla · baño</div>
      <div style={{ fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 150, color: COLOR.naranja }}>
        {Math.round(minutos)}′
      </div>
      <div style={{ width: 300, height: 18, borderRadius: 9, background: "#3a3d44", overflow: "hidden" }}>
        <div style={{ width: `${Math.min(100, (minutos / 35) * 100)}%`, height: "100%", background: COLOR.naranja }} />
      </div>
    </div>
  </AbsoluteFill>
);

export const Tranqui: React.FC<PropsTranqui> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.tranqui;
  const s = (seg: number) => seg * fps;
  const guino = resorte(frame, fps, m.poquito, { damping: 10 });
  const minutos = interpolate(frame, [m.celular, duracion], [30, 32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const paso = frame / 10;

  return (
    <Escena fondo={false} name="Tranqui">
      <Sfx efecto="ding" desde={m.rato + s(0.2)} volumen={0.3} />
      <Sfx efecto="bip" desde={m.celular} volumen={0.25} />
      <Sfx efecto="pop" desde={m.poquito} volumen={0.3} />
      <Planos
        planos={[
          {
            desde: 0,
            contenido: (
              <AbsoluteFill style={{ scale: "1.05" }}>
                <Bano>
                  <Personaje
                    x={540 + 6 * Math.sin(paso)}
                    y={980 - 8 * Math.abs(Math.sin(paso))}
                    escala={1.05}
                    {...ESTILO}
                    expresion="sonrisa"
                    manos={{ izq: [-110, -60 + 20 * Math.sin(paso)], der: [110, -60 - 20 * Math.sin(paso)] }}
                    frame={frame}
                  />
                </Bano>
              </AbsoluteFill>
            ),
          },
          { desde: m.celular - s(0.1), contenido: <PantallaTiempo minutos={minutos} frame={frame} /> },
          {
            desde: m.poquito - s(0.1),
            contenido: (
              <AbsoluteFill style={{ scale: String(1.25 + 0.1 * guino), transformOrigin: "50% 45%" }}>
                <Bano>
                  <Personaje
                    x={540}
                    y={1035}
                    escala={1.05}
                    pose="sentado"
                    {...ESTILO}
                    expresion="sonrisa"
                    mirada={[1, -0.4]}
                    manos={MANOS.celular}
                    celular
                    frame={frame}
                  />
                </Bano>
              </AbsoluteFill>
            ),
          },
        ]}
      />
      <HudEtiqueta
        ancla={{ x: 600, y: 760 }}
        caja={{ x: 110, y: 520 }}
        texto={T.rato}
        color={COLOR.verde}
        aparece={m.rato + s(0.3)}
        desaparece={m.celular - s(0.1)}
        tamano={30}
      />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={minutos} color={COLOR.naranja} aparece={m.celular} />
    </Escena>
  );
};
