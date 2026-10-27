import React from "react";
import { COLOR, FUENTE } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { Telefono } from "../faceid/componentes/Telefono";
import { Cable, Rayo } from "./componentes/Bateria";
import { Dormitorio } from "./escenas/Hook";
import { CUENTA, PORTADA } from "./guion-bateria";

/** Portada: el celular cargando a las 03:47, con la batería en rojo y calor. */
export const PortadaBateria: React.FC = () => (
  <Portada
    fondo={
      <>
        <Dormitorio frame={0} />
        <div style={{ position: "absolute", left: 540 - 480, top: 700 - 480, width: 960, height: 960, borderRadius: "50%", background: `radial-gradient(${COLOR.naranjaCalor}55, transparent 62%)` }} />
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Cable d="M540 1010 C 540 1060 700 1050 820 1040 S 1000 1020 1090 1000" largo={720} flujo={1} frame={0} grosor={14} />
        </svg>
        <Telefono ubicacion={{ x: 540, y: 720, rot: -6, escala: 0.95 }} pantalla="apagada">
          <text x={0} y={-150} textAnchor="middle" fill={COLOR.texto} fontFamily={FUENTE.inter} fontWeight={500} fontSize={88}>
            03:47
          </text>
          <g transform="translate(0 70) scale(1.3)">
            <rect x={-70} y={-34} width={140} height={68} rx={14} fill="none" stroke={COLOR.naranjaCalor} strokeWidth={5} />
            <rect x={70} y={-12} width={10} height={24} rx={3} fill={COLOR.naranjaCalor} />
            <rect x={-62} y={-26} width={124} height={52} rx={8} fill={COLOR.naranjaCalor} />
            <Rayo x={0} y={0} tamano={44} color="#fff" />
          </g>
          <text x={0} y={190} textAnchor="middle" fill={COLOR.naranjaCalor} fontFamily={FUENTE.mono} fontWeight={700} fontSize={26}>
            100 % · 41 °C
          </text>
        </Telefono>
      </>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.naranjaCalor }}
    lineas={[{ texto: PORTADA.lineas[0] }, { texto: PORTADA.lineas[1] }, { texto: PORTADA.lineas[2], color: COLOR.naranjaCalor }]}
    subrayado={COLOR.naranjaCalor}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
  />
);
