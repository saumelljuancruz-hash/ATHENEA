import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Ui";
import { R1Gancho, R2Nombre, R3Escudo, R4Hinchada, R5Mudanza, R6Partido, R7Manana, R8Cta } from "./scenes/Resumen";
import { C } from "./theme";
import { piece, type PieceId } from "./timeline";

const ESCENAS: [PieceId, string, React.FC][] = [
  ["gancho", "1 · Día 1", R1Gancho],
  ["nombre", "2 · El nombre", R2Nombre],
  ["escudo", "3 · El escudo", R3Escudo],
  ["hinchada", "4 · La hinchada", R4Hinchada],
  ["mudanza", "5 · La mudanza", R5Mudanza],
  ["partido", "6 · El partido", R6Partido],
  ["manana", "7 · Mañana", R7Manana],
  ["cta", "8 · Compartilo", R8Cta],
];

export const Resumen: React.FC = () => {
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
