import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminPage() {
  const { email } = await requireAdmin();

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
        <div className="eyebrow">RESTRICTED AREA</div>
        <h1>Administrator workspace</h1>
        <p className="muted">Verified administrator: {email}</p>
        <p className="muted">
          This route checks the verified Supabase identity and the database
          role. It is a protected foundation; management tools will be added
          only after their own database policies are defined.
        </p>
        <span className="pill">Admin access verified</span>
      </section>
    </main>
  );
}
