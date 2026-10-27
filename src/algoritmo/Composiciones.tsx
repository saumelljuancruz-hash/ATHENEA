import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaAlgoritmo } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { Parecidos } from "./escenas/Parecidos";
import { PausaComentario } from "./escenas/PausaComentario";
import { Recomienda } from "./escenas/Recomienda";
import { Remate } from "./escenas/Remate";
import { Senales } from "./escenas/Senales";
import { calcularMetadataAlgoritmo, AlgoritmoReel, PROPS_ALGORITMO } from "./AlgoritmoReel";
import { lineaAlgoritmo } from "./linea-algoritmo";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_ALGORITMO.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaAlgoritmo(PROPS_ALGORITMO.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesAlgoritmo: React.FC = () => (
  <Folder name="Algoritmo">
    <Composition
      id="AlgoritmoReel"
      component={AlgoritmoReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_ALGORITMO}
      calculateMetadata={calcularMetadataAlgoritmo}
    />
    <Still id="Algoritmo-Portada" component={PortadaAlgoritmo} width={ANCHO} height={ALTO} />
    <Folder name="Algoritmo-Escenas">
      <Composition id="Algoritmo-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Algoritmo-Senales" component={Senales} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.senales.duracion} defaultProps={{ marcas: m.senales, duracion: e.senales.duracion }} />
      <Composition id="Algoritmo-Parecidos" component={Parecidos} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.parecidos.duracion} defaultProps={{ marcas: m.parecidos, duracion: e.parecidos.duracion }} />
      <Composition
        id="Algoritmo-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.parecidos, duracion: e.parecidos.duracion } }}
      />
      <Composition id="Algoritmo-Recomienda" component={Recomienda} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.recomienda.duracion} defaultProps={{ marcas: m.recomienda, duracion: e.recomienda.duracion }} />
      <Composition id="Algoritmo-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Algoritmo-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
