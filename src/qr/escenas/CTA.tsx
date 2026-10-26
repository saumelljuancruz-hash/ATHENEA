import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { DISPOSICION, N, TarjetaQr, Visor } from "../componentes/Qr";
import { CUENTA, TEXTOS } from "../guion-qr";
import { MarcasQr } from "../linea-qr";

export type PropsCTA = { marcas: MarcasQr["cta"]; duracion: number; logoDisponible: boolean };

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
  const d = { ...DISPOSICION, cx: 540, cy: 760, escala: 1.1 };
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <TarjetaQr d={d} o={{ esquinas: 1, frame }} />
        <Visor cx={d.cx} cy={d.cy} lado={N * d.modulo * d.escala + 120} barrido={(frame % 90) / 90} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        CON <span style={{ color: COLOR.verde }}>REPUESTO</span>
      </div>
    </>
  );
};
