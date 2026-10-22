import { Composition, Folder } from "remotion";
import { FPS } from "../comun/metadata";
import { AvionReel, calcularMetadataAvion, PROPS_AVION } from "./AvionReel";
import { CTA } from "./escenas/CTA";
import { GranCirculo } from "./escenas/GranCirculo";
import { Hook } from "./escenas/Hook";
import { MapaMiente } from "./escenas/MapaMiente";
import { PausaComentario } from "./escenas/PausaComentario";
import { Prueba } from "./escenas/Prueba";
import { Remate } from "./escenas/Remate";
import { lineaAvion } from "./linea-avion";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_AVION.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaAvion(PROPS_AVION.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesAvion: React.FC = () => (
  <Folder name="Avion">
    <Composition
      id="AvionReel"
      component={AvionReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_AVION}
      calculateMetadata={calcularMetadataAvion}
    />
    <Folder name="Avion-Escenas">
      <Composition
        id="Hook"
        component={Hook}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.hook.duracion}
        defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }}
      />
      <Composition
        id="MapaMiente"
        component={MapaMiente}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.mapaMiente.duracion}
        defaultProps={{ marcas: m.mapaMiente, duracion: e.mapaMiente.duracion }}
      />
      <Composition
        id="PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{
          marcas: m.pausa,
          duracion: e.pausa.duracion,
          anterior: { marcas: m.mapaMiente, duracion: e.mapaMiente.duracion },
        }}
      />
      <Composition
        id="Prueba"
        component={Prueba}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.prueba.duracion}
        defaultProps={{ marcas: m.prueba, duracion: e.prueba.duracion }}
      />
      <Composition
        id="GranCirculo"
        component={GranCirculo}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.granCirculo.duracion}
        defaultProps={{ marcas: m.granCirculo, duracion: e.granCirculo.duracion }}
      />
      <Composition
        id="Remate"
        component={Remate}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.remate.duracion}
        defaultProps={{ duracion: e.remate.duracion }}
      />
      <Composition
        id="CTA"
        component={CTA}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.cta.duracion}
        defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }}
      />
    </Folder>
  </Folder>
);
