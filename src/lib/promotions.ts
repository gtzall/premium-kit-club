import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Promotion {
  id: string;
  eyebrow: string | null;
  title: string;
  highlight: string | null;
  description: string | null;
  discount_label: string | null;
  cta_text: string;
  cta_url: string;
  image_url: string | null;
  active: boolean;
  vip_only: boolean;
  sort: number;
}

export function usePromotions(opts?: { vipOnly?: boolean; includeInactive?: boolean }) {
  return useQuery({
    queryKey: ["promotions", opts],
    queryFn: async (): Promise<Promotion[]> => {
      let q = supabase.from("promotions").select("*").order("sort", { ascending: true });
      if (!opts?.includeInactive) q = q.eq("active", true);
      if (opts?.vipOnly !== undefined) q = q.eq("vip_only", opts.vipOnly);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Promotion[];
    },
  });
}
