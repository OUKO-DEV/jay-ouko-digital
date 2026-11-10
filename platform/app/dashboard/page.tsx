import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId, email, supabase } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", userId)
    .maybeSingle();

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">EO</span>
          <span>EMMANUEL OUKO</span>
        </Link>
        <form action={signOut}>
          <button type="submit">Sign out</button>
        </form>
      </header>

      <section className="panel">
        <div className="eyebrow">YOUR WORKSPACE</div>
        <div className="row">
          <h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}.</h1>
          <span className="pill">{profile?.role ?? "customer"}</span>
        </div>
        <p className="muted">Signed in as {email}</p>
        <p className="muted">
          Your account is authenticated. Project management, bookings, payments
          and course access will be added in later development phases.
        </p>
        <p className="form-note">Account reference: {userId}</p>
      </section>
    </main>
  );
}
