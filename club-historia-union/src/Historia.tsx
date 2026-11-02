import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { Watermark } from "./components/Ui";
import { H1Atencion, H2Union, H3Sumas, H4Doble, H5Manana } from "./scenes/Historia";
import { C } from "./theme";
import { piece } from "./timeline";

// Historia vertical: la marca de agua baja a 250 px para no quedar debajo de
// la barra de progreso y el nombre de la cuenta que muestran las historias.
export const Historia: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Series>
        <Series.Sequence name="1 · Atención" durationInFrames={piece("atencion").durationInFrames}>
          <H1Atencion />
        </Series.Sequence>
        <Series.Sequence name="2 · Uno solo" durationInFrames={piece("union").durationInFrames}>
          <H2Union />
        </Series.Sequence>
        <Series.Sequence name="3 · Sumás donde sea" durationInFrames={piece("sumas").durationInFrames}>
          <H3Sumas />
        </Series.Sequence>
        <Series.Sequence name="4 · Valés doble" durationInFrames={piece("doble").durationInFrames}>
          <H4Doble />
        </Series.Sequence>
        <Series.Sequence name="5 · Mañana" durationInFrames={piece("manana").durationInFrames}>
          <H5Manana />
        </Series.Sequence>
      </Series>
      <Captions />
      <Watermark top={250} />
      <Audio name="Voz en off" src={staticFile("voiceover/voz-en-off.mp3")} volume={0.6} />
      <Audio
        name="Colchón musical"
        src={staticFile("sfx/colchon.mp3")}
        volume={(f) => interpolate(f, [0, 12, durationInFrames - 30, durationInFrames], [0, 0.5, 0.5, 0], { extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
};
