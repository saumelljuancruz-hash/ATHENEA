import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { GanchoPantalla, LineaGancho } from "../../comun/Gancho";
import { ContadorHud } from "../../comun/Hud";
import { Bano } from "../../comun/personajes/Lugares";
import { MANOS, PELOS, PIELES, Personaje } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { TEXTOS } from "../guion-pierna";
import { MarcasPierna } from "../linea-pierna";

export type PropsHook = { marcas: MarcasPierna["hook"]; duracion: number };

/** El personaje de este Reel (siempre el mismo). */
export const ESTILO = { piel: PIELES[1], pelo: PELOS[1], remera: "#ffc94a", pantalon: "#4a6fd1", semilla: 3 };
export const TONO_GANCHO = "58,32,84";

/** Sentado en el inodoro con el celular, aburrido. */
export const EnElBano: React.FC<{ frame: number }> = ({ frame }) => (
  <Bano>
    <Personaje
      x={540}
      y={1035}
      escala={1.05}
      pose="sentado"
      {...ESTILO}
      expresion="aburrido"
      mirada={[0, 0.7]}
      manos={MANOS.celular}
      celular
      frame={frame}
    />
  </Bano>
);

export const Hook: React.FC<PropsHook> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const parado = frame >= m.existe - 0.1 * fps;
  const minutos = interpolate(frame, [0, m.media + 0.5 * fps], [12, 30], { extrapolateRight: "clamp" });
  const tambalea = entre(frame, m.existe, m.existe + 0.3 * fps);

  return (
    <Escena entrada={false} fondo={false} name="Hook">
      <Sfx efecto="tap" desde={m.existe} volumen={0.4} />
      <Sfx efecto="estirar" desde={m.existe + 6} volumen={0.3} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 900], destino: [540, 1080] },
          { desde: m.existe, zoom: 0.95, foco: [540, 900], destino: [540, 1020] },
          { desde: m.paso, zoom: 1.7, foco: [540, 640], destino: [540, 820] },
        ]}
      >
        {parado ? (
          <Bano>
            <Personaje
              x={540}
              y={980}
              escala={1.05}
              {...ESTILO}
              expresion="sorpresa"
              mirada={[0.3, 1]}
              manos={MANOS.pierna}
              piernaFloja={1}
              tambaleo={0.6 * tambalea}
              frame={frame}
            />
          </Bano>
        ) : (
          <EnElBano frame={frame} />
        )}
      </Cortes>
      <GanchoPantalla lineas={T.gancho as LineaGancho[]} hasta={m.existe - 6} tono={TONO_GANCHO} />
      <ContadorHud
        etiqueta={TEXTOS.tranqui.contador}
        valor={minutos}
        color={COLOR.naranja}
        aparece={0.3 * fps}
        sale={m.existe}
      />
    </Escena>
  );
};
