import "./comun/tema";
import { ComposicionesAvion } from "./avion/Composiciones";
import { ComposicionesFaceId } from "./faceid/Composiciones";

export const RemotionRoot: React.FC = () => (
  <>
    <ComposicionesAvion />
    <ComposicionesFaceId />
  </>
);
