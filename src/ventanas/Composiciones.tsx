import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaVentanas } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Comet } from "./escenas/Comet";
import { Esquina } from "./escenas/Esquina";
import { Hook } from "./escenas/Hook";
import { PausaComentario } from "./escenas/PausaComentario";
import { Pileta } from "./escenas/Pileta";
import { Remate } from "./escenas/Remate";
import { calcularMetadataVentanas, VentanasReel, PROPS_VENTANAS } from "./VentanasReel";
import { lineaVentanas } from "./linea-ventanas";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_VENTANAS.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaVentanas(PROPS_VENTANAS.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesVentanas: React.FC = () => (
  <Folder name="Ventanas">
    <Composition
      id="VentanasReel"
      component={VentanasReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_VENTANAS}
      calculateMetadata={calcularMetadataVentanas}
    />
    <Still id="Ventanas-Portada" component={PortadaVentanas} width={ANCHO} height={ALTO} />
    <Folder name="Ventanas-Escenas">
      <Composition id="Ventanas-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Ventanas-Comet" component={Comet} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.comet.duracion} defaultProps={{ marcas: m.comet, duracion: e.comet.duracion }} />
      <Composition id="Ventanas-Pileta" component={Pileta} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.pileta.duracion} defaultProps={{ marcas: m.pileta, duracion: e.pileta.duracion }} />
      <Composition
        id="Ventanas-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.pileta, duracion: e.pileta.duracion } }}
      />
      <Composition id="Ventanas-Esquina" component={Esquina} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.esquina.duracion} defaultProps={{ marcas: m.esquina, duracion: e.esquina.duracion }} />
      <Composition id="Ventanas-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Ventanas-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
