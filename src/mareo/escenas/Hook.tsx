import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { GanchoPantalla, LineaGancho } from "../../comun/Gancho";
import { Living } from "../../comun/personajes/Lugares";
import { MANOS, PELOS, PIELES, Personaje } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { Estrellitas } from "../componentes/Cuerpo";
import { TEXTOS } from "../guion-mareo";
import { MarcasMareo } from "../linea-mareo";

export type PropsHook = { marcas: MarcasMareo["hook"]; duracion: number };

/** La protagonista de este Reel (siempre la misma). */
export const ESTILO = {
  piel: PIELES[2],
  pelo: PELOS[0],
  peinado: "rulos" as const,
  remera: "#3ee0c0",
  pantalon: "#5b3a8c",
  semilla: 5,
};
export const TONO_GANCHO = "88,36,60";

/** En el living: sentada en el sillón o parada y mareada. */
export const EnElLiving: React.FC<{ frame: number; parada: boolean; mareo: number }> = ({ frame, parada, mareo }) => (
  <Living frame={frame}>
    {parada ? (
      <>
        <Personaje
          x={540}
          y={1000}
          escala={1.05}
          {...ESTILO}
          expresion={mareo > 0.3 ? "mareo" : "sorpresa"}
          manos={MANOS.cabeza}
          tambaleo={mareo}
          frame={frame}
        />
        <Estrellitas x={540} y={580} radio={150} frame={frame} intensidad={mareo} />
      </>
    ) : (
      <Personaje
        x={540}
        y={1080}
        escala={1.05}
        pose="sentado"
        {...ESTILO}
        expresion="sonrisa"
        mirada={[-0.5, 0]}
        manos={MANOS.costados}
        frame={frame}
      />
    )}
  </Living>
);

export const Hook: React.FC<PropsHook> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const parada = frame >= m.estrellitas - 0.35 * fps;
  const mareo = entre(frame, m.estrellitas - 0.2 * fps, m.estrellitas + 0.4 * fps);
  const negro = entre(frame, m.negro - 0.1 * fps, m.negro + 0.3 * fps) * (1 - entre(frame, m.paso - 0.4 * fps, m.paso));

  return (
    <Escena entrada={false} fondo={false} name="Hook">
      <Sfx efecto="whoosh" desde={m.estrellitas - 0.35 * fps} volumen={0.3} />
      <Sfx efecto="brillo" desde={m.estrellitas} volumen={0.35} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 880], destino: [540, 1080] },
          { desde: m.estrellitas, zoom: 1.25, foco: [540, 760], destino: [540, 1000] },
          { desde: m.paso, zoom: 1.9, foco: [540, 640], destino: [540, 820] },
        ]}
      >
        <EnElLiving frame={frame} parada={parada} mareo={mareo} />
      </Cortes>
      {/* "Todo se pone negro" */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, transparent 10%, rgba(30,10,40,0.97) 60%)",
          opacity: negro,
        }}
      />
      <AbsoluteFill style={{ opacity: negro }}>
        <svg width={1080} height={1920}>
          <Estrellitas x={540} y={960} radio={260} frame={frame} intensidad={1} n={8} />
        </svg>
      </AbsoluteFill>
      <GanchoPantalla lineas={T.gancho as LineaGancho[]} hasta={m.negro} tono={TONO_GANCHO} />
    </Escena>
  );
};
