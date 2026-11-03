/**
 * PORTAFOLIO
 * --------------------------------------------------------------
 * Para sumar un proyecto nuevo, copia uno de los bloques { ... },
 * pégalo al final de la lista y cambia sus datos.
 * Las imágenes van en /public/images/projects/.
 */
import type { L10n } from "./types";

export type Project = {
  id: string;
  name: string;
  category: L10n;
  summary: L10n;
  description: L10n;
  /** Lo que incluye la web (chips en el modal). */
  features: L10n[];
  /** La primera imagen es la portada de la tarjeta. */
  images: { src: string; alt: L10n }[];
  /** ⚠️ REEMPLAZAR por el link real del proyecto. Deja "" si aún no está online. */
  url: string;
  /** Color de acento de la tarjeta (opcional). */
  accent?: string;
};

export const projects: Project[] = [
  {
    id: "mima",
    name: "Mima Pizzería",
    category: { es: "Pizzería", en: "Pizzeria" },
    summary: {
      es: "Web con menú y pedidos por WhatsApp.",
      en: "Website with menu and WhatsApp ordering.",
    },
    description: {
      es: "Una web rápida y con mucho sabor para una pizzería de barrio. El cliente elige sus pizzas, arma el pedido en el carrito y lo envía por WhatsApp con todo detallado: productos, cantidades, total y forma de entrega. Sin apps de por medio y sin comisiones.",
      en: "A fast, flavorful site for a neighborhood pizzeria. Customers pick their pizzas, build the order in the cart and send it via WhatsApp with every detail: items, quantities, total and delivery method. No third-party apps, no commissions.",
    },
    features: [
      { es: "Menú por categorías", en: "Menu by category" },
      { es: "Carrito", en: "Cart" },
      { es: "Pedido por WhatsApp", en: "WhatsApp ordering" },
      { es: "Diseño para celular", en: "Mobile-first" },
    ],
    images: [
      { src: "/images/projects/mima.jpg", alt: { es: "Pizza recién horneada de Mima Pizzería", en: "Freshly baked pizza from Mima Pizzería" } },
      { src: "/images/projects/mima-2.jpg", alt: { es: "Pizza servida en tabla de madera", en: "Pizza served on a wooden board" } },
    ],
    url: "",
    accent: "#E8553D",
  },
  {
    id: "athenea",
    name: "ATHENEA Relojería",
    category: { es: "Catálogo / E-commerce", en: "Catalog / E-commerce" },
    summary: {
      es: "Catálogo con carrito y pedido por WhatsApp.",
      en: "Catalog with cart and WhatsApp checkout.",
    },
    description: {
      es: "Catálogo elegante para una relojería: filtros por categoría, fichas de producto con fotos y un carrito que envía el pedido completo por WhatsApp. El mismo sistema que uso para los menús de restaurantes, aplicado a productos.",
      en: "An elegant catalog for a watch shop: category filters, product pages with photos and a cart that sends the full order through WhatsApp. The same system I use for restaurant menus, applied to products.",
    },
    features: [
      { es: "Catálogo de productos", en: "Product catalog" },
      { es: "Carrito", en: "Cart" },
      { es: "Pedido por WhatsApp", en: "WhatsApp checkout" },
      { es: "Diseño premium", en: "Premium design" },
    ],
    images: [
      { src: "/images/projects/athenea.jpg", alt: { es: "Reloj clásico de ATHENEA Relojería", en: "Classic watch from ATHENEA Relojería" } },
      { src: "/images/projects/athenea-2.jpg", alt: { es: "Reloj inteligente blanco del catálogo", en: "White smartwatch from the catalog" } },
    ],
    url: "",
    accent: "#C9A46A",
  },
  {
    id: "balu",
    name: "BALU Salón de Eventos",
    category: { es: "Salón de fiestas", en: "Event venue" },
    summary: {
      es: "Web para salón de fiestas y eventos.",
      en: "Website for a party and event venue.",
    },
    description: {
      es: "Una web que muestra el salón en su mejor versión: galería de fotos, tipos de evento, capacidad y un botón directo para consultar fechas por WhatsApp. Pensada para que las familias y empresas pidan presupuesto en segundos.",
      en: "A website that shows the venue at its best: photo gallery, event types, capacity and a direct button to check dates via WhatsApp. Built so families and companies can request a quote in seconds.",
    },
    features: [
      { es: "Galería de fotos", en: "Photo gallery" },
      { es: "Tipos de evento", en: "Event types" },
      { es: "Consulta de fechas", en: "Date inquiries" },
      { es: "Diseño para celular", en: "Mobile-first" },
    ],
    images: [
      { src: "/images/projects/balu.jpg", alt: { es: "Salón BALU preparado para un evento", en: "BALU venue set up for an event" } },
      { src: "/images/projects/balu-2.jpg", alt: { es: "Mesas decoradas en el salón BALU", en: "Decorated tables at BALU venue" } },
    ],
    url: "",
    accent: "#7FA77A",
  },
];
