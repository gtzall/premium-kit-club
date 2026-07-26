import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "get_cart",
  title: "Get cart",
  description: "Return the signed-in user's saved cart items with product details and subtotal.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("cart_items")
      .select("id, product_id, size, qty, products(name, price, image, slug, stock)")
      .eq("user_id", ctx.getUserId()!);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = (data ?? []).map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      size: r.size,
      qty: r.qty,
      name: r.products?.name,
      price: r.products?.price,
      image: r.products?.image,
      slug: r.products?.slug,
      line_total: (r.products?.price ?? 0) * r.qty,
    }));
    const subtotal = items.reduce((a, i) => a + i.line_total, 0);
    const payload = { items, subtotal, count: items.reduce((a, i) => a + i.qty, 0) };
    return {
      content: [{ type: "text", text: JSON.stringify(payload) }],
      structuredContent: payload,
    };
  },
});
