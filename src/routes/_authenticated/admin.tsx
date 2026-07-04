import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, categories, type Product } from "@/data/products";
import { usePromotions, type Promotion } from "@/lib/promotions";
import { brl } from "@/lib/format";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Crown, Shield, ShieldOff, Users, Package, Star, Plus, Trash2, Pencil, Upload, Megaphone, X,
} from "lucide-react";

type AppRole = "admin" | "vip" | "user";
type UserRow = {
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
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) throw redirect({ to: "/conta" });
  },
  head: () => ({ meta: [{ title: "Admin — GN Football" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [tab, setTab] = useState<"products" | "promotions" | "users">("products");
  const { data: products = [], refetch: refetchProducts } = useProducts({ includeInactive: true });
  const { data: promos = [], refetch: refetchPromos } = usePromotions({ includeInactive: true });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingU, setLoadingU] = useState(true);
  const qc = useQueryClient();

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["products"] });
    qc.invalidateQueries({ queryKey: ["promotions"] });
  };

  const loadUsers = useCallback(async () => {
    setLoadingU(true);
    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, email, total_purchased_items, created_at").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const byUser = new Map<string, AppRole[]>();
    (roles ?? []).forEach((r: { user_id: string; role: AppRole }) => {
      const arr = byUser.get(r.user_id) ?? [];
      arr.push(r.role);
      byUser.set(r.user_id, arr);
    });
    setUsers((profs ?? []).map((p) => ({ ...(p as Omit<UserRow, "roles">), roles: byUser.get(p.id) ?? [] })));
    setLoadingU(false);
  }, []);
  useEffect(() => { loadUsers(); }, [loadUsers]);

  const stats = {
    users: users.length,
    vips: users.filter((r) => r.roles.includes("vip") || r.total_purchased_items >= 5).length,
    products: products.length,
    promos: promos.filter((p) => p.active).length,
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <CartDrawer />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8">
        <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold-soft)]">Painel</div>
        <h1 className="mt-2 font-display text-4xl font-black md:text-5xl">Administração</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Edite produtos, promoções e clientes. Tudo salva direto no site.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat icon={<Package className="h-4 w-4" />} label="Produtos" value={stats.products} />
          <Stat icon={<Megaphone className="h-4 w-4" />} label="Promoções ativas" value={stats.promos} />
          <Stat icon={<Users className="h-4 w-4" />} label="Clientes" value={stats.users} />
          <Stat icon={<Crown className="h-4 w-4" />} label="VIPs" value={stats.vips} />
        </div>

        <div className="mt-10 flex gap-2 border-b border-white/10">
          {(["products", "promotions", "users"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-xs uppercase tracking-widest transition ${
                tab === t ? "text-[color:var(--gold)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "products" ? "Produtos" : t === "promotions" ? "Promoções" : "Clientes"}
              {tab === t && <span className="absolute inset-x-0 -bottom-px h-px bg-[color:var(--gold)]" />}
            </button>
          ))}
        </div>

        {tab === "products" && <ProductsTab products={products} onChange={() => { refetchProducts(); invalidateAll(); }} />}
        {tab === "promotions" && <PromotionsTab promos={promos} onChange={() => { refetchPromos(); invalidateAll(); }} />}
        {tab === "users" && <UsersTab users={users} loading={loadingU} onChange={loadUsers} />}
      </section>
      <Footer />
    </main>
  );
}

/* ---------------- Products ---------------- */

function ProductsTab({ products, onChange }: { products: Product[]; onChange: () => void }) {
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [query, setQuery] = useState("");
  const filtered = products.filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()));

  async function del(id: string) {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto excluído");
    onChange();
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full max-w-sm rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-[color:var(--gold)]/60"
        />
        <button
          onClick={() => setEditing({ id: "", slug: "", name: "", category: "europeus", price: 149.9, image: "", featured: false, active: true, stock: 10 })}
          className="btn-gold ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="h-3.5 w-3.5" /> Novo produto
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.team}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 text-[color:var(--gold)]">{brl(p.price)}</td>
                <td className="px-4 py-3 text-xs">
                  {p.featured && <span className="mr-1 rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-2 py-0.5 text-[10px] text-[color:var(--gold)]">Destaque</span>}
                  {p.active === false && <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">Inativo</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} className="rounded-full border border-white/10 p-2 hover:border-[color:var(--gold)]/40"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(p.id)} className="rounded-full border border-white/10 p-2 hover:border-red-400/40 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); onChange(); }}
        />
      )}
    </div>
  );
}

