import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, resorte } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Living } from "../../comun/personajes/Lugares";
import { MANOS, Personaje } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR, FUENTE } from "../../comun/tema";
import { Corazon, Sangre } from "../componentes/Cuerpo";
import { TEXTOS } from "../guion-mareo";
import { MarcasMareo } from "../linea-mareo";
import { ESTILO } from "./Hook";
import { FondoCuerpo } from "./Gravedad";

export type PropsRescate = { marcas: MarcasMareo["rescate"]; duracion: number };

const Chip: React.FC<{ texto: string; aparece: number; activo: boolean; top: number }> = ({
  texto,
  aparece,
  activo,
  top,
}) => (
  <div
    style={{
      position: "absolute",
      left: 110,
      top,
      scale: String(aparece),
      transformOrigin: "left center",
      fontFamily: FUENTE.inter,
      fontWeight: 800,
      fontSize: 46,
      color: activo ? "#2b1d3a" : "#fff",
      background: activo ? COLOR.verde : "rgba(36,22,52,0.6)",
      borderRadius: 999,
      padding: "14px 34px",
      boxShadow: activo ? `0 10px 30px ${COLOR.verde}66` : "none",
    }}
  >
    {texto}
  </div>
);

export const Rescate: React.FC<PropsRescate> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.rescate;
  const s = (seg: number) => seg * fps;

  const acelera = entre(frame, m.corazon - s(0.1), m.corazon + s(0.5));
  const bpm = Math.round(
    interpolate(acelera, [0, 1], [70, 100]) -
      interpolate(frame, [m.subir, m.truco], [0, 18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const aprietan = entre(frame, m.vasos - s(0.1), m.vasos + s(0.4));
  const vuelve = entre(frame, m.subir - s(0.2), m.truco - s(0.1));
  const paso1 = resorte(frame, fps, m.truco + s(0.2), { damping: 12 });
  const paso2 = resorte(frame, fps, m.pasos, { damping: 12 });
  const enPie = frame >= m.pasos + s(0.3);

  const cuerpo = (
    <AbsoluteFill>
      <FondoCuerpo />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 880], destino: [540, 1000] },
          { desde: m.corazon, zoom: 2, foco: [560, 795], destino: [540, 880] },
          { desde: m.vasos, zoom: 1.35, foco: [540, 1100], destino: [540, 960] },
          { desde: m.subir, zoom: 1, foco: [540, 880], destino: [540, 1000] },
        ]}
      >
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <g opacity={0.5}>
            <Personaje
              x={540}
              y={1000}
              escala={1.05}
              {...ESTILO}
              expresion={vuelve > 0.6 ? "sonrisa" : "mareo"}
              manos={MANOS.costados}
              tambaleo={0.4 * (1 - vuelve)}
              frame={frame}
            />
          </g>
          <Sangre x={540} y={1000} escala={1.05} abajo={1 - vuelve} frame={frame} sube={aprietan * (1 - vuelve)} />
          <Corazon x={560} y={795} tamano={70 + 12 * acelera} frame={frame} bpm={bpm} fps={fps} />
        </svg>
      </Cortes>
    </AbsoluteFill>
  );

  const truco = (
    <AbsoluteFill style={{ scale: "1.02" }}>
      <Living frame={frame}>
        {enPie ? (
          <Personaje
            x={540}
            y={1000}
            escala={1.05}
            {...ESTILO}
            expresion="sonrisa"
            manos={MANOS.costados}
            frame={frame}
          />
        ) : (
          <Personaje
            x={540}
            y={1100}
            escala={1.05}
            pose="sentado"
            {...ESTILO}
            expresion="neutra"
            manos={{ izq: [-120, -10], der: [120, -10] }}
            frame={frame}
          />
        )}
      </Living>
      <Chip texto={T.paso1} aparece={paso1} activo={!enPie} top={430} />
      <Chip texto={T.paso2} aparece={paso2} activo={enPie} top={540} />
    </AbsoluteFill>
  );

  return (
    <Escena fondo={false} name="Rescate">
      <Sfx efecto="tap" desde={m.corazon} volumen={0.35} />
      <Sfx efecto="estirar" desde={m.vasos} volumen={0.3} />
      <Sfx efecto="brillo" desde={m.subir} volumen={0.3} />
      <Sfx efecto="pop" desde={m.truco + s(0.2)} volumen={0.3} />
      <Sfx efecto="pop" desde={m.pasos} volumen={0.3} />
      <Planos
        planos={[
          { desde: 0, contenido: cuerpo },
          { desde: m.truco - s(0.1), contenido: truco },
        ]}
      />
      <AbsoluteFill style={{ opacity: frame < m.truco - s(0.1) ? 1 : 0 }}>
        <HudEtiqueta
          ancla={{ x: 600, y: 780 }}
          caja={{ x: 110, y: 520 }}
          texto={T.corazon}
          color={COLOR.rojo}
          aparece={m.corazon + s(0.2)}
          desaparece={m.vasos}
          tamano={30}
        />
        <HudEtiqueta
          ancla={{ x: 580, y: 1060 }}
          caja={{ x: 110, y: 520 }}
          texto={T.vasos}
          color={COLOR.verde}
          aparece={m.vasos + s(0.3)}
          tamano={30}
        />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud etiqueta={T.contador} valor={bpm} color={COLOR.rojo} aparece={s(0.2)} sale={m.truco} />
    </Escena>
  );
};
