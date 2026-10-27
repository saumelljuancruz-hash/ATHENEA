import { Composition, Folder, Still } from "remotion";
import { FPS } from "../comun/metadata";
import { PortadaApps } from "./Portada";
import { CTA } from "./escenas/CTA";
import { Cero } from "./escenas/Cero";
import { Congela } from "./escenas/Congela";
import { Excepcion } from "./escenas/Excepcion";
import { Hook } from "./escenas/Hook";
import { PausaComentario } from "./escenas/PausaComentario";
import { Remate } from "./escenas/Remate";
import { calcularMetadataApps, AppsReel, PROPS_APPS } from "./AppsReel";
import { lineaApps } from "./linea-apps";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_APPS.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaApps(PROPS_APPS.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesApps: React.FC = () => (
  <Folder name="Apps">
    <Composition
      id="AppsReel"
      component={AppsReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_APPS}
      calculateMetadata={calcularMetadataApps}
    />
    <Still id="Apps-Portada" component={PortadaApps} width={ANCHO} height={ALTO} />
    <Folder name="Apps-Escenas">
      <Composition id="Apps-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Apps-Congela" component={Congela} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.congela.duracion} defaultProps={{ marcas: m.congela, duracion: e.congela.duracion }} />
      <Composition id="Apps-Cero" component={Cero} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cero.duracion} defaultProps={{ marcas: m.cero, duracion: e.cero.duracion }} />
      <Composition
        id="Apps-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.cero, duracion: e.cero.duracion } }}
      />
      <Composition id="Apps-Excepcion" component={Excepcion} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.excepcion.duracion} defaultProps={{ marcas: m.excepcion, duracion: e.excepcion.duracion }} />
      <Composition id="Apps-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Apps-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
