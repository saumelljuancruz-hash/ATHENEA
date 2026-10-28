import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { Bano } from "../comun/personajes/Lugares";
import { MANOS, Personaje } from "../comun/personajes/Personaje";
import { ESTILO } from "./escenas/Hook";
import { CUENTA, PORTADA } from "./guion-pierna";

/** Portada: parado en el baño con la pierna floja y cara de susto. */
export const PortadaPierna: React.FC = () => (
  <Portada
    fondo={
      <div style={{ position: "absolute", inset: 0, translate: "0 -150px", scale: "1.05" }}>
        <Bano>
          <Personaje
            x={540}
            y={980}
            escala={1.05}
            {...ESTILO}
            expresion="sorpresa"
            mirada={[0.3, 1]}
            manos={MANOS.pierna}
            piernaFloja={1}
            frame={40}
          />
        </Bano>
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
    tono="58,32,84"
  />
);
