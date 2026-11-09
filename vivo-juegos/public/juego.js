import { acierta, leerNumero, respuestaVF } from "./respuestas.js";

// ── Configuración (se puede cambiar en la dirección: ?preguntas=50&segundos=20) ──
const params = new URLSearchParams(location.search);
const numero = (clave, defecto) => {
  const v = Number(params.get(clave));
  return Number.isFinite(v) && v > 0 ? v : defecto;
};
const CONFIG = {
  preguntas: numero("preguntas", 30),
  segundosRevelar: numero("revelar", 6),
  puntos: 100,
  bonusPrimero: 50,
  blurInicial: 80,
};

// Cada tipo de pregunta: títulos, cuánto dura y qué dice el contador.
const TIPOS = {
  bandera: { titulo: "ADIVINÁ EL PAÍS", subtitulo: "POR SU BANDERA", pista: "COMENTÁ EL PAÍS EN EL CHAT", segundos: numero("segundos", 15), contador: "aciertos" },
  vf: { titulo: "¿VERDADERO O FALSO?", subtitulo: "DATOS QUE NADIE TE EXPLICÓ", pista: "COMENTÁ V O F EN EL CHAT", segundos: numero("segundosvf", 18), contador: "votaron" },
  cuanto: { titulo: "¿CUÁNTO?", subtitulo: "EL QUE MÁS SE ACERCA GANA", pista: "COMENTÁ UN NÚMERO EN EL CHAT", segundos: numero("segundoscuanto", 20), contador: "respondieron" },
  logo: { titulo: "ADIVINÁ EL LOGO", subtitulo: "CUANTO ANTES, MÁS PUNTOS", pista: "COMENTÁ LA MARCA EN EL CHAT", segundos: numero("segundoslogo", 20), contador: "aciertos" },
};
const JUEGOS = { 1: "banderas", 2: "vf", 3: "cuanto", 4: "logos", 5: "mixto" };

const $ = (id) => document.getElementById(id);

let PAISES = [];
let DATOS = [];
let CUANTO = [];
let LOGOS = [];

const estado = {
  pantalla: "menu",
  juego: null, // "banderas" | "vf" | "cuanto" | "logos" | "mixto"
  preguntas: [],
  i: 0,
  fase: null, // "cuenta" | "pregunta" | "revelar"
  terminaEn: 0,
  pausa: false,
  restantePausa: 0,
  jugadores: new Map(), // usuario → { nombre, foto, puntos, aciertos }
  participantes: new Set(),
  actual: null, // datos de la pregunta en juego
  sonido: true,
  bots: params.has("prueba"),
  timeoutsBots: [],
};

// ── Sonidos ──────────────────────────────────────────────────────────────────
const SONIDOS = Object.fromEntries(["toque", "ding", "whoosh", "chispa"].map((n) => [n, new Audio(`sonidos/${n}.wav`)]));
const sonar = (nombre, volumen = 0.5) => {
  if (!estado.sonido) {
    return;
  }
  const a = SONIDOS[nombre].cloneNode();
  a.volume = volumen;
  a.play().catch(() => {});
};

// ── Escalado del escenario a la ventana ─────────────────────────────────────
const escalar = () => {
  const s = Math.min(innerWidth / 1080, innerHeight / 1920);
  $("escenario").style.transform = `translate(-50%, -50%) scale(${s})`;
};
addEventListener("resize", escalar);
escalar();

