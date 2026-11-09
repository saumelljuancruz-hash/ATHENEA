// Servidor de los juegos en vivo de @nadietelo.explico.
//
// - Lee los comentarios del vivo de TikTok (con tiktok-live-connector) y se los pasa al juego.
// - Sirve la página del juego en http://localhost:3000, que se captura en TikTok LIVE Studio u OBS.
//
//   node servidor.mjs                       → se conecta al vivo de @nadietelo.explico
//   node servidor.mjs otro.usuario          → se conecta al vivo de otra cuenta
//   node servidor.mjs --prueba              → sin TikTok: jugadores de mentira para ensayar
//   node servidor.mjs --puerto 3001         → otro puerto
//
// Si TikTok limita la conexión, se puede poner una clave gratis de https://www.eulerstream.com
// en la variable EULER_API_KEY (ver LEEME.md).

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { exec } from "node:child_process";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const PRUEBA = args.includes("--prueba");
const iPuerto = args.indexOf("--puerto");
const PUERTO = iPuerto >= 0 ? Number(args[iPuerto + 1]) : 3000;
const USUARIO = (args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--puerto") ?? "nadietelo.explico").replace(/^@/, "");
const NO_ABRIR = args.includes("--no-abrir");

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
};

// ── Eventos para la página (Server-Sent Events) ──────────────────────────────
const clientes = new Set();
let estado = { modo: PRUEBA ? "prueba" : "vivo", usuario: USUARIO, conectado: false, mensaje: PRUEBA ? "Modo prueba" : "Conectando…" };

const enviar = (evento) => {
  const linea = `data: ${JSON.stringify(evento)}\n\n`;
  for (const res of clientes) {
    res.write(linea);
  }
};
const cambiarEstado = (cambios) => {
  estado = { ...estado, ...cambios };
  enviar({ tipo: "estado", ...estado });
};

/** La foto de perfil viene en campos distintos según la versión de TikTok. */
const fotoDe = (user) =>
  user?.profilePictureUrl ?? user?.profilePicture?.url?.[0] ?? user?.profilePicture?.urlList?.[0] ?? user?.avatarThumb?.urlList?.[0] ?? user?.avatarThumb?.url?.[0] ?? "";

// ── Conexión con el vivo de TikTok ───────────────────────────────────────────
const conectarTikTok = async () => {
  const { TikTokLiveConnection, WebcastEvent, ControlEvent } = await import("tiktok-live-connector");
  const opciones = { processInitialData: false };
  if (process.env.EULER_API_KEY) {
    opciones.signApiKey = process.env.EULER_API_KEY;
  }
  const conexion = new TikTokLiveConnection(USUARIO, opciones);

  conexion.on(WebcastEvent.CHAT, (data) => {
    const texto = String(data.comment ?? "").trim();
    const usuario = data.user?.uniqueId;
    if (!texto || !usuario) {
      return;
    }
    enviar({ tipo: "comentario", usuario, nombre: data.user?.nickname || usuario, foto: fotoDe(data.user), texto });
  });
  conexion.on(WebcastEvent.FOLLOW, (data) => {
    enviar({ tipo: "seguidor", usuario: data.user?.uniqueId, nombre: data.user?.nickname || data.user?.uniqueId, foto: fotoDe(data.user) });
  });
  conexion.on(WebcastEvent.SHARE, (data) => {
    enviar({ tipo: "compartio", usuario: data.user?.uniqueId, nombre: data.user?.nickname || data.user?.uniqueId });
  });
  conexion.on(WebcastEvent.ROOM_USER, (data) => {
    if (typeof data.viewerCount === "number") {
      enviar({ tipo: "espectadores", cantidad: data.viewerCount });
    }
  });
  conexion.on(WebcastEvent.STREAM_END, () => {
    cambiarEstado({ conectado: false, mensaje: "Terminó el vivo" });
    console.log("· Terminó el vivo.");
  });
  conexion.on(ControlEvent.DISCONNECTED, () => {
    cambiarEstado({ conectado: false, mensaje: "Se cortó la conexión, reintentando…" });
    console.log("· Se cortó la conexión con TikTok. Reintento en 15 segundos…");
    setTimeout(intentar, 15000);
  });

  async function intentar() {
    try {
      cambiarEstado({ conectado: false, mensaje: `Buscando el vivo de @${USUARIO}…` });
      const s = await conexion.connect();
      cambiarEstado({ conectado: true, mensaje: `Conectado al vivo de @${USUARIO}` });
      console.log(`✔ Conectado al vivo de @${USUARIO} (sala ${s.roomId}). Los comentarios ya llegan al juego.`);
    } catch (error) {
      const offline = /offline|not live|UserOffline/i.test(`${error?.name} ${error?.message}`);
      const mensaje = offline ? `@${USUARIO} no está en vivo todavía` : `No se pudo conectar: ${error?.message ?? error}`;
      cambiarEstado({ conectado: false, mensaje });
      console.log(`· ${mensaje}. Reintento en 20 segundos…`);
      setTimeout(intentar, 20000);
    }
  }
  intentar();
};

