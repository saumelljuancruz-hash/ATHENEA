/**
 * Transcribe la voz de un Reel con Whisper (local, gratis) y alinea cada
 * palabra del guion con su tiempo real. Escribe el JSON de timestamps en public/.
 *
 * Uso:  node --no-warnings scripts/transcribir-voz.mjs <reel>     (p. ej. avion, faceid)
 * Lee ARCHIVOS y TEXTO_VOZ de src/<reel>/guion-<reel>.ts.
 *
 * Se usan las palabras del guion (no las de Whisper) para que los subtítulos
 * respeten la ortografía: "catorce" aunque Whisper escuche "14", "tirá", etc.
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import {
  downloadWhisperModel,
  installWhisperCpp,
  transcribe,
} from "@remotion/install-whisper-cpp";

const RAIZ = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const reel = process.argv[2] ?? "avion";
const { ARCHIVOS, TEXTO_VOZ } = await import(path.join(RAIZ, "src", reel, `guion-${reel}.ts`));
const WHISPER = path.join(RAIZ, "whisper.cpp");
const VERSION = "1.5.5";
const MODELO = "small";
const voz = path.join(RAIZ, "public", ARCHIVOS.voz);
const wav = path.join(WHISPER, `voz-${reel}-16k.wav`);
const salida = path.join(RAIZ, "public", ARCHIVOS.timestamps);

const normalizar = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

await installWhisperCpp({ to: WHISPER, version: VERSION });
await downloadWhisperModel({ model: MODELO, folder: WHISPER });
execSync(`ffmpeg -loglevel error -y -i "${voz}" -ar 16000 -ac 1 "${wav}"`);

const { transcription } = await transcribe({
  model: MODELO,
  whisperPath: WHISPER,
  whisperCppVersion: VERSION,
  inputPath: wav,
  tokenLevelTimestamps: true,
  language: "es",
});

// Tokens → palabras (un token que empieza con espacio abre palabra nueva).
const oidas = [];
for (const t of transcription) {
  const texto = t.text;
  if (!texto.trim()) continue;
  const desde = t.offsets.from / 1000;
  const hasta = t.offsets.to / 1000;
  const esPuntuacion = !normalizar(texto);
  const apertura = /^[¿¡]/.test(texto.trim());
  const u = oidas[oidas.length - 1];
  if (texto.startsWith(" ") && (!esPuntuacion || apertura)) {
    oidas.push({ texto: texto.trim(), inicio: desde, fin: hasta, abierta: esPuntuacion });
  } else if (u) {
    u.texto += texto.trim();
    if (!esPuntuacion) {
      if (u.abierta) u.inicio = desde;
      u.abierta = false;
      u.fin = hasta;
    }
  }
}

const guion = TEXTO_VOZ.replace(/\[[^\]]*\]/g, " ").split(/\s+/).filter(Boolean);
const a = guion.map(normalizar);
const b = oidas.map((o) => normalizar(o.texto));

// LCS entre guion y transcripción.
const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
for (let i = a.length - 1; i >= 0; i--) {
  for (let j = b.length - 1; j >= 0; j--) {
    dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  }
}
const pares = [];
for (let i = 0, j = 0; i < a.length && j < b.length; ) {
  if (a[i] === b[j]) pares.push([i++, j++]);
  else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
  else j++;
}

// Las palabras sin pareja (p. ej. "catorce" ↔ "14") se reparten en su hueco.
const palabras = guion.map((palabra) => ({ palabra, inicio: 0, fin: 0 }));
const anclas = [[-1, -1], ...pares, [a.length, b.length]];
for (let k = 0; k < anclas.length - 1; k++) {
  const [i0, j0] = anclas[k];
  const [i1, j1] = anclas[k + 1];
  if (i0 >= 0) {
    palabras[i0].inicio = oidas[j0].inicio;
    palabras[i0].fin = oidas[j0].fin;
  }
  const huecos = i1 - i0 - 1;
  if (huecos <= 0) continue;
  const desde = j0 + 1 < j1 ? oidas[j0 + 1].inicio : i0 >= 0 ? oidas[j0].fin : 0;
  const hasta = j1 - 1 > j0 ? oidas[j1 - 1].fin : j1 < oidas.length ? oidas[j1].inicio : desde + 0.3 * huecos;
  const paso = (hasta - desde) / huecos;
  for (let h = 0; h < huecos; h++) {
    palabras[i0 + 1 + h].inicio = desde + paso * h;
    palabras[i0 + 1 + h].fin = desde + paso * (h + 1);
  }
}

fs.rmSync(path.join(process.cwd(), "tmp.json"), { force: true });

const redondear = (n) => Math.round(n * 1000) / 1000;
fs.writeFileSync(
  salida,
  JSON.stringify(
    {
      fuente: `whisper.cpp ${VERSION} (${MODELO}) alineado al guion`,
      palabras: palabras.map((p) => ({ palabra: p.palabra, inicio: redondear(p.inicio), fin: redondear(p.fin) })),
    },
    null,
    1,
  ),
);
console.log(`${palabras.length} palabras (${pares.length} coincidencias exactas) → ${path.relative(RAIZ, salida)}`);
