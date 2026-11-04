/**
 * DATOS GENERALES DEL SITIO
 * --------------------------------------------------------------
 * Edita aquí tu marca, tus datos de contacto y los beneficios del hero.
 * Todo lo que cambies se refleja automáticamente en la web.
 */
import type { L10n } from "./types";

export const site = {
  /** Nombre de la marca (aparece en la navbar, el footer y el título de Google). */
  name: "Juan Cruz Web Studio",
  /** Versión corta para espacios chicos (logo). */
  shortName: "JC Studio",

  /**
   * URL final del sitio (sin barra al final). Se usa para SEO, sitemap y Open Graph.
   * También puedes definirla en Vercel con la variable NEXT_PUBLIC_SITE_URL.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://juancruzwebstudio.com",

  /**
   * Número de WhatsApp con código de país, solo dígitos (formato de wa.me).
   * Lo usan TODOS los botones y mensajes de WhatsApp del sitio.
   */
  whatsapp: "5492291525151",
  /** El mismo número, como se muestra escrito en la web. */
  whatsappDisplay: "+54 9 2291 525151",

  /** Email de contacto (sección de contacto y footer). */
  email: "juancruzwebstudio@gmail.com",

  /** Redes (deja "" para ocultar). */
  instagram: "https://instagram.com/",

  /**
   * Beneficios que aparecen debajo del hero, con su ícono.
   * Íconos disponibles: "clock" (reloj), "percent" (0%), "globe" (mundo).
   */
  benefits: [
    {
      icon: "clock",
      title: { es: "Entrega en días", en: "Delivered in days" },
      text: { es: "Tu web lista en 5 a 14 días, según el plan.", en: "Your site ready in 5 to 14 days, depending on the plan." },
    },
    {
      icon: "percent",
      title: { es: "0% comisiones", en: "0% commissions" },
      text: { es: "Los pedidos llegan directo a tu WhatsApp.", en: "Orders go straight to your WhatsApp." },
    },
    {
      icon: "globe",
      title: { es: "100% online, desde cualquier país", en: "100% online, from any country" },
      text: { es: "Todo por WhatsApp o videollamada.", en: "Everything over WhatsApp or video call." },
    },
  ] satisfies { icon: "clock" | "percent" | "globe"; title: L10n; text: L10n }[],
};

/** Arma un link de WhatsApp con el mensaje ya escrito. */
export function whatsappLink(message: string, phone: string = site.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
