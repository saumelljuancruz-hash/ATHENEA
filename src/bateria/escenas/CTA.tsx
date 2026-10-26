import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { Pila } from "../componentes/Bateria";
import { CUENTA, TEXTOS } from "../guion-bateria";
import { MarcasBateria } from "../linea-bateria";

export type PropsCTA = { marcas: MarcasBateria["cta"]; duracion: number; logoDisponible: boolean };

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
  const calor = 0.5 + 0.5 * Math.sin(frame / 30);
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, background: "#16171a" }}>
        <Pila x={540} y={820} alto={820} nivel={0.8} frame={frame} calor={calor} porcentaje={false} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        ES EL <span style={{ color: COLOR.naranjaCalor }}>CALOR</span>
      </div>
    </>
  );
};
