import Link from "next/link";
import { signUp } from "@/lib/auth/actions";

const errors: Record<string, string> = {
  "invalid-details": "Enter your name and a valid email address.",
  "weak-password": "Use a password between 12 and 128 characters.",
  "signup-failed": "We could not complete registration. Check your details or try again later."
};

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
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
        <div className="eyebrow" style={{ marginTop: 30 }}>CREATE YOUR ACCOUNT</div>
        <h1>Start with trust.</h1>
        <p>Create your client account. We will send an email confirmation link before you can sign in.</p>

        {message ? <div className="alert" role="alert">{message}</div> : null}

        <form className="form" action={signUp}>
          <label>
            Full name
            <input name="fullName" type="text" autoComplete="name" required minLength={2} maxLength={80} />
          </label>
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} />
          </label>
          <p className="form-note">Use at least 12 characters. A long, unique passphrase is easier to remember and harder to guess.</p>
          <button type="submit">Create account</button>
          <p className="form-note">Already registered? <Link href="/login">Sign in</Link>.</p>
        </form>
      </section>
    </main>
  );
}
