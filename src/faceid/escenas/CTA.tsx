import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { dibujarBusto, dibujarPuntos } from "../cabeza";
import { Lienzo } from "../componentes/Lienzo";
import { CUENTA, TEXTOS } from "../guion-faceid";
import { MarcasFaceId } from "../linea-faceid";
import { CAM_BUSTO } from "./encuadres";

export type PropsCTA = { marcas: MarcasFaceId["cta"]; duracion: number; logoDisponible: boolean };

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
  const cam = { ...CAM_BUSTO, yaw: 0.45 * Math.sin(frame / 40), escala: 300, centro: [540, 720] as [number, number] };
  return (
    <>
      <Lienzo
        dibujar={(ctx) => {
          dibujarBusto(ctx, cam, { luz: 0.6 });
          dibujarPuntos(ctx, cam, { aparicion: 1, aterrizaje: 1, tamano: 3.2 });
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        TE MIDE <span style={{ color: COLOR.verde }}>EN 3D</span>
      </div>
    </>
  );
};
