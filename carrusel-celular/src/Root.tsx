import { Composition, Folder, Still } from "remotion";
import { Carrusel, SLIDES } from "./slides/Slides";
import { H, W } from "./slides/Slide";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="Carrusel" component={Carrusel} width={W} height={H} fps={1} durationInFrames={SLIDES.length} />
      <Folder name="Slides">
        {SLIDES.map((Slide, i) => (
          <Still key={i} id={`Slide-${i + 1}`} component={Slide} width={W} height={H} />
        ))}
      </Folder>
    </>
  );
};
