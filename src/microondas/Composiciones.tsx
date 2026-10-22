import { Composition, Folder } from "remotion";
import { FPS } from "../comun/metadata";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { PuntosCalientes } from "./escenas/PuntosCalientes";
import { PausaComentario } from "./escenas/PausaComentario";
import { Plato } from "./escenas/Plato";
import { Magnetron } from "./escenas/Magnetron";
import { Remate } from "./escenas/Remate";
import { calcularMetadataMicroondas, MicroondasReel, PROPS_MICROONDAS } from "./MicroondasReel";
import { lineaMicroondas } from "./linea-microondas";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_MICROONDAS.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaMicroondas(PROPS_MICROONDAS.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesMicroondas: React.FC = () => (
  <Folder name="Microondas">
    <Composition
      id="MicroondasReel"
      component={MicroondasReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_MICROONDAS}
      calculateMetadata={calcularMetadataMicroondas}
    />
    <Folder name="Microondas-Escenas">
      <Composition id="Microondas-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Microondas-Magnetron" component={Magnetron} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.magnetron.duracion} defaultProps={{ marcas: m.magnetron, duracion: e.magnetron.duracion }} />
      <Composition
        id="Microondas-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.magnetron, duracion: e.magnetron.duracion } }}
      />
      <Composition id="Microondas-PuntosCalientes" component={PuntosCalientes} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.puntosCalientes.duracion} defaultProps={{ marcas: m.puntosCalientes, duracion: e.puntosCalientes.duracion }} />
      <Composition id="Microondas-Plato" component={Plato} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.plato.duracion} defaultProps={{ marcas: m.plato, duracion: e.plato.duracion }} />
      <Composition id="Microondas-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Microondas-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
