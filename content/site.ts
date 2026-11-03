/**
 * DATOS GENERALES DEL SITIO
 * --------------------------------------------------------------
 * Edita aquí tu marca, tus datos de contacto y los contadores.
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
   * ⚠️ REEMPLAZAR: tu número de WhatsApp con código de país, solo dígitos.
   * Ejemplo Argentina: 5491112345678 · México: 5215512345678 · España: 34612345678
   */
  whatsapp: "5490000000000",

  /** ⚠️ REEMPLAZAR: tu email de contacto. */
  email: "hola@juancruzwebstudio.com",

  /** Redes (deja "" para ocultar). */
  instagram: "https://instagram.com/",

  /**
   * Contadores animados que aparecen debajo del hero.
   * ⚠️ Actualízalos con tus números reales.
   */
  stats: [
    { value: 12, suffix: "+", label: { es: "Webs entregadas", en: "Websites delivered" } },
    { value: 4, suffix: "", label: { es: "Países", en: "Countries" } },
    { value: 7, suffix: "", label: { es: "Días promedio de entrega", en: "Average days to deliver" } },
    { value: 0, suffix: "%", label: { es: "Comisión por pedido", en: "Commission per order" } },
  ] satisfies { value: number; suffix: string; label: L10n }[],
};

/** Arma un link de WhatsApp con el mensaje ya escrito. */
export function whatsappLink(message: string, phone: string = site.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
