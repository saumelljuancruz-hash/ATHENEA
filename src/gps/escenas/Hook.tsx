import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud, HudEtiqueta } from "../../comun/Hud";
import { Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Espacio, puntoEnGlobo } from "../componentes/Espacio";
import { DATOS, TEXTOS } from "../guion-gps";
import { MarcasGps } from "../linea-gps";

export type PropsHook = { marcas: MarcasGps["hook"]; duracion: number };

/** Satélites que "hablan" con el celular en el gancho. */
const TRANSMITEN = [0, 3, 7, 11, 16, 22];

export const Hook: React.FC<PropsHook> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;

  const R = interpolate(frame, [0, duracion], [330, 360]);
  const centro: [number, number] = [505, 860 + flotar(frame, 220, 6)];
  const lon = -62 + frame * 0.03;
  const lat = -48;
  const pin = puntoEnGlobo(centro, R, lon, lat, DATOS.ubicacion);
  const tachado = entre(frame, marcas.nada, marcas.nada + 0.3 * fps);
  const escucha = entre(frame, marcas.escucha - 6, marcas.escucha + 0.3 * fps);

  return (
    <Escena entrada={false} name="Hook">
      <Sfx efecto="ping" desde={6} />
      <Sfx efecto="ping" desde={marcas.escucha} volumen={0.3} />
      <Espacio
        frame={frame}
        centro={centro}
        R={R}
        lonCentro={lon}
        latCentro={lat}
        visibles={0.55}
        transmiten={TRANSMITEN}
        senales={0.5 + 0.5 * escucha}
        ubicacion={DATOS.ubicacion}
      >
        {(pin) => (
          // Flecha hacia arriba tachada: el celular no le manda nada al satélite.
          <g opacity={tachado}>
            <line x1={pin.x} y1={pin.y - 70} x2={pin.x} y2={pin.y - 190} stroke={COLOR.rojo} strokeWidth={4} strokeDasharray="8 8" />
            <path d={`M${pin.x - 14} ${pin.y - 174} L${pin.x} ${pin.y - 194} L${pin.x + 14} ${pin.y - 174}`} fill="none" stroke={COLOR.rojo} strokeWidth={4} />
            <g transform={`translate(${pin.x} ${pin.y - 130}) scale(${0.6 + 0.4 * tachado})`}>
              <circle r={26} fill="rgba(8,9,11,0.85)" stroke={COLOR.rojo} strokeWidth={3} />
              <path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke={COLOR.rojo} strokeWidth={5} strokeLinecap="round" />
            </g>
          </g>
        )}
      </Espacio>
      <AbsoluteFill>
        <HudEtiqueta ancla={{ x: pin.x + 12, y: pin.y - 20 }} caja={{ x: pin.x + 150, y: pin.y + 90 }} texto={T.escucha} color={COLOR.verde} aparece={marcas.escucha} tamano={26} />
      </AbsoluteFill>
      <ContadorHud etiqueta={T.contador} valor={0} unidad="bytes" color={COLOR.verde} aparece={marcas.nada} />
    </Escena>
  );
};
