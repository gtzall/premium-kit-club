import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Allow only URL-safe slug/id characters — blocks PostgREST filter injection via .or()
const SAFE = /^[a-zA-Z0-9_-]+$/;

export default defineTool({
  name: "get_product",
  title: "Get product",
  description: "Fetch a single product by slug or id, including price, stock, sizes, and description.",
  inputSchema: {
    slug_or_id: z
      .string()
      .min(1)
      .max(128)
      .regex(SAFE, "Only letters, numbers, hyphen and underscore are allowed.")
      .describe("The product slug or id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug_or_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    // Two safe equality queries instead of .or() with a user-built expression.
    const [bySlug, byId] = await Promise.all([
      sb.from("products").select("*").eq("slug", slug_or_id).eq("active", true).maybeSingle(),
      sb.from("products").select("*").eq("id", slug_or_id).eq("active", true).maybeSingle(),
    ]);
    const data = bySlug.data ?? byId.data;
    if (!data) return { content: [{ type: "text", text: "Product not found" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { product: data },
    };
  },
});
