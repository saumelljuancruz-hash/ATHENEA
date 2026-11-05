import { getInputProps } from "remotion";

// Red social del video: cambia el color del botón "Seguir".
//   npx remotion render ResumenDia1 out/resumen-instagram.mp4 --props='{"plataforma":"instagram"}'
const props = getInputProps() as { plataforma?: string };

export const PLATAFORMA: string = props.plataforma ?? "tiktok";
export const SEGUIR = PLATAFORMA === "tiktok" ? "#fe2c55" : "#2f8cff";