// ── Servidor web ─────────────────────────────────────────────────────────────
const servirArchivo = (res, ruta) => {
  if (!existsSync(ruta) || !statSync(ruta).isFile()) {
    res.writeHead(404).end("No existe");
    return;
  }
  res.writeHead(200, { "Content-Type": TIPOS[extname(ruta)] ?? "application/octet-stream", "Cache-Control": "no-cache" });
  createReadStream(ruta).pipe(res);
};

const leerCuerpo = (req) =>
  new Promise((resolve) => {
    let cuerpo = "";
    req.on("data", (parte) => {
      cuerpo += parte;
      if (cuerpo.length > 10000) {
        req.destroy();
      }
    });
    req.on("end", () => resolve(cuerpo));
  });

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const ruta = decodeURIComponent(url.pathname);

  if (ruta === "/eventos") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
    res.write(`data: ${JSON.stringify({ tipo: "estado", ...estado })}\n\n`);
    clientes.add(res);
    const latido = setInterval(() => res.write(": latido\n\n"), 20000);
    req.on("close", () => {
      clearInterval(latido);
      clientes.delete(res);
    });
    return;
  }
  // Comentario a mano (para probar desde otra pestaña o el celular en la misma red).
  if (ruta === "/comentar" && req.method === "POST") {
    try {
      const { usuario = "prueba", nombre, texto } = JSON.parse(await leerCuerpo(req));
      if (texto) {
        enviar({ tipo: "comentario", usuario: String(usuario).slice(0, 40), nombre: String(nombre ?? usuario).slice(0, 40), foto: "", texto: String(texto).slice(0, 200) });
      }
      res.writeHead(204).end();
    } catch {
      res.writeHead(400).end("JSON inválido");
    }
    return;
  }
  // Banderas: salen del paquete flag-icons (licencia MIT).
  const bandera = ruta.match(/^\/banderas\/([a-z]{2})\.svg$/);
  if (bandera) {
    servirArchivo(res, join(AQUI, "node_modules", "flag-icons", "flags", "4x3", `${bandera[1]}.svg`));
    return;
  }
  const publica = join(AQUI, "public");
  const archivo = join(publica, normalize(ruta === "/" ? "/index.html" : ruta));
  if (!archivo.startsWith(publica)) {
    res.writeHead(403).end("No");
    return;
  }
  servirArchivo(res, archivo);
});

servidor.listen(PUERTO, () => {
  const direccion = `http://localhost:${PUERTO}/${PRUEBA ? "?prueba=1" : ""}`;
  console.log("");
  console.log("  JUEGOS EN VIVO · @nadietelo.explico");
  console.log(`  Abrí el juego en: ${direccion}`);
  console.log(PRUEBA ? "  Modo prueba: juegan jugadores de mentira, no se conecta a TikTok." : `  Leyendo los comentarios del vivo de @${USUARIO}.`);
  console.log("  Para cerrar, apretá Ctrl + C.");
  console.log("");
  if (!NO_ABRIR) {
    abrirNavegador(direccion);
  }
  if (!PRUEBA) {
    conectarTikTok().catch((error) => {
      cambiarEstado({ conectado: false, mensaje: `Error: ${error?.message ?? error}` });
      console.error("No se pudo cargar tiktok-live-connector. ¿Corriste npm install?", error);
    });
  }
});

/** Abre el juego en una ventana sola de Chrome o Edge (o en el navegador que haya). */
function abrirNavegador(direccion) {
  if (process.platform === "win32") {
    const candidatos = [
      join(process.env.ProgramFiles ?? "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
      join(process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
      join(process.env.LOCALAPPDATA ?? "", "Google", "Chrome", "Application", "chrome.exe"),
      join(process.env["ProgramFiles(x86)"] ?? "C:\\Program Files (x86)", "Microsoft", "Edge", "Application", "msedge.exe"),
      join(process.env.ProgramFiles ?? "C:\\Program Files", "Microsoft", "Edge", "Application", "msedge.exe"),
    ];
    const navegador = candidatos.find((c) => existsSync(c));
    exec(navegador ? `"${navegador}" --app="${direccion}" --window-size=608,1080` : `start "" "${direccion}"`);
  } else if (process.platform === "darwin") {
    exec(`open "${direccion}"`);
  }
}
