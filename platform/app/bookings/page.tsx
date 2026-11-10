import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { requestBooking } from "@/lib/commerce/actions";
import { signOut } from "@/lib/auth/actions";

export const dynamic = "force-dynamic";

const statuses: Record<string, string> = {
  requested: "Awaiting confirmation", confirmed: "Confirmed",
  completed: "Completed", cancelled: "Cancelled"
};

export default async function BookingsPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const { userId, supabase } = await requireUser();
  const [{ data: profile }, { data: bookings }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", userId).maybeSingle(),
    supabase.from("booking_requests")
      .select("id, topic, preferred_date, preferred_time, timezone, status, notes, created_at")
      .eq("user_id", userId).order("preferred_date", { ascending: true }).limit(20)
  ]);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">EO</span><span>EMMANUEL OUKO</span></Link>
        <nav className="nav-links" aria-label="Booking navigation">
          <Link href="/dashboard">Dashboard</Link><Link href="/learning">Learning</Link>
          <form action={signOut}><button type="submit">Sign out</button></form>
        </nav>
      </header>
      <section className="panel">
        <div className="eyebrow">BOOK A SESSION</div><h1>Choose a time to talk.</h1>
        <p className="muted">This sends a booking request. Your session is not confirmed until the team approves it.</p>
        {params.sent ? <div className="alert success" role="status">Booking request submitted. Watch your account for confirmation.</div> : null}
        {params.error ? <div className="alert" role="alert">Please check the booking details or try again.</div> : null}
        <form className="form" action={requestBooking}>
          <label>Full name<input name="fullName" required minLength={2} maxLength={80} defaultValue={profile?.full_name ?? ""}/></label>
          <label>Session topic<select name="topic" required defaultValue="">
            <option value="" disabled>Choose a topic</option>
            <option>Website and digital services consultation</option>
            <option>AI tools and productivity training</option>
            <option>Digital skills learning</option>
            <option>Forex education</option>
            <option>Project progress meeting</option>
          </select></label>
          <label>Preferred date<input name="preferredDate" type="date" min={today} required/></label>
          <label>Preferred time (Kenya time)<input name="preferredTime" type="time" required/></label>
          <input type="hidden" name="timezone" value="Africa/Nairobi"/>
          <label>Additional notes (optional)<textarea name="notes" rows={3} maxLength={1500}/></label>
          <button type="submit">Send booking request</button>
        </form>
      </section>
      <section className="panel">
        <div className="eyebrow">YOUR BOOKINGS</div><h2>Booking history</h2>
        {!bookings?.length ? <p className="muted">You have no booking requests yet.</p> : (
          <div className="request-list">{bookings.map((booking) => (
            <article className="feature" key={booking.id}>
              <div className="row"><h3>{booking.topic}</h3><span className="pill">{statuses[booking.status] ?? booking.status}</span></div>
              <p>{booking.preferred_date} at {String(booking.preferred_time).slice(0,5)} ({booking.timezone})</p>
              {booking.notes ? <p className="muted">{booking.notes}</p> : null}
            </article>
          ))}</div>
        )}
      </section>
    </main>
  );
}
