import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import heroField from "@/assets/hero-field.png.asset.json";

export function PromoBanner() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 18 });
  const sy = useSpring(y, { stiffness: 80, damping: 18 });
  const tx = useTransform(sx, (v) => v * -20);
  const ty = useTransform(sy, (v) => v * -20);
  const txt = useTransform(sx, (v) => v * 12);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="noise-overlay relative overflow-hidden rounded-3xl border border-[color:var(--gold)]/20 bg-[color:var(--surface)]"
      >
        <motion.img
          src={heroField.url}
          alt=""
          style={{ x: tx, y: ty, scale: 1.15 }}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

        <motion.div
          style={{ x: txt }}
          className="relative grid gap-8 p-10 md:grid-cols-[1.2fr_1fr] md:p-16"
        >
          <div>
            <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
              03 — Drop limitado
            </div>
            <h3 className="font-display text-4xl font-black leading-[1.05] md:text-6xl">
              Brasil <span className="text-gold-gradient italic">2026</span>
              <br />
              modelo jogador.
            </h3>
            <p className="mt-6 max-w-md text-muted-foreground">
              De R$ 500,00 por <span className="font-bold text-foreground">R$ 175,00</span>. Estoque
              reduzido. Quando acabar, acabou.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://wa.me/5511960385479?text=Quero%20a%20camisa%20do%20Brasil%202026"
                className="btn-gold inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider"
              >
                Garantir a minha
              </a>
            </div>
          </div>
          <div className="hidden items-end justify-end md:flex">
            <div className="font-display text-[12rem] font-black leading-none text-[color:var(--gold)]/15">
              −65%
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
