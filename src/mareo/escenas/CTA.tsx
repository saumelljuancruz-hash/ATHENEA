import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { CUENTA, TEXTOS } from "../guion-mareo";
import { MarcasMareo } from "../linea-mareo";
import { EnElLiving } from "./Hook";

export type PropsCTA = { marcas: MarcasMareo["cta"]; duracion: number; logoDisponible: boolean };

export const CTA: React.FC<PropsCTA> = ({ duracion, logoDisponible }) => (
  <CierreCTA
    duracion={duracion}
    logoDisponible={logoDisponible}
    logo={CUENTA.logo}
    usuario={CUENTA.usuario}
    textos={TEXTOS.cta}
    pantalla={<MiniReel />}
    fondo={<AbsoluteFill style={{ background: "linear-gradient(180deg, #7a2e55, #e8604f)" }} />}
  />
);

/** Versión en miniatura de este Reel para la pantalla del teléfono. */
const MiniReel: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      <EnElLiving frame={frame} parada mareo={1} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1450,
          textAlign: "center",
          fontFamily: FUENTE.inter,
          fontWeight: 800,
          fontSize: 84,
          color: COLOR.texto,
          textShadow: "0 6px 20px rgba(0,0,0,0.5)",
        }}
      >
        <span style={{ color: "#ffe14d" }}>ESTRELLITAS</span>
      </div>
    </>
  );
};
