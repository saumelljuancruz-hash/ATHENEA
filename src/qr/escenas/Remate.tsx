import React from "react";
import { useCurrentFrame } from "remotion";
import { RemateLineas } from "../../comun/RemateLineas";
import { DISPOSICION, TarjetaQr } from "../componentes/Qr";
import { TEXTOS } from "../guion-qr";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<QrGirando />} />
);

/** QR grande girando despacio, de fondo. */
const QrGirando: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920}>
      <TarjetaQr d={{ ...DISPOSICION, cx: 720, cy: 900, escala: 1.25, rot: 12 + frame * 0.25 }} o={{ esquinas: 0.6 + 0.4 * Math.sin(frame / 8), frame }} />
    </svg>
  );
};
