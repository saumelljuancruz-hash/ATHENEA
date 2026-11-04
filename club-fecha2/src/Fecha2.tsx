import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Ui";
import { F1Gancho, F2Partido, F3Tabla, F4Hinchada, F5Manana, F6Chance, F7Cta } from "./scenes/Fecha2";
import { C } from "./theme";
import { piece, type PieceId } from "./timeline";

const ESCENAS: [PieceId, string, React.FC][] = [
  ["gancho", "1 · Perdimos 6-3", F1Gancho],
  ["partido", "2 · Nueve goles", F2Partido],
  ["tabla", "3 · Sextos", F3Tabla],
  ["hinchada", "4 · La tribuna crece", F4Hinchada],
  ["manana", "5 · Mañana de local", F5Manana],
  ["chance", "6 · La chance", F6Chance],
  ["cta", "7 · Compartilo", F7Cta],
];

export const Fecha2: React.FC = () => {
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
