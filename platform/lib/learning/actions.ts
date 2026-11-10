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
