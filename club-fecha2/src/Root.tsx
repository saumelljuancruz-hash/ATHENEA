import { Composition } from "remotion";
import { Fecha2 } from "./Fecha2";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="Fecha2" component={Fecha2} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
