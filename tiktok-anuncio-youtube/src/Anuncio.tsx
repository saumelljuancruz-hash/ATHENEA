import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Ui";
import { A1Gancho, A2Intro, A3Cuerpo, A4Bucle, A5Final, A6Cta } from "./scenes/Anuncio";
import { C } from "./theme";
import { piece, type PieceId } from "./timeline";

const ESCENAS: [PieceId, string, React.FC][] = [
  ["gancho", "1 · No te lo conté", A1Gancho],
  ["intro", "2 · Ahora en YouTube", A2Intro],
  ["cuerpo", "3 · Videos largos", A3Cuerpo],
  ["bucle", "4 · El primer video", A4Bucle],
  ["final", "5 · El link en el perfil", A5Final],
  ["cta", "6 · Seguime acá", A6Cta],
];

export const Anuncio: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Series>
        {ESCENAS.map(([id, name, Escena]) => (
          <Series.Sequence key={id} name={name} durationInFrames={piece(id).durationInFrames}>
            <Escena />
          </Series.Sequence>
        ))}
      </Series>
      <Captions />
      <Watermark />
      <Audio name="Voz en off" src={staticFile("voiceover/voz-en-off.mp3")} volume={0.6} />
      <Audio
        name="Colchón musical"
        src={staticFile("sfx/colchon.mp3")}
        volume={(f) => interpolate(f, [0, 12, durationInFrames - 30, durationInFrames], [0, 0.5, 0.5, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};
