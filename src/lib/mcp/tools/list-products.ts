import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_products",
  title: "List products",
  description: "List active jerseys in the GN Football catalog. Optionally filter by category (e.g. 'retro', 'europeu', 'brasileiro') or featured only.",
  inputSchema: {
    category: z.string().optional().describe("Optional category slug filter."),
    featured: z.boolean().optional().describe("If true, return only featured products."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, featured, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = supabaseForUser(ctx)
      .from("products")
      .select("id, slug, name, category, team, league, price, original_price, stock, featured, image, badges")
      .eq("active", true)
      .order("sort", { ascending: true })
      .limit(limit ?? 50);
    if (category) q = q.eq("category", category);
    if (featured) q = q.eq("featured", true);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { products: data ?? [] },
    };
  },
});
