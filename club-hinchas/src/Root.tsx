import { Composition, Folder, Still } from "remotion";
import { Reel } from "./Reel";
import { H, HistoriaCancha, SlideCancha, SlideEligieron, SlidePartido, SlideResultados, SlideTabla, W } from "./resultados/Resultados";
import { S1Gancho } from "./scenes/S1Gancho";
import { S2Intro } from "./scenes/S2Intro";
import { S3Cuerpo1 } from "./scenes/S3Cuerpo1";
import { S4Bucle1 } from "./scenes/S4Bucle1";
import { S5Cuerpo2 } from "./scenes/S5Cuerpo2";
import { S6Bucle2 } from "./scenes/S6Bucle2";
import { S7Final } from "./scenes/S7Final";
import { S8Cta } from "./scenes/S8Cta";
import { FPS, piece, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Episodio1" component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />
      <Folder name="Escenas">
        <Composition id="S1-Gancho" component={S1Gancho} width={1080} height={1920} fps={FPS} durationInFrames={piece("gancho").durationInFrames} />
        <Composition id="S2-Intro" component={S2Intro} width={1080} height={1920} fps={FPS} durationInFrames={piece("intro").durationInFrames} />
        <Composition id="S3-Cuerpo1" component={S3Cuerpo1} width={1080} height={1920} fps={FPS} durationInFrames={piece("cuerpo1").durationInFrames} />
        <Composition id="S4-Bucle1" component={S4Bucle1} width={1080} height={1920} fps={FPS} durationInFrames={piece("bucle1").durationInFrames} />
        <Composition id="S5-Cuerpo2" component={S5Cuerpo2} width={1080} height={1920} fps={FPS} durationInFrames={piece("cuerpo2").durationInFrames} />
        <Composition id="S6-Bucle2" component={S6Bucle2} width={1080} height={1920} fps={FPS} durationInFrames={piece("bucle2").durationInFrames} />
        <Composition id="S7-Final" component={S7Final} width={1080} height={1920} fps={FPS} durationInFrames={piece("final").durationInFrames} />
        <Composition id="S8-Cta" component={S8Cta} width={1080} height={1920} fps={FPS} durationInFrames={piece("cta").durationInFrames} />
      </Folder>
      <Folder name="Resultados">
        <Still id="Fecha-1-Partido" component={SlidePartido} width={W} height={H} />
        <Still id="Fecha-2-Eligieron" component={SlideEligieron} width={W} height={H} />
        <Still id="Fecha-3-Resultados" component={SlideResultados} width={W} height={H} />
        <Still id="Fecha-4-Tabla" component={SlideTabla} width={W} height={H} />
        <Still id="Fecha-5-Cancha" component={SlideCancha} width={W} height={H} />
        <Still id="Cancha" component={HistoriaCancha} width={W} height={H} />
      </Folder>
    </>
  );
};
