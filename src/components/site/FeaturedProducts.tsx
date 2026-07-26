import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { JerseyCard } from "./JerseyCard";
import { useFeaturedProducts } from "@/data/products";
import { ArrowRight } from "lucide-react";
import heroField from "@/assets/hero-field.png.asset.json";

export function FeaturedProducts() {
  const { data: featuredProducts } = useFeaturedProducts();
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Atmospheric field bleed on the left, fades everywhere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage: `url(${heroField.url})`,
          backgroundSize: "cover",
          backgroundPosition: "left bottom",
          maskImage:
            "radial-gradient(ellipse at 15% 70%, black 0%, transparent 70%), linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 15% 70%, black 0%, transparent 70%), linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
              02 — Destaques da temporada
            </div>
            <h2 className="font-display text-4xl font-black leading-[1.05] md:text-6xl">
              Os mantos mais <span className="text-gold-gradient italic">desejados.</span>
            </h2>
          </div>
          <Link
            to="/catalogo"
            className="group btn-outline-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs uppercase tracking-widest"
          >
            Ver coleção completa
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6"
        >
          {featuredProducts.slice(0, 8).map((p, i) => (
            <JerseyCard key={p.id} product={p} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
