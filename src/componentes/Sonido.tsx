import { Audio } from "@remotion/media";
import React, { createContext, useContext } from "react";
import { Sequence, staticFile } from "remotion";
import { ARCHIVOS, VOLUMEN } from "../guion-avion";

/** Permite silenciar los efectos de una escena (p. ej. cuando se reutiliza congelada). */
export const SfxActivos = createContext(true);

type Efecto = keyof typeof ARCHIVOS.sfx;

export const Sfx: React.FC<{ efecto: Efecto; desde: number; volumen?: number }> = ({
  efecto,
  desde,
  volumen,
}) => {
  const activos = useContext(SfxActivos);
  if (!activos) return null;
  return (
    <Sequence from={Math.round(desde)} name={`sfx ${efecto}`} layout="none">
      <Audio
        src={staticFile(ARCHIVOS.sfx[efecto])}
        volume={volumen ?? VOLUMEN[efecto]}
      />
    </Sequence>
  );
};

/** Motor de avión lejano en bucle, con fundidos de entrada y salida. */
export const Motor: React.FC<{ desde: number; duracion: number; volumen?: number }> = ({
  desde,
  duracion,
  volumen = VOLUMEN.motor,
}) => {
  const activos = useContext(SfxActivos);
  if (!activos || duracion <= 0) return null;
  const fundido = Math.min(30, duracion / 3);
  return (
    <Sequence from={Math.round(desde)} durationInFrames={Math.round(duracion)} name="sfx motor" layout="none">
      <Audio
        src={staticFile(ARCHIVOS.sfx.motor)}
        loop
        volume={(f) =>
          volumen * Math.min(1, f / fundido, Math.max(0, (duracion - f) / fundido))
        }
      />
    </Sequence>
  );
};
