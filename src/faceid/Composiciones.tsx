import { Composition, Folder } from "remotion";
import { FPS } from "../comun/metadata";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { Mapa3D } from "./escenas/Mapa3D";
import { PausaComentario } from "./escenas/PausaComentario";
import { Privacidad } from "./escenas/Privacidad";
import { Puntos } from "./escenas/Puntos";
import { Remate } from "./escenas/Remate";
import { calcularMetadataFaceId, FaceIdReel, PROPS_FACEID } from "./FaceIdReel";
import { lineaFaceId } from "./linea-faceid";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_FACEID.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaFaceId(PROPS_FACEID.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesFaceId: React.FC = () => (
  <Folder name="FaceID">
    <Composition
      id="FaceIdReel"
      component={FaceIdReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_FACEID}
      calculateMetadata={calcularMetadataFaceId}
    />
    <Folder name="FaceID-Escenas">
      <Composition id="FaceID-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="FaceID-Puntos" component={Puntos} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.puntos.duracion} defaultProps={{ marcas: m.puntos, duracion: e.puntos.duracion }} />
      <Composition
        id="FaceID-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.puntos, duracion: e.puntos.duracion } }}
      />
      <Composition id="FaceID-Mapa3D" component={Mapa3D} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.mapa3d.duracion} defaultProps={{ marcas: m.mapa3d, duracion: e.mapa3d.duracion }} />
      <Composition id="FaceID-Privacidad" component={Privacidad} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.privacidad.duracion} defaultProps={{ marcas: m.privacidad, duracion: e.privacidad.duracion }} />
      <Composition id="FaceID-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="FaceID-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
