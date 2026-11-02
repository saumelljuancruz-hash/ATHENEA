import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes locales (OFL) en public/fonts: el render no depende de la red.
export const DISPLAY = "Montserrat";
export const MONO = "JetBrains Mono";

for (const weight of ["600", "800", "900"]) {
  loadFont({ family: DISPLAY, url: staticFile(`fonts/Montserrat-${weight}.woff2`), weight });
}
for (const weight of ["500", "800"]) {
  loadFont({ family: MONO, url: staticFile(`fonts/JetBrainsMono-${weight}.woff2`), weight });
}

export const C = {
  bg: "#03050b",
  bg2: "#0a1226",
  electric: "#7fdcff",
  electricDeep: "#2f8cff",
  core: "#f4fbff",
  yellow: "#ffe14d",
  positive: "#ff5a4e",
  negative: "#4fa8ff",
  heat: "#ff8a2a",
  white: "#ffffff",
  dim: "rgba(255,255,255,0.55)",
};
