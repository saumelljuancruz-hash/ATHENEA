import React from "react";
import { random, useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { CUENTA, TEXTOS } from "../guion-acaros";
import { MarcasAcaros } from "../linea-acaros";
import { Acaro, POROS, SuperficiePiel } from "../componentes/Piel";

export type PropsCTA = { marcas: MarcasAcaros["cta"]; duracion: number; logoDisponible: boolean };

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
    <PielDeNoche />
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
      }}
    >
      ESTÁS <span style={{ color: COLOR.verde }}>HABITADO</span>
    </div>
  </>
);

/** Piel de noche con ácaros caminando despacito (para la pantalla del CTA). */
const PielDeNoche: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <SuperficiePiel poros={POROS} noche={0.8}>
      {POROS.slice(0, 10).map((p, k) => {
        const dir = random(`r${k}`) * 360;
        const rad = (dir * Math.PI) / 180;
        const d = 60 + frame * 0.35;
        return (
          <Acaro
            key={k}
            x={p.x + Math.sin(rad) * d}
            y={p.y - Math.cos(rad) * d}
            escala={0.42}
            rot={dir}
            frame={frame}
            camina={1}
          />
        );
      })}
    </SuperficiePiel>
  );
};
