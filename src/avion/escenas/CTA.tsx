import React from "react";
import { useCurrentFrame } from "remotion";
import { CierreCTA } from "../../comun/CierreCTA";
import { COLOR, FUENTE } from "../../comun/tema";
import { Avion } from "../componentes/Avion";
import { MapaMaqueta } from "../componentes/MapaMaqueta";
import { polilineaAPath, puntoEnPolilinea, rutaGranCirculo } from "../geo";
import { CUENTA, TEXTOS } from "../guion-avion";
import { MarcasAvion } from "../linea-avion";
import { PLACA_PACIFICO } from "./encuadres";

export type PropsCTA = { marcas: MarcasAvion["cta"]; duracion: number; logoDisponible: boolean };

const GC = rutaGranCirculo(100);

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
  const vuelta = (frame % 150) / 150;
  return (
    <>
      <MapaMaqueta estado={{ ...PLACA_PACIFICO, rotacion: [147 + Math.sin(frame / 50) * 2, 0, 0] }} mostrarGrilla={false}>
        {(p) => {
          const pts = GC.map((pt) => p(pt) as [number, number]);
          const a = puntoEnPolilinea(pts, vuelta);
          return (
            <>
              <path d={polilineaAPath(pts)} fill="none" stroke={COLOR.verde} strokeWidth={10} strokeLinecap="round" />
              <Avion x={a.x} y={a.y} angulo={a.angulo} tamano={90} />
            </>
          );
        }}
      </MapaMaqueta>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", fontFamily: FUENTE.inter, fontWeight: 800, fontSize: 84, color: COLOR.texto }}>
        ES UNA <span style={{ color: COLOR.verde }}>RECTA</span>
      </div>
    </>
  );
};
