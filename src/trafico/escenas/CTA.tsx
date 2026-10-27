import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { CALLE_PRINCIPAL, CarritoArriba, MapaCiudad } from "../componentes/Ciudad";
import { CUENTA, TEXTOS } from "../guion-trafico";
import { MarcasTrafico } from "../linea-trafico";

export type PropsCTA = { marcas: MarcasTrafico["cta"]; duracion: number; logoDisponible: boolean };

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
      <div style={{ position: "absolute", inset: 0, scale: "2", transformOrigin: `540px ${CALLE_PRINCIPAL}px` }}>
        <MapaCiudad frame={frame} rojo={1}>
          <CarritoArriba x={300 + ((frame * 1.5) % 500)} y={CALLE_PRINCIPAL} frame={frame} />
        </MapaCiudad>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        CON UN <span style={{ color: COLOR.rojo }}>CARRITO</span>
      </div>
    </>
  );
};
