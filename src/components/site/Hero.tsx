import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import heroStadium from "@/assets/hero-stadium.png.asset.json";
import heroField from "@/assets/hero-field.png.asset.json";

const slides = [
  {
    eyebrow: "Coleção 2025 / 26",
    title: ["Vista a", "lenda."],
    subtitle:
      "Camisas premium dos maiores clubes do mundo. Tecido oficial, acabamento de campeão.",
    image: heroStadium.url,
    cta: { primary: "Explorar catálogo", secondary: "Times brasileiros" },
  },
  {
    eyebrow: "Edição limitada",
    title: ["Times do", "mundo."],
    subtitle: "Europa, América, Ásia — todas as ligas, todas as cores, em estoque.",
    image: heroField.url,
    cta: { primary: "Ver Europeus", secondary: "Ver Seleções" },
  },
  {
    eyebrow: "Entrega expressa",
    title: ["Em campo", "em 48h."],
    subtitle: "Frete grátis acima de R$ 200. Pague no PIX e ganhe 5% extra.",
    image: heroStadium.url,
    cta: { primary: "Comprar agora", secondary: "Falar no WhatsApp" },
  },
];

export function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 6500);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      {/* Background image with crossfade */}
      <div className="absolute inset-0 -z-10">
        {slides.map((slide, idx) => (
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: idx === i ? 1 : 0, scale: idx === i ? 1.05 : 1 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 8, ease: "linear" } }}
          >
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </motion.div>
        ))}
        {/* Vignette + gradient stack */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,transparent_0%,oklch(0.06_0.005_260/0.85)_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[var(--gradient-fade-bottom)]" />
        {/* Spotlight beam */}
        <div className="spotlight absolute -top-32 left-1/2 h-[120%] w-[40vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,oklch(0.95_0.05_90/0.18)_0%,transparent_60%)]" />
      </div>

      {/* Mesh / grid 2D layer */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-white" />
      </svg>

      {/* Top ticker */}
      <div className="absolute inset-x-0 top-0 z-10 mt-20 overflow-hidden border-y border-white/10 bg-black/30 py-2 backdrop-blur md:mt-24">
        <div className="marquee flex w-max gap-12 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Frete grátis acima de R$200", "★", "Camisas oficiais 2025/26", "★", "Pix com 5% off", "★", "Entrega em 48h", "★", "Suporte 24h via WhatsApp", "★"].map(
              (t, j) => (
                <span key={`${k}-${j}`}>{t}</span>
              ),
            ),
          )}
        </div>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-20 pt-40 md:px-8 md:pb-28 md:pt-44">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/30 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)] backdrop-blur">
            <Sparkles className="h-3 w-3" />
            {s.eyebrow}
          </div>

          <h1 className="font-display text-[clamp(3rem,10vw,8rem)] font-black leading-[0.92] tracking-tight">
            <span className="block">{s.title[0]}</span>
            <span className="block text-gold-gradient">{s.title[1]}</span>
          </h1>

          <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
            {s.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/catalogo"
              className="btn-gold group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-wider"
            >
              {s.cta.primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://wa.me/5511960385479"
              target="_blank"
              rel="noreferrer"
              className="btn-outline-gold inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-semibold uppercase tracking-wider"
            >
              {s.cta.secondary}
            </a>
          </div>
        </motion.div>

        {/* Slide indicators + meta */}
        <div className="mt-16 flex items-end justify-between gap-8">
          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className="group relative h-1 w-12 overflow-hidden rounded-full bg-white/15"
              >
                <span
                  className={`absolute inset-y-0 left-0 bg-[var(--gradient-gold)] transition-all ${
                    idx === i ? "w-full" : "w-0 group-hover:w-1/3"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="hidden text-right md:block">
            <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Drop atual</div>
            <div className="font-display text-xl">
              {String(i + 1).padStart(2, "0")} <span className="text-muted-foreground">/ {String(slides.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
