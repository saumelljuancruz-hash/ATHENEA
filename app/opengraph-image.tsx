import { ImageResponse } from "next/og";
import { es } from "@/content/i18n/es";
import { site } from "@/content/site";
import { plans } from "@/content/pricing";

export const alt = `${site.name} · ${es.meta.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagen que aparece al compartir el link en WhatsApp, Instagram, LinkedIn, etc. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "radial-gradient(circle at 85% 10%, rgba(232,85,61,0.45), transparent 50%), #14110F",
          color: "#F5EDE3",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34 }}>
          <div style={{ width: 64, height: 64, borderRadius: 64, background: "#E8553D", color: "#14110F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontStyle: "italic", fontWeight: 700 }}>
            {site.name.charAt(0)}
          </div>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05, fontWeight: 700, maxWidth: 980 }}>
          <span>Tu restaurante recibiendo pedidos por</span>
          <span style={{ color: "#E8553D", fontStyle: "italic" }}>WhatsApp, sin comisiones.</span>
        </div>
        <div style={{ display: "flex", gap: 16, fontSize: 28, color: "#B8AA9A", fontFamily: "sans-serif" }}>
          <span>Menú digital</span>·<span>Carrito</span>·<span>Pedidos directos</span>·<span style={{ color: "#F2A541" }}>desde USD {Math.min(...plans.map((p) => p.price))}</span>
        </div>
      </div>
    ),
    size,
  );
}
