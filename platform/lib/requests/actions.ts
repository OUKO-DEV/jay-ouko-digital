"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string, max: number) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const services = new Set([
  "Web design & development",
  "Branding & graphic design",
  "Digital marketing & content",
  "AI tools & productivity",
  "Forex education",
  "Digital tools and productivity learning",
  "Other / not sure yet"
]);

export async function submitServiceRequest(formData: FormData) {
  const fullName = textValue(formData, "fullName", 80);
  const service = textValue(formData, "service", 100);
  const budget = textValue(formData, "budget", 60);
  const details = textValue(formData, "details", 4000);

  if (fullName.length < 2 || !services.has(service) || details.length < 10) {
    redirect("/dashboard?error=invalid-request");
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    redirect("/login");
  }

  const email =
    typeof claimsData.claims.email === "string"
      ? claimsData.claims.email
      : null;

  const { error } = await supabase.from("service_requests").insert({
    user_id: userId,
    full_name: fullName,
    email,
    service,
    budget: budget || null,
    details,
    status: "submitted"
  });

  if (error) {
    redirect("/dashboard?error=request-failed");
  }

  redirect("/dashboard?sent=1");
}

export async function updateServiceRequest(formData: FormData) {
  const requestId = textValue(formData, "requestId", 64);
  const status = textValue(formData, "status", 30);
  const adminNotes = textValue(formData, "adminNotes", 2000);

  const allowedStatuses = new Set([
    "submitted",
    "reviewing",
    "quoted",
    "accepted",
    "in_progress",
    "completed",
    "declined"
  ]);

  if (
    !/^[0-9a-f-]{36}$/i.test(requestId) ||
    !allowedStatuses.has(status)
  ) {
    redirect("/admin?error=invalid-update");
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { error } = await supabase
    .from("service_requests")
    .update({ status, admin_notes: adminNotes || null })
    .eq("id", requestId);

  if (error) {
    redirect("/admin?error=update-failed");
  }

  redirect("/admin?updated=1");
}

export async function createProject(formData: FormData) {
  const clientId = textValue(formData, "clientId", 64);
  const title = textValue(formData, "title", 120);
  const description = textValue(formData, "description", 3000);
  const dueDate = textValue(formData, "dueDate", 10);

  if (
    !/^[0-9a-f-]{36}$/i.test(clientId) ||
    title.length < 3 ||
    description.length < 10 ||
    (dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate))
  ) {
    redirect("/admin?error=invalid-project");
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profileError || profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { error } = await supabase.from("projects").insert({
    client_id: clientId,
    title,
    description,
    due_date: dueDate || null,
    status: "planned"
  });

  if (error) {
    redirect("/admin?error=project-failed");
  }

  redirect("/admin?projectCreated=1");
}
