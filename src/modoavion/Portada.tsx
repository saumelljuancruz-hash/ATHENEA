import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { Paisaje } from "../cielo/componentes/Paisaje";
import { Anillos, AvionLateral, Torre } from "./componentes/Vuelo";
import { CUENTA, PORTADA } from "./guion-modoavion";

/** Portada: el avión en picada, con las señales del celular rojas saliendo de la cabina. */
export const PortadaModoAvion: React.FC = () => (
  <Portada
    fondo={
      <>
        <Paisaje hora={0.35} saturacion={0.85} sol={{ x: 900, y: 470 }} frame={0} horizonte={1180} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          {[0, 14, 28].map((d) => (
            <Anillos key={d} x={560} y={760} frame={d} intensidad={1} alcance={520} periodo={42} color={COLOR.rojo} />
          ))}
          <Torre x={160} y={1150} escala={0.9} frame={0} saturada={1} recibe={1} />
          <Torre x={900} y={1170} escala={0.9} frame={0} saturada={1} recibe={1} />
          <AvionLateral x={560} y={700} escala={1.25} inclinacion={14} corte={1} celulares={0.85} frame={0} />
        </svg>
      </>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.rojo }}
    lineas={[{ texto: PORTADA.lineas[0] }, { texto: PORTADA.lineas[1] }, { texto: PORTADA.lineas[2], color: COLOR.rojo }]}
    subrayado={COLOR.rojo}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
  />
);