function ProductEditor({ initial, onClose, onSaved }: { initial: Partial<Product>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Product>>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !initial.id;

  function set<K extends keyof Product>(k: K, v: Product[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function upload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `products/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    set("image", data.publicUrl);
    setUploading(false);
    toast.success("Imagem enviada");
  }

  async function save() {
    if (!form.name || !form.image || form.price == null) return toast.error("Preencha nome, imagem e preço");
    setSaving(true);
    const slug = form.slug?.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = form.id?.trim() || slug;
    const payload = {
      id, slug, name: form.name, team: form.team ?? null, league: form.league ?? null,
      category: form.category ?? "europeus",
      price: form.price, original_price: form.originalPrice ?? null,
      image: form.image, featured: !!form.featured, active: form.active !== false,
      stock: form.stock ?? 10, sort: form.sort ?? 0,
    };
    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Produto criado" : "Produto atualizado");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[color:var(--surface)] p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-black">{isNew ? "Novo produto" : "Editar produto"}</h3>
          <button onClick={onClose} className="rounded-full border border-white/10 p-2"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Nome"><input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
          <Field label="Slug (opcional)"><input value={form.slug ?? ""} onChange={(e) => set("slug", e.target.value)} className={inputCls} /></Field>
          <Field label="Time"><input value={form.team ?? ""} onChange={(e) => set("team", e.target.value)} className={inputCls} /></Field>
          <Field label="Liga"><input value={form.league ?? ""} onChange={(e) => set("league", e.target.value)} className={inputCls} /></Field>
          <Field label="Categoria">
            <select value={form.category ?? "europeus"} onChange={(e) => set("category", e.target.value as Product["category"])} className={inputCls}>
              {categories.map((c) => <option key={c.slug} value={c.slug} className="bg-[color:var(--surface)]">{c.label}</option>)}
            </select>
          </Field>
          <Field label="Estoque"><input type="number" value={form.stock ?? 10} onChange={(e) => set("stock", Number(e.target.value))} className={inputCls} /></Field>
          <Field label="Preço (R$)"><input type="number" step="0.01" value={form.price ?? 0} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} /></Field>
          <Field label="Preço original (opcional)"><input type="number" step="0.01" value={form.originalPrice ?? ""} onChange={(e) => set("originalPrice", e.target.value ? Number(e.target.value) : null)} className={inputCls} /></Field>
        </div>

        <div className="mt-4">
          <Field label="Imagem">
            <div className="flex flex-wrap items-center gap-3">
              {form.image && <img src={form.image} alt="" className="h-20 w-20 rounded-xl object-cover" />}
              <input value={form.image ?? ""} onChange={(e) => set("image", e.target.value)} placeholder="URL ou faça upload" className={`${inputCls} flex-1 min-w-[240px]`} />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest">
                <Upload className="h-3.5 w-3.5" /> {uploading ? "Enviando..." : "Upload"}
              </button>
            </div>
          </Field>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} /> Destaque na home</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active !== false} onChange={(e) => set("active", e.target.checked)} /> Ativo</label>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-widest">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-gold rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Promotions ---------------- */

function PromotionsTab({ promos, onChange }: { promos: Promotion[]; onChange: () => void }) {
  const [editing, setEditing] = useState<Partial<Promotion> | null>(null);

  async function del(id: string) {
    if (!confirm("Excluir promoção?")) return;
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Promoção removida");
    onChange();
  }
  async function toggle(p: Promotion) {
    const { error } = await supabase.from("promotions").update({ active: !p.active }).eq("id", p.id);
    if (error) return toast.error(error.message);
    onChange();
  }

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <button
          onClick={() => setEditing({ title: "", cta_text: "Garantir", cta_url: "https://wa.me/5511960385479", active: true, vip_only: false, sort: 0 })}
          className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="h-3.5 w-3.5" /> Nova promoção
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {promos.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest">
                  {p.vip_only && <span className="rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-2 py-0.5 text-[color:var(--gold)]">VIP</span>}
                  <span className={`rounded-full border px-2 py-0.5 ${p.active ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-muted-foreground"}`}>
                    {p.active ? "Ativa" : "Pausada"}
                  </span>
                </div>
                <div className="mt-2 font-display text-lg font-black">{p.title} {p.highlight && <span className="text-gold-gradient italic">{p.highlight}</span>}</div>
                {p.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => toggle(p)} className="rounded-full border border-white/10 p-2 text-xs">{p.active ? "Pausar" : "Ativar"}</button>
                <button onClick={() => setEditing(p)} className="rounded-full border border-white/10 p-2"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => del(p.id)} className="rounded-full border border-white/10 p-2 hover:border-red-400/40 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {promos.length === 0 && <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-muted-foreground md:col-span-2">Nenhuma promoção. Crie a primeira.</div>}
      </div>

      {editing && (
        <PromotionEditor initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); onChange(); }} />
      )}
    </div>
  );
}

