import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Planos } from "../../comun/Planos";
import { Living } from "../../comun/personajes/Lugares";
import { Cabeza } from "../../comun/personajes/Personaje";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Cerebro as CerebroDibujo } from "../componentes/Cuerpo";
import { TEXTOS } from "../guion-mareo";
import { MarcasMareo } from "../linea-mareo";
import { ESTILO } from "./Hook";
import { FondoCuerpo } from "./Gravedad";

export type PropsCerebro = { marcas: MarcasMareo["cerebro"]; duracion: number };

export const Cerebro: React.FC<PropsCerebro> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.cerebro;
  const s = (seg: number) => seg * fps;

  const baja = entre(frame, s(0.2), m.menos + s(0.8));
  const nivel = interpolate(baja, [0, 1], [1, 0.7]);
  const vision = entre(frame, m.puntitos - s(0.1), m.puntitos + s(0.4));
  const gira = entre(frame, m.mareas - s(0.1), m.mareas + s(0.6));

  // Cabeza grande con el cerebro adentro y una gota que sube con poca sangre.
  const cabeza = (
    <AbsoluteFill>
      <FondoCuerpo />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <g transform="translate(540 880) scale(4.2)" opacity={0.55}>
          <Cabeza {...ESTILO} expresion="sorpresa" frame={frame} semilla={ESTILO.semilla} />
        </g>
        <CerebroDibujo x={540} y={690} tamano={190} nivel={nivel} frame={frame} />
        {/* Gotitas que llegan cada vez menos */}
        {Array.from({ length: 8 }, (_, k) => {
          const a = ((frame + k * 11) % 60) / 60;
          return (
            <circle
              key={k}
              cx={520 + (k % 3) * 20}
              cy={1250 - a * 380}
              r={11}
              fill="#e8304d"
              opacity={(1 - a) * (k < 8 * nivel - 2 ? 1 : 0.15)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );

  // Lo que ves: el living con puntitos que brillan y que gira un poco.
  const pov = (
    <AbsoluteFill
      style={{
        rotate: `${gira * 6 * Math.sin(frame / 14)}deg`,
        scale: String(1.12 + 0.04 * gira * Math.sin(frame / 9)),
        filter: `blur(${2 * vision}px)`,
      }}
    >
      <Living frame={frame} />
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, transparent 25%, rgba(40,14,50,0.9) 75%)",
          opacity: vision,
        }}
      />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 40 }, (_, k) => {
          const vida = ((frame + k * 13) % 40) / 40;
          return (
            <circle
              key={k}
              cx={random(`x${k}`) * 1080}
              cy={300 + random(`y${k}`) * 1200}
              r={4 + 10 * Math.sin(Math.PI * vida)}
              fill="#fff7c2"
              opacity={vision * Math.sin(Math.PI * vida)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );

  return (
    <Escena fondo={false} name="Cerebro">
      <Sfx efecto="bip" desde={m.menos} volumen={0.25} />
      <Sfx efecto="brillo" desde={m.puntitos} volumen={0.35} />
      <Sfx efecto="estirar" desde={m.mareas} volumen={0.25} />
      <Planos
        planos={[
          { desde: 0, contenido: cabeza },
          { desde: m.puntitos - s(0.1), contenido: pov },
        ]}
      />
      <HudEtiqueta
        ancla={{ x: 600, y: 700 }}
        caja={{ x: 110, y: 470 }}
        texto={T.menos}
        color={COLOR.rojo}
        aparece={m.menos + s(0.2)}
        desaparece={m.puntitos - s(0.1)}
        tamano={30}
      />
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={nivel * 100}
        unidad="%"
        color={nivel < 0.85 ? COLOR.rojo : COLOR.verde}
        aparece={s(0.2)}
      />
    </Escena>
  );
};
