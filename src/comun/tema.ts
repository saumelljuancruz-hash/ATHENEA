import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const COLOR = {
  fondoOscuro: "#16171a",
  fondoClaro: "#2a2c31",
  verde: "#3ee0c0",
  rojo: "#ff5a4e",
  azul: "#4aa3ff",
  magenta: "#ff4f7a",
  naranja: "#ff9a3c",
  tierra: "#7d828b",
  tierraLuz: "#9499a2",
  tierraLado: "#3b3e45",
  oceano: "#1f2228",
  oceanoBorde: "#3a3d44",
  placaLado: "#121316",
  grilla: "rgba(255,255,255,0.07)",
  texto: "#f4f5f7",
  textoSuave: "#a7abb3",
  hudFondo: "rgba(8,9,11,0.72)",
};

export const FUENTE = {
  inter: "Inter, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/** Zonas reservadas para la interfaz de Instagram (px). */
export const SEGURO = {
  ancho: 1080,
  alto: 1920,
  izquierda: 80,
  derecha: 150,
  arriba: 100,
  abajo: 250,
};

loadFont({ family: "Inter", url: staticFile("fonts/Inter-Medium.otf"), weight: "500" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-Bold.otf"), weight: "700" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-ExtraBold.otf"), weight: "800" });
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/JetBrainsMono-Regular.ttf"), weight: "400" });
loadFont({ family: "JetBrains Mono", url: staticFile("fonts/JetBrainsMono-Bold.ttf"), weight: "700" });
