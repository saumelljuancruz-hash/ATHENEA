// Arma public/datos/logos.json con los logos de Simple Icons (paquete simple-icons, CC0).
// Los logos son marcas registradas de sus dueños: acá se usan solo para que la gente los reconozca en el juego.
//   node herramientas/armar-logos.mjs

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as si from "simple-icons";
import { normalizar } from "../public/respuestas.js";

const AQUI = dirname(fileURLToPath(import.meta.url));

// id de Simple Icons: [nombre que se muestra, nivel (1 fácil · 2 medio · 3 difícil), otras formas de escribirlo]
const CATEGORIAS = {
  ROPA: {
    nike: ["Nike", 1, ["naik"]],
    adidas: ["Adidas", 1, []],
    puma: ["Puma", 1, []],
    jordan: ["Jordan", 2, ["air jordan", "jumpman"]],
    underarmour: ["Under Armour", 2, ["under armor", "ua"]],
    thenorthface: ["The North Face", 2, ["north face", "tnf"]],
    newbalance: ["New Balance", 2, ["nb"]],
    reebok: ["Reebok", 2, ["reebook", "rebok"]],
    zara: ["Zara", 2, []],
    handm: ["H&M", 2, ["h m", "h y m", "hm"]],
    fila: ["Fila", 3, []],
  },
  APP: {
    whatsapp: ["WhatsApp", 1, ["wsp", "wpp", "whatsap", "wasap", "guasap", "watsap"]],
    instagram: ["Instagram", 1, ["ig", "insta"]],
    tiktok: ["TikTok", 1, ["tik tok"]],
    youtube: ["YouTube", 1, ["yt", "you tube"]],
    spotify: ["Spotify", 1, []],
    netflix: ["Netflix", 1, []],
    facebook: ["Facebook", 1, ["fb", "face"]],
    x: ["X (Twitter)", 1, ["x", "twitter"]],
    telegram: ["Telegram", 1, []],
    snapchat: ["Snapchat", 1, ["snap"]],
    googlechrome: ["Google Chrome", 1, ["chrome"]],
    gmail: ["Gmail", 1, ["google mail"]],
    googlemaps: ["Google Maps", 1, ["maps"]],
    discord: ["Discord", 1, []],
    twitch: ["Twitch", 1, []],
    uber: ["Uber", 1, []],
    mercadopago: ["Mercado Pago", 1, ["mp"]],
    pinterest: ["Pinterest", 2, []],
    reddit: ["Reddit", 2, []],
    messenger: ["Messenger", 2, ["facebook messenger"]],
    threads: ["Threads", 2, []],
    waze: ["Waze", 2, []],
    shazam: ["Shazam", 2, []],
    duolingo: ["Duolingo", 2, ["duo"]],
    airbnb: ["Airbnb", 2, []],
    tinder: ["Tinder", 2, []],
    zoom: ["Zoom", 2, []],
    paypal: ["PayPal", 2, []],
    firefox: ["Firefox", 2, ["mozilla", "mozilla firefox"]],
    safari: ["Safari", 2, []],
    wikipedia: ["Wikipedia", 2, ["wiki"]],
    aliexpress: ["AliExpress", 2, ["ali"]],
    opera: ["Opera", 3, []],
    signal: ["Signal", 3, []],
    crunchyroll: ["Crunchyroll", 3, []],
    paramountplus: ["Paramount+", 3, ["paramount", "paramount plus"]],
    bookingdotcom: ["Booking.com", 3, ["booking"]],
    ebay: ["eBay", 3, []],
    tripadvisor: ["Tripadvisor", 3, []],
  },
  VIDEOJUEGOS: {
    playstation: ["PlayStation", 1, ["play station", "play", "ps", "sony playstation"]],
    fortnite: ["Fortnite", 1, []],
    roblox: ["Roblox", 1, []],
    steam: ["Steam", 2, []],
    epicgames: ["Epic Games", 2, ["epic"]],
    valorant: ["Valorant", 2, []],
    leagueoflegends: ["League of Legends", 2, ["lol", "league"]],
    counterstrike: ["Counter-Strike", 2, ["counter", "cs", "csgo", "cs go", "cs2"]],
    pubg: ["PUBG", 2, []],
    ea: ["EA", 2, ["electronic arts", "ea sports"]],
    rockstargames: ["Rockstar Games", 2, ["rockstar"]],
    ubisoft: ["Ubisoft", 3, []],
    riotgames: ["Riot Games", 3, ["riot"]],
    sega: ["Sega", 3, []],
    supercell: ["Supercell", 3, []],
    activision: ["Activision", 3, []],
    konami: ["Konami", 3, []],
    squareenix: ["Square Enix", 3, []],
    battledotnet: ["Battle.net", 3, ["battle net", "battlenet", "blizzard"]],
  },
  TECNOLOGÍA: {
    apple: ["Apple", 1, []],
    google: ["Google", 1, []],
    samsung: ["Samsung", 1, []],
    android: ["Android", 1, []],
    motorola: ["Motorola", 1, ["moto"]],
    sony: ["Sony", 2, []],
    lg: ["LG", 2, []],
    xiaomi: ["Xiaomi", 2, ["xiomi", "shaomi"]],
    huawei: ["Huawei", 2, []],
    nvidia: ["NVIDIA", 2, ["nvdia"]],
    intel: ["Intel", 2, []],
    amd: ["AMD", 2, []],
    hp: ["HP", 2, ["hewlett packard"]],
    lenovo: ["Lenovo", 2, []],
    dell: ["Dell", 3, []],
    nokia: ["Nokia", 3, []],
    linux: ["Linux", 3, ["tux"]],
  },
  MARCAS: {
    visa: ["Visa", 1, []],
    mastercard: ["Mastercard", 1, ["master card", "master"]],
    nasa: ["NASA", 2, []],
    ikea: ["IKEA", 3, []],
    carrefour: ["Carrefour", 2, []],
    shell: ["Shell", 2, []],
    hbo: ["HBO", 2, []],
    dcentertainment: ["DC", 3, ["dc comics", "dc entertainment"]],
  },
  DEPORTES: {
    fifa: ["FIFA", 2, []],
    nba: ["NBA", 2, []],
    premierleague: ["Premier League", 3, ["premier"]],
  },
  "COMIDA Y BEBIDA": {
    mcdonalds: ["McDonald's", 1, ["mcdonalds", "mc donalds", "mcdonald", "mc"]],
    cocacola: ["Coca-Cola", 1, ["coca cola", "coca", "coke"]],
    burgerking: ["Burger King", 1, ["bk", "burger"]],
    kfc: ["KFC", 2, []],
    starbucks: ["Starbucks", 2, []],
    redbull: ["Red Bull", 2, ["redbull"]],
  },
  "AUTOS Y MOTOS": {
    ferrari: ["Ferrari", 1, []],
    toyota: ["Toyota", 1, []],
    volkswagen: ["Volkswagen", 1, ["vw", "wolkswagen", "volkswaguen"]],
    chevrolet: ["Chevrolet", 1, ["chevy"]],
    ford: ["Ford", 1, []],
    bmw: ["BMW", 1, []],
    audi: ["Audi", 1, []],
    renault: ["Renault", 1, ["reno"]],
    fiat: ["Fiat", 1, []],
    peugeot: ["Peugeot", 1, ["pegeot", "peugot"]],
    tesla: ["Tesla", 1, []],
    lamborghini: ["Lamborghini", 1, ["lambo"]],
    porsche: ["Porsche", 2, []],
    honda: ["Honda", 2, []],
    nissan: ["Nissan", 2, []],
    citroen: ["Citroën", 2, []],
    hyundai: ["Hyundai", 2, []],
    jeep: ["Jeep", 2, []],
    yamahamotorcorporation: ["Yamaha", 2, []],
    kia: ["Kia", 2, []],
    mitsubishi: ["Mitsubishi", 2, []],
    suzuki: ["Suzuki", 2, []],
    mazda: ["Mazda", 3, []],
    subaru: ["Subaru", 3, []],
    volvo: ["Volvo", 3, []],
    ducati: ["Ducati", 3, []],
    mclaren: ["McLaren", 3, ["mc laren"]],
    maserati: ["Maserati", 3, []],
    bugatti: ["Bugatti", 3, []],
    astonmartin: ["Aston Martin", 3, []],
    seat: ["SEAT", 3, []],
    skoda: ["Škoda", 3, []],
    rollsroyce: ["Rolls-Royce", 3, ["rolls royce", "rolls"]],
  },
};

