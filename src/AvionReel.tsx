import { Audio } from "@remotion/media";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { PropsReel } from "./calcular-metadata";
import { Motor, Sfx } from "./componentes/Sonido";
import { Subtitulos } from "./componentes/Subtitulos";
import { CTA } from "./escenas/CTA";
import { GranCirculo } from "./escenas/GranCirculo";
import { Hook } from "./escenas/Hook";
import { MapaMiente } from "./escenas/MapaMiente";
import { PausaComentario } from "./escenas/PausaComentario";
import { Prueba } from "./escenas/Prueba";
import { Remate } from "./escenas/Remate";
import { ARCHIVOS, SUBTITULOS, VOLUMEN } from "./guion-avion";
import { construirLineaDeTiempo, EscenaId, intensidadVoz } from "./linea-de-tiempo";
import { COLOR } from "./tema";

export const AvionReel: React.FC<PropsReel> = ({ palabras, vozDisponible, logoDisponible, pausaVoz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const linea = useMemo(
    () => construirLineaDeTiempo(palabras, fps, durationInFrames),
    [palabras, fps, durationInFrames],
  );
  const { escenas: e, marcas: m } = linea;

  const enEscena = (f: number, id: EscenaId) => f >= e[id].desde && f < e[id].desde + e[id].duracion;
  const ocultarSubtitulos = (f: number) =>
    SUBTITULOS.ocultarEn.some((id) => enEscena(f, id as EscenaId)) || f >= durationInFrames - 0.3 * fps;

  const volumenMusica = (f: number) => {
    const t = f / fps;
    const duck = 1 - (1 - VOLUMEN.ducking) * intensidadVoz(palabras, t);
    const fundidos = Math.min(
      interpolate(f, [0, 0.6 * fps], [0, 1], { extrapolateRight: "clamp" }),
      interpolate(f, [durationInFrames - 1.2 * fps, durationInFrames - 1], [1, 0], { extrapolateLeft: "clamp" }),
    );
    return VOLUMEN.musica * duck * fundidos;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondoOscuro }}>
      <Sequence name="Hook" from={e.hook.desde} durationInFrames={e.hook.duracion}>
        <Hook marcas={m.hook} duracion={e.hook.duracion} />
      </Sequence>
      <Sequence name="01 MapaMiente" from={e.mapaMiente.desde} durationInFrames={e.mapaMiente.duracion}>
        <MapaMiente marcas={m.mapaMiente} duracion={e.mapaMiente.duracion} />
      </Sequence>
      <Sequence name="PausaComentario" from={e.pausa.desde} durationInFrames={e.pausa.duracion}>
        <PausaComentario
          marcas={m.pausa}
          duracion={e.pausa.duracion}
          anterior={{ marcas: m.mapaMiente, duracion: e.mapaMiente.duracion }}
        />
      </Sequence>
      <Sequence name="02 Prueba" from={e.prueba.desde} durationInFrames={e.prueba.duracion}>
        <Prueba marcas={m.prueba} duracion={e.prueba.duracion} />
      </Sequence>
      <Sequence name="03 GranCirculo" from={e.granCirculo.desde} durationInFrames={e.granCirculo.duracion}>
        <GranCirculo marcas={m.granCirculo} duracion={e.granCirculo.duracion} />
      </Sequence>
      <Sequence name="Remate" from={e.remate.desde} durationInFrames={e.remate.duracion}>
        <Remate duracion={e.remate.duracion} />
      </Sequence>
      <Sequence name="CTA" from={e.cta.desde} durationInFrames={e.cta.duracion}>
        <CTA marcas={m.cta} duracion={e.cta.duracion} logoDisponible={logoDisponible} />
      </Sequence>

      <Subtitulos palabras={palabras} ocultar={ocultarSubtitulos} />

      {/* Audio */}
      {vozDisponible && !pausaVoz ? <Audio src={staticFile(ARCHIVOS.voz)} volume={VOLUMEN.voz} /> : null}
      {vozDisponible && pausaVoz ? (
        <>
          <Sequence name="Voz (1/2)" layout="none">
            <Audio src={staticFile(ARCHIVOS.voz)} volume={VOLUMEN.voz} trimAfter={Math.round(pausaVoz.corte * fps)} />
          </Sequence>
          <Sequence name="Voz (2/2)" from={Math.round((pausaVoz.corte + pausaVoz.segundos) * fps)} layout="none">
            <Audio src={staticFile(ARCHIVOS.voz)} volume={VOLUMEN.voz} trimBefore={Math.round(pausaVoz.corte * fps)} />
          </Sequence>
        </>
      ) : null}
      <Audio src={staticFile(ARCHIVOS.musica)} loop volume={volumenMusica} />
      {(["mapaMiente", "prueba", "granCirculo", "remate", "cta"] as const).map((id) => (
        <Sfx key={id} efecto="whoosh" desde={Math.max(0, e[id].desde - 8)} />
      ))}
      <Sfx efecto="whoosh" desde={e.pausa.desde + e.pausa.duracion - 14} volumen={0.22} />
      <Motor desde={0} duracion={e.mapaMiente.desde + 10} />
      <Motor
        desde={e.prueba.desde + m.prueba.vuela}
        duracion={e.granCirculo.desde + e.granCirculo.duracion - (e.prueba.desde + m.prueba.vuela)}
      />
    </AbsoluteFill>
  );
};