// ── Utilidades ───────────────────────────────────────────────────────────────
const mezclar = (lista) => {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const fmt = (n) => Math.round(n).toLocaleString("es-AR");
/** 384400 → "384.400", 67.5 → "67,5", y los años sin punto: 1969. */
const fmtNumero = (n, anio = false) => (anio ? String(Math.round(n)) : n.toLocaleString("es-AR", { maximumFractionDigits: 2 }));
const COLORES = ["#3ee0c0", "#ffe14d", "#ff8a3d", "#7fdcff", "#ff6f8a", "#b48cff", "#8ee06a"];
const colorDe = (texto) => COLORES[[...texto].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORES.length];
const duracion = (pregunta) => TIPOS[pregunta.tipo].segundos * 1000;

/** Avatar con la foto de TikTok, o la inicial si no hay foto. Todo con textContent: nada del chat se interpreta como HTML. */
const avatar = (jugador) => {
  const div = document.createElement("div");
  div.className = "avatar";
  div.style.background = colorDe(jugador.nombre || "?");
  const inicial = () => {
    div.textContent = [...(jugador.nombre || "?").trim()][0]?.toUpperCase() ?? "?";
  };
  if (jugador.foto && /^https:\/\//.test(jugador.foto)) {
    const img = document.createElement("img");
    img.referrerPolicy = "no-referrer";
    img.src = jugador.foto;
    img.onerror = () => {
      img.remove();
      inicial();
    };
    div.append(img);
  } else {
    inicial();
  }
  return div;
};
const span = (clase, texto) => {
  const s = document.createElement("span");
  s.className = clase;
  s.textContent = texto;
  return s;
};

// "Usadas" se guarda en el navegador para no repetir preguntas entre partidas del mismo vivo.
const usadas = (() => {
  try {
    return new Set(JSON.parse(localStorage.getItem("usadas") || "[]"));
  } catch {
    return new Set();
  }
})();
const guardarUsadas = () => {
  try {
    localStorage.setItem("usadas", JSON.stringify([...usadas]));
  } catch {
    // Sin almacenamiento: puede repetir, no pasa nada.
  }
};
const claveDe = (p) => ({ bandera: `b-${p.pais?.codigo}`, vf: `vf-${p.dato?.texto}`, cuanto: `c-${p.dato?.pregunta}`, logo: `l-${p.logo?.id}` })[p.tipo];
const elegir = (lista, cantidad, clave) => {
  const nuevas = mezclar(lista.filter((x) => !usadas.has(clave(x))));
  const viejas = mezclar(lista.filter((x) => usadas.has(clave(x))));
  if (nuevas.length < cantidad) {
    // Ya salieron casi todas: se vuelve a empezar.
    for (const x of lista) {
      usadas.delete(clave(x));
    }
  }
  return [...nuevas, ...viejas].slice(0, cantidad);
};

// ── Armado de la partida ─────────────────────────────────────────────────────
/** De menor a mayor dificultad (40 % fáciles, 35 % medias, 25 % difíciles), mezcladas dentro de cada nivel. */
const porNiveles = (lista, cantidad, clave) => {
  const n1 = Math.round(cantidad * 0.4);
  const n2 = Math.round(cantidad * 0.35);
  const cuantos = [n1, n2, cantidad - n1 - n2];
  return [1, 2, 3].flatMap((nivel, k) => elegir(lista.filter((x) => x.nivel === nivel), cuantos[k], clave));
};
const ARMAR = {
  bandera: (n) => porNiveles(PAISES, n, (p) => `b-${p.codigo}`).map((pais) => ({ tipo: "bandera", pais })),
  vf: (n) => elegir(DATOS, Math.min(n, DATOS.length), (d) => `vf-${d.texto}`).map((dato) => ({ tipo: "vf", dato })),
  cuanto: (n) => elegir(CUANTO, Math.min(n, CUANTO.length), (d) => `c-${d.pregunta}`).map((dato) => ({ tipo: "cuanto", dato })),
  logo: (n) => porNiveles(LOGOS, n, (l) => `l-${l.id}`).map((logo) => ({ tipo: "logo", logo })),
};
const armarPartida = (juego) => {
  const n = CONFIG.preguntas;
  const solo = { banderas: "bandera", vf: "vf", cuanto: "cuanto", logos: "logo" }[juego];
  if (solo) {
    return ARMAR[solo](n);
  }
  // Mixto: bandera, verdadero o falso, logo, ¿cuánto?, y otra vez.
  const orden = ["bandera", "vf", "logo", "cuanto"];
  const tandas = Object.fromEntries(orden.map((t) => [t, ARMAR[t](Math.ceil(n / orden.length))]));
  return Array.from({ length: n }, (_, i) => tandas[orden[i % orden.length]][Math.floor(i / orden.length)]).filter(Boolean);
};

// ── Pantallas ────────────────────────────────────────────────────────────────
const mostrar = (pantalla) => {
  estado.pantalla = pantalla;
  for (const id of ["menu", "juego", "final"]) {
    $(id).classList.toggle("oculta", id !== pantalla);
  }
  $("conexion").classList.toggle("discreta", pantalla === "juego");
};

const irAlMenu = () => {
  pararBots();
  estado.fase = null;
  estado.pausa = false;
  $("pausa").classList.add("oculta");
  mostrar("menu");
};

const empezar = (juego) => {
  pararBots();
  estado.juego = juego;
  estado.preguntas = armarPartida(juego);
  estado.i = 0;
  estado.jugadores = new Map();
  estado.participantes = new Set();
  estado.pausa = false;
  $("pausa").classList.add("oculta");
  mostrar("juego");
  renderTop();
  $("participando").textContent = "0";
  ponerPregunta(estado.preguntas[0], false);
  estado.fase = "cuenta";
  estado.terminaEn = performance.now() + 3000;
  $("cuenta").classList.remove("oculta");
  sonar("whoosh", 0.4);
};

const reanimar = (el) => {
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "";
};

/** Pone en pantalla la pregunta (sin arrancar el reloj si `jugar` es false). */
const ponerPregunta = (pregunta, jugar = true) => {
  const tipo = pregunta.tipo;
  const t = TIPOS[tipo];
  $("titulo").textContent = t.titulo;
  $("titulo").classList.toggle("largo", tipo === "vf");
  $("subtitulo").textContent = t.subtitulo;
  $("subtitulo").classList.toggle("largo", tipo !== "bandera");
  $("numero").textContent = `${estado.i + 1} / ${estado.preguntas.length}`;
  $("puntos-pregunta").textContent = tipo === "cuanto" ? "+150 PTS AL 1.º" : `+${CONFIG.puntos + (tipo === "logo" ? 50 : 0)} PTS`;

  const ver = { bandera: tipo === "bandera", logo: tipo === "logo", dato: tipo === "vf" || tipo === "cuanto", respuesta: tipo !== "vf", vf: tipo === "vf" };
  for (const [id, visible] of Object.entries(ver)) {
    $(id).classList.toggle("oculta", !visible);
  }
  $("respuesta").classList.remove("revelada");
  $("respuesta-texto").className = "";
  $("respuesta-texto").textContent = t.pista;
  $("aciertos-label").textContent = t.contador;
  $("aciertos").textContent = "0";
  $("primeros").replaceChildren();
  $("dato").classList.remove("revelado");
  $("regla").classList.add("oculta");

  if (tipo === "bandera") {
    $("bandera-img").src = `banderas/${pregunta.pais.codigo}.svg`;
    reanimar($("bandera"));
  } else if (tipo === "logo") {
    const { logo } = pregunta;
    $("logo-path").setAttribute("d", logo.path);
    $("logo-path").setAttribute("fill", logo.color);
    // Los logos muy claros (amarillos, blancos) van sobre fondo oscuro.
    const [r, g, b] = [1, 3, 5].map((k) => parseInt(logo.color.slice(k, k + 2), 16) / 255);
    $("logo").classList.toggle("oscuro", 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6);
    $("logo-pista").textContent = logo.categoria;
    $("logo-svg").style.filter = `blur(${CONFIG.blurInicial}px)`;
    reanimar($("logo"));
  } else {
    const texto = tipo === "vf" ? pregunta.dato.texto : pregunta.dato.pregunta;
    $("dato-texto").textContent = texto;
    $("dato-texto").classList.toggle("largo", texto.length > 70);
    $("dato-explicacion").textContent = "";
    $("dato-fuente").textContent = "";
    if (tipo === "vf") {
      for (const l of ["V", "F"]) {
        $(`voto-${l}`).classList.remove("bien", "mal");
        $(`voto-${l}-pct`).textContent = "0%";
        $(`voto-${l}-barra`).style.width = "0%";
      }
    }
    reanimar($("dato"));
  }

  estado.actual = { pregunta, acertaron: [], votos: new Map(), cuentaVotos: { V: 0, F: 0 }, numeros: new Map(), empezo: performance.now() };
  if (!jugar) {
    // Durante la cuenta regresiva no se ve la primera pregunta.
    for (const id of ["bandera", "logo", "dato"]) {
      $(id).classList.add("oculta");
    }
    return;
  }
  estado.fase = "pregunta";
  estado.terminaEn = performance.now() + duracion(pregunta);
  sonar("whoosh", 0.35);
  lanzarBots(pregunta);
};

/** Puntos del logo: 150 apenas aparece, y bajan hasta 50 cuando ya se ve entero. */
const puntosLogo = () => {
  const resta = Math.max(0, estado.terminaEn - performance.now());
  return 50 + Math.round((CONFIG.puntos * resta) / duracion(estado.actual.pregunta));
};

const revelar = () => {
  const { pregunta, acertaron } = estado.actual;
  estado.fase = "revelar";
  estado.terminaEn = performance.now() + CONFIG.segundosRevelar * 1000;
  pararBots();
  if (pregunta.tipo === "bandera" || pregunta.tipo === "logo") {
    const nombre = (pregunta.tipo === "bandera" ? pregunta.pais.nombre : pregunta.logo.nombre).toUpperCase();
    $("respuesta-texto").textContent = nombre;
    $("respuesta-texto").className = nombre.length > 24 ? "muy-largo" : nombre.length > 15 ? "largo" : "";
    $("respuesta").classList.add("revelada");
    if (pregunta.tipo === "logo") {
      $("logo-svg").style.filter = "none";
      $("puntos-pregunta").textContent = "+50 PTS";
    }
  } else if (pregunta.tipo === "vf") {
    revelarVF();
  } else {
    revelarCuanto();
  }
  $("aciertos").textContent = fmt(pregunta.tipo === "cuanto" ? estado.actual.numeros.size : acertaron.length);
  renderPrimeros();
  renderTop();
  sonar("ding", 0.5);
};

const revelarVF = () => {
  const { pregunta, acertaron, votos } = estado.actual;
  const bien = pregunta.dato.respuesta;
  $(`voto-${bien}`).classList.add("bien");
  $(`voto-${bien === "V" ? "F" : "V"}`).classList.add("mal");
  $("dato-explicacion").textContent = `${bien === "V" ? "VERDADERO" : "FALSO"}: ${pregunta.dato.explicacion}`;
  $("dato-fuente").textContent = `Fuente: ${pregunta.dato.fuente}`;
  // En verdadero o falso los puntos se reparten recién ahora, para no adelantar la respuesta.
  let primero = true;
  for (const voto of votos.values()) {
    if (voto.respuesta === bien) {
      const pts = CONFIG.puntos + (primero ? CONFIG.bonusPrimero : 0);
      sumar(voto.jugador, pts);
      acertaron.push({ ...voto.jugador, pts });
      primero = false;
    }
  }
  $("aciertos-label").textContent = "aciertos";
};

const revelarCuanto = () => {
  const { pregunta, acertaron, numeros } = estado.actual;
  const { respuesta, unidad, anio } = pregunta.dato;
  const ordenadas = [...numeros.values()].sort((a, b) => Math.abs(a.valor - respuesta) - Math.abs(b.valor - respuesta) || a.t - b.t);
  // 150, 100 y 50 a los tres más cerca; los que la clavaron justo, 150 todos.
  ordenadas.forEach((r, k) => {
    const exacto = Math.abs(r.valor - respuesta) < 1e-9;
    const pts = exacto ? 150 : [150, 100, 50][k] ?? 0;
    if (pts > 0) {
      sumar(r.jugador, pts);
      acertaron.push({ ...r.jugador, pts, valor: r.valor, exacto });
    }
  });
  const texto = `${fmtNumero(respuesta, anio)}${unidad ? ` ${unidad}` : ""}`.toUpperCase();
  $("respuesta-texto").textContent = texto;
  $("respuesta-texto").className = texto.length > 24 ? "muy-largo" : texto.length > 15 ? "largo" : "";
  $("respuesta").classList.add("revelada");
  $("dato").classList.add("revelado");
  $("dato-explicacion").textContent = pregunta.dato.explicacion;
  $("dato-fuente").textContent = `Fuente: ${pregunta.dato.fuente}`;
  renderRegla(ordenadas, respuesta, anio, acertaron);
};

/** La regla: dónde cayó cada número que comentaron, y la respuesta. */
const renderRegla = (respuestas, respuesta, anio, ganadores) => {
  const linea = $("regla-linea");
  linea.replaceChildren();
  $("regla").classList.remove("oculta");
  const valores = respuestas.map((r) => r.valor).sort((a, b) => a - b);
  const q = (p) => valores[Math.min(valores.length - 1, Math.floor(p * valores.length))];
  let min = Math.min(respuesta, valores.length ? q(0.1) : respuesta);
  let max = Math.max(respuesta, valores.length ? q(0.9) : respuesta);
  if (max - min < 1e-9) {
    min = respuesta * 0.8 - 1;
    max = respuesta * 1.2 + 1;
  }
  const margen = (max - min) * 0.06;
  min -= margen;
  max += margen;
  const x = (v) => `${Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))}%`;
  const destacados = new Set(ganadores.map((g) => g.usuario));
  for (const r of respuestas.slice(0, 200)) {
    const punto = document.createElement("i");
    punto.className = destacados.has(r.jugador.usuario) ? "punto top" : "punto";
    punto.style.left = x(r.valor);
    linea.append(punto);
  }
  const marca = document.createElement("b");
  marca.className = "marca";
  marca.style.left = x(respuesta);
  marca.append(span("", fmtNumero(respuesta, anio)));
  linea.append(marca);
  // Los extremos, redondeados para que se lean fácil.
  const redondo = (v) => (max - min > 20 ? Math.round(v) : Math.round(v * 10) / 10);
  $("regla-min").textContent = fmtNumero(redondo(Math.max(0, min)), anio);
  $("regla-max").textContent = fmtNumero(redondo(max), anio);
};

const siguiente = () => {
  if (estado.i + 1 >= estado.preguntas.length) {
    terminar();
    return;
  }
  estado.i += 1;
  ponerPregunta(estado.preguntas[estado.i]);
};

const terminar = () => {
  pararBots();
  estado.fase = null;
  for (const p of estado.preguntas) {
    usadas.add(claveDe(p));
  }
  guardarUsadas();
  const ranking = ordenados();
  const podio = $("podio");
  podio.replaceChildren();
  // Orden visual del podio: 2.º, 1.º, 3.º.
  for (const k of [1, 0, 2]) {
    const j = ranking[k];
    const escalon = document.createElement("div");
    escalon.className = `escalon p${k + 1}`;
    if (j) {
      escalon.append(avatar(j), span("nombre", j.nombre), span("pts", `${fmt(j.puntos)} PTS`));
    }
    const base = document.createElement("div");
    base.className = "base";
    base.textContent = String(k + 1);
    escalon.append(base);
    podio.append(escalon);
  }
  $("resto").replaceChildren(...ranking.slice(3, 8).map((j, k) => filaRanking(j, k + 4)));
  mostrar("final");
  sonar("chispa", 0.5);
};

// ── Puntos y ranking ─────────────────────────────────────────────────────────
const jugadorDe = (c) => {
  let j = estado.jugadores.get(c.usuario);
  if (!j) {
    j = { usuario: c.usuario, nombre: c.nombre || c.usuario, foto: c.foto || "", puntos: 0, aciertos: 0, ultimo: 0 };
    estado.jugadores.set(c.usuario, j);
  } else if (c.foto && !j.foto) {
    j.foto = c.foto;
  }
  return j;
};
const sumar = (jugador, pts) => {
  jugador.puntos += pts;
  jugador.aciertos += 1;
  jugador.ultimo = performance.now();
};
const ordenados = () => [...estado.jugadores.values()].filter((j) => j.puntos > 0).sort((a, b) => b.puntos - a.puntos || a.ultimo - b.ultimo);

const filaRanking = (j, posicion) => {
  const li = document.createElement("li");
  li.className = "fila";
  li.append(span("pos", String(posicion)), avatar(j), span("nombre", j.nombre), span("pts", fmt(j.puntos)));
  return li;
};
const renderTop = () => {
  const top = ordenados().slice(0, 5);
  const lista = $("top");
  if (top.length === 0) {
    const vacio = document.createElement("li");
    vacio.className = "vacio";
    vacio.textContent = "Todavía nadie sumó puntos. ¡Comentá!";
    lista.replaceChildren(vacio);
    return;
  }
  lista.replaceChildren(...top.map((j, k) => filaRanking(j, k + 1)));
};
const renderPrimeros = () => {
  const { pregunta, acertaron } = estado.actual;
  const cuantos = pregunta.tipo === "cuanto" ? 3 : 2;
  const chips = acertaron.slice(0, cuantos).map((j) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    const nombre = pregunta.tipo === "cuanto" ? `${j.nombre}: ${fmtNumero(j.valor, pregunta.dato.anio)}` : j.nombre;
    chip.append(avatar(j), span("nombre", nombre), span("pts", `+${j.pts}`));
    return chip;
  });
  $("primeros").replaceChildren(...chips);
};

