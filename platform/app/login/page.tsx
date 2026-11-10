import Link from "next/link";
import { signIn } from "@/lib/auth/actions";

const errors: Record<string, string> = {
  "invalid-details": "Enter a valid email address and password.",
  "signin-failed": "Sign-in failed. Check your details and verify your email address.",
  "confirmation-failed": "That confirmation link is invalid or expired. Request a new one or contact support."
};

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; signedOut?: string }>;
}) {
  const params = await searchParams;
  const message = params.error ? errors[params.error] : undefined;

  return (
    <main className="auth-wrap">
      <section className="auth-card">
        <Link className="brand" href="/">
          <span className="brand-mark">EO</span>
          <span>EMMANUEL OUKO</span>
        </Link>
        <div className="eyebrow" style={{ marginTop: 30 }}>CLIENT ACCESS</div>
        <h1>Welcome back.</h1>
        <p>Sign in to continue to your secure workspace.</p>

        {message ? <div className="alert" role="alert">{message}</div> : null}
        {params.signedOut ? <div className="alert success" role="status">You have signed out.</div> : null}

        <form className="form" action={signIn}>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required maxLength={128} />
          </label>
          <button type="submit">Sign in securely</button>
          <p className="form-note">New to the platform? <Link href="/sign-up">Create an account</Link>.</p>
        </form>
        <p className="form-note">Use only your own account. Never share your password or verification codes.</p>
      </section>
    </main>
  );
}
