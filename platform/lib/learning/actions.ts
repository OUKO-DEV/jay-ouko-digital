"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string, max: number) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim().slice(0, max) : "";
}

async function authenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || typeof userId !== "string") redirect("/login");
  return { supabase, userId };
}

export async function enrollInCourse(formData: FormData) {
  const courseId = value(formData, "courseId", 64);
  if (!/^[0-9a-f-]{36}$/i.test(courseId)) redirect("/learning?error=invalid-course");

  const { supabase, userId } = await authenticatedClient();
  const { data: course, error: courseError } = await supabase
    .from("courses").select("id, published").eq("id", courseId).maybeSingle();

  if (courseError || !course?.published) redirect("/learning?error=course-unavailable");

  const { error } = await supabase.from("course_enrollments").insert({
    course_id: courseId,
    user_id: userId,
    status: "pending"
  });

  if (error) redirect("/learning?error=enrollment-failed");
  redirect("/learning?enrolled=1");
}


async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || typeof userId !== "string") redirect("/login");
  const { data: profile, error: profileError } = await supabase
    .from("profiles").select("role").eq("id", userId).maybeSingle();
  if (profileError || profile?.role !== "admin") redirect("/dashboard");
  return supabase;
}

export async function createCourse(formData: FormData) {
  const title = value(formData, "title", 140);
  const slug = value(formData, "slug", 100).toLowerCase();
  const summary = value(formData, "summary", 1200);
  const level = value(formData, "level", 20);
  const rawPrice = value(formData, "priceKes", 20);
  const price = rawPrice === "" ? null : Number(rawPrice);
  if (
    title.length < 3 ||
    !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ||
    summary.length < 10 ||
    !["Beginner", "Intermediate", "Advanced"].includes(level) ||
    (price !== null && (!Number.isFinite(price) || price < 0 || price > 10000000))
  ) redirect("/admin?error=invalid-course");

  const supabase = await requireAdmin();
  const { error } = await supabase.from("courses").insert({
    title, slug, summary, level, price_kes: price, published: false
  });
  if (error) redirect("/admin?error=course-create-failed");
  redirect("/admin?courseCreated=1");
}

export async function setCoursePublished(formData: FormData) {
  const courseId = value(formData, "courseId", 64);
  const published = value(formData, "published", 5);
  if (!/^[0-9a-f-]{36}$/i.test(courseId) || !["true", "false"].includes(published)) {
    redirect("/admin?error=invalid-course-update");
  }
  const supabase = await requireAdmin();
  const { error } = await supabase.from("courses")
    .update({ published: published === "true" }).eq("id", courseId);
  if (error) redirect("/admin?error=course-update-failed");
  redirect("/admin?courseUpdated=1");
}