// ── Comentarios del chat ─────────────────────────────────────────────────────
const recibir = (c) => {
  if (estado.pantalla !== "juego" || estado.fase !== "pregunta" || estado.pausa || !estado.actual) {
    return;
  }
  const { pregunta, acertaron, votos, cuentaVotos, numeros } = estado.actual;
  if (!estado.participantes.has(c.usuario)) {
    estado.participantes.add(c.usuario);
    $("participando").textContent = fmt(estado.participantes.size);
  }
  const jugador = jugadorDe(c);

  if (pregunta.tipo === "bandera" || pregunta.tipo === "logo") {
    if (acertaron.some((a) => a.usuario === c.usuario)) {
      return;
    }
    const [item, lista] = pregunta.tipo === "bandera" ? [pregunta.pais, PAISES] : [pregunta.logo, LOGOS];
    if (!acierta(c.texto, item, lista)) {
      return;
    }
    const base = pregunta.tipo === "logo" ? puntosLogo() : CONFIG.puntos;
    const pts = base + (acertaron.length === 0 ? CONFIG.bonusPrimero : 0);
    sumar(jugador, pts);
    acertaron.push({ ...jugador, pts });
    $("aciertos").textContent = fmt(acertaron.length);
    if (acertaron.length <= 2) {
      renderPrimeros();
      sonar(acertaron.length === 1 ? "chispa" : "toque", 0.35);
    }
    renderTop();
    return;
  }

  if (pregunta.tipo === "vf") {
    // Vale el primer voto de cada uno.
    if (votos.has(c.usuario)) {
      return;
    }
    const r = respuestaVF(c.texto);
    if (!r) {
      return;
    }
    votos.set(c.usuario, { respuesta: r, jugador });
    cuentaVotos[r] += 1;
    const total = cuentaVotos.V + cuentaVotos.F;
    for (const l of ["V", "F"]) {
      const pct = Math.round((cuentaVotos[l] / total) * 100);
      $(`voto-${l}-pct`).textContent = `${pct}%`;
      $(`voto-${l}-barra`).style.width = `${pct}%`;
    }
    $("aciertos").textContent = fmt(total);
    return;
  }

  // ¿Cuánto?: vale el primer número de cada uno.
  if (numeros.has(c.usuario)) {
    return;
  }
  const valor = leerNumero(c.texto);
  if (valor === null) {
    return;
  }
  numeros.set(c.usuario, { valor, jugador, t: performance.now() });
  $("aciertos").textContent = fmt(numeros.size);
};

