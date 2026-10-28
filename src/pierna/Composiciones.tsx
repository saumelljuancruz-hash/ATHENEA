import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaPierna } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Cable } from "./escenas/Cable";
import { Hook } from "./escenas/Hook";
import { Hormigueo } from "./escenas/Hormigueo";
import { Tranqui } from "./escenas/Tranqui";
import { calcularMetadataPierna, PiernaReel, PROPS_PIERNA } from "./PiernaReel";
import { lineaPierna } from "./linea-pierna";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_PIERNA.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaPierna(PROPS_PIERNA.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesPierna: React.FC = () => (
  <Folder name="Pierna">
    <Composition
      id="PiernaReel"
      component={PiernaReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_PIERNA}
      calculateMetadata={calcularMetadataPierna}
    />
    <Still id="Pierna-Portada" component={PortadaPierna} width={ANCHO} height={ALTO} />
    <Folder name="Pierna-Escenas">
      <Composition
        id="Pierna-Hook"
        component={Hook}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.hook.duracion}
        defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }}
      />
      <Composition
        id="Pierna-Cable"
        component={Cable}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.cable.duracion}
        defaultProps={{ marcas: m.cable, duracion: e.cable.duracion }}
      />
      <Composition
        id="Pierna-Hormigueo"
        component={Hormigueo}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.hormigueo.duracion}
        defaultProps={{ marcas: m.hormigueo, duracion: e.hormigueo.duracion }}
      />
      <Composition
        id="Pierna-Tranqui"
        component={Tranqui}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.tranqui.duracion}
        defaultProps={{ marcas: m.tranqui, duracion: e.tranqui.duracion }}
      />
      <Composition
        id="Pierna-CTA"
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
