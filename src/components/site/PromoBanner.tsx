import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent } from "react";
import heroField from "@/assets/hero-field.png.asset.json";
import { usePromotions } from "@/lib/promotions";

export function PromoBanner() {
  const { data: promos } = usePromotions({ vipOnly: false });
  const promo = promos?.[0];

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 18 });
  const sy = useSpring(y, { stiffness: 80, damping: 18 });
  const tx = useTransform(sx, (v) => v * -30);
  const ty = useTransform(sy, (v) => v * -30);
  const txt = useTransform(sx, (v) => v * 14);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!promo) return null;

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative isolate overflow-hidden py-28 md:py-40"
    >
      <motion.img
        src={promo.image_url || heroField.url}
        alt=""
        aria-hidden
        style={{ x: tx, y: ty, scale: 1.15 }}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, oklch(0.08 0.005 260 / 0.55) 0%, oklch(0.08 0.005 260 / 0.95) 70%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)",
        }}
      />

      <motion.div
        style={{ x: txt }}
        className="relative mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[1.2fr_1fr] md:px-8"
      >
        <div>
          {promo.eyebrow && (
            <div className="mb-4 text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
              {promo.eyebrow}
            </div>
          )}
          <h3 className="font-display text-4xl font-black leading-[1.05] md:text-6xl">
            {promo.title}{" "}
            {promo.highlight && <span className="text-gold-gradient italic">{promo.highlight}</span>}
          </h3>
          {promo.description && (
            <p className="mt-6 max-w-md text-muted-foreground whitespace-pre-line">
              {promo.description}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={promo.cta_url}
              target="_blank"
              rel="noreferrer"
              className="btn-gold inline-flex items-center rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wider"
            >
              {promo.cta_text}
            </a>
          </div>
        </div>
        {promo.discount_label && (
          <div className="hidden items-end justify-end md:flex">
            <div className="font-display text-[12rem] font-black leading-none text-[color:var(--gold)]/15">
              {promo.discount_label}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
