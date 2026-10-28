import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta, TituloSeccion } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { PiernaPorDentro, puntoNervio, T_APRIETE } from "../componentes/PiernaPorDentro";
import { TEXTOS } from "../guion-pierna";
import { MarcasPierna } from "../linea-pierna";

export type PropsCable = { marcas: MarcasPierna["cable"]; duracion: number };

export const Cable: React.FC<PropsCable> = ({ marcas: m }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.cable;
  const s = (seg: number) => seg * fps;

  const cable = frame >= m.cable - s(0.1) && frame < m.apretas ? 1 : 0;
  const apriete = entre(frame, m.apretas - s(0.1), m.apretas + s(0.5));
  const bloqueo = entre(frame, m.apretas + s(0.2), m.apretas + s(1.2));
  const dormido = entre(frame, m.nada - s(0.1), m.nada + s(0.4));
  const pinch = puntoNervio(T_APRIETE);

  return (
    <Escena fondo={false} name="Cable">
      <Sfx efecto="ping" desde={m.nervio} volumen={0.25} />
      <Sfx efecto="estirar" desde={m.apretas} volumen={0.35} />
      <Sfx efecto="pop" desde={m.nada} volumen={0.25} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [480, 950] },
          { desde: m.nervio, zoom: 1.35, foco: [420, 860] },
          { desde: m.cable, zoom: 2.1, foco: [300, 806] },
          { desde: m.apretas, zoom: 1.6, foco: [pinch[0] + 60, 880] },
          { desde: m.nada, zoom: 1.5, foco: [780, 1100] },
        ]}
      >
        <PiernaPorDentro frame={frame} apriete={apriete} bloqueo={bloqueo} caos={0} dormido={dormido} cable={cable} />
      </Cortes>
      <AbsoluteFill>
        <HudEtiqueta
          ancla={{ x: 540, y: 820 }}
          caja={{ x: 110, y: 520 }}
          texto={T.nervio}
          color="#d97a00"
          aparece={m.nervio + s(0.2)}
          desaparece={m.apretas}
          tamano={30}
        />
        <HudEtiqueta
          ancla={{ x: 560, y: 880 }}
          caja={{ x: 110, y: 520 }}
          texto={T.apretado}
          color={COLOR.rojo}
          aparece={m.apretas + s(0.4)}
          desaparece={m.nada}
          tamano={30}
        />
      </AbsoluteFill>
      <TituloSeccion numero={T.seccion} titulo={T.titulo} />
      <ContadorHud
        etiqueta={T.contador}
        valor={interpolate(bloqueo, [0, 1], [100, 0])}
        unidad="%"
        color={bloqueo > 0.5 ? COLOR.rojo : COLOR.verde}
        aparece={s(0.3)}
      />
    </Escena>
  );
};
