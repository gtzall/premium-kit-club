import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type OAuthNS = {
  getAuthorizationDetails: (id: string) => Promise<{
    data: { client?: { name?: string } | null; redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
  approveAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
  denyAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
};

function oauth(): OAuthNS {
  return (supabase.auth as unknown as { oauth: OAuthNS }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({ to: "/auth", search: { next } });
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Não foi possível carregar a autorização</h1>
        <p className="mt-2 text-sm text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) { setBusy(false); setError(error.message); return; }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) { setBusy(false); setError("Servidor não retornou redirecionamento."); return; }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "Um aplicativo";

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-foreground">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
        <h1 className="font-display text-2xl uppercase tracking-wide">
          Conectar {clientName} à sua conta
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {clientName} poderá acessar a GN Football agindo como você, respeitando suas permissões.
        </p>
        {error && (
          <p role="alert" className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
        <div className="mt-6 flex gap-2">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 rounded-full bg-[color:var(--gold,#D4AF37)] px-4 py-2.5 text-sm font-semibold text-black transition disabled:opacity-50"
          >
            Aprovar
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white transition disabled:opacity-50"
          >
            Recusar
          </button>
        </div>
      </div>
    </main>
  );
}
