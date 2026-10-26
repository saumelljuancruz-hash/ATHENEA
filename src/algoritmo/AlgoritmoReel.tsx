import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { crearCalcularMetadata, propsPorDefecto } from "../comun/metadata";
import { PistaDeAudio, Sfx } from "../comun/Sonido";
import { Subtitulos } from "../comun/Subtitulos";
import { COLOR } from "../comun/tema";
import { PropsReel } from "../comun/tipos";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { Parecidos } from "./escenas/Parecidos";
import { PausaComentario } from "./escenas/PausaComentario";
import { Recomienda } from "./escenas/Recomienda";
import { Remate } from "./escenas/Remate";
import { Senales } from "./escenas/Senales";
import { ARCHIVOS, CUENTA, PALABRAS_CLAVE, PAUSA_REMATE, SUBTITULOS, VOLUMEN } from "./guion-algoritmo";
import { EscenaAlgoritmo, lineaAlgoritmo } from "./linea-algoritmo";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export const PROPS_ALGORITMO = propsPorDefecto(TIMESTAMPS_ESTIMADOS);

export const calcularMetadataAlgoritmo = crearCalcularMetadata({
  voz: ARCHIVOS.voz,
  timestamps: ARCHIVOS.timestamps,
  logo: CUENTA.logo,
  estimados: TIMESTAMPS_ESTIMADOS,
  pausa: PAUSA_REMATE,
  // Sin tope: el video dura lo que necesita la voz (+ pausa del remate + 0,5 s).
  nombreSalida: "algoritmo",
});

const CONFIG_SUBTITULOS = { ...SUBTITULOS, palabrasClave: PALABRAS_CLAVE };

export const AlgoritmoReel: React.FC<PropsReel> = ({ palabras, vozDisponible, logoDisponible, pausaVoz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { escenas: e, marcas: m } = useMemo(
    () => lineaAlgoritmo(palabras, fps, durationInFrames),
    [palabras, fps, durationInFrames],
  );

  const enEscena = (f: number, id: EscenaAlgoritmo) => f >= e[id].desde && f < e[id].desde + e[id].duracion;
  const ocultarSubtitulos = (f: number) =>
    SUBTITULOS.ocultarEn.some((id) => enEscena(f, id as EscenaAlgoritmo)) || f >= durationInFrames - 0.3 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondoOscuro }}>
      <Sequence name="Hook" from={e.hook.desde} durationInFrames={e.hook.duracion}>
        <Hook marcas={m.hook} duracion={e.hook.duracion} />
      </Sequence>
      <Sequence name="01 Senales" from={e.senales.desde} durationInFrames={e.senales.duracion}>
        <Senales marcas={m.senales} duracion={e.senales.duracion} />
      </Sequence>
      <Sequence name="02 Parecidos" from={e.parecidos.desde} durationInFrames={e.parecidos.duracion}>
        <Parecidos marcas={m.parecidos} duracion={e.parecidos.duracion} />
      </Sequence>
      <Sequence name="PausaComentario" from={e.pausa.desde} durationInFrames={e.pausa.duracion}>
        <PausaComentario
          marcas={m.pausa}
          duracion={e.pausa.duracion}
          anterior={{ marcas: m.parecidos, duracion: e.parecidos.duracion }}
        />
      </Sequence>
      <Sequence name="03 Recomienda" from={e.recomienda.desde} durationInFrames={e.recomienda.duracion}>
        <Recomienda marcas={m.recomienda} duracion={e.recomienda.duracion} />
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
      {(["senales", "parecidos", "recomienda", "remate", "cta"] as const).map((id) => (
        <Sfx key={id} efecto="whoosh" desde={Math.max(0, e[id].desde - 8)} />
      ))}
      <Sfx efecto="whoosh" desde={e.pausa.desde + e.pausa.duracion - 14} volumen={0.22} />
    </AbsoluteFill>
  );
};
