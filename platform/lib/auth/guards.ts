import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub;

  if (error || typeof userId !== "string") {
    redirect("/login");
  }

  return {
    supabase,
    userId,
    email:
      typeof claims?.email === "string"
        ? claims.email
        : "Verified account"
  };
}

export async function requireAdmin() {
  const session = await requireUser();

  // This query is protected by the profiles table's RLS policy.
  // The browser never decides whether an account is an administrator.
  const { data: profile, error } = await session.supabase
    .from("profiles")
    .select("role")
    .eq("id", session.userId)
    .maybeSingle();

  if (error || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return { ...session, profile };
}
