import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Ui";
import { G1Gancho, G2Partido, G3Tabla, G4Bengalas, G5Regla, G6Numeros, G7Manana, G8Cta } from "./scenes/Fecha3";
import { C } from "./theme";
import { piece, type PieceId } from "./timeline";

const ESCENAS: [PieceId, string, React.FC][] = [
  ["gancho", "1 · Revancha", G1Gancho],
  ["partido", "2 · Seis goles", G2Partido],
  ["tabla", "3 · Cuartos", G3Tabla],
  ["bengalas", "4 · Las bengalas", G4Bengalas],
  ["regla", "5 · Solo de local", G5Regla],
  ["numeros", "6 · Las chances", G6Numeros],
  ["manana", "7 · Mañana", G7Manana],
  ["cta", "8 · Compartilo", G8Cta],
];

export const Fecha3: React.FC = () => {
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