// ── Reloj (un solo bucle para todo) ─────────────────────────────────────────
let ultimoSegundo = null;
const ARCO = 2 * Math.PI * 52;
const bucle = () => {
  requestAnimationFrame(bucle);
  if (estado.pantalla !== "juego" || !estado.fase || estado.pausa) {
    return;
  }
  const ahora = performance.now();
  const resta = Math.max(0, estado.terminaEn - ahora);
  const segundos = Math.ceil(resta / 1000);
  if (estado.fase === "cuenta") {
    $("cuenta-numero").textContent = String(Math.max(1, segundos));
    if (segundos !== ultimoSegundo) {
      sonar("toque", 0.4);
      ultimoSegundo = segundos;
    }
    if (resta <= 0) {
      $("cuenta").classList.add("oculta");
      ponerPregunta(estado.preguntas[0]);
    }
    return;
  }
  if (estado.fase === "pregunta") {
    const { pregunta } = estado.actual;
    const total = duracion(pregunta);
    $("reloj-numero").textContent = String(segundos);
    $("reloj-arco").style.strokeDashoffset = String(ARCO * (1 - resta / total));
    document.querySelector(".reloj").classList.toggle("apurado", segundos <= 5);
    if (pregunta.tipo === "logo") {
      // El logo se va desdifuminando a medida que pasa el tiempo.
      const avance = 1 - resta / total;
      $("logo-svg").style.filter = `blur(${(CONFIG.blurInicial * (1 - avance) ** 1.5).toFixed(1)}px)`;
      $("puntos-pregunta").textContent = `+${puntosLogo() + (estado.actual.acertaron.length === 0 ? CONFIG.bonusPrimero : 0)} PTS`;
    }
    if (segundos !== ultimoSegundo && segundos <= 3 && segundos > 0) {
      sonar("toque", 0.45);
    }
    ultimoSegundo = segundos;
    if (resta <= 0) {
      revelar();
    }
    return;
  }
  if (estado.fase === "revelar") {
    $("reloj-numero").textContent = "0";
    $("reloj-arco").style.strokeDashoffset = String(ARCO);
    if (resta <= 0) {
      siguiente();
    }
  }
};

