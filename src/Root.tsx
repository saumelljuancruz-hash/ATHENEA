import "./comun/tema";
import { ComposicionesAvion } from "./avion/Composiciones";
import { ComposicionesFaceId } from "./faceid/Composiciones";
import { ComposicionesMicroondas } from "./microondas/Composiciones";
import { ComposicionesGps } from "./gps/Composiciones";
import { ComposicionesQr } from "./qr/Composiciones";
import { ComposicionesCielo } from "./cielo/Composiciones";

export const RemotionRoot: React.FC = () => (
  <>
    <ComposicionesAvion />
    <ComposicionesFaceId />
    <ComposicionesMicroondas />
    <ComposicionesGps />
    <ComposicionesQr />
    <ComposicionesCielo />
  </>
);
