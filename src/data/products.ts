import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Category =
  | "europeus"
  | "brasileiros"
  | "selecoes"
  | "retro"
  | "conjuntos";

export interface Product {
  id: string;
  slug: string;
  name: string;
  team?: string | null;
  league?: string | null;
  category: Category;
  price: number;
  originalPrice?: number | null;
  image: string;
  featured?: boolean;
  active?: boolean;
  stock?: number;
  sort?: number;
}

export const categories: { slug: Category; label: string; tagline: string }[] = [
  { slug: "europeus",    label: "Times Europeus",   tagline: "Da Premier à La Liga" },
  { slug: "brasileiros", label: "Times Brasileiros", tagline: "Coração nacional" },
  { slug: "selecoes",    label: "Seleções",          tagline: "Cores que vestem o mundo" },
  { slug: "retro",       label: "Retrô",             tagline: "Eternizadas no tempo" },
  { slug: "conjuntos",   label: "Conjuntos",         tagline: "Looks completos" },
];

type Row = {
  id: string;
  slug: string;
  name: string;
  team: string | null;
  league: string | null;
  category: string;
  price: number | string;
  original_price: number | string | null;
  image: string;
  featured: boolean;
  active: boolean;
  stock: number;
  sort: number;
};

function rowToProduct(r: Row): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    team: r.team,
    league: r.league,
    category: r.category as Category,
    price: Number(r.price),
    originalPrice: r.original_price != null ? Number(r.original_price) : null,
    image: r.image,
    featured: r.featured,
    active: r.active,
    stock: r.stock,
    sort: r.sort,
  };
}

export function useProducts(opts?: { includeInactive?: boolean }) {
  return useQuery({
    queryKey: ["products", { includeInactive: opts?.includeInactive ?? false }],
    queryFn: async (): Promise<Product[]> => {
      let q = supabase.from("products").select("*").order("sort", { ascending: true });
      if (!opts?.includeInactive) q = q.eq("active", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data as unknown as Row[]).map(rowToProduct);
    },
  });
}

export function useFeaturedProducts() {
  const { data, ...rest } = useProducts();
  return { ...rest, data: data?.filter((p) => p.featured) ?? [] };
}
