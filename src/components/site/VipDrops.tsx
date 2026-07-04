import { Crown, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { usePromotions } from "@/lib/promotions";
import { useAuth } from "@/hooks/use-auth";

export function VipDrops() {
  const { user, isVip } = useAuth();
  const { data: drops } = usePromotions({ vipOnly: true });

  return (
    <section className="relative py-24 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 70% 40%, oklch(0.20 0.08 85 / 0.25) 0%, transparent 65%)",
        }}
      />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold)]">
              <Crown className="h-3 w-3" /> Área VIP
            </div>
            <h2 className="font-display text-4xl font-black leading-[1.05] md:text-6xl">
              Drops <span className="text-gold-gradient italic">antecipados.</span>
            </h2>
            <p className="mt-4 max-w-lg text-sm text-muted-foreground">
              Vantagens exclusivas para membros VIP: drops liberados antes de todo mundo, entrega
              com prioridade e descontos que ninguém mais vê.
            </p>
          </div>
          {!isVip && (
            <Link
              to={user ? "/conta" : "/auth"}
              className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs uppercase tracking-widest"
            >
              Como virar VIP <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {isVip ? (
          <div className="grid gap-4 md:grid-cols-2">
            {(drops ?? []).map((d, i) => (
              <motion.a
                key={d.id}
                href={d.cta_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="group relative flex items-center justify-between gap-6 overflow-hidden rounded-3xl border border-[color:var(--gold)]/25 bg-white/[0.03] p-8 backdrop-blur-sm transition hover:border-[color:var(--gold)]/60"
              >
                {d.image_url && (
                  <img
                    src={d.image_url}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15"
                  />
                )}
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
                    {d.eyebrow ?? "Exclusivo VIP"}
                  </div>
                  <div className="mt-2 font-display text-2xl font-black md:text-3xl">
                    {d.title} {d.highlight && <span className="text-gold-gradient italic">{d.highlight}</span>}
                  </div>
                  {d.description && (
                    <p className="mt-3 max-w-md text-sm text-muted-foreground">{d.description}</p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--gold)]">
                    {d.cta_text} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
                <Sparkles className="hidden h-10 w-10 shrink-0 text-[color:var(--gold)]/50 md:block" />
              </motion.a>
            ))}
            {(drops ?? []).length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-muted-foreground md:col-span-2">
                Nenhum drop VIP ativo no momento. Fique de olho — novidades a caminho.
              </div>
            )}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-sm">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[color:var(--gold)]/10 blur-3xl" />
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 text-[color:var(--gold)]">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-2xl font-black md:text-3xl">Conteúdo bloqueado</div>
                  <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                    Drops VIP são visíveis apenas para membros. Compre 5 ou mais peças para
                    ganhar VIP automaticamente — ou fale conosco no WhatsApp.
                  </p>
                </div>
              </div>
              <Link
                to={user ? "/conta" : "/auth"}
                className="btn-gold inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider"
              >
                {user ? "Ver meu status" : "Entrar / cadastrar"}
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
