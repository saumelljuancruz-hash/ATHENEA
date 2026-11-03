import { Composition } from "remotion";
import { Resumen } from "./Resumen";
import { FPS, TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => {
  return <Composition id="ResumenDia1" component={Resumen} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />;
};