const pausar = () => {
  if (estado.pantalla !== "juego" || !estado.fase) {
    return;
  }
  estado.pausa = !estado.pausa;
  if (estado.pausa) {
    estado.restantePausa = estado.terminaEn - performance.now();
  } else {
    estado.terminaEn = performance.now() + estado.restantePausa;
  }
  $("pausa").classList.toggle("oculta", !estado.pausa);
};
const saltar = () => {
  if (estado.pantalla !== "juego" || estado.pausa) {
    return;
  }
  if (estado.fase === "pregunta") {
    revelar();
  } else if (estado.fase === "revelar") {
    siguiente();
  }
};

// ── Jugadores de prueba (para ensayar sin estar en vivo) ─────────────────────
const NOMBRES_BOT = ["lucas_92", "sofi.m", "nacho.ok", "juli_bsas", "mati10", "cami.r", "tomi_23", "agus.fit", "flor_cba", "santi.ar", "vale_ok", "fede_86", "mica.s", "joaco_ok", "lu.mtz", "pau_ros", "maxi.g", "belu_08", "gonza.f", "ro_mdz", "ema.k", "cande.t", "lauti_7", "ani.ok", "bauti.r", "meli_g", "franco.z", "abril_s", "thiago.p", "zoe.ar"];
const pararBots = () => {
  for (const t of estado.timeoutsBots) {
    clearTimeout(t);
  }
  estado.timeoutsBots = [];
};
const azarNormal = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
const textoBot = (pregunta, avance) => {
  if (pregunta.tipo === "vf") {
    const r = Math.random() < 0.65 ? pregunta.dato.respuesta : pregunta.dato.respuesta === "V" ? "F" : "V";
    return Math.random() < 0.5 ? r : r === "V" ? "verdadero" : "falso";
  }
  if (pregunta.tipo === "cuanto") {
    const { respuesta, anio } = pregunta.dato;
    if (Math.random() < 0.1) {
      return String(respuesta).replace(".", ",");
    }
    const valor = anio ? Math.round(respuesta + azarNormal() * 12) : respuesta * Math.exp(azarNormal() * 0.45);
    return valor >= 1000 && !anio ? fmt(valor) : String(Math.round(valor * 10) / 10).replace(".", ",");
  }
  if (pregunta.tipo === "logo") {
    // Con el logo más nítido, es más fácil acertar.
    const prob = [0, 0.9, 0.65, 0.4][pregunta.logo.nivel] * (0.3 + 0.7 * avance);
    return Math.random() < prob ? pregunta.logo.nombre.toLowerCase() : LOGOS[Math.floor(Math.random() * LOGOS.length)].nombre;
  }
  const prob = [0, 0.85, 0.55, 0.3][pregunta.pais.nivel];
  if (Math.random() < prob) {
    return Math.random() < 0.3 ? `es ${pregunta.pais.nombre}!!` : pregunta.pais.nombre.toLowerCase();
  }
  return PAISES[Math.floor(Math.random() * PAISES.length)].nombre;
};
const lanzarBots = (pregunta) => {
  pararBots();
  if (!estado.bots) {
    return;
  }
  const total = duracion(pregunta);
  for (const nombre of NOMBRES_BOT) {
    if (Math.random() > 0.8) {
      continue;
    }
    const avance = pregunta.tipo === "logo" ? 0.15 + Math.random() * 0.8 : 0.1 + Math.random() * 0.8;
    estado.timeoutsBots.push(setTimeout(() => recibir({ usuario: nombre, nombre, foto: "", texto: textoBot(pregunta, avance) }), avance * total));
  }
};

