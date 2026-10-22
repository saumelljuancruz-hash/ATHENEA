import { Audio } from "@remotion/media";
import React, { createContext, useContext } from "react";
import { interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { intensidadVoz } from "./linea-de-tiempo";
import { PalabraConTiempo } from "./tipos";

/**
 * Biblioteca de efectos de la cuenta (generados con scripts/generar-audio.py),
 * con su volumen por defecto.
 */
export const EFECTOS = {
  whoosh: { src: "audio/sfx-whoosh.wav", volumen: 0.32 },
  pop: { src: "audio/sfx-pop.wav", volumen: 0.28 },
  tap: { src: "audio/sfx-tap.wav", volumen: 0.5 },
  motor: { src: "audio/sfx-motor.wav", volumen: 0.16 },
  estirar: { src: "audio/sfx-estirar.wav", volumen: 0.45 },
  zumbido: { src: "audio/sfx-zumbido.wav", volumen: 0.2 },
  bip: { src: "audio/sfx-bip.wav", volumen: 0.3 },
  candado: { src: "audio/sfx-candado.wav", volumen: 0.55 },
  microondas: { src: "audio/sfx-microondas.wav", volumen: 0.18 },
  burbujeo: { src: "audio/sfx-burbujeo.wav", volumen: 0.3 },
  ding: { src: "audio/sfx-ding.wav", volumen: 0.4 },
};

export const MUSICA = "audio/musica-suave.mp3";

export type Efecto = keyof typeof EFECTOS;

/** Permite silenciar los efectos de una escena (p. ej. cuando se reutiliza congelada). */
export const SfxActivos = createContext(true);

export const Sfx: React.FC<{ efecto: Efecto; desde: number; volumen?: number }> = ({ efecto, desde, volumen }) => {
  const activos = useContext(SfxActivos);
  if (!activos) return null;
  return (
    <Sequence from={Math.round(desde)} name={`sfx ${efecto}`} layout="none">
      <Audio src={staticFile(EFECTOS[efecto].src)} volume={volumen ?? EFECTOS[efecto].volumen} />
    </Sequence>
  );
};

/** Efecto en bucle (motor, zumbido) con fundidos de entrada y salida. */
export const Bucle: React.FC<{ efecto: Efecto; desde: number; duracion: number; volumen?: number }> = ({
  efecto,
  desde,
  duracion,
  volumen = EFECTOS[efecto].volumen,
}) => {
  const activos = useContext(SfxActivos);
  if (!activos || duracion <= 0) return null;
  const fundido = Math.min(30, duracion / 3);
  return (
    <Sequence from={Math.round(desde)} durationInFrames={Math.round(duracion)} name={`sfx ${efecto}`} layout="none">
      <Audio
        src={staticFile(EFECTOS[efecto].src)}
        loop
        volume={(f) => volumen * Math.min(1, f / fundido, Math.max(0, (duracion - f) / fundido))}
      />
    </Sequence>
  );
};

/** Voz en off (cortada en dos tramos si se insertó una pausa) + música con ducking. */
export const PistaDeAudio: React.FC<{
  voz: string;
  vozDisponible: boolean;
  pausaVoz: { corte: number; segundos: number } | null;
  palabras: PalabraConTiempo[];
  volumenVoz: number;
  volumenMusica: number;
  ducking: number;
}> = ({ voz, vozDisponible, pausaVoz, palabras, volumenVoz, volumenMusica, ducking }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const musica = (f: number) => {
    const duck = 1 - (1 - ducking) * intensidadVoz(palabras, f / fps);
    const fundidos = Math.min(
      interpolate(f, [0, 0.6 * fps], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(f, [durationInFrames - 1.2 * fps, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp" }),
    );
    return volumenMusica * duck * fundidos;
  };
  return (
    <>
      {vozDisponible && !pausaVoz ? <Audio src={staticFile(voz)} volume={volumenVoz} /> : null}
      {vozDisponible && pausaVoz ? (
        <>
          <Sequence name="Voz (1/2)" layout="none">
            <Audio src={staticFile(voz)} volume={volumenVoz} trimAfter={Math.round(pausaVoz.corte * fps)} />
          </Sequence>
          <Sequence name="Voz (2/2)" from={Math.round((pausaVoz.corte + pausaVoz.segundos) * fps)} layout="none">
            <Audio src={staticFile(voz)} volume={volumenVoz} trimBefore={Math.round(pausaVoz.corte * fps)} />
          </Sequence>
        </>
      ) : null}
      <Audio src={staticFile(MUSICA)} loop volume={musica} />
    </>
  );
};
