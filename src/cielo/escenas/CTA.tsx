import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { Paisaje } from "../componentes/Paisaje";
import { CUENTA, TEXTOS } from "../guion-cielo";
import { MarcasCielo } from "../linea-cielo";

export type PropsCTA = { marcas: MarcasCielo["cta"]; duracion: number; logoDisponible: boolean };

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
  const hora = (frame % 180) / 180;
  return (
    <>
      <Paisaje hora={hora} sol={{ x: 760, y: 360 + hora * 700 }} frame={frame} mirada={0.3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1500, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        ES <span style={{ color: COLOR.azul }}>LUZ</span>
      </div>
    </>
  );
};
