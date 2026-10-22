import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { entre, flotar } from "../../comun/anim";
import { Escena } from "../../comun/Escena";
import { ContadorHud } from "../../comun/Hud";
import { Bucle, Sfx } from "../../comun/Sonido";
import { COLOR } from "../../comun/tema";
import { Escenario } from "../componentes/Escenario";
import { DATOS, TEXTOS } from "../guion-faceid";
import { MarcasFaceId } from "../linea-faceid";
import { CAM_BUSTO, conYaw, TEL_ESCENA } from "./encuadres";

export type PropsHook = { marcas: MarcasFaceId["hook"]; duracion: number };

export const Hook: React.FC<PropsHook> = ({ marcas, duracion }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = TEXTOS.hook;

  // De golpe: en "te tira" la cara se llena de puntos.
  const aparicion = entre(frame, marcas.puntos, marcas.puntos + 0.9 * fps);
  const aterrizaje = entre(frame, marcas.puntos + 0.15 * fps, marcas.puntos + 1.2 * fps);
  const rayos = entre(frame, marcas.puntos, marcas.puntos + 0.2 * fps) * (1 - entre(frame, marcas.invisibles, duracion));
  const emision = entre(frame, marcas.cara, marcas.cara + 0.3 * fps);

  const cam = conYaw(CAM_BUSTO, -0.28 + 0.22 * Math.sin(frame / 70), {
    escala: interpolate(frame, [0, duracion], [255, 285]),
  });

  return (
    <Escena entrada={false} name="Hook">
      <Bucle efecto="zumbido" desde={marcas.cara} duracion={duracion - marcas.cara + 10} />
      <Sfx efecto="bip" desde={marcas.puntos} volumen={0.2} />
      <Sfx efecto="bip" desde={marcas.invisibles} />
      <Escenario
        cam={cam}
        busto={{ luz: 0.5 + 0.12 * emision }}
        puntos={{ aparicion, aterrizaje, rayos }}
        telefono={{
          ubicacion: { ...TEL_ESCENA, y: TEL_ESCENA.y + flotar(frame, 160, 6), rot: TEL_ESCENA.rot + flotar(frame, 200, 1.2) },
          pantalla: "bloqueado",
          emision,
        }}
      />
      <ContadorHud
        etiqueta={T.contador}
        prefijo="+"
        valor={DATOS.puntos * aparicion}
        unidad={T.unidad}
        color={COLOR.magenta}
        aparece={marcas.puntos}
      />
    </Escena>
  );
};
