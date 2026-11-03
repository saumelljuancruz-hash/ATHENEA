/**
 * RESTAURANTES DE LA DEMO INTERACTIVA
 * --------------------------------------------------------------
 * Cada estilo tiene su nombre, colores y menú. Puedes cambiar
 * platos, precios o fotos (en /public/images/demo/).
 */
import type { L10n } from "./types";

export type DemoItem = {
  id: string;
  name: L10n;
  description: L10n;
  price: number;
  image: string;
  /** Etiqueta opcional, ej. "Popular". */
  badge?: L10n;
};

export type DemoCategory = { id: string; name: L10n; items: DemoItem[] };

export type DemoRestaurant = {
  id: "pizzeria" | "hamburgueseria" | "cafe";
  /** Nombre del estilo en el selector. */
  label: L10n;
  emoji: string;
  name: string;
  tagline: L10n;
  /** Colores de la mini web. */
  theme: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    primary: string;
    primaryText: string;
    /** "serif" | "sans" | "rounded": cambia la tipografía del título. */
    font: "serif" | "sans" | "rounded";
  };
  currency: string;
  categories: DemoCategory[];
};

const img = (name: string) => `/images/demo/${name}.jpg`;
const popular = { es: "Popular", en: "Popular" };

export const demoRestaurants: DemoRestaurant[] = [
  {
    id: "pizzeria",
    label: { es: "Pizzería", en: "Pizzeria" },
    emoji: "🍕",
    name: "Forno Rosso",
    tagline: { es: "Pizza a la piedra · Desde 1998", en: "Stone-baked pizza · Since 1998" },
    theme: {
      bg: "#FFF8F0",
      surface: "#FFFFFF",
      text: "#2B1B14",
      muted: "#7A6658",
      primary: "#C8361F",
      primaryText: "#FFFFFF",
      font: "serif",
    },
    currency: "$",
    categories: [
      {
        id: "pizzas",
        name: { es: "Pizzas", en: "Pizzas" },
        items: [
          { id: "margarita", name: { es: "Margarita", en: "Margherita" }, description: { es: "Tomate, mozzarella fresca y albahaca.", en: "Tomato, fresh mozzarella and basil." }, price: 11, image: img("pizza-margarita"), badge: popular },
          { id: "pepperoni", name: { es: "Pepperoni", en: "Pepperoni" }, description: { es: "Mozzarella y pepperoni crocante.", en: "Mozzarella and crispy pepperoni." }, price: 13, image: img("pizza-pepperoni") },
          { id: "napolitana", name: { es: "Napolitana", en: "Neapolitan" }, description: { es: "Tomate en rodajas, ajo y orégano.", en: "Sliced tomato, garlic and oregano." }, price: 12, image: img("pizza-napolitana") },
          { id: "cuatro-quesos", name: { es: "Cuatro quesos", en: "Four cheese" }, description: { es: "Mozzarella, azul, parmesano y provolone.", en: "Mozzarella, blue, parmesan and provolone." }, price: 14, image: img("pizza-cuatro-quesos") },
        ],
      },
      {
        id: "entradas",
        name: { es: "Entradas", en: "Starters" },
        items: [
          { id: "pan-ajo", name: { es: "Pan de ajo", en: "Garlic bread" }, description: { es: "Con perejil y salsas de la casa.", en: "With parsley and house dips." }, price: 5, image: img("pan-ajo") },
          { id: "pasta", name: { es: "Pasta al pomodoro", en: "Pasta al pomodoro" }, description: { es: "Fusilli con salsa de tomate casera.", en: "Fusilli with homemade tomato sauce." }, price: 9, image: img("pasta") },
        ],
      },
      {
        id: "bebidas",
        name: { es: "Bebidas y postres", en: "Drinks & desserts" },
        items: [
          { id: "cerveza", name: { es: "Cerveza artesanal", en: "Craft beer" }, description: { es: "Rubia, pinta de 500 ml.", en: "Blonde ale, 500 ml pint." }, price: 4, image: img("cerveza") },
          { id: "vino", name: { es: "Copa de vino tinto", en: "Glass of red wine" }, description: { es: "Malbec de la casa.", en: "House Malbec." }, price: 5, image: img("vino") },
          { id: "tiramisu", name: { es: "Tiramisú", en: "Tiramisu" }, description: { es: "Receta de la nonna.", en: "Grandma's recipe." }, price: 6, image: img("tiramisu") },
        ],
      },
    ],
  },
  {
    id: "hamburgueseria",
    label: { es: "Hamburguesería", en: "Burger joint" },
    emoji: "🍔",
    name: "Smash Club",
    tagline: { es: "Smash burgers · Abierto hasta tarde", en: "Smash burgers · Open late" },
    theme: {
      bg: "#111111",
      surface: "#1E1E1E",
      text: "#F7F7F2",
      muted: "#A3A39A",
      primary: "#FFC93C",
      primaryText: "#111111",
      font: "sans",
    },
    currency: "$",
    categories: [
      {
        id: "burgers",
        name: { es: "Burgers", en: "Burgers" },
        items: [
          { id: "clasica", name: { es: "La Clásica", en: "The Classic" }, description: { es: "Doble carne, cheddar, lechuga y salsa secreta.", en: "Double patty, cheddar, lettuce and secret sauce." }, price: 10, image: img("burger-clasica"), badge: popular },
          { id: "bbq", name: { es: "BBQ Bacon", en: "BBQ Bacon" }, description: { es: "Triple carne, bacon y salsa barbacoa.", en: "Triple patty, bacon and BBQ sauce." }, price: 13, image: img("burger-bbq") },
          { id: "veggie", name: { es: "Veggie", en: "Veggie" }, description: { es: "Medallón de garbanzos, aguacate y vegetales.", en: "Chickpea patty, avocado and veggies." }, price: 10, image: img("burger-veggie") },
          { id: "mini", name: { es: "Mini burgers x2", en: "Mini burgers x2" }, description: { es: "Dos sliders para compartir.", en: "Two sliders to share." }, price: 9, image: img("mini-burgers") },
        ],
      },
      {
        id: "acompanantes",
        name: { es: "Acompañantes", en: "Sides" },
        items: [
          { id: "papas", name: { es: "Papas fritas", en: "Fries" }, description: { es: "Con sal marina y especias.", en: "With sea salt and spices." }, price: 4, image: img("papas") },
          { id: "aros", name: { es: "Aros de cebolla", en: "Onion rings" }, description: { es: "Crocantes, con dip de la casa.", en: "Crispy, with house dip." }, price: 5, image: img("aros-cebolla") },
        ],
      },
      {
        id: "bebidas",
        name: { es: "Bebidas", en: "Drinks" },
        items: [
          { id: "malteada", name: { es: "Malteada de cookies", en: "Cookies milkshake" }, description: { es: "Helado de vainilla y galletas.", en: "Vanilla ice cream and cookies." }, price: 6, image: img("malteada") },
          { id: "limonada", name: { es: "Limonada con menta", en: "Mint lemonade" }, description: { es: "Natural y bien fría.", en: "Fresh and ice-cold." }, price: 4, image: img("limonada") },
        ],
      },
    ],
  },
  {
    id: "cafe",
    label: { es: "Café", en: "Café" },
    emoji: "☕",
    name: "Café Alba",
    tagline: { es: "Especialidad y brunch · Todos los días", en: "Specialty coffee & brunch · Every day" },
    theme: {
      bg: "#F1EBE3",
      surface: "#FBF8F4",
      text: "#2E2620",
      muted: "#776A5E",
      primary: "#4E6B4F",
      primaryText: "#FFFFFF",
      font: "rounded",
    },
    currency: "$",
    categories: [
      {
        id: "cafes",
        name: { es: "Cafés", en: "Coffee" },
        items: [
          { id: "espresso", name: { es: "Espresso", en: "Espresso" }, description: { es: "Grano de especialidad, tueste medio.", en: "Specialty beans, medium roast." }, price: 2.5, image: img("espresso") },
          { id: "capuchino", name: { es: "Capuchino", en: "Cappuccino" }, description: { es: "Con arte latte y canela opcional.", en: "With latte art, cinnamon optional." }, price: 3.5, image: img("capuchino"), badge: popular },
          { id: "helado", name: { es: "Café helado", en: "Iced coffee" }, description: { es: "Cold brew con leche y hielo.", en: "Cold brew with milk and ice." }, price: 4, image: img("cafe-helado") },
        ],
      },
      {
        id: "brunch",
        name: { es: "Brunch", en: "Brunch" },
        items: [
          { id: "tostada", name: { es: "Tostada de aguacate", en: "Avocado toast" }, description: { es: "Pan de masa madre y huevo poché.", en: "Sourdough and poached egg." }, price: 8, image: img("tostada-aguacate") },
          { id: "pancakes", name: { es: "Pancakes", en: "Pancakes" }, description: { es: "Con miel de maple y frutos rojos.", en: "With maple syrup and berries." }, price: 7, image: img("pancakes") },
        ],
      },
      {
        id: "pasteleria",
        name: { es: "Pastelería", en: "Pastries" },
        items: [
          { id: "croissant", name: { es: "Croissant de mantequilla", en: "Butter croissant" }, description: { es: "Horneado cada mañana.", en: "Baked every morning." }, price: 3, image: img("croissant") },
          { id: "cheesecake", name: { es: "Cheesecake", en: "Cheesecake" }, description: { es: "Con coulis de arándanos.", en: "With blueberry coulis." }, price: 5, image: img("cheesecake") },
          { id: "brownie", name: { es: "Brownie", en: "Brownie" }, description: { es: "Chocolate intenso, húmedo.", en: "Rich, fudgy chocolate." }, price: 3.5, image: img("brownie") },
        ],
      },
    ],
  },
];
