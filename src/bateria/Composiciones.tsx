import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaBateria } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Calor } from "./escenas/Calor";
import { Corte } from "./escenas/Corte";
import { Hook } from "./escenas/Hook";
import { Inteligente } from "./escenas/Inteligente";
import { PausaComentario } from "./escenas/PausaComentario";
import { Remate } from "./escenas/Remate";
import { calcularMetadataBateria, BateriaReel, PROPS_BATERIA } from "./BateriaReel";
import { lineaBateria } from "./linea-bateria";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_BATERIA.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaBateria(PROPS_BATERIA.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesBateria: React.FC = () => (
  <Folder name="Bateria">
    <Composition
      id="BateriaReel"
      component={BateriaReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_BATERIA}
      calculateMetadata={calcularMetadataBateria}
    />
    <Still id="Bateria-Portada" component={PortadaBateria} width={ANCHO} height={ALTO} />
    <Folder name="Bateria-Escenas">
      <Composition id="Bateria-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Bateria-Corte" component={Corte} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.corte.duracion} defaultProps={{ marcas: m.corte, duracion: e.corte.duracion }} />
      <Composition id="Bateria-Inteligente" component={Inteligente} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.inteligente.duracion} defaultProps={{ marcas: m.inteligente, duracion: e.inteligente.duracion }} />
      <Composition
        id="Bateria-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.inteligente, duracion: e.inteligente.duracion } }}
      />
      <Composition id="Bateria-Calor" component={Calor} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.calor.duracion} defaultProps={{ marcas: m.calor, duracion: e.calor.duracion }} />
      <Composition id="Bateria-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Bateria-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
