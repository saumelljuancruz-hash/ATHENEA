import { Composition, Folder } from "remotion";
import { FPS } from "../comun/metadata";
import { Antenas } from "./escenas/Antenas";
import { Busqueda } from "./escenas/Busqueda";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { PausaComentario } from "./escenas/PausaComentario";
import { Remate } from "./escenas/Remate";
import { Zumbido } from "./escenas/Zumbido";
import { calcularMetadataModoAvion, ModoAvionReel, PROPS_MODOAVION } from "./ModoAvionReel";
import { lineaModoAvion } from "./linea-modoavion";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_MODOAVION.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaModoAvion(PROPS_MODOAVION.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesModoAvion: React.FC = () => (
  <Folder name="ModoAvion">
    <Composition
      id="ModoAvionReel"
      component={ModoAvionReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_MODOAVION}
      calculateMetadata={calcularMetadataModoAvion}
    />
    <Folder name="ModoAvion-Escenas">
      <Composition id="ModoAvion-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="ModoAvion-Busqueda" component={Busqueda} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.busqueda.duracion} defaultProps={{ marcas: m.busqueda, duracion: e.busqueda.duracion }} />
      <Composition id="ModoAvion-Zumbido" component={Zumbido} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.zumbido.duracion} defaultProps={{ marcas: m.zumbido, duracion: e.zumbido.duracion }} />
      <Composition
        id="ModoAvion-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.zumbido, duracion: e.zumbido.duracion } }}
      />
      <Composition id="ModoAvion-Antenas" component={Antenas} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.antenas.duracion} defaultProps={{ marcas: m.antenas, duracion: e.antenas.duracion }} />
      <Composition id="ModoAvion-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="ModoAvion-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
