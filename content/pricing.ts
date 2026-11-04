/**
 * PLANES, EXTRAS Y MANTENIMIENTO
 * --------------------------------------------------------------
 * Precios en USD. Cambia un número aquí y se actualiza en las
 * tarjetas de planes, la tabla comparativa y el configurador.
 */
import type { L10n } from "./types";

export type PlanId = "basico" | "pro" | "premium";

export type Plan = {
  id: PlanId;
  name: L10n;
  price: number;
  tagline: L10n;
  /** Marca el plan como destacado ("Más elegido"). */
  highlighted?: boolean;
  delivery: L10n;
  revisions: number;
  /** Lista corta de la tarjeta. */
  features: L10n[];
};

export const plans: Plan[] = [
  {
    id: "basico",
    name: { es: "Básico", en: "Basic" },
    price: 120,
    tagline: {
      es: "Tu local presente en internet, listo para recibir mensajes.",
      en: "Your place online, ready to get messages.",
    },
    delivery: { es: "Entrega en 5 días", en: "Delivered in 5 days" },
    revisions: 1,
    features: [
      { es: "Página única con menú", en: "One-page site with menu" },
      { es: "Horarios, ubicación y redes", en: "Hours, location and social links" },
      { es: "Botón de WhatsApp", en: "WhatsApp button" },
      { es: "Diseño pensado para celular", en: "Mobile-first design" },
    ],
  },
  {
    id: "pro",
    name: { es: "Pro", en: "Pro" },
    price: 250,
    highlighted: true,
    tagline: {
      es: "Recibe pedidos armados por WhatsApp, sin comisiones.",
      en: "Get ready-made orders on WhatsApp, commission-free.",
    },
    delivery: { es: "Entrega en 7 a 10 días", en: "Delivered in 7–10 days" },
    revisions: 2,
    features: [
      { es: "Todo lo del plan Básico", en: "Everything in Basic" },
      { es: "Menú digital con fotos y categorías", en: "Digital menu with photos and categories" },
      { es: "Carrito con pedido directo a WhatsApp", en: "Cart with direct WhatsApp ordering" },
      { es: "Código QR del menú para las mesas", en: "Menu QR code for your tables" },
      { es: "Dominio propio y SEO básico", en: "Custom domain and basic SEO" },
    ],
  },
  {
    id: "premium",
    name: { es: "Premium", en: "Premium" },
    price: 490,
    tagline: {
      es: "La web completa de tu marca, que tú mismo actualizas.",
      en: "Your brand's complete website, updated by you.",
    },
    delivery: { es: "Entrega en 14 días", en: "Delivered in 14 days" },
    revisions: 3,
    features: [
      { es: "Todo lo del plan Pro", en: "Everything in Pro" },
      { es: "Hasta 5 secciones (nosotros, galería, eventos…)", en: "Up to 5 sections (about, gallery, events…)" },
      { es: "Formulario de reservas", en: "Reservation form" },
      { es: "Panel para cambiar platos y precios", en: "Dashboard to edit dishes and prices" },
      { es: "Versión en inglés", en: "English version" },
    ],
  },
];

/**
 * Tabla comparativa (desplegable).
 * Cada fila: true = incluido, false = no incluido, o un texto propio por plan.
 */
export type CompareValue = boolean | L10n;

export const comparison: { label: L10n; values: Record<PlanId, CompareValue> }[] = [
  { label: { es: "Diseño adaptado a celular", en: "Mobile-first design" }, values: { basico: true, pro: true, premium: true } },
  { label: { es: "Menú con precios", en: "Menu with prices" }, values: { basico: true, pro: true, premium: true } },
  { label: { es: "Horarios, ubicación y mapa", en: "Hours, location and map" }, values: { basico: true, pro: true, premium: true } },
  { label: { es: "Links a redes sociales", en: "Social media links" }, values: { basico: true, pro: true, premium: true } },
  { label: { es: "Botón de WhatsApp", en: "WhatsApp button" }, values: { basico: true, pro: true, premium: true } },
  { label: { es: "Fotos y categorías en el menú", en: "Menu photos and categories" }, values: { basico: false, pro: true, premium: true } },
  { label: { es: "Carrito con pedido a WhatsApp", en: "Cart with WhatsApp ordering" }, values: { basico: false, pro: true, premium: true } },
  { label: { es: "Código QR para las mesas", en: "QR code for tables" }, values: { basico: false, pro: true, premium: true } },
  { label: { es: "Dominio propio (.com, .mx, .es…)", en: "Custom domain (.com, .mx, .es…)" }, values: { basico: false, pro: true, premium: true } },
  { label: { es: "SEO básico (Google)", en: "Basic SEO (Google)" }, values: { basico: false, pro: true, premium: true } },
  {
    label: { es: "Secciones extra", en: "Extra sections" },
    values: { basico: false, pro: false, premium: { es: "Hasta 5", en: "Up to 5" } },
  },
  { label: { es: "Formulario de reservas", en: "Reservation form" }, values: { basico: false, pro: false, premium: true } },
  { label: { es: "Panel para editar platos y precios", en: "Dashboard to edit dishes & prices" }, values: { basico: false, pro: false, premium: true } },
  { label: { es: "Versión en inglés", en: "English version" }, values: { basico: false, pro: false, premium: true } },
  {
    label: { es: "Tiempo de entrega", en: "Delivery time" },
    values: {
      basico: { es: "5 días", en: "5 days" },
      pro: { es: "7–10 días", en: "7–10 days" },
      premium: { es: "14 días", en: "14 days" },
    },
  },
  {
    label: { es: "Rondas de cambios", en: "Revision rounds" },
    values: {
      basico: { es: "1", en: "1" },
      pro: { es: "2", en: "2" },
      premium: { es: "3", en: "3" },
    },
  },
];

export type Extra = { id: string; name: L10n; description: L10n; price: number };

export const extras: Extra[] = [
  {
    id: "fotos-ia",
    name: { es: "Fotos de platos con IA", en: "AI dish photos" },
    description: { es: "Imágenes profesionales de tus platos, sin sesión de fotos.", en: "Pro-looking dish images, no photo shoot needed." },
    price: 40,
  },
  {
    id: "logo",
    name: { es: "Logo simple", en: "Simple logo" },
    description: { es: "Un logo limpio para tu web, redes y menú QR.", en: "A clean logo for your site, socials and QR menu." },
    price: 50,
  },
  {
    id: "promo",
    name: { es: "Página para evento o promo", en: "Event or promo page" },
    description: { es: "Una página especial para una fecha, evento o promoción.", en: "A dedicated page for a date, event or promotion." },
    price: 50,
  },
];

export type MaintenanceId = "ninguno" | "esencial" | "activo";

export const maintenance: { id: MaintenanceId; name: L10n; description: L10n; monthly: number }[] = [
  {
    id: "ninguno",
    name: { es: "Sin mantenimiento", en: "No maintenance" },
    description: { es: "Te entrego la web y tú te encargas del hosting.", en: "I hand over the site and you handle hosting." },
    monthly: 0,
  },
  {
    id: "esencial",
    name: { es: "Esencial", en: "Essential" },
    description: { es: "Hosting, web siempre online y pequeños arreglos.", en: "Hosting, site always online and small fixes." },
    monthly: 15,
  },
  {
    id: "activo",
    name: { es: "Activo", en: "Active" },
    description: { es: "Todo lo anterior más hasta 4 cambios por mes.", en: "All of the above plus up to 4 changes a month." },
    monthly: 30,
  },
];

/** Porcentaje que se paga al empezar (el resto al entregar). */
export const depositPercent = 50;
