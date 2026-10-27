import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { Nubes, Ventanilla } from "./componentes/Ventana";
import { CUENTA, PORTADA } from "./guion-ventanas";

/** Portada: la ventanilla con esquinas, agrietada y en rojo, al lado de la redondeada. */
export const PortadaVentanas: React.FC = () => (
  <Portada
    fondo={
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect width={1080} height={1920} fill="#8f949c" />
        <Ventanilla x={330} y={720} ancho={300} alto={380} redondez={0} grieta={1} tension={1} panel={false} cielo={<Nubes x={330} y={720} frame={30} />} />
        <Ventanilla x={790} y={720} ancho={240} alto={330} redondez={1} panel={false} cielo={<Nubes x={790} y={720} frame={120} />} />
      </svg>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.rojo }}
    lineas={[{ texto: PORTADA.lineas[0] }, { texto: PORTADA.lineas[1] }, { texto: PORTADA.lineas[2], color: COLOR.rojo }]}
    subrayado={COLOR.rojo}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
  />
);
