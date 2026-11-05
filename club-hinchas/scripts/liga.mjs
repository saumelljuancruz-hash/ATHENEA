// Liga de la serie: fixture, resultados y tabla.
//
//   node scripts/liga.mjs fixture                 muestra las 18 fechas
//   node scripts/liga.mjs jugar --hinchas 8       juega la próxima fecha
//   node scripts/liga.mjs jugar --hinchas 8 --fecha 3 --forzar
//   node scripts/liga.mjs jugar --hinchas 1175 --bengalas 40   (compartidos de los videos)
//   node scripts/liga.mjs club --nombre "Club X" --corto "X" --sigla CLX --colores "#123456,#ffffff"
//
// Los resultados salen de un sorteo con semilla pública ("t1-f3-NUE-GRA"):
// cualquiera puede repetir la cuenta y obtener lo mismo. Nadie los elige a mano.
// La única ventaja del club de la serie es su gente, y solo de local:
//   hinchada (seguidores): 4 × log10(hinchas + 1) puntos de fuerza (1.000 ≈ +12)
//   bengalas (compartidos de los videos desde el último partido de local):
//   cada una suma 0,05 % de chance de ganar, con un tope de 90 %. El partido
//   se juega con la fuerza que da exactamente esa chance.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/liga");
const EQUIPOS = path.join(DIR, "equipos.json");
const ESTADO = path.join(DIR, "estado.json");
const FECHA = path.join(DIR, "fecha.json");

const liga = JSON.parse(fs.readFileSync(EQUIPOS, "utf8"));
const leerEstado = () => (fs.existsSync(ESTADO) ? JSON.parse(fs.readFileSync(ESTADO, "utf8")) : { fechas: [] });
const guardar = (f, data) => fs.writeFileSync(f, JSON.stringify(data, null, 2) + "\n");

