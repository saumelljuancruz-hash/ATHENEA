import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Captions } from "./components/Captions";
import { mix, ramp } from "./components/anim";
import { Label, Watermark } from "./components/Ui";
import { H1Gancho, H2Partido, H3Tabla, H4Hinchas, H5Bengalas, H6Numeros, H7Faltan, H8Cta } from "./scenes/Fecha4";
import { C, DISPLAY } from "./theme";
import { beats, piece, wordAt, type PieceId } from "./timeline";

const ESCENAS: [PieceId, string, React.FC][] = [
  ["gancho", "1 · ¿Le ganamos al tercero?", H1Gancho],
  ["partido", "2 · Gravedad", H2Partido],
  ["tabla", "3 · Séptimos", H3Tabla],
  ["hinchas", "4 · La tribuna no para", H4Hinchas],
  ["bengalas", "5 · 421 bengalas", H5Bengalas],
  ["numeros", "6 · La respuesta", H6Numeros],
  ["faltan", "7 · Faltan 484", H7Faltan],
  ["cta", "8 · Compartilo", H8Cta],
];

/** Barra de suspenso: "la respuesta" avanza desde la pregunta hasta el 66 %. */
const BarraRespuesta: React.FC = () => {
  const frame = useCurrentFrame();
  const desde = piece("gancho").from + beats("gancho")[1];
  const hasta = piece("numeros").from + wordAt("numeros", "66%");
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

export const Fecha4: React.FC = () => {
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
