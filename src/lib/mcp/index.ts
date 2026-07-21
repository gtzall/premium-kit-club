import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import myProfile from "./tools/my-profile";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "gn-football-mcp",
  title: "GN Football",
  version: "0.1.0",
  instructions:
    "Tools for the GN Football premium jersey store. Use `list_products` to browse the catalog (filter by category or featured), `get_product` to look up a specific jersey by slug or id, and `my_profile` to read the signed-in user's profile and VIP status. All tools act as the authenticated user; catalog reads only return active products.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, getProduct, myProfile],
});
