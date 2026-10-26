import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { Espacio } from "../componentes/Espacio";
import { CUENTA, DATOS, TEXTOS } from "../guion-gps";
import { MarcasGps } from "../linea-gps";

export type PropsCTA = { marcas: MarcasGps["cta"]; duracion: number; logoDisponible: boolean };

export const CTA: React.FC<PropsCTA> = ({ duracion, logoDisponible }) => (
  <CierreCTA
    duracion={duracion}
    logoDisponible={logoDisponible}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
    textos={TEXTOS.cta}
    pantalla={<MiniReel />}
  />
);

/** Versión en miniatura de este Reel para la pantalla del teléfono. */
const MiniReel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <Espacio frame={frame} centro={[540, 760]} R={300} lonCentro={-62} latCentro={-48} transmiten={[0, 3, 7, 11, 16, 22]} senales={1} ubicacion={DATOS.ubicacion} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        TE <span style={{ color: COLOR.verde }}>ESCUCHA</span>
      </div>
    </>
  );
};
