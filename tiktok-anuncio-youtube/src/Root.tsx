import { Composition } from "remotion";
import { Anuncio } from "./Anuncio";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="AnuncioYouTube" component={Anuncio} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
