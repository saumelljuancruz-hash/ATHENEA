import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { Espacio } from "../componentes/Espacio";
import { DATOS, TEXTOS } from "../guion-gps";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<GloboConOrbitas />} />
);

/** Globo con satélites girando sin parar, de fondo. */
const GloboConOrbitas: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Espacio
      frame={frame * 2}
      centro={[720, 900]}
      R={330}
      lonCentro={-60 + frame * 0.2}
      latCentro={-30}
      transmiten={[1, 6, 13, 19, 25]}
      senales={0.6}
      ubicacion={DATOS.ubicacion}
    />
  );
};
