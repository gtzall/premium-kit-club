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
  name: "update_profile",
  title: "Update profile",
  description: "Update the signed-in user's GN Football profile fields (full_name only). Role, email and purchased counters are protected.",
  inputSchema: {
    full_name: z
      .string()
      .trim()
      .min(2, "Name too short")
      .max(80, "Name too long")
      .regex(/^[\p{L}\p{M} '.\-]+$/u, "Invalid characters in name")
      .describe("Display name shown on the account."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ full_name }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const sb = supabaseForUser(ctx);
    const uid = ctx.getUserId()!;
    const { data, error } = await sb
      .from("profiles")
      .update({ full_name })
      .eq("id", uid)
      .select("id, full_name, email, total_purchased_items")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Profile updated: ${full_name}` }],
      structuredContent: { profile: data },
    };
  },
});
