import { Composition, Folder } from "remotion";
import { FPS } from "../comun/metadata";
import { CTA } from "./escenas/CTA";
import { Cuatro } from "./escenas/Cuatro";
import { Hook } from "./escenas/Hook";
import { PausaComentario } from "./escenas/PausaComentario";
import { Remate } from "./escenas/Remate";
import { Senal } from "./escenas/Senal";
import { Tiempo } from "./escenas/Tiempo";
import { calcularMetadataGps, GpsReel, PROPS_GPS } from "./GpsReel";
import { lineaGps } from "./linea-gps";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_GPS.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaGps(PROPS_GPS.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesGps: React.FC = () => (
  <Folder name="Gps">
    <Composition
      id="GpsReel"
      component={GpsReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_GPS}
      calculateMetadata={calcularMetadataGps}
    />
    <Folder name="Gps-Escenas">
      <Composition id="Gps-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Gps-Senal" component={Senal} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.senal.duracion} defaultProps={{ marcas: m.senal, duracion: e.senal.duracion }} />
      <Composition
        id="Gps-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.senal, duracion: e.senal.duracion } }}
      />
      <Composition id="Gps-Cuatro" component={Cuatro} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cuatro.duracion} defaultProps={{ marcas: m.cuatro, duracion: e.cuatro.duracion }} />
      <Composition id="Gps-Tiempo" component={Tiempo} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.tiempo.duracion} defaultProps={{ marcas: m.tiempo, duracion: e.tiempo.duracion }} />
      <Composition id="Gps-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Gps-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
