import { Composition } from "remotion";
import { Inauguracion } from "./Inauguracion";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="Inauguracion" component={Inauguracion} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
