import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import playersHero from "@/assets/players-hero.png.asset.json";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/jogadores")({
  head: () => ({
    meta: [
      { title: "Jogadores — GN Football" },
      { name: "description", content: "Os atletas que vestem GN Football. Suor, glória e os mantos que escrevem história." },
      { property: "og:title", content: "Jogadores — GN Football" },
      { property: "og:image", content: playersHero.url },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />

      <section className="relative isolate min-h-[90svh] overflow-hidden">
        <img src={playersHero.url} alt="Jogadores em duelo no estádio" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/40 via-black/30 to-background" />

        <div className="mx-auto flex min-h-[90svh] max-w-5xl flex-col items-center justify-end px-5 pb-24 text-center md:px-8 md:pb-32">
          <div className="mb-4 text-[10px] uppercase tracking-[0.35em] text-[color:var(--gold-soft)]">
            Para quem joga de verdade
          </div>
          <h1 className="font-display text-[clamp(2.5rem,8vw,6.5rem)] font-black uppercase leading-[0.95]">
            Os <span className="text-gold-gradient italic">atletas</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
            Camisas pensadas para quem suor, glória e gramado fazem parte da rotina.
            Tecido Dry-Fit oficial, modelagem de campo e o caimento dos mantos que
            entram em campo todo fim de semana.
          </p>
          <Link
            to="/catalogo"
            className="btn-gold mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wider"
          >
            Ver mantos <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
