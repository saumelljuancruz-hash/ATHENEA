import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { CaraConTic } from "./escenas/Hook";
import { CUENTA, PORTADA } from "./guion-parpado";

/** Portada: la cara con el párpado temblando y las rayitas del tic. */
export const PortadaParpado: React.FC = () => (
  <Portada
    fondo={
      <div style={{ position: "absolute", inset: 0, translate: "0 -300px" }}>
        <CaraConTic frame={40} tic={0.8} />
      </div>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.rojo }}
    lineas={[
      { texto: PORTADA.lineas[0] },
      { texto: PORTADA.lineas[1] },
      { texto: PORTADA.lineas[2], color: COLOR.rojo },
    ]}
    subrayado={COLOR.rojo}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
    tono="70,30,80"
  />
);
