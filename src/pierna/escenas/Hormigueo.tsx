import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Bano } from "../../comun/personajes/Lugares";
import { MANOS, Personaje } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { PiernaPorDentro } from "../componentes/PiernaPorDentro";
import { TEXTOS } from "../guion-pierna";
import { MarcasPierna } from "../linea-pierna";
import { ESTILO } from "./Hook";

export type PropsHormigueo = { marcas: MarcasPierna["hormigueo"]; duracion: number };

export const Hormigueo: React.FC<PropsHormigueo> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hormigueo;
  const s = (seg: number) => seg * fps;

  const suelta = entre(frame, m.paras - s(0.1), m.paras + s(0.5));
  const despierta = entre(frame, m.despierta - s(0.1), m.despierta + s(0.3));
  const caos = entre(frame, m.golpe - s(0.1), m.golpe + s(0.3));
  const senales =
    interpolate(suelta, [0, 1], [0, 40]) +
    interpolate(caos, [0, 1], [0, 60]) +
    caos * 12 * Math.abs(Math.sin(frame / 3));

  const pierna = (
    <Cortes
      cortes={[
        { desde: 0, zoom: 1.4, foco: [400, 880] },
        { desde: m.despierta, zoom: 1.7, foco: [790, 1150] },
        { desde: m.golpe, zoom: 1.05, foco: [500, 950] },
      ]}
    >
      <PiernaPorDentro frame={frame} apriete={1 - suelta} bloqueo={1 - suelta} caos={caos} dormido={1 - despierta} />
    </Cortes>
  );

  // Parado sacudiendo la pierna, con chispas alrededor.
  const persona = (
    <Bano>
      <Personaje
        x={540}
        y={980}
        escala={1.05}
        {...ESTILO}
        expresion="dolor"
        mirada={[0.4, 1]}
        manos={MANOS.pierna}
        piernaFloja={0.6}
        tambaleo={0.5}
        frame={frame}
      />
      {Array.from({ length: 14 }, (_, k) => {
        const vida = ((frame + k * 9) % 22) / 22;
        const r = 10 + 20 * vida;
        return (
          <path
            key={k}
            transform={`translate(${600 + (random(`px${k}`) - 0.3) * 200} ${1000 + random(`py${k}`) * 260})`}
            d={`M 0 ${-r} L ${r * 0.25} ${-r * 0.25} L ${r} 0 L ${r * 0.25} ${r * 0.25} L 0 ${r} L ${-r * 0.25} ${r * 0.25} L ${-r} 0 L ${-r * 0.25} ${-r * 0.25} Z`}
            fill="#ffe14d"
            opacity={1 - vida}
          />
        );
      })}
    </Bano>
  );

  return (
    <Escena fondo={false} name="Hormigueo">
      <Sfx efecto="whoosh" desde={m.paras} volumen={0.25} />
      <Sfx efecto="ping" desde={m.despierta} volumen={0.3} />
      <Sfx efecto="zumbido" desde={m.golpe} volumen={0.22} />
      <Sfx efecto="burbujeo" desde={m.hormigueo} volumen={0.2} />
      <Planos
        planos={[
          { desde: 0, contenido: pierna },
          {
            desde: m.hormigueo - s(0.1),
            contenido: <AbsoluteFill style={{ scale: "1.1", transformOrigin: "50% 60%" }}>{persona}</AbsoluteFill>,
          },
        ]}
      />
      <HudEtiqueta
        ancla={{ x: 540, y: 900 }}
        caja={{ x: 110, y: 520 }}
        texto={T.hormigueo}
        color="#d97a00"
        aparece={m.golpe + s(0.4)}
        tamano={30}
      />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={Math.min(100, senales)}
        unidad="%"
        color={caos > 0.5 ? COLOR.naranja : COLOR.verde}
        aparece={s(0.2)}
      />
    </Escena>
  );
};
