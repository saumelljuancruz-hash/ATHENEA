import { Camara } from "../cabeza";
import { Ubicacion } from "../componentes/Telefono";

/** Busto centrado, con la cara en el tercio superior-medio del cuadro. */
export const CAM_BUSTO: Camara = { yaw: 0, pitch: 0.08, escala: 270, centro: [560, 700], distancia: 7 };

/** Teléfono abajo a la izquierda, con la parte de arriba apuntando a la cara. */
export const TEL_ESCENA: Ubicacion = { x: 215, y: 1115, rot: 22, escala: 0.62 };

export const conYaw = (c: Camara, yaw: number, extra: Partial<Camara> = {}): Camara => ({ ...c, yaw, ...extra });
