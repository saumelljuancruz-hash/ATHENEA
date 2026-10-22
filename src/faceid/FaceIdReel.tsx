import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { crearCalcularMetadata, propsPorDefecto } from "../comun/metadata";
import { PistaDeAudio, Sfx } from "../comun/Sonido";
import { Subtitulos } from "../comun/Subtitulos";
import { COLOR } from "../comun/tema";
import { PropsReel } from "../comun/tipos";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { Mapa3D } from "./escenas/Mapa3D";
import { PausaComentario } from "./escenas/PausaComentario";
import { Privacidad } from "./escenas/Privacidad";
import { Puntos } from "./escenas/Puntos";
import { Remate } from "./escenas/Remate";
import { ARCHIVOS, CUENTA, PALABRAS_CLAVE, PAUSA_REMATE, SUBTITULOS, VOLUMEN } from "./guion-faceid";
import { EscenaFaceId, lineaFaceId } from "./linea-faceid";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export const PROPS_FACEID = propsPorDefecto(TIMESTAMPS_ESTIMADOS);

export const calcularMetadataFaceId = crearCalcularMetadata({
  voz: ARCHIVOS.voz,
  timestamps: ARCHIVOS.timestamps,
  logo: CUENTA.logo,
  estimados: TIMESTAMPS_ESTIMADOS,
  pausa: PAUSA_REMATE,
  minFrames: 1800,
  maxFrames: 2400,
  nombreSalida: "faceid",
});

const CONFIG_SUBTITULOS = { ...SUBTITULOS, palabrasClave: PALABRAS_CLAVE };

export const FaceIdReel: React.FC<PropsReel> = ({ palabras, vozDisponible, logoDisponible, pausaVoz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { escenas: e, marcas: m } = useMemo(
    () => lineaFaceId(palabras, fps, durationInFrames),
    [palabras, fps, durationInFrames],
  );

  const enEscena = (f: number, id: EscenaFaceId) => f >= e[id].desde && f < e[id].desde + e[id].duracion;
  const ocultarSubtitulos = (f: number) =>
    SUBTITULOS.ocultarEn.some((id) => enEscena(f, id as EscenaFaceId)) || f >= durationInFrames - 0.3 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondoOscuro }}>
      <Sequence name="Hook" from={e.hook.desde} durationInFrames={e.hook.duracion}>
        <Hook marcas={m.hook} duracion={e.hook.duracion} />
      </Sequence>
      <Sequence name="01 Puntos" from={e.puntos.desde} durationInFrames={e.puntos.duracion}>
        <Puntos marcas={m.puntos} duracion={e.puntos.duracion} />
      </Sequence>
      <Sequence name="PausaComentario" from={e.pausa.desde} durationInFrames={e.pausa.duracion}>
        <PausaComentario
          marcas={m.pausa}
          duracion={e.pausa.duracion}
          anterior={{ marcas: m.puntos, duracion: e.puntos.duracion }}
        />
      </Sequence>
      <Sequence name="02 Mapa3D" from={e.mapa3d.desde} durationInFrames={e.mapa3d.duracion}>
        <Mapa3D marcas={m.mapa3d} duracion={e.mapa3d.duracion} />
      </Sequence>
      <Sequence name="03 Privacidad" from={e.privacidad.desde} durationInFrames={e.privacidad.duracion}>
        <Privacidad marcas={m.privacidad} duracion={e.privacidad.duracion} />
      </Sequence>
      <Sequence name="Remate" from={e.remate.desde} durationInFrames={e.remate.duracion}>
        <Remate duracion={e.remate.duracion} />
      </Sequence>
      <Sequence name="CTA" from={e.cta.desde} durationInFrames={e.cta.duracion}>
        <CTA marcas={m.cta} duracion={e.cta.duracion} logoDisponible={logoDisponible} />
      </Sequence>

      <Subtitulos palabras={palabras} ocultar={ocultarSubtitulos} config={CONFIG_SUBTITULOS} />

      <PistaDeAudio
        voz={ARCHIVOS.voz}
        vozDisponible={vozDisponible}
        pausaVoz={pausaVoz}
        palabras={palabras}
        volumenVoz={VOLUMEN.voz}
        volumenMusica={VOLUMEN.musica}
        ducking={VOLUMEN.ducking}
      />
      {(["puntos", "mapa3d", "privacidad", "remate", "cta"] as const).map((id) => (
        <Sfx key={id} efecto="whoosh" desde={Math.max(0, e[id].desde - 8)} />
      ))}
      <Sfx efecto="whoosh" desde={e.pausa.desde + e.pausa.duracion - 14} volumen={0.22} />
    </AbsoluteFill>
  );
};
