// node pruebas/respuestas.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { acierta, aciertaPais, leerNumero, normalizar, respuestaVF } from "../public/respuestas.js";

const paises = JSON.parse(readFileSync(new URL("../public/datos/paises.json", import.meta.url)));
const pais = (codigo) => paises.find((p) => p.codigo === codigo);
let n = 0;
const si = (comentario, codigo) => {
  assert.equal(aciertaPais(comentario, pais(codigo), paises), true, `"${comentario}" debería acertar ${codigo}`);
  n++;
};
const no = (comentario, codigo) => {
  assert.equal(aciertaPais(comentario, pais(codigo), paises), false, `"${comentario}" NO debería acertar ${codigo}`);
  n++;
};

assert.equal(normalizar("¡Perú!!"), "peru");
assert.equal(normalizar("EE. UU."), "ee uu");

// Escrito de distintas formas
si("Ecuador", "ec");
si("ecuador!!!", "ec");
si("es ECUADOR 🇪🇨", "ec");
si("perú", "pe");
si("Peru", "pe");
si("EEUU", "us");
si("EE. UU.", "us");
si("usa", "us");
si("estados unidos", "us");
si("Holanda", "nl");
si("paises bajos", "nl");
si("costa de marfil", "ci");
si("españa", "es");
si("Espana", "es");
si("corea del sur", "kr");
si("corea", "kr");
si("congo", "cd");
si("congo", "cg");
si("guinea", "gn");
si("Japón", "jp");
// Errores de tipeo chicos
si("argentian", "ar");
si("ecudor", "ec");
si("australa", "au");
si("madagascra", "mg");
// Lo que no vale
no("Colombia", "ec");
no("venezuela", "ec");
no("guinea ecuatorial", "gn");
no("papua nueva guinea", "gn");
no("nigeria", "ne");
no("niger", "ng");
no("austria", "au");
no("australia", "at");
no("sudan del sur", "sd");
no("sudan", "ss");
no("corea del norte", "kr");
no("republica dominicana", "dm");
no("dominica", "do");
no("iran", "iq");
no("irak", "ir");
no("republica democratica del congo", "cg");
no("jajaja", "ec");
no("", "ec");
no("no se", "ec");
no("ecuador o colombia o peru o chile o argentina o bolivia o venezuela y mas", "co");
no("colombia o ecuador", "co");
no("ecuador o colombia", "ec");
no("mexico o eeuu", "us");
si("guinea ecuatorial", "gq");
si("papua nueva guinea", "pg");
si("guinea bisau", "gw");
si("sudan del sur", "ss");
si("republica democratica del congo", "cd");
si("corea del norte", "kp");
si("republica dominicana", "do");
si("dominica", "dm");
no("islandia", "ie");
no("irlanda", "is");

// Verdadero o falso
assert.equal(respuestaVF("V"), "V");
assert.equal(respuestaVF("v!!"), "V");
assert.equal(respuestaVF("verdadero"), "V");
assert.equal(respuestaVF("es verdad"), "V");
assert.equal(respuestaVF("F"), "F");
assert.equal(respuestaVF("falso!!"), "F");
assert.equal(respuestaVF("FFF"), "F");
assert.equal(respuestaVF("mentira"), "F");
assert.equal(respuestaVF("v o f?"), null);
assert.equal(respuestaVF("hola"), null);
assert.equal(respuestaVF("vamos"), null);
n += 11;

// Números como los escribimos en Argentina
const numeros = [
  ["206", 206], ["creo que 206!!", 206], ["67,5", 67.5], ["67.5", 67.5], ["384.400", 384400], ["384 mil", 384000],
  ["1,3 millones", 1300000], ["1.300.000", 1300000], ["2k", 2000], ["1 palo", 1000000], ["1969", 1969], ["el 1.969", 1969],
  ["unos 8 minutos", 8], ["8849m", 8849], ["8849 metros", 8849], ["3 milanesas", 3], ["1.234,5", 1234.5], ["hola", null], ["", null], ["un millón", 1000000], ["un palo", 1000000], ["mil", 1000], ["7,32", 7.32], ["7.32", 7.32],
];
for (const [texto, valor] of numeros) {
  assert.equal(leerNumero(texto), valor, `"${texto}" debería ser ${valor}`);
  n++;
}

// Logos: escrito junto o separado, y marcas que se pisan
const logos = [
  { id: "mcdonalds", acepta: ["mcdonalds", "mc donalds", "mc"] },
  { id: "mclaren", acepta: ["mclaren", "mc laren"] },
  { id: "google", acepta: ["google"] },
  { id: "googlechrome", acepta: ["google chrome", "chrome"] },
  { id: "cocacola", acepta: ["coca cola", "coca", "coke"] },
  { id: "playstation", acepta: ["playstation", "play station", "play", "ps", "sony playstation"] },
  { id: "sony", acepta: ["sony"] },
];
const logo = (id) => logos.find((l) => l.id === id);
const okLogo = (texto, id, esperado) => {
  assert.equal(acierta(texto, logo(id), logos), esperado, `"${texto}" con ${id} debería dar ${esperado}`);
  n++;
};
okLogo("Mc Donald's", "mcdonalds", true);
okLogo("mcdonals", "mcdonalds", true);
okLogo("cocacola", "cocacola", true);
okLogo("Coca-Cola!!", "cocacola", true);
okLogo("play station 5", "playstation", true);
okLogo("sony playstation", "playstation", true);
okLogo("sony", "playstation", false);
okLogo("google chrome", "googlechrome", true);
okLogo("google chrome", "google", false);
okLogo("mc laren", "mcdonalds", false);
okLogo("mc", "mclaren", false);

console.log(`✔ ${n} pruebas de respuestas OK`);
