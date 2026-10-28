import "./comun/tema";
import { ComposicionesAvion } from "./avion/Composiciones";
import { ComposicionesFaceId } from "./faceid/Composiciones";
import { ComposicionesMicroondas } from "./microondas/Composiciones";
import { ComposicionesGps } from "./gps/Composiciones";
import { ComposicionesQr } from "./qr/Composiciones";
import { ComposicionesCielo } from "./cielo/Composiciones";
import { ComposicionesModoAvion } from "./modoavion/Composiciones";
import { ComposicionesBateria } from "./bateria/Composiciones";
import { ComposicionesAlgoritmo } from "./algoritmo/Composiciones";
import { ComposicionesTrafico } from "./trafico/Composiciones";
import { ComposicionesVentanas } from "./ventanas/Composiciones";
import { ComposicionesApps } from "./apps/Composiciones";
import { ComposicionesAcaros } from "./acaros/Composiciones";
import { ComposicionesPierna } from "./pierna/Composiciones";
import { ComposicionesMareo } from "./mareo/Composiciones";
import { ComposicionesParpado } from "./parpado/Composiciones";

export const RemotionRoot: React.FC = () => (
  <>
    <ComposicionesAvion />
    <ComposicionesFaceId />
    <ComposicionesMicroondas />
    <ComposicionesGps />
    <ComposicionesQr />
    <ComposicionesCielo />
    <ComposicionesModoAvion />
    <ComposicionesBateria />
    <ComposicionesAlgoritmo />
    <ComposicionesTrafico />
    <ComposicionesVentanas />
    <ComposicionesApps />
    <ComposicionesAcaros />
    <ComposicionesPierna />
    <ComposicionesMareo />
    <ComposicionesParpado />
  </>
);