// ── Conexión con el servidor ─────────────────────────────────────────────────
const conectar = () => {
  const fuente = new EventSource("eventos");
  fuente.onmessage = (e) => {
    let ev;
    try {
      ev = JSON.parse(e.data);
    } catch {
      return;
    }
    if (ev.tipo === "comentario") {
      recibir(ev);
    } else if (ev.tipo === "estado") {
      const caja = $("conexion");
      caja.classList.toggle("ok", ev.conectado);
      caja.classList.toggle("prueba", ev.modo === "prueba");
      $("conexion-texto").textContent = ev.modo === "prueba" ? "MODO PRUEBA" : ev.mensaje;
    } else if (ev.tipo === "seguidor" && ev.nombre) {
      avisar(`¡${ev.nombre} se sumó a la cuenta!`);
    } else if (ev.tipo === "compartio" && ev.nombre) {
      avisar(`¡${ev.nombre} compartió el vivo!`);
    }
  };
  fuente.onerror = () => {
    $("conexion").classList.remove("ok");
    $("conexion-texto").textContent = "Sin conexión con el servidor";
  };
};
const avisar = (texto) => {
  const div = document.createElement("div");
  div.className = "aviso";
  div.textContent = texto;
  $("avisos").append(div);
  setTimeout(() => div.remove(), 4200);
  while ($("avisos").children.length > 3) {
    $("avisos").firstChild.remove();
  }
};

