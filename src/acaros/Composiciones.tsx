import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaAcaros } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { Noche } from "./escenas/Noche";
import { PausaComentario } from "./escenas/PausaComentario";
import { Quienes } from "./escenas/Quienes";
import { Remate } from "./escenas/Remate";
import { Tranqui } from "./escenas/Tranqui";
import { calcularMetadataAcaros, AcarosReel, PROPS_ACAROS } from "./AcarosReel";
import { lineaAcaros } from "./linea-acaros";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_ACAROS.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaAcaros(PROPS_ACAROS.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesAcaros: React.FC = () => (
  <Folder name="Acaros">
    <Composition
      id="AcarosReel"
      component={AcarosReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_ACAROS}
      calculateMetadata={calcularMetadataAcaros}
    />
    <Still id="Acaros-Portada" component={PortadaAcaros} width={ANCHO} height={ALTO} />
    <Folder name="Acaros-Escenas">
      <Composition id="Acaros-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Acaros-Quienes" component={Quienes} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.quienes.duracion} defaultProps={{ marcas: m.quienes, duracion: e.quienes.duracion }} />
      <Composition id="Acaros-Noche" component={Noche} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.noche.duracion} defaultProps={{ marcas: m.noche, duracion: e.noche.duracion }} />
      <Composition
        id="Acaros-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.noche, duracion: e.noche.duracion } }}
      />
      <Composition id="Acaros-Tranqui" component={Tranqui} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.tranqui.duracion} defaultProps={{ marcas: m.tranqui, duracion: e.tranqui.duracion }} />
      <Composition id="Acaros-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Acaros-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
