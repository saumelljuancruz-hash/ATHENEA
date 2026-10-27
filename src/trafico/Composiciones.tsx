import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaTrafico } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Carrito } from "./escenas/Carrito";
import { Hook } from "./escenas/Hook";
import { Nosotros } from "./escenas/Nosotros";
import { PausaComentario } from "./escenas/PausaComentario";
import { Remate } from "./escenas/Remate";
import { Truco } from "./escenas/Truco";
import { calcularMetadataTrafico, TraficoReel, PROPS_TRAFICO } from "./TraficoReel";
import { lineaTrafico } from "./linea-trafico";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_TRAFICO.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaTrafico(PROPS_TRAFICO.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesTrafico: React.FC = () => (
  <Folder name="Trafico">
    <Composition
      id="TraficoReel"
      component={TraficoReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_TRAFICO}
      calculateMetadata={calcularMetadataTrafico}
    />
    <Still id="Trafico-Portada" component={PortadaTrafico} width={ANCHO} height={ALTO} />
    <Folder name="Trafico-Escenas">
      <Composition id="Trafico-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Trafico-Carrito" component={Carrito} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.carrito.duracion} defaultProps={{ marcas: m.carrito, duracion: e.carrito.duracion }} />
      <Composition id="Trafico-Truco" component={Truco} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.truco.duracion} defaultProps={{ marcas: m.truco, duracion: e.truco.duracion }} />
      <Composition
        id="Trafico-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.truco, duracion: e.truco.duracion } }}
      />
      <Composition id="Trafico-Nosotros" component={Nosotros} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.nosotros.duracion} defaultProps={{ marcas: m.nosotros, duracion: e.nosotros.duracion }} />
      <Composition id="Trafico-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Trafico-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
