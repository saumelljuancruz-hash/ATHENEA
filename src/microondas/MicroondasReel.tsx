import React, { useMemo } from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { crearCalcularMetadata, propsPorDefecto } from "../comun/metadata";
import { PistaDeAudio, Sfx } from "../comun/Sonido";
import { Subtitulos } from "../comun/Subtitulos";
import { COLOR } from "../comun/tema";
import { PropsReel } from "../comun/tipos";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { PuntosCalientes } from "./escenas/PuntosCalientes";
import { PausaComentario } from "./escenas/PausaComentario";
import { Plato } from "./escenas/Plato";
import { Magnetron } from "./escenas/Magnetron";
import { Remate } from "./escenas/Remate";
import { ARCHIVOS, CUENTA, PALABRAS_CLAVE, PAUSA_REMATE, SUBTITULOS, VOLUMEN } from "./guion-microondas";
import { EscenaMicroondas, lineaMicroondas } from "./linea-microondas";
import { TIMESTAMPS_ESTIMADOS } from "./timestamps-estimados";

export const PROPS_MICROONDAS = propsPorDefecto(TIMESTAMPS_ESTIMADOS);

export const calcularMetadataMicroondas = crearCalcularMetadata({
  voz: ARCHIVOS.voz,
  timestamps: ARCHIVOS.timestamps,
  logo: CUENTA.logo,
  estimados: TIMESTAMPS_ESTIMADOS,
  pausa: PAUSA_REMATE,
  minFrames: 1800,
  maxFrames: 2400,
  nombreSalida: "microondas",
});

const CONFIG_SUBTITULOS = { ...SUBTITULOS, palabrasClave: PALABRAS_CLAVE };

export const MicroondasReel: React.FC<PropsReel> = ({ palabras, vozDisponible, logoDisponible, pausaVoz }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { escenas: e, marcas: m } = useMemo(
    () => lineaMicroondas(palabras, fps, durationInFrames),
    [palabras, fps, durationInFrames],
  );

  const enEscena = (f: number, id: EscenaMicroondas) => f >= e[id].desde && f < e[id].desde + e[id].duracion;
  const ocultarSubtitulos = (f: number) =>
    SUBTITULOS.ocultarEn.some((id) => enEscena(f, id as EscenaMicroondas)) || f >= durationInFrames - 0.3 * fps;

  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.fondoOscuro }}>
      <Sequence name="Hook" from={e.hook.desde} durationInFrames={e.hook.duracion}>
        <Hook marcas={m.hook} duracion={e.hook.duracion} />
      </Sequence>
      <Sequence name="01 Magnetron" from={e.magnetron.desde} durationInFrames={e.magnetron.duracion}>
        <Magnetron marcas={m.magnetron} duracion={e.magnetron.duracion} />
      </Sequence>
      <Sequence name="PausaComentario" from={e.pausa.desde} durationInFrames={e.pausa.duracion}>
        <PausaComentario
          marcas={m.pausa}
          duracion={e.pausa.duracion}
          anterior={{ marcas: m.magnetron, duracion: e.magnetron.duracion }}
        />
      </Sequence>
      <Sequence name="02 PuntosCalientes" from={e.puntosCalientes.desde} durationInFrames={e.puntosCalientes.duracion}>
        <PuntosCalientes marcas={m.puntosCalientes} duracion={e.puntosCalientes.duracion} />
      </Sequence>
      <Sequence name="03 Plato" from={e.plato.desde} durationInFrames={e.plato.duracion}>
        <Plato marcas={m.plato} duracion={e.plato.duracion} />
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
      {(["magnetron", "puntosCalientes", "plato", "remate", "cta"] as const).map((id) => (
        <Sfx key={id} efecto="whoosh" desde={Math.max(0, e[id].desde - 8)} />
      ))}
      <Sfx efecto="whoosh" desde={e.pausa.desde + e.pausa.duracion - 14} volumen={0.22} />
    </AbsoluteFill>
  );
};
