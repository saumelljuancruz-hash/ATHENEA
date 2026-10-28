import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { EnElLiving } from "./escenas/Hook";
import { CUENTA, PORTADA } from "./guion-mareo";

/** Portada: parada frente al sillón, mareada, con estrellitas girando. */
export const PortadaMareo: React.FC = () => (
  <Portada
    fondo={
      <div style={{ position: "absolute", inset: 0, translate: "0 -170px", scale: "1.05" }}>
        <EnElLiving frame={20} parada mareo={1} />
      </div>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.rojo }}
    lineas={[
      { texto: PORTADA.lineas[0] },
      { texto: PORTADA.lineas[1], color: "#ffc94a" },
      { texto: PORTADA.lineas[2] },
    ]}
    subrayado="#ffc94a"
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
    tono="88,36,60"
  />
);