const porId = new Map(Object.values(si).filter((x) => x && x.slug).map((x) => [x.slug, x]));
const logos = [];
for (const [categoria, marcas] of Object.entries(CATEGORIAS)) {
  for (const [id, [nombre, nivel, otras]] of Object.entries(marcas)) {
    const icono = porId.get(id);
    if (!icono) {
      throw new Error(`Simple Icons no tiene ${id}`);
    }
    const acepta = [...new Set([nombre, icono.title, ...otras].map(normalizar).filter(Boolean))];
    logos.push({ id, nombre, categoria, nivel, color: `#${icono.hex}`, path: icono.path, acepta });
  }
}
// Que dos marcas no acepten la misma forma (salvo las que se piden a propósito).
const vistas = new Map();
for (const l of logos) {
  for (const f of l.acepta) {
    if (vistas.has(f)) {
      throw new Error(`"${f}" lo aceptan ${vistas.get(f)} y ${l.id}`);
    }
    vistas.set(f, l.id);
  }
}

mkdirSync(join(AQUI, "..", "public", "datos"), { recursive: true });
writeFileSync(join(AQUI, "..", "public", "datos", "logos.json"), `${JSON.stringify(logos)}\n`);
console.log(`Listo: ${logos.length} logos (${[1, 2, 3].map((n) => logos.filter((l) => l.nivel === n).length).join(" · ")} por nivel, de fácil a difícil).`);
console.log(Object.keys(CATEGORIAS).map((c) => `${c}: ${logos.filter((l) => l.categoria === c).length}`).join(" · "));
