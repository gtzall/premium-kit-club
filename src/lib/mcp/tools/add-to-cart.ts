import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const SAFE = /^[a-zA-Z0-9_-]+$/;

export default defineTool({
  name: "add_to_cart",
  title: "Add to cart",
  description: "Add a product (by id) to the signed-in user's cart. If the item + size already exists, the quantity is incremented.",
  inputSchema: {
    product_id: z.string().min(1).max(128).regex(SAFE).describe("Product id."),
    size: z.enum(["P", "M", "G", "GG"]).default("M"),
    qty: z.number().int().min(1).max(20).default(1),
  },
  annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ product_id, size, qty }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const uid = ctx.getUserId()!;

    // Verify product exists & is active (RLS lets us read only active rows)
    const { data: prod, error: pErr } = await sb
      .from("products")
      .select("id, stock, name")
      .eq("id", product_id)
      .eq("active", true)
      .maybeSingle();
    if (pErr) return { content: [{ type: "text", text: pErr.message }], isError: true };
    if (!prod) return { content: [{ type: "text", text: "Product not available" }], isError: true };

    const { data: existing } = await sb
      .from("cart_items")
      .select("id, qty")
      .eq("user_id", uid)
      .eq("product_id", product_id)
      .eq("size", size)
      .maybeSingle();

    const nextQty = Math.min(20, (existing?.qty ?? 0) + qty);
    if (prod.stock > 0 && nextQty > prod.stock) {
      return { content: [{ type: "text", text: `Only ${prod.stock} in stock` }], isError: true };
    }

    let row;
    if (existing) {
      const { data, error } = await sb
        .from("cart_items")
        .update({ qty: nextQty })
        .eq("id", existing.id)
        .select()
        .maybeSingle();
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      row = data;
    } else {
      const { data, error } = await sb
        .from("cart_items")
        .insert({ user_id: uid, product_id, size, qty: nextQty })
        .select()
        .maybeSingle();
      if (error) return { content: [{ type: "text", text: error.message }], isError: true };
      row = data;
    }
    return {
      content: [{ type: "text", text: `Added ${qty}x ${prod.name} (${size}) to cart.` }],
      structuredContent: { item: row },
    };
  },
});
