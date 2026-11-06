import { Composition } from "remotion";
import { Fecha4 } from "./Fecha4";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="Fecha4" component={Fecha4} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
