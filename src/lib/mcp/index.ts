import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import myProfile from "./tools/my-profile";
import updateProfile from "./tools/update-profile";
import getCart from "./tools/get-cart";
import addToCart from "./tools/add-to-cart";
import removeFromCart from "./tools/remove-from-cart";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "gn-football-mcp",
  title: "GN Football",
  version: "0.2.0",
  instructions:
    "Tools for the GN Football premium jersey store. Browse the catalog with `list_products` and `get_product`. Manage the signed-in user's cart via `get_cart`, `add_to_cart`, and `remove_from_cart`. Read the profile with `my_profile` and edit the display name via `update_profile`. All tools act as the authenticated user; catalog reads only return active products.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, getProduct, myProfile, updateProfile, getCart, addToCart, removeFromCart],
});
