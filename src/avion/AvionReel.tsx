import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { crearCalcularMetadata, propsPorDefecto } from "../comun/metadata";
import { Bucle, PistaDeAudio, Sfx } from "../comun/Sonido";
import { Subtitulos } from "../comun/Subtitulos";
import { COLOR } from "../comun/tema";
import { PropsReel } from "../comun/tipos";
import { CTA } from "./escenas/CTA";
import { GranCirculo } from "./escenas/GranCirculo";
import { Hook } from "./escenas/Hook";
import { MapaMiente } from "./escenas/MapaMiente";
import { PausaComentario } from "./escenas/PausaComentario";
import { Prueba } from "./escenas/Prueba";
import { Remate } from "./escenas/Remate";
import { ARCHIVOS, CUENTA, PALABRAS_CLAVE, PAUSA_REMATE, SUBTITULOS, VOLUMEN } from "./guion-avion";
import { EscenaAvion, lineaAvion } from "./linea-avion";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export const PROPS_AVION = propsPorDefecto(TIMESTAMPS_ESTIMADOS);

export const calcularMetadataAvion = crearCalcularMetadata({
  voz: ARCHIVOS.voz,
  timestamps: ARCHIVOS.timestamps,
  logo: CUENTA.logo,
  estimados: TIMESTAMPS_ESTIMADOS,
  pausa: PAUSA_REMATE,
  minFrames: 1800,
  // La locución de este Reel dura 40,3 s: con la pausa del Remate queda en ~43 s.
  maxFrames: 2600,
  nombreSalida: "avion",
});

const CONFIG_SUBTITULOS = { ...SUBTITULOS, palabrasClave: PALABRAS_CLAVE };

export const AvionReel: React.FC<PropsReel> = ({ palabras, vozDisponible, logoDisponible, pausaVoz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const linea = useMemo(() => lineaAvion(palabras, fps, durationInFrames), [palabras, fps, durationInFrames]);
  const { escenas: e, marcas: m } = linea;

  const enEscena = (f: number, id: EscenaAvion) => f >= e[id].desde && f < e[id].desde + e[id].duracion;
  const ocultarSubtitulos = (f: number) =>
    SUBTITULOS.ocultarEn.some((id) => enEscena(f, id as EscenaAvion)) || f >= durationInFrames - 0.3 * fps;

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

      <Subtitulos palabras={palabras} ocultar={ocultarSubtitulos} config={CONFIG_SUBTITULOS} />

      {/* Audio */}
      <PistaDeAudio
        voz={ARCHIVOS.voz}
        vozDisponible={vozDisponible}
        pausaVoz={pausaVoz}
        palabras={palabras}
        volumenVoz={VOLUMEN.voz}
        volumenMusica={VOLUMEN.musica}
        ducking={VOLUMEN.ducking}
      />
      {(["mapaMiente", "prueba", "granCirculo", "remate", "cta"] as const).map((id) => (
        <Sfx key={id} efecto="whoosh" desde={Math.max(0, e[id].desde - 8)} />
      ))}
      <Sfx efecto="whoosh" desde={e.pausa.desde + e.pausa.duracion - 14} volumen={0.22} />
      <Bucle efecto="motor" desde={0} duracion={e.mapaMiente.desde + 10} />
      <Bucle
        efecto="motor"
        desde={e.prueba.desde + m.prueba.vuela}
        duracion={e.granCirculo.desde + e.granCirculo.duracion - (e.prueba.desde + m.prueba.vuela)}
      />
    </AbsoluteFill>
  );
};
