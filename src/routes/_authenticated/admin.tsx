import { createFileRoute, redirect } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: u.user.id,
      _role: "admin",
    });
    if (!isAdmin) throw redirect({ to: "/conta" });
  },
  head: () => ({ meta: [{ title: "Admin — GN Football" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">Painel</div>
        <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Administração</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Catálogo atual ({products.length} produtos). A próxima fase migra o catálogo para o banco
          com CRUD completo a partir deste painel.
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Destaque</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-[color:var(--gold)]">{brl(p.price)}</td>
                  <td className="px-4 py-3">{p.featured ? "Sim" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </main>
  );
}
