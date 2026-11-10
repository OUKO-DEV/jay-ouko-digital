import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { submitPaymentReference } from "@/lib/commerce/actions";
import { signOut } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

const statuses: Record<string, string> = {
  submitted: "Submitted for checking", verifying: "Being verified",
  confirmed: "Payment confirmed", rejected: "Not verified"
};

export default async function PaymentsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const params = await searchParams;
  const { userId, supabase } = await requireUser();
  const { data: payments } = await supabase.from("payment_submissions")
    .select("id, purpose, amount_kes, payer_phone, mpesa_reference, status, created_at")
    .eq("user_id", userId).order("created_at", { ascending: false }).limit(20);

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">EO</span><span>EMMANUEL OUKO</span></Link>
        <nav className="nav-links" aria-label="Payment navigation">
          <Link href="/dashboard">Dashboard</Link><Link href="/bookings">Bookings</Link>
          <form action={signOut}><button type="submit">Sign out</button></form>
        </nav>
      </header>
      <section className="panel">
        <div className="eyebrow">PAYMENT RECORDS</div><h1>Submit an M-Pesa reference.</h1>
        <p className="muted">First contact Emmanuel to confirm the amount and the correct payment channel. After making the payment, submit the M-Pesa transaction code below. Your submission remains unverified until it is checked against the actual transaction.</p>
        <div className="alert" role="note">Never enter or share your M-Pesa PIN, one-time password or full card details here. This form does not initiate an STK Push or take money from your account.</div>
        {params.submitted ? <div className="alert success" role="status">Your payment reference was submitted for verification.</div> : null}
        {params.error ? <div className="alert" role="alert">Check the amount, Kenyan phone number and transaction code, then try again.</div> : null}
        <form className="form" action={submitPaymentReference}>
          <label>What is this payment for?<input name="purpose" required minLength={3} maxLength={160} placeholder="e.g. Website design deposit"/></label>
          <label>Amount paid (KSh)<input name="amount" type="number" min="1" max="10000000" step="0.01" required/></label>
          <label>Phone number used for M-Pesa<input name="phone" type="tel" required maxLength={20} placeholder="07XXXXXXXX or 2547XXXXXXXX"/></label>
          <label>M-Pesa transaction code<input name="reference" required minLength={8} maxLength={20} autoCapitalize="characters" placeholder="e.g. QWX123ABC"/></label>
          <button type="submit">Submit for verification</button>
        </form>
      </section>
      <section className="panel">
        <div className="eyebrow">PAYMENT HISTORY</div><h2>Your submissions</h2>
        {!payments?.length ? <p className="muted">No payment references submitted yet.</p> : (
          <div className="request-list">{payments.map((payment) => (
            <article className="feature" key={payment.id}>
              <div className="row"><h3>{payment.purpose}</h3><span className="pill">{statuses[payment.status] ?? payment.status}</span></div>
              <p>KSh {Number(payment.amount_kes).toLocaleString("en-KE")} · {payment.payer_phone} · {payment.mpesa_reference}</p>
              <p className="form-note">Submitted {new Date(payment.created_at).toLocaleDateString("en-KE")}</p>
            </article>
          ))}</div>
        )}
      </section>
    </main>
  );
}
