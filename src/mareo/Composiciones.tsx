import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaMareo } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Cerebro } from "./escenas/Cerebro";
import { Gravedad } from "./escenas/Gravedad";
import { Hook } from "./escenas/Hook";
import { Rescate } from "./escenas/Rescate";
import { calcularMetadataMareo, MareoReel, PROPS_MAREO } from "./MareoReel";
import { lineaMareo } from "./linea-mareo";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_MAREO.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaMareo(PROPS_MAREO.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesMareo: React.FC = () => (
  <Folder name="Mareo">
    <Composition
      id="MareoReel"
      component={MareoReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_MAREO}
      calculateMetadata={calcularMetadataMareo}
    />
    <Still id="Mareo-Portada" component={PortadaMareo} width={ANCHO} height={ALTO} />
    <Folder name="Mareo-Escenas">
      <Composition
        id="Mareo-Hook"
        component={Hook}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.hook.duracion}
        defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }}
      />
      <Composition
        id="Mareo-Gravedad"
        component={Gravedad}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.gravedad.duracion}
        defaultProps={{ marcas: m.gravedad, duracion: e.gravedad.duracion }}
      />
      <Composition
        id="Mareo-Cerebro"
        component={Cerebro}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.cerebro.duracion}
        defaultProps={{ marcas: m.cerebro, duracion: e.cerebro.duracion }}
      />
      <Composition
        id="Mareo-Rescate"
        component={Rescate}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.rescate.duracion}
        defaultProps={{ marcas: m.rescate, duracion: e.rescate.duracion }}
      />
      <Composition
        id="Mareo-CTA"
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
