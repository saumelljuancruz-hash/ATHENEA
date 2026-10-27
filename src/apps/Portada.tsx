import React from "react";
import { COLOR, FUENTE } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { Pila } from "../bateria/componentes/Bateria";
import { Telefono } from "../faceid/componentes/Telefono";
import { CerrandoApps } from "./escenas/Hook";
import { CUENTA, PORTADA, TEXTOS } from "./guion-apps";

/** Portada: el selector de apps cerrando todo, la batería en rojo y el sello de MITO. */
export const PortadaApps: React.FC = () => (
  <Portada
    fondo={
      <>
        <Telefono ubicacion={{ x: 400, y: 720, rot: -6, escala: 0.95 }} pantalla="apagada">
          <CerrandoApps frame={8} />
        </Telefono>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <Pila x={820} y={760} alto={420} nivel={0.16} frame={0} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 600,
            top: 470,
            translate: "-50% -50%",
            rotate: "-12deg",
            border: `7px solid ${COLOR.rojo}`,
            borderRadius: 16,
            padding: "4px 34px",
            fontFamily: FUENTE.inter,
            fontWeight: 800,
            fontSize: 96,
            letterSpacing: 5,
            color: COLOR.rojo,
            background: "rgba(22,23,26,0.75)",
            boxShadow: `0 0 40px ${COLOR.rojo}55`,
          }}
        >
          {TEXTOS.hook.mito}
        </div>
      </>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.rojo }}
    lineas={[{ texto: PORTADA.lineas[0] }, { texto: PORTADA.lineas[1] }, { texto: PORTADA.lineas[2], color: COLOR.rojo }]}
    subrayado={COLOR.rojo}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
  />
);
