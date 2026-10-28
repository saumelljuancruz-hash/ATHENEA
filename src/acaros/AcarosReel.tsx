import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { CierreLoop } from "../comun/CierreLoop";
import { crearCalcularMetadata, propsPorDefecto } from "../comun/metadata";
import { PistaDeAudio, Sfx } from "../comun/Sonido";
import { Subtitulos } from "../comun/Subtitulos";
import { COLOR } from "../comun/tema";
import { PropsReel } from "../comun/tipos";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { Noche } from "./escenas/Noche";
import { Quienes } from "./escenas/Quienes";
import { Remate } from "./escenas/Remate";
import { Tranqui } from "./escenas/Tranqui";
import { ARCHIVOS, CUENTA, PALABRAS_CLAVE, SUBTITULOS, VOLUMEN } from "./guion-acaros";
import { EscenaAcaros, lineaAcaros } from "./linea-acaros";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export const PROPS_ACAROS = propsPorDefecto(TIMESTAMPS_ESTIMADOS);

export const calcularMetadataAcaros = crearCalcularMetadata({
  voz: ARCHIVOS.voz,
  timestamps: ARCHIVOS.timestamps,
  logo: CUENTA.logo,
  estimados: TIMESTAMPS_ESTIMADOS,
  // Sin tope y sin pausas insertadas: el video dura lo que la voz (+ 0,5 s).
  nombreSalida: "acaros",
});

const LOOP = 45;

const CONFIG_SUBTITULOS = { ...SUBTITULOS, palabrasClave: PALABRAS_CLAVE };

export const AcarosReel: React.FC<PropsReel> = ({ palabras, vozDisponible, logoDisponible, pausaVoz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { escenas: e, marcas: m } = useMemo(
    () => lineaAcaros(palabras, fps, durationInFrames),
    [palabras, fps, durationInFrames],
  );

  const enEscena = (f: number, id: EscenaAcaros) => f >= e[id].desde && f < e[id].desde + e[id].duracion;
  const ocultarSubtitulos = (f: number) =>
    SUBTITULOS.ocultarEn.some((id) => enEscena(f, id as EscenaAcaros)) || f >= durationInFrames - 0.3 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondoOscuro }}>
      <Sequence name="Hook" from={e.hook.desde} durationInFrames={e.hook.duracion}>
        <Hook marcas={m.hook} duracion={e.hook.duracion} />
      </Sequence>
      <Sequence name="01 Quienes" from={e.quienes.desde} durationInFrames={e.quienes.duracion}>
        <Quienes marcas={m.quienes} duracion={e.quienes.duracion} />
      </Sequence>
      <Sequence name="02 Noche" from={e.noche.desde} durationInFrames={e.noche.duracion}>
        <Noche marcas={m.noche} duracion={e.noche.duracion} />
      </Sequence>
      <Sequence name="03 Tranqui" from={e.tranqui.desde} durationInFrames={e.tranqui.duracion}>
        <Tranqui marcas={m.tranqui} duracion={e.tranqui.duracion} />
      </Sequence>
      <Sequence name="Remate" from={e.remate.desde} durationInFrames={e.remate.duracion}>
        <Remate duracion={e.remate.duracion} />
      </Sequence>
      <Sequence name="CTA" from={e.cta.desde} durationInFrames={e.cta.duracion}>
        <CTA marcas={m.cta} duracion={e.cta.duracion} logoDisponible={logoDisponible} />
      </Sequence>

      {/* Loop: el último cuadro empalma con el primero */}
      <Sequence name="Loop" from={durationInFrames - LOOP} durationInFrames={LOOP}>
        <CierreLoop duracion={LOOP}>
          <Hook marcas={m.hook} duracion={e.hook.duracion} />
        </CierreLoop>
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
      {(["quienes", "noche", "tranqui", "remate", "cta"] as const).map((id) => (
        <Sfx key={id} efecto="whoosh" desde={Math.max(0, e[id].desde - 8)} />
      ))}
    </AbsoluteFill>
  );
};