// --- azar con semilla ---------------------------------------------------
const hash = (s) => {
  let h = 2166136261;
  for (const ch of s) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
const rng = (seed) => {
  let a = hash(seed);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const poisson = (lambda, rand) => {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= rand();
  } while (p > L);
  return k - 1;
};

// --- fixture: todos contra todos, ida y vuelta (método del círculo) ------
const fixture = () => {
  const rand = rng(`t${liga.temporada}-fixture`);
  // El club de la serie queda fijo en el círculo: así alterna local y visitante
  // todas las fechas. El resto se sortea.
  const otros = liga.equipos.map((e) => e.id).filter((id) => id !== liga.nuestro);
  for (let i = otros.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [otros[i], otros[j]] = [otros[j], otros[i]];
  }
  const ids = [liga.nuestro, ...otros];
  const n = ids.length;
  const ida = [];
  let rot = ids.slice(1);
  // Saldo de localías y última condición de cada equipo, para alternar.
  const saldo = Object.fromEntries(ids.map((id) => [id, 0]));
  const ultima = {};
  for (let r = 0; r < n - 1; r++) {
    const fila = [ids[0], ...rot];
    const partidos = [];
    for (let k = 0; k < n / 2; k++) {
      const a = fila[k];
      const b = fila[n - 1 - k];
      // El club de la serie: local en la fecha 1 y después alterna.
      // El resto: es local el que viene con menos localías o jugó afuera la última.
      const aLocal =
        k === 0
          ? r % 2 === 0
          : saldo[a] !== saldo[b]
            ? saldo[a] < saldo[b]
            : ultima[a] !== ultima[b]
              ? ultima[a] === "V"
              : rand() < 0.5;
      const [l, v] = aLocal ? [a, b] : [b, a];
      saldo[l]++;
      saldo[v]--;
      ultima[l] = "L";
      ultima[v] = "V";
      partidos.push([l, v]);
    }
    ida.push(partidos);
    rot = [rot[rot.length - 1], ...rot.slice(0, -1)];
  }
  const vuelta = ida.map((ps) => ps.map(([a, b]) => [b, a]));
  return [...ida, ...vuelta];
};

const equipo = (id) => liga.equipos.find((e) => e.id === id);
const bonusHinchada = (hinchas) => 4 * Math.log10(hinchas + 1);
const POR_BENGALA = 0.0005; // 0,05 % de chance de ganar por bengala
const TOPE = 0.9; // con bengalas, la chance de ganar no pasa del 90 %

const poissonP = (l, k) => {
  let p = Math.exp(-l);
  for (let i = 1; i <= k; i++) {
    p *= l / i;
  }
  return p;
};
/** Probabilidad de que gane el local, según la diferencia de fuerza (en la escala d). */
const pGanaLocal = (d) => {
  const lh = 1.35 * Math.exp(d);
  const la = 1.05 * Math.exp(-d);
  let w = 0;
  for (let i = 0; i < 45; i++) {
    for (let j = 0; j < i; j++) {
      w += poissonP(lh, i) * poissonP(la, j);
    }
  }
  return w;
};
/** Cuánto hay que subir d para que la chance de ganar quede en `objetivo` (búsqueda binaria). */
const subirHasta = (d0, objetivo) => {
  // Hasta d + 2,5 alcanza para cualquier chance del tope (90 %) y los goles esperados siguen siendo razonables.
  let lo = 0;
  let hi = 2.5;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (pGanaLocal(d0 + mid) < objetivo) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
};
const chanceConBengalas = (base, bengalas) => (bengalas > 0 ? Math.max(base, Math.min(TOPE, base + POR_BENGALA * bengalas)) : base);

const jugarPartido = (fecha, local, visitante, hinchas, bengalas) => {
  const semilla = `t${liga.temporada}-f${fecha}-${local}-${visitante}`;
  const rand = rng(semilla);
  const localia = 3 + (local === liga.nuestro ? bonusHinchada(hinchas) : 0);
  let d = (equipo(local).fuerza + localia - equipo(visitante).fuerza) / 25;
  if (local === liga.nuestro && bengalas > 0) {
    d += subirHasta(d, chanceConBengalas(pGanaLocal(d), bengalas));
  }
  return { local, visitante, gl: poisson(1.35 * Math.exp(d), rand), gv: poisson(1.05 * Math.exp(-d), rand), semilla };
};

const tabla = (fechas) => {
  const filas = Object.fromEntries(liga.equipos.map((e) => [e.id, { id: e.id, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 }]));
  for (const f of fechas) {
    for (const m of f.partidos) {
      const L = filas[m.local];
      const V = filas[m.visitante];
      L.pj++;
      V.pj++;
      L.gf += m.gl;
      L.gc += m.gv;
      V.gf += m.gv;
      V.gc += m.gl;
      if (m.gl > m.gv) {
        L.g++;
        V.p++;
        L.pts += 3;
      } else if (m.gl < m.gv) {
        V.g++;
        L.p++;
        V.pts += 3;
      } else {
        L.e++;
        V.e++;
        L.pts++;
        V.pts++;
      }
    }
  }
  return Object.values(filas)
    .map((f) => ({ ...f, dg: f.gf - f.gc }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf || equipo(a.id).nombre.localeCompare(equipo(b.id).nombre));
};

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const comando = args[0];
const FIX = fixture();
guardar(path.join(DIR, "fixture.json"), FIX.map((ps, i) => ({ fecha: i + 1, partidos: ps.map(([local, visitante]) => ({ local, visitante })) })));

if (comando === "fixture") {
  FIX.forEach((ps, i) => console.log(`Fecha ${String(i + 1).padStart(2)}: ${ps.map(([a, b]) => `${a}-${b}`).join("  ")}`));
} else if (comando === "jugar") {
  const hinchas = Number(opt("hinchas"));
  if (!Number.isFinite(hinchas) || hinchas < 0) {
    throw new Error("Falta --hinchas <seguidores de hoy>");
  }
  const bengalas = Number(opt("bengalas") ?? 0);
  if (!Number.isFinite(bengalas) || bengalas < 0) {
    throw new Error("--bengalas tiene que ser un número (compartidos)");
  }
  const estado = leerEstado();
  const numero = Number(opt("fecha") ?? estado.fechas.length + 1);
  if (numero < 1 || numero > FIX.length) {
    throw new Error(`La temporada tiene ${FIX.length} fechas`);
  }
  const ya = estado.fechas.find((f) => f.fecha === numero);
  if (ya && !args.includes("--forzar")) {
    throw new Error(`La fecha ${numero} ya se jugó (con ${ya.hinchas} hinchas). Usá --forzar para repetirla.`);
  }
  const partidos = FIX[numero - 1].map(([l, v]) => jugarPartido(numero, l, v, hinchas, bengalas));
  estado.fechas = [...estado.fechas.filter((f) => f.fecha !== numero), { fecha: numero, hinchas, bengalas, partidos }].sort((a, b) => a.fecha - b.fecha);
  guardar(ESTADO, estado);
  const jugadas = estado.fechas.filter((f) => f.fecha <= numero);
  const proxima = FIX[numero]?.find((p) => p.includes(liga.nuestro));
  guardar(FECHA, {
    temporada: liga.temporada,
    fecha: numero,
    totalFechas: FIX.length,
    hinchas,
    bonusHinchada: Math.round(bonusHinchada(hinchas) * 10) / 10,
    bengalas,
    extraBengalas: Math.round(Math.min(POR_BENGALA * bengalas, TOPE) * 1000) / 10,
    partidos,
    tabla: tabla(jugadas),
    proximo: proxima ? { fecha: numero + 1, local: proxima[0], visitante: proxima[1] } : null,
  });
  console.log(`Fecha ${numero} · hinchas ${hinchas} (+${bonusHinchada(hinchas).toFixed(1)} de fuerza) · bengalas ${bengalas} (+${(POR_BENGALA * bengalas * 100).toFixed(2)} % de chance, tope ${TOPE * 100} %) — solo cuentan de local`);
  for (const m of partidos) {
    console.log(`  ${equipo(m.local).nombre.padEnd(22)} ${m.gl} - ${m.gv}  ${equipo(m.visitante).nombre}`);
  }
  console.log("Tabla:");
  tabla(jugadas).forEach((f, i) => console.log(`  ${String(i + 1).padStart(2)}. ${equipo(f.id).nombre.padEnd(22)} ${String(f.pts).padStart(2)} pts  ${f.pj} PJ  ${f.dg >= 0 ? "+" : ""}${f.dg}`));
} else if (comando === "club") {
  const yo = equipo(liga.nuestro);
  for (const k of ["nombre", "corto", "sigla", "icono"]) {
    if (opt(k)) {
      yo[k] = opt(k);
    }
  }
  if (opt("colores")) {
    yo.colores = opt("colores").split(",");
  }
  guardar(EQUIPOS, liga);
  console.log("Club actualizado:", yo);
} else {
  console.log("Comandos: fixture | jugar --hinchas N [--fecha N --forzar] | club --nombre ... --corto ... --sigla ... --colores a,b");
}
