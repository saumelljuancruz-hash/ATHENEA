import React from "react";
import { useCurrentFrame } from "remotion";
import { flotar } from "../../comun/anim";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { Paisaje } from "../../cielo/componentes/Paisaje";
import { Anillos, AvionLateral } from "../componentes/Vuelo";
import { CUENTA, TEXTOS } from "../guion-modoavion";
import { MarcasModoAvion } from "../linea-modoavion";

export type PropsCTA = { marcas: MarcasModoAvion["cta"]; duracion: number; logoDisponible: boolean };

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
  const y = 760 + flotar(frame, 120, 14);
  return (
    <>
      <Paisaje hora={0.12} sol={{ x: 820, y: 360 }} frame={frame} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <Anillos x={540} y={y + 40} frame={frame} intensidad={1} alcance={460} periodo={30} />
        <AvionLateral x={540} y={y} escala={1.2} inclinacion={-4} corte={1} celulares={0.6} frame={frame} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1450, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        ES <span style={{ color: COLOR.verde }}>RUIDO</span>
      </div>
    </>
  );
};
