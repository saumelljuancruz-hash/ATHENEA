export type PalabraConTiempo = {
  palabra: string;
  inicio: number;
  fin: number;
};

/** Props que calculateMetadata completa para cualquier Reel de la cuenta. */
export type PropsReel = {
  palabras: PalabraConTiempo[];
  fuenteTimestamps: "json" | "estimados-escalados" | "estimados";
  duracionVoz: number;
  vozDisponible: boolean;
  logoDisponible: boolean;
  /** Pausa insertada en la voz: se corta en `corte` (s del audio) y se retoma `segundos` después. */
  pausaVoz: { corte: number; segundos: number } | null;
};
