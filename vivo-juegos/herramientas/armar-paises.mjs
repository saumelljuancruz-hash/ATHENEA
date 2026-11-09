// Arma public/datos/paises.json: los 193 países miembros de la ONU, con el nombre en español
// (sale de Intl/CLDR), las formas en que la gente lo escribe en el chat y un nivel de dificultad.
//   node herramientas/armar-paises.mjs

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizar } from "../public/respuestas.js";

const AQUI = dirname(fileURLToPath(import.meta.url));

// Los 193 estados miembros de la ONU (código ISO 3166-1 alfa-2).
const ONU =
  "DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW " +
  "AG AR BS BB BZ BO BR CA CL CO CR CU DM DO EC SV GD GT GY HT HN JM MX NI PA PY PE KN LC VC SR TT US UY VE " +
  "AF AM AZ BH BD BT BN KH CN CY GE IN ID IR IQ IL JP JO KZ KW KG LA LB MY MV MN MM NP KP OM PK PH QA SA SG KR LK SY TJ TH TL TR TM AE UZ VN YE " +
  "AL AD AT BY BE BA BG HR CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB " +
  "AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU";

// Nivel 1: las que casi todos conocen. Nivel 2: conocidas. El resto, nivel 3.
const FACILES = "AR BR UY CL PY BO PE CO VE EC MX US CA CU JM CR PA ES FR IT DE GB PT NL BE CH SE NO DK FI IE GR TR RU UA PL JP CN KR IN AU NZ ZA EG MA NG IL SA AT".split(" ");
const MEDIAS =
  "GT HN SV NI DO HT HU CZ HR RS RO BG IS SK SI LT LV EE BY AL TH VN PH ID MY SG PK IR IQ AF KZ GE AM KE ET GH CM SN DZ TN CI QA AE KP LB SY JO NP LK MN".split(" ");

// Nombre que se muestra, cuando el de Intl no es el que se usa en Argentina.
const NOMBRE = {
  CI: "Costa de Marfil",
  MM: "Myanmar",
  SA: "Arabia Saudita",
  RO: "Rumania",
  BD: "Bangladesh",
  BH: "Baréin",
  QA: "Qatar",
  TL: "Timor Oriental",
  CZ: "República Checa",
  GW: "Guinea-Bisáu",
};

// Otras formas de escribirlo que también valen.
const TAMBIEN = {
  US: ["eeuu", "ee uu", "usa", "eua", "estados unidos de america", "united states"],
  GB: ["uk", "gran bretana", "reino unido de gran bretana"],
  NL: ["holanda"],
  CZ: ["chequia"],
  CI: ["cote d ivoire", "cote divoire"],
  MM: ["birmania"],
  SA: ["arabia saudi", "arabia"],
  AE: ["emiratos", "emiratos arabes"],
  KR: ["corea"],
  BA: ["bosnia"],
  MK: ["macedonia"],
  SZ: ["suazilandia", "eswatini"],
  TL: ["timor leste", "timor"],
  BY: ["belarus"],
  MD: ["moldova"],
  CD: ["rd congo", "rdc", "congo kinshasa", "congo"],
  CG: ["republica del congo", "congo brazzaville"],
  DO: ["dominicana", "rep dominicana"],
  CF: ["centroafrica"],
  BD: ["banglades"],
  BH: ["bahrein", "barein"],
  QA: ["catar"],
  KE: ["kenya"],
  BW: ["botswana"],
  ZW: ["zimbabwe"],
  MW: ["malawi"],
  LS: ["lesotho"],
  DJ: ["djibouti", "yibuti"],
  FJ: ["fiji"],
  PW: ["palau"],
  BN: ["brunei"],
  RO: ["rumania", "romania"],
  KZ: ["kazajstan"],
  KG: ["kirguistan", "kirguizistan"],
  TJ: ["tayikistan"],
  BT: ["butan"],
  SR: ["suriname"],
  GY: ["guyana"],
  TT: ["trinidad"],
  PG: ["papua"],
  IR: ["persia"],
  VN: ["viet nam"],
  RU: ["federacion rusa"],
  BS: ["las bahamas"],
};

const dn = new Intl.DisplayNames(["es"], { type: "region" });
const codigos = ONU.split(" ");
if (codigos.length !== 193 || new Set(codigos).size !== 193) {
  throw new Error(`Tienen que ser 193 países distintos y hay ${codigos.length}`);
}

const paises = codigos.map((codigo) => {
  const nombre = NOMBRE[codigo] ?? dn.of(codigo).replace(/\s*\(.*\)$/, "");
  const acepta = [...new Set([nombre, dn.of(codigo), dn.of(codigo).replace(/\s*\(.*\)$/, ""), ...(TAMBIEN[codigo] ?? [])].map(normalizar).filter(Boolean))];
  const nivel = FACILES.includes(codigo) ? 1 : MEDIAS.includes(codigo) ? 2 : 3;
  if (!existsSync(join(AQUI, "..", "node_modules", "flag-icons", "flags", "4x3", `${codigo.toLowerCase()}.svg`))) {
    throw new Error(`Falta la bandera de ${codigo}`);
  }
  return { codigo: codigo.toLowerCase(), nombre, acepta, nivel };
});

mkdirSync(join(AQUI, "..", "public", "datos"), { recursive: true });
writeFileSync(join(AQUI, "..", "public", "datos", "paises.json"), `${JSON.stringify(paises, null, 1)}\n`);
console.log(`Listo: ${paises.length} países (${paises.filter((p) => p.nivel === 1).length} fáciles, ${paises.filter((p) => p.nivel === 2).length} medios, ${paises.filter((p) => p.nivel === 3).length} difíciles).`);
