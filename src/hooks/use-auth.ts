import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "vip" | "user";

export interface AuthProfile {
  id: string;
  full_name: string | null;
  total_purchased_items: number;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (!s?.user) {
        setProfile(null);
        setRoles([]);
      } else {
        // Defer DB reads
        setTimeout(() => refresh(s.user.id), 0);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) refresh(data.session.user.id);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function refresh(uid: string) {
    const [{ data: prof }, { data: rs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", uid),
    ]);
    if (prof) setProfile(prof as AuthProfile);
    if (rs) setRoles(rs.map((r: { role: AppRole }) => r.role));
  }

  const isVip = roles.includes("vip") || (profile?.total_purchased_items ?? 0) >= 5;
  const isAdmin = roles.includes("admin");

  return { session, user, profile, roles, loading, isVip, isAdmin, signOut: () => supabase.auth.signOut() };
}
