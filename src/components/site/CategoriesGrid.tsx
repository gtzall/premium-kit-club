import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { categories, useProducts } from "@/data/products";
import playersHero from "@/assets/players-hero.png.asset.json";

export function CategoriesGrid() {
  const { data: products = [] } = useProducts();
  return (
    <section className="relative overflow-hidden">
      {/* Continuation bleed from Hero — players silhouette fading in from the right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14]"
        style={{
          backgroundImage: `url(${playersHero.url})`,
          backgroundSize: "cover",
          backgroundPosition: "right center",
          maskImage:
            "radial-gradient(ellipse at 80% 40%, black 0%, transparent 65%), linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 80% 40%, black 0%, transparent 65%), linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-32">

      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="mb-3 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
            01 — Categorias
          </div>
          <h2 className="font-display text-4xl font-black leading-[1.05] md:text-6xl">
            Cada time tem <span className="text-gold-gradient italic">sua história.</span>
          </h2>
        </div>
        <Link
          to="/catalogo"
          className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          Ver tudo
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {categories.slice(0, 4).map((c, i) => {
          const cover = products.find((p) => p.category === c.slug)?.image;
          return (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                to="/catalogo"
                search={{ cat: c.slug } as never}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--surface)]"
              >
                {cover && (
                  <img
                    src={cover}
                    alt={c.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
                    0{i + 1}
                  </div>
                  <div className="mt-1 font-display text-2xl font-black md:text-3xl">{c.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.tagline}</div>
                  <div className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-[color:var(--gold)] opacity-0 transition-opacity group-hover:opacity-100">
                    Explorar <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      </div>
    </section>
  );
}
