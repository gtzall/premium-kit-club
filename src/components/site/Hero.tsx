import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import playersHero from "@/assets/players-hero.png.asset.json";
import heroField from "@/assets/hero-field.png.asset.json";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      {/* Single fixed background — players */}
      <div className="absolute inset-0 -z-10">
        <img
          src={playersHero.url}
          alt="Jogadores em ação no estádio"
          className="h-full w-full object-cover"
        />
        {/* Atmospheric vignette to fuse with the rest of the page */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_0%,oklch(0.08_0.005_260/0.75)_70%)]" />
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/70 to-transparent" />
      </div>

      {/* Centered content */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.92] tracking-tight">
            <span className="block">Vista a</span>
            <span className="block text-gold-gradient">lenda.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-base text-white/80 md:text-lg">
            Camisas premium dos maiores clubes e seleções do mundo. Tecido oficial,
            acabamento de campeão, direto na sua porta.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/catalogo"
              className="btn-gold group inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wider"
            >
              Explorar catálogo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/5511960385479"
              target="_blank"
              rel="noreferrer"
              className="btn-outline-gold inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-wider"
            >
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>

      {/* Field image fused at the bottom — smoke transition into the rest of the site */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[55%]">
        <img
          src={heroField.url}
          alt=""
          aria-hidden
          className="h-full w-full object-cover object-top opacity-90"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 35%, black 80%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 35%, black 80%, transparent 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-b from-transparent to-[color:var(--background)]" />
      </div>
    </section>
  );
}
