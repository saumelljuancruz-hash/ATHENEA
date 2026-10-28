import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { CierreLoop } from "../comun/CierreLoop";
import { crearCalcularMetadata, propsPorDefecto } from "../comun/metadata";
import { PistaDeAudio, Sfx } from "../comun/Sonido";
import { Subtitulos } from "../comun/Subtitulos";
import { COLOR } from "../comun/tema";
import { PropsReel } from "../comun/tipos";
import { CTA } from "./escenas/CTA";
import { Cerebro } from "./escenas/Cerebro";
import { Gravedad } from "./escenas/Gravedad";
import { Hook } from "./escenas/Hook";
import { Rescate } from "./escenas/Rescate";
import { ARCHIVOS, CUENTA, PALABRAS_CLAVE, SUBTITULOS, VOLUMEN } from "./guion-mareo";
import { EscenaMareo, lineaMareo } from "./linea-mareo";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export const PROPS_MAREO = propsPorDefecto(TIMESTAMPS_ESTIMADOS);

export const calcularMetadataMareo = crearCalcularMetadata({
  voz: ARCHIVOS.voz,
  timestamps: ARCHIVOS.timestamps,
  logo: CUENTA.logo,
  estimados: TIMESTAMPS_ESTIMADOS,
  // Sin tope y sin pausas insertadas: el video dura lo que la voz (+ 0,5 s).
  nombreSalida: "mareo",
});

const LOOP = 45;

const CONFIG_SUBTITULOS = { ...SUBTITULOS, palabrasClave: PALABRAS_CLAVE };

export const MareoReel: React.FC<PropsReel> = ({ palabras, vozDisponible, logoDisponible, pausaVoz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { escenas: e, marcas: m } = useMemo(
    () => lineaMareo(palabras, fps, durationInFrames),
    [palabras, fps, durationInFrames],
  );

  const enEscena = (f: number, id: EscenaMareo) => f >= e[id].desde && f < e[id].desde + e[id].duracion;
  const ocultarSubtitulos = (f: number) =>
    SUBTITULOS.ocultarEn.some((id) => enEscena(f, id as EscenaMareo)) || f >= durationInFrames - 0.3 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondoOscuro }}>
      <Sequence name="Hook" from={e.hook.desde} durationInFrames={e.hook.duracion}>
        <Hook marcas={m.hook} duracion={e.hook.duracion} />
      </Sequence>
      <Sequence name="01 Gravedad" from={e.gravedad.desde} durationInFrames={e.gravedad.duracion}>
        <Gravedad marcas={m.gravedad} duracion={e.gravedad.duracion} />
      </Sequence>
      <Sequence name="02 Cerebro" from={e.cerebro.desde} durationInFrames={e.cerebro.duracion}>
        <Cerebro marcas={m.cerebro} duracion={e.cerebro.duracion} />
      </Sequence>
      <Sequence name="03 Rescate" from={e.rescate.desde} durationInFrames={e.rescate.duracion}>
        <Rescate marcas={m.rescate} duracion={e.rescate.duracion} />
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
      {(["gravedad", "cerebro", "rescate", "cta"] as const).map((id) => (
        <Sfx key={id} efecto="whoosh" desde={Math.max(0, e[id].desde - 8)} />
      ))}
    </AbsoluteFill>
  );
};
