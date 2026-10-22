import { Composition, Folder } from "remotion";
import "./tema";
import { AvionReel } from "./AvionReel";
import { calcularMetadata, FPS, PROPS_POR_DEFECTO } from "./calcular-metadata";
import { CTA } from "./escenas/CTA";
import { GranCirculo } from "./escenas/GranCirculo";
import { Hook } from "./escenas/Hook";
import { MapaMiente } from "./escenas/MapaMiente";
import { PausaComentario } from "./escenas/PausaComentario";
import { Prueba } from "./escenas/Prueba";
import { Remate } from "./escenas/Remate";
import { construirLineaDeTiempo } from "./linea-de-tiempo";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_POR_DEFECTO.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = construirLineaDeTiempo(PROPS_POR_DEFECTO.palabras, FPS, DURACION_ESTIMADA);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AvionReel"
      component={AvionReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_POR_DEFECTO}
      calculateMetadata={calcularMetadata}
    />
    <Folder name="Escenas">
      <Composition id="Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="MapaMiente" component={MapaMiente} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.mapaMiente.duracion} defaultProps={{ marcas: m.mapaMiente, duracion: e.mapaMiente.duracion }} />
      <Composition
        id="PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.mapaMiente, duracion: e.mapaMiente.duracion } }}
      />
      <Composition id="Prueba" component={Prueba} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.prueba.duracion} defaultProps={{ marcas: m.prueba, duracion: e.prueba.duracion }} />
      <Composition id="GranCirculo" component={GranCirculo} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.granCirculo.duracion} defaultProps={{ marcas: m.granCirculo, duracion: e.granCirculo.duracion }} />
      <Composition id="Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </>
);
