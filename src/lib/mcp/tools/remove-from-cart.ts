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
  name: "remove_from_cart",
  title: "Remove from cart",
  description: "Remove a specific cart item by its id, or clear the whole cart when clear_all=true.",
  inputSchema: {
    item_id: z.string().uuid().optional().describe("Cart item id to remove."),
    clear_all: z.boolean().optional().describe("If true, remove all items from the cart."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ item_id, clear_all }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!item_id && !clear_all) {
      return { content: [{ type: "text", text: "Provide item_id or clear_all=true" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const uid = ctx.getUserId()!;
    const q = sb.from("cart_items").delete().eq("user_id", uid);
    const { error } = clear_all ? await q : await q.eq("id", item_id!);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: clear_all ? "Cart cleared." : "Item removed." }],
      structuredContent: { ok: true },
    };
  },
});
