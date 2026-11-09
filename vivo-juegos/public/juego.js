import { aciertaPais, respuestaVF } from "./respuestas.js";

// ── Configuración (se puede cambiar en la dirección: ?preguntas=50&segundos=20) ──
const params = new URLSearchParams(location.search);
const numero = (clave, defecto) => {
  const v = Number(params.get(clave));
  return Number.isFinite(v) && v > 0 ? v : defecto;
};
const CONFIG = {
  preguntas: numero("preguntas", 30),
  segundosBandera: numero("segundos", 15),
  segundosVF: numero("segundosvf", 18),
  segundosRevelar: numero("revelar", 6),
  puntos: 100,
  bonusPrimero: 50,
};

const $ = (id) => document.getElementById(id);
const TITULOS = {
  bandera: ["ADIVINÁ EL PAÍS", "POR SU BANDERA", "COMENTÁ EL PAÍS EN EL CHAT"],
  vf: ["¿VERDADERO O FALSO?", "DATOS QUE NADIE TE EXPLICÓ", "COMENTÁ V O F EN EL CHAT"],
};

let PAISES = [];
let DATOS = [];

const estado = {
  pantalla: "menu",
  juego: null, // "banderas" | "vf" | "mixto"
  preguntas: [],
  i: 0,
  fase: null, // "cuenta" | "pregunta" | "revelar"
  terminaEn: 0,
  pausa: false,
  restantePausa: 0,
  jugadores: new Map(), // usuario → { nombre, foto, puntos, aciertos, desde }
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
const COLORES = ["#3ee0c0", "#ffe14d", "#ff8a3d", "#7fdcff", "#ff6f8a", "#b48cff", "#8ee06a"];
const colorDe = (texto) => COLORES[[...texto].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORES.length];

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
const elegir = (lista, cantidad, clave) => {
  const nuevas = mezclar(lista.filter((x) => !usadas.has(clave(x))));
  const viejas = mezclar(lista.filter((x) => usadas.has(clave(x))));
  if (nuevas.length < cantidad) {
    // Ya salieron casi todas: se vuelve a empezar con las que no salieron recién.
    for (const x of lista) {
      usadas.delete(clave(x));
    }
  }
  return [...nuevas, ...viejas].slice(0, cantidad);
};

// ── Armado de la partida ─────────────────────────────────────────────────────
const armarBanderas = (cantidad) => {
  const n1 = Math.round(cantidad * 0.4);
  const n2 = Math.round(cantidad * 0.35);
  const n3 = cantidad - n1 - n2;
  const clave = (p) => `b-${p.codigo}`;
  // De menor a mayor dificultad, mezcladas dentro de cada nivel.
  return [1, 2, 3].flatMap((nivel, k) => elegir(PAISES.filter((p) => p.nivel === nivel), [n1, n2, n3][k], clave)).map((pais) => ({ tipo: "bandera", pais }));
};
const armarVF = (cantidad) => elegir(DATOS, cantidad, (d) => `vf-${d.texto}`).map((dato) => ({ tipo: "vf", dato }));

const armarPartida = (juego) => {
  const n = CONFIG.preguntas;
  if (juego === "banderas") {
    return armarBanderas(n);
  }
  if (juego === "vf") {
    return armarVF(Math.min(n, DATOS.length));
  }
  const banderas = armarBanderas(Math.ceil(n / 2));
  const vf = armarVF(Math.floor(n / 2));
  return Array.from({ length: n }, (_, i) => (i % 2 === 0 ? banderas[i / 2] : vf[(i - 1) / 2])).filter(Boolean);
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

/** Pone en pantalla la pregunta (sin arrancar el reloj si `jugar` es false). */
const ponerPregunta = (pregunta, jugar = true) => {
  const tipo = pregunta.tipo;
  const [titulo, subtitulo, pista] = TITULOS[tipo];
  $("titulo").textContent = titulo;
  $("titulo").classList.toggle("largo", tipo === "vf");
  $("subtitulo").textContent = subtitulo;
  $("subtitulo").classList.toggle("largo", tipo === "vf");
  $("numero").textContent = `${estado.i + 1} / ${estado.preguntas.length}`;
  $("puntos-pregunta").textContent = `+${CONFIG.puntos} PTS`;

  $("bandera").classList.toggle("oculta", tipo !== "bandera");
  $("dato").classList.toggle("oculta", tipo !== "vf");
  $("respuesta").classList.toggle("oculta", tipo !== "bandera");
  $("vf").classList.toggle("oculta", tipo !== "vf");
  $("respuesta").classList.remove("revelada");
  $("respuesta-texto").className = "";
  $("respuesta-texto").textContent = pista;
  $("aciertos-label").textContent = tipo === "vf" ? "votaron" : "aciertos";
  $("aciertos").textContent = "0";
  $("primeros").replaceChildren();

  if (tipo === "bandera") {
    const img = $("bandera-img");
    img.src = `banderas/${pregunta.pais.codigo}.svg`;
    // Reinicia la animación de entrada.
    $("bandera").style.animation = "none";
    void $("bandera").offsetWidth;
    $("bandera").style.animation = "";
  } else {
    $("dato-texto").textContent = pregunta.dato.texto;
    $("dato-texto").classList.toggle("largo", pregunta.dato.texto.length > 70);
    $("dato-explicacion").textContent = "";
    $("dato-fuente").textContent = "";
    for (const l of ["V", "F"]) {
      $(`voto-${l}`).classList.remove("bien", "mal");
      $(`voto-${l}-pct`).textContent = "0%";
      $(`voto-${l}-barra`).style.width = "0%";
    }
    $("dato").style.animation = "none";
    void $("dato").offsetWidth;
    $("dato").style.animation = "";
  }

  estado.actual = { pregunta, acertaron: [], votos: new Map(), cuentaVotos: { V: 0, F: 0 } };
  if (!jugar) {
    // Durante la cuenta regresiva no se ve la primera pregunta.
    $("bandera").classList.add("oculta");
    $("dato").classList.add("oculta");
  }
  if (jugar) {
    estado.fase = "pregunta";
    estado.terminaEn = performance.now() + (tipo === "vf" ? CONFIG.segundosVF : CONFIG.segundosBandera) * 1000;
    sonar("whoosh", 0.35);
    lanzarBots(pregunta);
  }
};

const revelar = () => {
  const { pregunta, acertaron, votos } = estado.actual;
  estado.fase = "revelar";
  estado.terminaEn = performance.now() + CONFIG.segundosRevelar * 1000;
  pararBots();
  if (pregunta.tipo === "bandera") {
    const nombre = pregunta.pais.nombre.toUpperCase();
    $("respuesta-texto").textContent = nombre;
    $("respuesta-texto").className = nombre.length > 24 ? "muy-largo" : nombre.length > 15 ? "largo" : "";
    $("respuesta").classList.add("revelada");
  } else {
    const bien = pregunta.dato.respuesta;
    $(`voto-${bien}`).classList.add("bien");
    $(`voto-${bien === "V" ? "F" : "V"}`).classList.add("mal");
    $("dato-explicacion").textContent = `${bien === "V" ? "VERDADERO" : "FALSO"}: ${pregunta.dato.explicacion}`;
    $("dato-fuente").textContent = `Fuente: ${pregunta.dato.fuente}`;
    // En verdadero o falso los puntos se reparten recién ahora, para no adelantar la respuesta.
    let primero = true;
    for (const [usuario, voto] of votos) {
      if (voto.respuesta === bien) {
        const pts = CONFIG.puntos + (primero ? CONFIG.bonusPrimero : 0);
        sumar(voto.jugador, pts);
        acertaron.push({ ...voto.jugador, usuario, pts });
        primero = false;
      }
    }
    $("aciertos-label").textContent = "aciertos";
    $("aciertos").textContent = fmt(acertaron.length);
    renderPrimeros();
    renderTop();
  }
  sonar("ding", 0.5);
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
    usadas.add(p.tipo === "bandera" ? `b-${p.pais.codigo}` : `vf-${p.dato.texto}`);
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
  const resto = $("resto");
  resto.replaceChildren(...ranking.slice(3, 8).map((j, k) => filaRanking(j, k + 4)));
  mostrar("final");
  sonar("chispa", 0.5);
};

// ── Puntos y ranking ─────────────────────────────────────────────────────────
const jugadorDe = (c) => {
  let j = estado.jugadores.get(c.usuario);
  if (!j) {
    j = { usuario: c.usuario, nombre: c.nombre || c.usuario, foto: c.foto || "", puntos: 0, aciertos: 0, desde: performance.now() };
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
  const chips = estado.actual.acertaron.slice(0, 2).map((j) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.append(avatar(j), span("nombre", j.nombre), span("pts", `+${j.pts}`));
    return chip;
  });
  $("primeros").replaceChildren(...chips);
};

// ── Comentarios del chat ─────────────────────────────────────────────────────
const recibir = (c) => {
  if (estado.pantalla !== "juego" || estado.fase !== "pregunta" || estado.pausa || !estado.actual) {
    return;
  }
  const { pregunta, acertaron, votos, cuentaVotos } = estado.actual;
  if (!estado.participantes.has(c.usuario)) {
    estado.participantes.add(c.usuario);
    $("participando").textContent = fmt(estado.participantes.size);
  }
  const jugador = jugadorDe(c);
  if (pregunta.tipo === "bandera") {
    if (acertaron.some((a) => a.usuario === c.usuario)) {
      return;
    }
    if (aciertaPais(c.texto, pregunta.pais, PAISES)) {
      const pts = CONFIG.puntos + (acertaron.length === 0 ? CONFIG.bonusPrimero : 0);
      sumar(jugador, pts);
      acertaron.push({ ...jugador, pts });
      $("aciertos").textContent = fmt(acertaron.length);
      if (acertaron.length <= 2) {
        renderPrimeros();
        sonar(acertaron.length === 1 ? "chispa" : "toque", 0.35);
      }
      renderTop();
    }
    return;
  }
  // Verdadero o falso: vale el primer voto de cada uno.
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
    const total = (estado.actual.pregunta.tipo === "vf" ? CONFIG.segundosVF : CONFIG.segundosBandera) * 1000;
    $("reloj-numero").textContent = String(segundos);
    $("reloj-arco").style.strokeDashoffset = String(ARCO * (1 - resta / total));
    document.querySelector(".reloj").classList.toggle("apurado", segundos <= 5);
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
const lanzarBots = (pregunta) => {
  pararBots();
  if (!estado.bots) {
    return;
  }
  const duracion = (pregunta.tipo === "vf" ? CONFIG.segundosVF : CONFIG.segundosBandera) * 1000;
  const acierto = pregunta.tipo === "vf" ? 0.65 : [0, 0.85, 0.55, 0.3][pregunta.pais.nivel];
  for (const nombre of NOMBRES_BOT) {
    if (Math.random() > 0.8) {
      continue;
    }
    const cuando = 1500 + Math.random() * (duracion - 2500);
    let texto;
    if (pregunta.tipo === "vf") {
      const bien = Math.random() < acierto;
      const r = bien ? pregunta.dato.respuesta : pregunta.dato.respuesta === "V" ? "F" : "V";
      texto = Math.random() < 0.5 ? r : r === "V" ? "verdadero" : "falso";
    } else if (Math.random() < acierto) {
      texto = Math.random() < 0.3 ? `es ${pregunta.pais.nombre}!!` : pregunta.pais.nombre.toLowerCase();
    } else {
      texto = PAISES[Math.floor(Math.random() * PAISES.length)].nombre;
    }
    estado.timeoutsBots.push(setTimeout(() => recibir({ usuario: nombre, nombre, foto: "", texto }), cuando));
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
  if (estado.pantalla === "menu" && ["1", "2", "3"].includes(tecla)) {
    empezar({ 1: "banderas", 2: "vf", 3: "mixto" }[tecla]);
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
  [PAISES, DATOS] = await Promise.all([fetch("datos/paises.json").then((r) => r.json()), fetch("datos/verdadero-falso.json").then((r) => r.json())]);
  conectar();
  requestAnimationFrame(bucle);
  const juego = params.get("juego");
  if (["banderas", "vf", "mixto"].includes(juego)) {
    empezar(juego);
  }
};
cargar();

// Para las pruebas automáticas.
window.__juego = { estado, recibir, empezar, saltar, revelar, terminar };
