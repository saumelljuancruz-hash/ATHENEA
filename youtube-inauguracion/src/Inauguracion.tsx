import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { mix, ramp } from "./components/anim";
import { Label, Watermark } from "./components/Ui";
import { Y1Gancho, Y2Intro, Y3Cuerpo1, Y4Bucle1, Y5Cuerpo2, Y6Bucle2, Y7Final, Y8Cta } from "./scenes/Inauguracion";
import { C, DISPLAY } from "./theme";
import { piece, type PieceId } from "./timeline";

const ESCENAS: [PieceId, string, React.FC][] = [
  ["gancho", "1 · Tu celular te miente", Y1Gancho],
  ["intro", "2 · Bienvenido", Y2Intro],
  ["cuerpo1", "3 · Lo que vas a ver", Y3Cuerpo1],
  ["bucle1", "4 · No solo un minuto", Y4Bucle1],
  ["cuerpo2", "5 · Videos largos", Y5Cuerpo2],
  ["bucle2", "6 · Ahora sí", Y6Bucle2],
  ["final", "7 · La respuesta", Y7Final],
  ["cta", "8 · Suscribite", Y8Cta],
];

/** Barra de suspenso: "la respuesta" se acerca desde la intro hasta que se revela. */
const BarraRespuesta: React.FC = () => {
  const frame = useCurrentFrame();
  const desde = piece("intro").from;
  const hasta = piece("final").from;
  const p = ramp(frame, desde, hasta, (t) => t);
  const visible = Math.min(ramp(frame, desde, desde + 10), 1 - ramp(frame, hasta + 30, hasta + 45));
  if (visible <= 0) {
    return null;
  }
  const llego = frame >= hasta;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 248, opacity: visible, display: "flex", alignItems: "center", gap: 18 }}>
      <Label size={26} color={C.dim}>
        LA RESPUESTA
      </Label>
      <div style={{ flex: 1, height: 14, borderRadius: 7, background: "rgba(255,255,255,0.12)", position: "relative" }}>
        <div style={{ width: `${p * 100}%`, height: "100%", borderRadius: 7, background: `linear-gradient(90deg, ${C.yellow}88, ${C.yellow})`, boxShadow: `0 0 20px ${C.yellow}` }} />
        <div style={{ position: "absolute", left: `calc(${p * 100}% - 24px)`, top: -17, width: 48, height: 48, borderRadius: "50%", background: llego ? C.yellow : "#1a1d27", border: `3px solid ${C.yellow}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontWeight: 900, fontSize: 28, color: llego ? "#1a1400" : C.yellow, scale: String(llego ? mix(ramp(frame, hasta, hasta + 8), 1.6, 1) : 1) }}>
          {llego ? "!" : "?"}
        </div>
      </div>
    </div>
  );
};

export const Inauguracion: React.FC = () => {
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
      <BarraRespuesta />
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
