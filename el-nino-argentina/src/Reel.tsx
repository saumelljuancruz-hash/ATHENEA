import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Ui";
import { S1Gancho } from "./scenes/S1Gancho";
import { S2Intro } from "./scenes/S2Intro";
import { S3Cuerpo1 } from "./scenes/S3Cuerpo1";
import { S4Bucle1 } from "./scenes/S4Bucle1";
import { S5Cuerpo2 } from "./scenes/S5Cuerpo2";
import { S6Bucle2 } from "./scenes/S6Bucle2";
import { S7Final } from "./scenes/S7Final";
import { S8Cta } from "./scenes/S8Cta";
import { C } from "./theme";
import { piece } from "./timeline";

export const Reel: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Series>
        <Series.Sequence name="1 · Gancho" durationInFrames={piece("gancho").durationInFrames}>
          <S1Gancho />
        </Series.Sequence>
        <Series.Sequence name="2 · Introducción" durationInFrames={piece("intro").durationInFrames}>
          <S2Intro />
        </Series.Sequence>
        <Series.Sequence name="3 · Cuerpo 1" durationInFrames={piece("cuerpo1").durationInFrames}>
          <S3Cuerpo1 />
        </Series.Sequence>
        <Series.Sequence name="4 · Bucle abierto" durationInFrames={piece("bucle1").durationInFrames}>
          <S4Bucle1 />
        </Series.Sequence>
        <Series.Sequence name="5 · Cuerpo 2" durationInFrames={piece("cuerpo2").durationInFrames}>
          <S5Cuerpo2 />
        </Series.Sequence>
        <Series.Sequence name="6 · Bucle abierto" durationInFrames={piece("bucle2").durationInFrames}>
          <S6Bucle2 />
        </Series.Sequence>
        <Series.Sequence name="7 · Cuerpo final" durationInFrames={piece("final").durationInFrames}>
          <S7Final />
        </Series.Sequence>
        <Series.Sequence name="8 · Llamado a la acción" durationInFrames={piece("cta").durationInFrames}>
          <S8Cta />
        </Series.Sequence>
      </Series>
      <Captions />
      <Watermark />
      <Audio name="Voz en off" src={staticFile("voiceover/voz-en-off.mp3")} volume={0.6} />
      <Audio
        name="Ambiente de mar"
        src={staticFile("sfx/ambiente-mar.mp3")}
        volume={(f) => interpolate(f, [0, 20, durationInFrames - 40, durationInFrames], [0, 0.065, 0.065, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};
