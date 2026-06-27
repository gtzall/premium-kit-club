import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { brl } from "@/lib/format";
import { toast } from "sonner";
import { Crown, Shield, ShieldOff, Users, Package, Star } from "lucide-react";

type AppRole = "admin" | "vip" | "user";

type Row = {
  id: string;
  full_name: string | null;
  email: string | null;
  total_purchased_items: number;
  created_at: string;
  roles: AppRole[];
};

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
  const [tab, setTab] = useState<"users" | "products">("users");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: profs, error: e1 }, { data: roles, error: e2 }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, email, total_purchased_items, created_at")
        .order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (e1 || e2) {
      toast.error(e1?.message ?? e2?.message ?? "Erro ao carregar");
      setLoading(false);
      return;
    }
    const byUser = new Map<string, AppRole[]>();
    (roles ?? []).forEach((r: { user_id: string; role: AppRole }) => {
      const arr = byUser.get(r.user_id) ?? [];
      arr.push(r.role);
      byUser.set(r.user_id, arr);
    });
    setRows(
      (profs ?? []).map((p) => ({
        ...(p as Omit<Row, "roles">),
        roles: byUser.get(p.id) ?? [],
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRole(userId: string, role: AppRole, has: boolean) {
    if (has) {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);
      if (error) return toast.error(error.message);
      toast.success(`Papel ${role} removido`);
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
      toast.success(`Papel ${role} concedido`);
    }
    load();
  }

  const filtered = rows.filter((r) => {
    const q = query.toLowerCase();
    return (
      !q ||
      r.email?.toLowerCase().includes(q) ||
      r.full_name?.toLowerCase().includes(q)
    );
  });

  const stats = {
    total: rows.length,
    vips: rows.filter((r) => r.roles.includes("vip") || r.total_purchased_items >= 5).length,
    admins: rows.filter((r) => r.roles.includes("admin")).length,
    products: products.length,
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">
          Painel
        </div>
        <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Administração</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Gerencie clientes, conceda VIP/Admin e acompanhe o catálogo.
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={<Users className="h-4 w-4" />} label="Clientes" value={stats.total} />
          <Stat icon={<Crown className="h-4 w-4" />} label="VIPs" value={stats.vips} />
          <Stat icon={<Shield className="h-4 w-4" />} label="Admins" value={stats.admins} />
          <Stat icon={<Package className="h-4 w-4" />} label="Produtos" value={stats.products} />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-2 border-b border-white/10">
          {(["users", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-xs uppercase tracking-widest transition ${
                tab === t
                  ? "text-[color:var(--gold)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "users" ? "Clientes" : "Catálogo"}
              {tab === t && (
                <span className="absolute inset-x-0 -bottom-px h-px bg-[color:var(--gold)]" />
              )}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <div className="mt-6">
            <input
              placeholder="Buscar por nome ou e-mail..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full max-w-sm rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-[color:var(--gold)]/60"
            />

            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Peças</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                        Carregando...
                      </td>
                    </tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                        Nenhum cliente encontrado.
                      </td>
                    </tr>
                  )}
                  {filtered.map((r) => {
                    const isAdmin = r.roles.includes("admin");
                    const isVip = r.roles.includes("vip") || r.total_purchased_items >= 5;
                    return (
                      <tr key={r.id} className="border-t border-white/5">
                        <td className="px-4 py-3">
                          <div className="font-medium">{r.full_name || "—"}</div>
                          <div className="text-xs text-muted-foreground">{r.email}</div>
                        </td>
                        <td className="px-4 py-3 text-[color:var(--gold)]">
                          {r.total_purchased_items}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {isAdmin && <Badge tone="gold">Admin</Badge>}
                            {isVip && <Badge tone="purple">VIP</Badge>}
                            {!isAdmin && !isVip && <Badge tone="muted">Cliente</Badge>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => toggleRole(r.id, "vip", r.roles.includes("vip"))}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-wider transition hover:border-[color:var(--gold)]/40 hover:bg-white/5"
                            >
                              <Star className="h-3 w-3" />
                              {r.roles.includes("vip") ? "Remover VIP" : "Tornar VIP"}
                            </button>
                            <button
                              onClick={() => toggleRole(r.id, "admin", isAdmin)}
                              className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-wider transition hover:border-[color:var(--gold)]/40 hover:bg-white/5"
                            >
                              {isAdmin ? (
                                <ShieldOff className="h-3 w-3" />
                              ) : (
                                <Shield className="h-3 w-3" />
                              )}
                              {isAdmin ? "Remover admin" : "Tornar admin"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "products" && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[640px] text-sm">
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
        )}
      </section>
      <Footer />
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 font-display text-3xl font-black text-[color:var(--gold)]">
        {value}
      </div>
    </div>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "gold" | "purple" | "muted";
}) {
  const classes =
    tone === "gold"
      ? "border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 text-[color:var(--gold)]"
      : tone === "purple"
        ? "border-purple-400/30 bg-purple-400/10 text-purple-300"
        : "border-white/10 bg-white/5 text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${classes}`}
    >
      {children}
    </span>
  );
}
