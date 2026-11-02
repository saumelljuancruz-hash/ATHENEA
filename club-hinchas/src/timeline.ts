import type { Caption } from "@remotion/captions";
import data from "./timeline.json";

// Generado por scripts/generar_voz.py a partir de voiceover/guion.json.
// Todos los tiempos salen del audio, así que las escenas se ajustan solas
// si cambia la voz en off.

export type PieceId =
  | "gancho"
  | "intro"
  | "cuerpo1"
  | "bucle1"
  | "cuerpo2"
  | "bucle2"
  | "final"
  | "cta";

export type ReelCaption = Caption & { keyword: boolean; handle: boolean };

type Piece = {
  id: string;
  from: number;
  durationInFrames: number;
  sentences: { text: string; start: number; end: number }[];
};

export const FPS = data.fps;
export const TOTAL_FRAMES = data.durationInFrames;
export const CAPTIONS = data.captions as ReelCaption[];
const PIECES = data.pieces as Piece[];

export const piece = (id: PieceId): Piece => {
  const found = PIECES.find((p) => p.id === id);
  if (!found) {
    throw new Error(`No existe la pieza ${id}`);
  }
  return found;
};

/** Frame (relativo a la pieza) en que empieza cada frase. */
export const beats = (id: PieceId): number[] =>
  piece(id).sentences.map((s) => s.start);

/** Frame (relativo a la pieza) en que se dice una palabra. */
export const wordAt = (id: PieceId, word: string, occurrence = 0): number => {
  const p = piece(id);
  // Se compara por frame redondeado: una palabra que arranca unos ms antes
  // del corte igual pertenece a la pieza.
  const frameOf = (c: Caption) => Math.round((c.startMs / 1000) * FPS);
  const matches = CAPTIONS.filter(
    (c) =>
      frameOf(c) >= p.from &&
      frameOf(c) < p.from + p.durationInFrames &&
      c.text.trim().toLowerCase().replace(/[.,:…]/g, "") === word.toLowerCase(),
  );
  const match = matches[occurrence];
  if (!match) {
    throw new Error(`No se dice "${word}" en ${id}`);
  }
  return Math.round((match.startMs / 1000) * FPS) - p.from;
};

/** Frames donde cambia de escena, para los flashes y whooshes. */
export const CUTS = PIECES.slice(1).map((p) => p.from);
