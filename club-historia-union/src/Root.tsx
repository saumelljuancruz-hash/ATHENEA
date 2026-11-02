import { Composition } from "remotion";
import { Historia } from "./Historia";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="HistoriaUnion" component={Historia} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
