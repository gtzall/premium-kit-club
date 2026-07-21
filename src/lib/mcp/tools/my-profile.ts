import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "my_profile",
  title: "My profile",
  description: "Return the signed-in user's GN Football profile, roles (admin/vip), and VIP status.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const uid = ctx.getUserId();
    const sb = supabaseForUser(ctx);
    const [{ data: profile }, { data: roles }] = await Promise.all([
      sb.from("profiles").select("*").eq("id", uid!).maybeSingle(),
      sb.from("user_roles").select("role").eq("user_id", uid!),
    ]);
    const roleList = (roles ?? []).map((r: { role: string }) => r.role);
    const isVip = roleList.includes("vip") || (profile?.total_purchased_items ?? 0) >= 5;
    const payload = { profile, roles: roleList, isVip, isAdmin: roleList.includes("admin") };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
