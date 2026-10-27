import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { COLOR } from "../../comun/tema";
import { MapaCiudad, PuntoCelular } from "../componentes/Ciudad";
import { TEXTOS } from "../guion-trafico";
import { puntosCiudad } from "./Nosotros";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<CiudadDeFondo />} />
);

/** La ciudad con todos sus celulares moviéndose, de fondo. */
export const CiudadDeFondo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <MapaCiudad frame={frame} rojo={1} otras={0.5}>
      {puntosCiudad(frame + 900).map((p) => (
        <PuntoCelular key={p.i} x={p.x} y={p.y} frame={frame} r={7} color={p.principal ? COLOR.rojo : COLOR.verde} fase={p.i} />
      ))}
    </MapaCiudad>
  );
};
