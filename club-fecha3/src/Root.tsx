import { Composition } from "remotion";
import { Fecha3 } from "./Fecha3";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="Fecha3" component={Fecha3} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
