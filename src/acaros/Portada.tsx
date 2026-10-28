import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { CaraConLupa } from "./escenas/Hook";
import { CUENTA, PORTADA, TEXTOS } from "./guion-acaros";

/** Portada: la cara dormida con la lupa mostrando un ácaro saliendo del poro. */
export const PortadaAcaros: React.FC = () => (
  <Portada
    fondo={
      <div style={{ position: "absolute", inset: 0, translate: "0 -320px" }}>
        <CaraConLupa frame={0} asoma={1} zoomLupa={1.6} etiqueta={TEXTOS.hook.lupa} />
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
  />
);