function PromotionEditor({ initial, onClose, onSaved }: { initial: Partial<Promotion>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Promotion>>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !initial.id;
  function set<K extends keyof Promotion>(k: K, v: Promotion[K]) { setForm((f) => ({ ...f, [k]: v })); }

  async function upload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `promos/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { cacheControl: "3600" });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    set("image_url", data.publicUrl);
    setUploading(false);
  }

  async function save() {
    if (!form.title) return toast.error("Preencha o título");
    setSaving(true);
    const payload = {
      eyebrow: form.eyebrow ?? null, title: form.title, highlight: form.highlight ?? null,
      description: form.description ?? null, discount_label: form.discount_label ?? null,
      cta_text: form.cta_text || "Garantir", cta_url: form.cta_url || "https://wa.me/5511960385479",
      image_url: form.image_url ?? null, active: form.active !== false, vip_only: !!form.vip_only,
      sort: form.sort ?? 0,
    };
    const { error } = isNew
      ? await supabase.from("promotions").insert(payload)
      : await supabase.from("promotions").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Promoção criada" : "Promoção atualizada");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[color:var(--surface)] p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl font-black">{isNew ? "Nova promoção" : "Editar promoção"}</h3>
          <button onClick={onClose} className="rounded-full border border-white/10 p-2"><X className="h-4 w-4" /></button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Field label="Eyebrow (linha superior)"><input value={form.eyebrow ?? ""} onChange={(e) => set("eyebrow", e.target.value)} className={inputCls} /></Field>
          <Field label="Rótulo de desconto (ex: −65%)"><input value={form.discount_label ?? ""} onChange={(e) => set("discount_label", e.target.value)} className={inputCls} /></Field>
          <Field label="Título"><input value={form.title ?? ""} onChange={(e) => set("title", e.target.value)} className={inputCls} /></Field>
          <Field label="Destaque (palavra dourada)"><input value={form.highlight ?? ""} onChange={(e) => set("highlight", e.target.value)} className={inputCls} /></Field>
          <Field label="Texto do botão"><input value={form.cta_text ?? ""} onChange={(e) => set("cta_text", e.target.value)} className={inputCls} /></Field>
          <Field label="Link do botão"><input value={form.cta_url ?? ""} onChange={(e) => set("cta_url", e.target.value)} className={inputCls} /></Field>
        </div>
        <div className="mt-4">
          <Field label="Descrição">
            <textarea rows={3} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} className={`${inputCls} resize-none`} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Imagem de fundo (opcional)">
            <div className="flex flex-wrap items-center gap-3">
              {form.image_url && <img src={form.image_url} alt="" className="h-20 w-20 rounded-xl object-cover" />}
              <input value={form.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} className={`${inputCls} flex-1 min-w-[240px]`} />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-outline-gold inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest">
                <Upload className="h-3.5 w-3.5" /> {uploading ? "Enviando..." : "Upload"}
              </button>
            </div>
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active !== false} onChange={(e) => set("active", e.target.checked)} /> Ativa</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.vip_only} onChange={(e) => set("vip_only", e.target.checked)} /> Somente VIP</label>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-widest">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-gold rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-widest">{saving ? "Salvando..." : "Salvar"}</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Users ---------------- */

function UsersTab({ users, loading, onChange }: { users: UserRow[]; loading: boolean; onChange: () => void }) {
  const [q, setQ] = useState("");
  const filtered = users.filter((r) => !q || r.email?.toLowerCase().includes(q.toLowerCase()) || r.full_name?.toLowerCase().includes(q.toLowerCase()));
  async function toggleRole(uid: string, role: AppRole, has: boolean) {
    const q = has
      ? supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role)
      : supabase.from("user_roles").insert({ user_id: uid, role });
    const { error } = await q;
    if (error) return toast.error(error.message);
    toast.success(has ? `Papel ${role} removido` : `Papel ${role} concedido`);
    onChange();
  }
  return (
    <div className="mt-6">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar cliente..." className="w-full max-w-sm rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none focus:border-[color:var(--gold)]/60" />
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Peças</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th></tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Carregando...</td></tr>}
            {!loading && filtered.map((r) => {
              const isAdmin = r.roles.includes("admin");
              const isVip = r.roles.includes("vip") || r.total_purchased_items >= 5;
              return (
                <tr key={r.id} className="border-t border-white/5">
                  <td className="px-4 py-3"><div className="font-medium">{r.full_name || "—"}</div><div className="text-xs text-muted-foreground">{r.email}</div></td>
                  <td className="px-4 py-3 text-[color:var(--gold)]">{r.total_purchased_items}</td>
                  <td className="px-4 py-3">
                    {isAdmin && <span className="mr-1 rounded-full border border-[color:var(--gold)]/40 bg-[color:var(--gold)]/10 px-2 py-0.5 text-[10px] text-[color:var(--gold)]">Admin</span>}
                    {isVip && <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-2 py-0.5 text-[10px] text-purple-300">VIP</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggleRole(r.id, "vip", r.roles.includes("vip"))} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-wider"><Star className="h-3 w-3" /> {r.roles.includes("vip") ? "Remover VIP" : "Tornar VIP"}</button>
                      <button onClick={() => toggleRole(r.id, "admin", isAdmin)} className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-wider">{isAdmin ? <ShieldOff className="h-3 w-3" /> : <Shield className="h-3 w-3" />} {isAdmin ? "Remover admin" : "Tornar admin"}</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Shared ---------------- */

const inputCls = "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-[color:var(--gold)]/60";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">{icon}{label}</div>
      <div className="mt-2 font-display text-3xl font-black text-[color:var(--gold)]">{value}</div>
    </div>
  );
}
