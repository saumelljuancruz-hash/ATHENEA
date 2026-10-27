import React from "react";
import { COLOR } from "../comun/tema";
import { Portada } from "../comun/Portada";
import { Telefono } from "../faceid/componentes/Telefono";
import { CALLE_PRINCIPAL, CarritoArriba, MapaCiudad, PantallaMapa } from "./componentes/Ciudad";
import { CUENTA, PORTADA, TEXTOS } from "./guion-trafico";

/** Portada: el mapa con la calle roja, el carrito de los 99 celulares y el teléfono avisando el embotellamiento. */
export const PortadaTrafico: React.FC = () => (
  <Portada
    fondo={
      <>
        <div style={{ position: "absolute", inset: 0, scale: "1.7", transformOrigin: `420px ${CALLE_PRINCIPAL - 120}px`, translate: "0 -300px" }}>
          <MapaCiudad frame={0} rojo={1} otras={0.3}>
            <CarritoArriba x={330} y={CALLE_PRINCIPAL} frame={0} escala={1.1} />
          </MapaCiudad>
        </div>
        <Telefono ubicacion={{ x: 800, y: 640, rot: 8, escala: 0.8 }} pantalla="apagada">
          <PantallaMapa rojo={1} banner={1} frame={0} texto={TEXTOS.carrito.embotellamiento} />
        </Telefono>
      </>
    }
    etiqueta={{ texto: PORTADA.etiqueta, color: COLOR.rojo }}
    lineas={[{ texto: PORTADA.lineas[0] }, { texto: PORTADA.lineas[1] }, { texto: PORTADA.lineas[2], color: COLOR.rojo }]}
    subrayado={COLOR.rojo}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
  />
);
