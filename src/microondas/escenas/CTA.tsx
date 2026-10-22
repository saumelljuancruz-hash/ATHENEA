import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { Microondas } from "../componentes/Microondas";
import { CUENTA, TEXTOS } from "../guion-microondas";
import { MarcasMicroondas } from "../linea-microondas";

export type PropsCTA = { marcas: MarcasMicroondas["cta"]; duracion: number; logoDisponible: boolean };

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
      <Microondas ubicacion={{ x: 540, y: 760, escala: 1.15 }} rot={frame * 0.05} tempComida={0.8} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        ES <span style={{ color: COLOR.verde }}>AGUA</span>
      </div>
    </>
  );
};
