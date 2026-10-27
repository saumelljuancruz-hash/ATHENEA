import React from "react";
import { useCurrentFrame } from "remotion";
import { flotar } from "../../comun/anim";
import { RemateLineas } from "../../comun/RemateLineas";
import { TarjetaApp } from "../componentes/Apps";
import { APPS, TEXTOS } from "../guion-apps";

export type PropsRemate = { duracion: number };

export const Remate: React.FC<PropsRemate> = ({ duracion }) => (
  <RemateLineas duracion={duracion} lineas={TEXTOS.remate} fondo={<AppsDurmiendo />} />
);

/** Apps dormidas (congeladas) flotando, de fondo. */
export const AppsDurmiendo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {APPS.map((app, k) => (
        <TarjetaApp
          key={app.nombre}
          x={220 + (k % 3) * 320}
          y={560 + Math.floor(k / 3) * 560 + flotar(frame, 200, 14, k)}
          ancho={240}
          alto={420}
          app={app}
          frame={frame + k * 15}
          hielo={1}
          rot={(k % 2 ? 1 : -1) * 4}
        />
      ))}
    </svg>
  );
};
