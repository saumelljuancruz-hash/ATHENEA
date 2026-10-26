import { Composition, Folder } from "remotion";
import { FPS } from "../comun/metadata";
import { Binario } from "./escenas/Binario";
import { CTA } from "./escenas/CTA";
import { Esquinas } from "./escenas/Esquinas";
import { Hook } from "./escenas/Hook";
import { PausaComentario } from "./escenas/PausaComentario";
import { Remate } from "./escenas/Remate";
import { Respaldo } from "./escenas/Respaldo";
import { calcularMetadataQr, QrReel, PROPS_QR } from "./QrReel";
import { lineaQr } from "./linea-qr";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_QR.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaQr(PROPS_QR.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesQr: React.FC = () => (
  <Folder name="Qr">
    <Composition
      id="QrReel"
      component={QrReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_QR}
      calculateMetadata={calcularMetadataQr}
    />
    <Folder name="Qr-Escenas">
      <Composition id="Qr-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Qr-Esquinas" component={Esquinas} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.esquinas.duracion} defaultProps={{ marcas: m.esquinas, duracion: e.esquinas.duracion }} />
      <Composition id="Qr-Binario" component={Binario} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.binario.duracion} defaultProps={{ marcas: m.binario, duracion: e.binario.duracion }} />
      <Composition
        id="Qr-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.binario, duracion: e.binario.duracion } }}
      />
      <Composition id="Qr-Respaldo" component={Respaldo} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.respaldo.duracion} defaultProps={{ marcas: m.respaldo, duracion: e.respaldo.duracion }} />
      <Composition id="Qr-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Qr-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
