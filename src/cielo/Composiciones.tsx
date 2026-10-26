import { Composition, Folder } from "remotion";
import { FPS } from "../comun/metadata";
import { Atardecer } from "./escenas/Atardecer";
import { CTA } from "./escenas/CTA";
import { Hook } from "./escenas/Hook";
import { Luz } from "./escenas/Luz";
import { PausaComentario } from "./escenas/PausaComentario";
import { Rebote } from "./escenas/Rebote";
import { Remate } from "./escenas/Remate";
import { calcularMetadataCielo, CieloReel, PROPS_CIELO } from "./CieloReel";
import { lineaCielo } from "./linea-cielo";

const ANCHO = 1080;
const ALTO = 1920;

// Línea de tiempo con los timestamps estimados, sólo para previsualizar cada escena suelta.
const DURACION_ESTIMADA = Math.ceil((PROPS_CIELO.duracionVoz + 0.5) * FPS);
const { escenas: e, marcas: m } = lineaCielo(PROPS_CIELO.palabras, FPS, DURACION_ESTIMADA);

export const ComposicionesCielo: React.FC = () => (
  <Folder name="Cielo">
    <Composition
      id="CieloReel"
      component={CieloReel}
      width={ANCHO}
      height={ALTO}
      fps={FPS}
      durationInFrames={2100}
      defaultProps={PROPS_CIELO}
      calculateMetadata={calcularMetadataCielo}
    />
    <Folder name="Cielo-Escenas">
      <Composition id="Cielo-Hook" component={Hook} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.hook.duracion} defaultProps={{ marcas: m.hook, duracion: e.hook.duracion }} />
      <Composition id="Cielo-Luz" component={Luz} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.luz.duracion} defaultProps={{ marcas: m.luz, duracion: e.luz.duracion }} />
      <Composition id="Cielo-Rebote" component={Rebote} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.rebote.duracion} defaultProps={{ marcas: m.rebote, duracion: e.rebote.duracion }} />
      <Composition
        id="Cielo-PausaComentario"
        component={PausaComentario}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={e.pausa.duracion}
        defaultProps={{ marcas: m.pausa, duracion: e.pausa.duracion, anterior: { marcas: m.rebote, duracion: e.rebote.duracion } }}
      />
      <Composition id="Cielo-Atardecer" component={Atardecer} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.atardecer.duracion} defaultProps={{ marcas: m.atardecer, duracion: e.atardecer.duracion }} />
      <Composition id="Cielo-Remate" component={Remate} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.remate.duracion} defaultProps={{ duracion: e.remate.duracion }} />
      <Composition id="Cielo-CTA" component={CTA} width={ANCHO} height={ALTO} fps={FPS} durationInFrames={e.cta.duracion} defaultProps={{ marcas: m.cta, duracion: e.cta.duracion, logoDisponible: false }} />
    </Folder>
  </Folder>
);
