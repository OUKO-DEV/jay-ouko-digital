"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function read(formData: FormData, key: string, max: number) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim().slice(0, max) : "";
}

async function session() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub;
  if (error || typeof userId !== "string") redirect("/login");
  return {
    supabase,
    userId,
    email: typeof claims?.email === "string" ? claims.email : null
  };
}

export async function requestBooking(formData: FormData) {
  const fullName = read(formData, "fullName", 80);
  const topic = read(formData, "topic", 120);
  const preferredDate = read(formData, "preferredDate", 10);
  const preferredTime = read(formData, "preferredTime", 5);
  const timezone = read(formData, "timezone", 80) || "Africa/Nairobi";
  const notes = read(formData, "notes", 1500);

  if (
    fullName.length < 2 ||
    topic.length < 3 ||
    !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(preferredTime) ||
    Number.isNaN(Date.parse(`${preferredDate}T${preferredTime}:00+03:00`)) ||
    preferredDate < new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" })
  ) redirect("/bookings?error=invalid-booking");

  const { supabase, userId, email } = await session();
  const { error } = await supabase.from("booking_requests").insert({
    user_id: userId, full_name: fullName, email, topic,
    preferred_date: preferredDate, preferred_time: preferredTime,
    timezone, notes: notes || null, status: "requested"
  });

  if (error) redirect("/bookings?error=booking-failed");
  redirect("/bookings?sent=1");
}

export async function submitPaymentReference(formData: FormData) {
  const purpose = read(formData, "purpose", 160);
  const amountRaw = read(formData, "amount", 20);
  const phoneRaw = read(formData, "phone", 20).replace(/[\s()-]/g, "");
  const reference = read(formData, "reference", 20).toUpperCase();
  const amount = Number(amountRaw);

  const phone = phoneRaw.startsWith("0")
    ? `+254${phoneRaw.slice(1)}`
    : phoneRaw.startsWith("254")
      ? `+${phoneRaw}`
      : phoneRaw;

  if (
    purpose.length < 3 ||
    !Number.isFinite(amount) || amount <= 0 || amount > 10000000 ||
    !/^\+?254[0-9]{9}$/.test(phone) ||
    !/^[A-Z0-9]{8,20}$/.test(reference)
  ) redirect("/payments?error=invalid-payment");

  const { supabase, userId } = await session();
  const { error } = await supabase.from("payment_submissions").insert({
    user_id: userId,
    purpose,
    amount_kes: amount,
    payer_phone: phone,
    mpesa_reference: reference,
    status: "submitted"
  });

  if (error) redirect("/payments?error=payment-failed");
  redirect("/payments?submitted=1");
}


async function requireAdminClient() {
  const current = await session();
  const { data: profile, error } = await current.supabase
    .from("profiles").select("role").eq("id", current.userId).maybeSingle();
  if (error || profile?.role !== "admin") redirect("/dashboard");
  return current;
}

export async function updateBooking(formData: FormData) {
  const bookingId = read(formData, "bookingId", 64);
  const status = read(formData, "status", 20);
  const adminNotes = read(formData, "adminNotes", 1500);
  if (!/^[0-9a-f-]{36}$/i.test(bookingId) ||
      !["requested", "confirmed", "completed", "cancelled"].includes(status)) {
    redirect("/admin?error=invalid-booking-update");
  }
  const { supabase } = await requireAdminClient();
  const { error } = await supabase.from("booking_requests")
    .update({ status, admin_notes: adminNotes || null }).eq("id", bookingId);
  if (error) redirect("/admin?error=booking-update-failed");
  redirect("/admin?bookingUpdated=1");
}

export async function reconcilePayment(formData: FormData) {
  const paymentId = read(formData, "paymentId", 64);
  const status = read(formData, "status", 20);
  const adminNotes = read(formData, "adminNotes", 1500);
  if (!/^[0-9a-f-]{36}$/i.test(paymentId) ||
      !["verifying", "confirmed", "rejected"].includes(status)) {
    redirect("/admin?error=invalid-payment-update");
  }
  const { supabase } = await requireAdminClient();
  const { error } = await supabase.from("payment_submissions")
    .update({ status, admin_notes: adminNotes || null }).eq("id", paymentId);
  if (error) redirect("/admin?error=payment-update-failed");
  redirect("/admin?paymentUpdated=1");
}
