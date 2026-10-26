import React from "react";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { CUENTA, TEXTOS } from "../guion-algoritmo";
import { MarcasAlgoritmo } from "../linea-algoritmo";
import { MultitudDeFondo } from "./Remate";

export type PropsCTA = { marcas: MarcasAlgoritmo["cta"]; duracion: number; logoDisponible: boolean };

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
const MiniReel: React.FC = () => (
  <>
    <MultitudDeFondo />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
      TE <span style={{ color: COLOR.verde }}>MIDE</span>
    </div>
  </>
);
