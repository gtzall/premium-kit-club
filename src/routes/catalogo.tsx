import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { z } from "zod";
import { Navbar } from "@/components/site/Navbar";
import { CartDrawer } from "@/components/site/CartDrawer";

import { Footer } from "@/components/site/Footer";
import { JerseyCard } from "@/components/site/JerseyCard";
import { categories, products, type Category } from "@/data/products";
import { cn } from "@/lib/utils";

const search = z.object({
  cat: z.enum(["europeus", "brasileiros", "selecoes", "retro", "conjuntos"]).optional(),
});

export const Route = createFileRoute("/catalogo")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "Catálogo — GN Football" },
      { name: "description", content: "Explore todas as camisas: europeus, brasileiros, seleções, retrô e conjuntos." },
    ],
  }),
  component: Catalogo,
});

const priceBuckets = [
  { label: "Tudo", min: 0, max: Infinity },
  { label: "Até R$160", min: 0, max: 160 },
  { label: "R$160 – R$220", min: 160, max: 220 },
  { label: "Acima de R$220", min: 220, max: Infinity },
];

function Catalogo() {
  const { cat } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [active, setActive] = useState<Category | "all">(cat ?? "all");
  const [bucket, setBucket] = useState(0);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const b = priceBuckets[bucket];
    return products.filter((p) => {
      if (active !== "all" && p.category !== active) return false;
      if (p.price < b.min || p.price > b.max) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [active, bucket, query]);

  const setCat = (c: Category | "all") => {
    setActive(c);
    navigate({ search: c === "all" ? {} : { cat: c } });
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />


      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/5 pb-12 pt-36 md:pt-44">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.20_0.02_260)_0%,transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">Coleção</div>
            <h1 className="mt-3 font-display text-5xl font-black leading-[0.95] md:text-7xl">
              Catálogo <span className="text-gold-gradient italic">completo.</span>
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "modelo encontrado" : "modelos disponíveis"} —
              entrega expressa para todo o Brasil.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[68px] z-30 border-b border-white/5 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="flex flex-wrap gap-2">
            <CatChip active={active === "all"} onClick={() => setCat("all")}>Todas</CatChip>
            {categories.map((c) => (
              <CatChip key={c.slug} active={active === c.slug} onClick={() => setCat(c.slug)}>
                {c.label}
              </CatChip>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar time..."
              className="w-full min-w-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-[color:var(--gold)]/60 md:w-56"
            />
            <select
              value={bucket}
              onChange={(e) => setBucket(Number(e.target.value))}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]/60"
            >
              {priceBuckets.map((b, i) => (
                <option key={b.label} value={i} className="bg-[color:var(--surface)]">
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        {filtered.length === 0 ? (
          <div className="py-32 text-center text-muted-foreground">
            Nenhum modelo encontrado. Ajuste os filtros e tente de novo.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <JerseyCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}

function CatChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-xs uppercase tracking-wider transition",
        active
          ? "border-[color:var(--gold)] bg-[color:var(--gold)]/15 text-[color:var(--gold)]"
          : "border-white/10 bg-white/5 text-muted-foreground hover:border-[color:var(--gold)]/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
