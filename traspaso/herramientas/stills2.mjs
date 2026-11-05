// Uso: node stills.mjs <proyecto> <carpeta-salida> <frame,frame,...>
import path from "node:path";
import { createRequire } from "node:module";
const [project, outDir, framesArg] = process.argv.slice(2);
const require = createRequire(path.join(project, "package.json"));
const { bundle } = require("@remotion/bundler");
const { renderStill, selectComposition } = require("@remotion/renderer");
const serveUrl = await bundle({ entryPoint: path.join(project, "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: process.argv[5] ?? "TormentasElectricas" });
for (const frame of framesArg.split(",").map(Number)) {
  await renderStill({ composition, serveUrl, frame, output: path.join(outDir, `f${String(frame).padStart(4, "0")}.jpg`), imageFormat: "jpeg", scale: 0.4 });
  process.stdout.write(`${frame} `);
}
console.log("listo");
