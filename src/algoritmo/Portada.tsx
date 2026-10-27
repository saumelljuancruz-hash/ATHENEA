import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { Telefono } from "../faceid/componentes/Telefono";
import { ReelEnPantalla } from "./escenas/Hook";
import { MultitudDeFondo } from "./escenas/Remate";
import { CUENTA, PORTADA } from "./guion-algoritmo";

/** Portada: un Reel escaneándote, sobre una multitud con las personas parecidas encendidas. */
export const PortadaAlgoritmo: React.FC = () => (
  <Portada
    fondo={
      <>
        <MultitudDeFondo />
        <div style={{ position: "absolute", left: 540 - 450, top: 680 - 450, width: 900, height: 900, borderRadius: "50%", background: `radial-gradient(${COLOR.verde}33, transparent 62%)` }} />
        <Telefono ubicacion={{ x: 540, y: 680, rot: 5, escala: 0.9 }} pantalla="apagada">
          <ReelEnPantalla frame={40} progreso={0.62} />
          <rect x={-138} y={-40} width={276} height={40} fill={COLOR.verde} opacity={0.15} />
          <line x1={-138} x2={138} y1={0} y2={0} stroke={COLOR.verde} strokeWidth={4} />
          {[
            [-138, -298],
            [138, -298],
            [-138, 298],
            [138, 298],
          ].map(([x, y], k) => (
            <path key={k} d={`M ${x} ${y + (y < 0 ? 40 : -40)} L ${x} ${y} L ${x + (x < 0 ? 40 : -40)} ${y}`} fill="none" stroke={COLOR.verde} strokeWidth={7} />
          ))}
        </Telefono>
      </>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.verde }}
    lineas={[{ texto: PORTADA.lineas[0] }, { texto: PORTADA.lineas[1] }, { texto: PORTADA.lineas[2], color: COLOR.verde }]}
    subrayado={COLOR.verde}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
  />
);
