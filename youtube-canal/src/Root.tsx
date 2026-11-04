import { Still } from "remotion";
import { Banner, H, W } from "./Banner";

export const RemotionRoot: React.FC = () => (
  <>
    <Still id="BannerYouTube" component={Banner} width={W} height={H} />
    <Still id="BannerZonas" component={() => <Banner zonas />} width={W} height={H} />
  </>
);
