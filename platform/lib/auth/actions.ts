"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getSiteUrl() {
  const value = process.env.SITE_URL;

  if (!value) {
    throw new Error("SITE_URL is missing. Add it to platform/.env.local.");
  }

  const parsed = new URL(value);
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost") {
    throw new Error("SITE_URL must use HTTPS outside localhost.");
  }

  return parsed.origin;
}

export async function signUp(formData: FormData) {
  const fullName = readText(formData, "fullName");
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (fullName.length < 2 || fullName.length > 80 || !email.includes("@")) {
    redirect("/sign-up?error=invalid-details");
  }

  if (password.length < 12 || password.length > 128) {
    redirect("/sign-up?error=weak-password");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getSiteUrl()}/auth/confirm`
    }
  });

  if (error) {
    // Do not expose provider internals or reveal whether an email exists.
    redirect("/sign-up?error=signup-failed");
  }

  redirect("/check-email");
}

export async function signIn(formData: FormData) {
  const email = readText(formData, "email").toLowerCase();
  const password = readText(formData, "password");

  if (!email.includes("@") || !password) {
    redirect("/login?error=invalid-details");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirect("/login?error=signin-failed");
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/login?signedOut=1");
}
