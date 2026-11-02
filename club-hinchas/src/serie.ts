import { getInputProps } from "remotion";
import serie from "./serie.json";

// Hinchas y red social del video. Por defecto salen de serie.json (Instagram);
// para otra cuenta se pasan al renderizar:
//   npx remotion render Episodio1 out/ep-tiktok.mp4 --props='{"hinchas":21,"plataforma":"tiktok"}'
const props = getInputProps() as { hinchas?: number; plataforma?: string };

export const HINCHAS: number = props.hinchas ?? serie.hinchas;
export const PLATAFORMA: string = props.plataforma ?? "instagram";
/** Color del botón "Seguir" de cada red. */
export const SEGUIR = PLATAFORMA === "tiktok" ? "#fe2c55" : "#2f8cff";
