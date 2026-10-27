import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { entre } from "../../comun/anim";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { GanchoPantalla, LineaGancho } from "../../comun/Gancho";
import { Sfx } from "../../comun/Sonido";
import { Nubes, Ventanilla } from "../componentes/Ventana";
import { TEXTOS } from "../guion-ventanas";
import { MarcasVentanas } from "../linea-ventanas";

export type PropsHook = { marcas: MarcasVentanas["hook"]; duracion: number };

const IZQ = { x: 300, y: 1000 };
const DER = { x: 770, y: 1000 };

export const Hook: React.FC<PropsHook> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const grieta = entre(frame, m.cayeron - 0.1 * fps, m.cayeron + 0.7 * fps);
  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="estirar" desde={m.cayeron} volumen={0.35} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1, foco: [540, 1040], destino: [540, 1060] },
          { desde: m.cayeron, zoom: 1.45, foco: [IZQ.x + 60, IZQ.y - 60], destino: [540, 1060] },
          { desde: m.cuento, zoom: 1.05, foco: [540, 1040], destino: [540, 1060] },
        ]}
      >
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <rect width={1080} height={1920} fill="#8f949c" />
          {Array.from({ length: 30 }, (_, k) => (
            <circle key={k} cx={60 + (k % 10) * 108} cy={800 + Math.floor(k / 10) * 240} r={5} fill="#6f747d" />
          ))}
          <Ventanilla x={IZQ.x} y={IZQ.y} ancho={280} alto={350} redondez={0} grieta={grieta} tension={grieta} panel={false} cielo={<Nubes x={IZQ.x} y={IZQ.y} frame={frame} />} />
          <Ventanilla x={DER.x} y={DER.y} ancho={280} alto={350} redondez={1} panel={false} cielo={<Nubes x={DER.x} y={DER.y} frame={frame + 90} />} />
        </svg>
      </Cortes>
      <GanchoPantalla lineas={T.gancho as LineaGancho[]} hasta={duracion} />
    </Escena>
  );
};
