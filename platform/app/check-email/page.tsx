import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <div className="brand">
          <span className="brand-mark">EO</span>
          <span>EMMANUEL OUKO</span>
        </div>
        <div className="eyebrow" style={{ marginTop: 30 }}>ONE MORE STEP</div>
        <h1>Check your inbox.</h1>
        <p>
          If registration was accepted, Supabase has sent a confirmation link
          to the address you entered. Open that link on this device to verify
          your email and finish creating your session.
        </p>
        <Link className="button" href="/login">Continue to sign in</Link>
        <p className="form-note">Do not forward confirmation links or share verification codes.</p>
      </section>
    </main>
  );
}
