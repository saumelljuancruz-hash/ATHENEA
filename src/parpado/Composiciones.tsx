import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaParpado } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Causas } from "./escenas/Causas";
import { Hook } from "./escenas/Hook";
import { Musculo } from "./escenas/Musculo";
import { Tranqui } from "./escenas/Tranqui";
import { calcularMetadataParpado, ParpadoReel, PROPS_PARPADO } from "./ParpadoReel";
import { lineaParpado } from "./linea-parpado";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_PARPADO.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaParpado(PROPS_PARPADO.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesParpado: React.FC = () => (
  <Folder name="Parpado">
    <Composition
      id="ParpadoReel"
      component={ParpadoReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_PARPADO}
      calculateMetadata={calcularMetadataParpado}
    />
    <Still id="Parpado-Portada" component={PortadaParpado} width={ANCHO} height={ALTO} />
    <Folder name="Parpado-Escenas">
      <Composition
        id="Parpado-Hook"
        component={Hook}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.hook.duracion}
        defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }}
      />
      <Composition
        id="Parpado-Musculo"
        component={Musculo}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.musculo.duracion}
        defaultProps={{ marcas: m.musculo, duracion: e.musculo.duracion }}
      />
      <Composition
        id="Parpado-Causas"
        component={Causas}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.causas.duracion}
        defaultProps={{ marcas: m.causas, duracion: e.causas.duracion }}
      />
      <Composition
        id="Parpado-Tranqui"
        component={Tranqui}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.tranqui.duracion}
        defaultProps={{ marcas: m.tranqui, duracion: e.tranqui.duracion }}
      />
      <Composition
        id="Parpado-CTA"
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
