import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { Hero } from "@/components/sections/Hero";
import { Demo } from "@/components/sections/Demo";
import { Compare } from "@/components/sections/Compare";
import { Portfolio } from "@/components/sections/Portfolio";
import { Pricing } from "@/components/sections/Pricing";
import { Configurator } from "@/components/sections/Configurator";
import { Process } from "@/components/sections/Process";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

// Cada <Suspense> permite que React active (hidrate) las secciones por partes,
// sin bloquear el celular en una sola tarea larga.
export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido">
        <Hero />
        <Suspense>
          <Demo />
        </Suspense>
        <Suspense>
          <Compare />
        </Suspense>
        <Suspense>
          <Portfolio />
        </Suspense>
        <Suspense>
          <Pricing />
        </Suspense>
        <Suspense>
          <Configurator />
        </Suspense>
        <Suspense>
          <Process />
        </Suspense>
        <Suspense>
          <Faq />
        </Suspense>
        <Suspense>
          <Contact />
        </Suspense>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
      <WhatsAppFab />
    </>
  );
}
