import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { CartDrawer } from "@/components/site/CartDrawer";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Crown, Zap, Truck, Tag } from "lucide-react";

export const Route = createFileRoute("/_authenticated/conta")({
  head: () => ({ meta: [{ title: "Minha conta — GN Football" }] }),
  component: ContaPage,
});

function ContaPage() {
  const { user, profile, isVip, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const purchased = profile?.total_purchased_items ?? 0;
  const toVip = Math.max(0, 5 - purchased);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />

      <section className="mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">Minha conta</div>
            <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">
              Olá, {profile?.full_name || user?.email}
            </h1>
          </div>
          <button
            onClick={async () => { await signOut(); navigate({ to: "/" }); }}
            className="btn-outline-gold rounded-full px-5 py-2.5 text-xs uppercase tracking-widest"
          >
            Sair
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Peças compradas</div>
            <div className="mt-2 font-display text-5xl font-black text-[color:var(--gold)]">{purchased}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Status</div>
            <div className="mt-2 flex items-center gap-2 font-display text-3xl font-black">
              {isVip ? (<><Crown className="h-7 w-7 text-[color:var(--gold)]" /> VIP</>) : "Cliente"}
            </div>
            {!isVip && (
              <div className="mt-2 text-xs text-muted-foreground">Faltam {toVip} peças para virar VIP.</div>
            )}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">E-mail</div>
            <div className="mt-2 truncate text-sm">{user?.email}</div>
            {isAdmin && <div className="mt-3 inline-flex rounded-full bg-[color:var(--gold)]/15 px-3 py-1 text-[10px] uppercase tracking-widest text-[color:var(--gold)]">Administrador</div>}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-[color:var(--gold)]/30 bg-gradient-to-br from-[color:var(--gold)]/10 to-transparent p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[color:var(--gold)]">
            <Crown className="h-4 w-4" /> Vantagens VIP
          </div>
          <h2 className="mt-3 font-display text-3xl font-black md:text-4xl">
            Quem veste GN, joga em outro <span className="text-gold-gradient italic">nível.</span>
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              { icon: Zap, t: "Drops antecipados", d: "Acesso 48h antes a novos modelos e edições limitadas." },
              { icon: Truck, t: "Entrega prioritária", d: "Seu pedido vai na frente da fila de envio." },
              { icon: Tag, t: "Descontos exclusivos", d: "Cupons fixos e ofertas que só VIP recebe." },
            ].map((v) => (
              <div key={v.t} className="rounded-xl border border-white/10 bg-black/30 p-5">
                <v.icon className="h-5 w-5 text-[color:var(--gold)]" />
                <div className="mt-3 font-semibold">{v.t}</div>
                <div className="mt-1 text-xs text-muted-foreground">{v.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