// ── Teclado ──────────────────────────────────────────────────────────────────
addEventListener("keydown", (e) => {
  if (e.target instanceof HTMLInputElement) {
    if (e.key === "Escape") {
      $("manual").classList.add("oculta");
      e.target.blur();
    }
    return;
  }
  const tecla = e.key.toLowerCase();
  if (estado.pantalla === "menu" && JUEGOS[tecla]) {
    empezar(JUEGOS[tecla]);
  } else if (tecla === " ") {
    e.preventDefault();
    pausar();
  } else if (tecla === "arrowright") {
    saltar();
  } else if (tecla === "r" && estado.juego) {
    empezar(estado.juego);
  } else if (tecla === "m") {
    irAlMenu();
  } else if (tecla === "b") {
    estado.bots = !estado.bots;
    avisar(estado.bots ? "Jugadores de prueba: SÍ" : "Jugadores de prueba: NO");
    if (!estado.bots) {
      pararBots();
    }
  } else if (tecla === "c") {
    $("manual").classList.toggle("oculta");
    if (!$("manual").classList.contains("oculta")) {
      $("manual-texto").focus();
    }
  } else if (tecla === "s") {
    estado.sonido = !estado.sonido;
    avisar(estado.sonido ? "Sonido: SÍ" : "Sonido: NO");
  } else if (tecla === "f") {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  }
});
for (const opcion of document.querySelectorAll(".opcion")) {
  opcion.addEventListener("click", () => empezar(opcion.dataset.juego));
}
$("manual").addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = $("manual-texto").value.trim();
  const usuario = $("manual-usuario").value.trim() || "prueba";
  if (texto) {
    recibir({ usuario, nombre: usuario, foto: "", texto });
  }
  $("manual-texto").value = "";
});

// ── Arranque ─────────────────────────────────────────────────────────────────
const cargar = async () => {
  const leer = (archivo) => fetch(`datos/${archivo}`).then((r) => r.json());
  [PAISES, DATOS, CUANTO, LOGOS] = await Promise.all([leer("paises.json"), leer("verdadero-falso.json"), leer("cuanto.json"), leer("logos.json")]);
  conectar();
  requestAnimationFrame(bucle);
  const juego = params.get("juego");
  if (Object.values(JUEGOS).includes(juego)) {
    empezar(juego);
  }
};
cargar();

// Para las pruebas automáticas.
window.__juego = { estado, recibir, empezar, saltar, revelar, terminar };
