import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { es } from "@/content/i18n/es";
import { site } from "@/content/site";
import { plans } from "@/content/pricing";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name} · ${es.meta.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: es.meta.description,
  applicationName: site.name,
  keywords: [
    "páginas web para restaurantes",
    "web para restaurante",
    "menú digital",
    "pedidos por WhatsApp",
    "menú QR",
    "diseño web gastronomía",
    "restaurant website",
    "WhatsApp ordering",
  ],
  authors: [{ name: site.name }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description: es.meta.description,
    locale: "es_419",
    alternateLocale: ["es_ES", "es_MX", "en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: es.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#14110f" },
    { media: "(prefers-color-scheme: light)", color: "#faf5ee" },
  ],
  colorScheme: "dark light",
};

/** Aplica el tema guardado antes de pintar, para evitar parpadeos. Por defecto: oscuro. */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  description: es.meta.description,
  areaServed: ["ES", "MX", "AR", "CO", "CL", "PE", "US", "419"],
  serviceType: "Diseño de páginas web para restaurantes",
  makesOffer: plans.map((p) => ({
    "@type": "Offer",
    name: `Plan ${p.name.es}`,
    price: p.price,
    priceCurrency: "USD",
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`dark ${fraunces.variable} ${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
