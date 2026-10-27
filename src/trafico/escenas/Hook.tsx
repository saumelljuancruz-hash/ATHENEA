import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Cortes } from "../../comun/Cortes";
import { Escena } from "../../comun/Escena";
import { GanchoPantalla, LineaGancho } from "../../comun/Gancho";
import { ContadorHud } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { CALLE_PRINCIPAL, CarritoArriba, MapaCiudad } from "../componentes/Ciudad";
import { DATOS, TEXTOS } from "../guion-trafico";
import { MarcasTrafico } from "../linea-trafico";

export type PropsHook = { marcas: MarcasTrafico["hook"]; duracion: number };

export const Hook: React.FC<PropsHook> = ({ marcas: m, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;
  const carritoX = interpolate(frame, [0, duracion], [430, 560]);
  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="bip" desde={m.maps} volumen={0.2} />
      <Sfx efecto="pop" desde={m.carrito} volumen={0.3} />
      <Cortes
        cortes={[
          { desde: 0, zoom: 1.35, foco: [carritoX, CALLE_PRINCIPAL], destino: [540, 1080] },
          { desde: m.maps, zoom: 0.95, foco: [540, CALLE_PRINCIPAL], destino: [540, 1100] },
          { desde: m.carrito, zoom: 2.1, foco: [560, CALLE_PRINCIPAL], destino: [540, 1060] },
        ]}
      >
        <MapaCiudad rojo={interpolate(frame, [0, duracion], [0.75, 1])} frame={frame}>
          <CarritoArriba x={carritoX} y={CALLE_PRINCIPAL} frame={frame} escala={0.9} />
        </MapaCiudad>
      </Cortes>
      <GanchoPantalla lineas={T.gancho as LineaGancho[]} hasta={duracion} />
      <ContadorHud etiqueta={T.contador} valor={DATOS.celulares} color={COLOR.verde} aparece={m.carrito - 0.1 * fps} />
    </Escena>
  );
};
