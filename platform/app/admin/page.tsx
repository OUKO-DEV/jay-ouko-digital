import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/guards";
import { createProject, updateServiceRequest } from "@/lib/requests/actions";
import { updateBooking, reconcilePayment } from "@/lib/commerce/actions";
import { createCourse, setCoursePublished } from "@/lib/learning/actions";

export const dynamic = "force-dynamic";

const requestLabels: Record<string, string> = {
  submitted: "Submitted", reviewing: "Reviewing", quoted: "Quoted",
  accepted: "Accepted", in_progress: "In progress", completed: "Completed", declined: "Declined"
};
const bookingLabels: Record<string, string> = {
  requested: "Requested", confirmed: "Confirmed", completed: "Completed", cancelled: "Cancelled"
};
const paymentLabels: Record<string, string> = {
  submitted: "Submitted", verifying: "Verifying", confirmed: "Confirmed", rejected: "Rejected"
};

export default async function AdminPage({ searchParams }: {
  searchParams: Promise<{ error?: string; updated?: string; projectCreated?: string;
    bookingUpdated?: string; paymentUpdated?: string; courseCreated?: string; courseUpdated?: string }>;
}) {
  const params = await searchParams;
  const { email, supabase } = await requireAdmin();

  const [
    { data: requests }, { data: projects }, { data: bookings },
    { data: payments }, { data: courses }
  ] = await Promise.all([
    supabase.from("service_requests")
      .select("id, user_id, full_name, email, service, budget, details, status, admin_notes, created_at")
      .order("created_at", { ascending: false }).limit(50),
    supabase.from("projects")
      .select("id, client_id, title, description, status, due_date")
      .order("updated_at", { ascending: false }).limit(50),
    supabase.from("booking_requests")
      .select("id, user_id, full_name, email, topic, preferred_date, preferred_time, timezone, status, notes, admin_notes")
      .order("preferred_date", { ascending: true }).limit(50),
    supabase.from("payment_submissions")
      .select("id, user_id, purpose, amount_kes, payer_phone, mpesa_reference, status, admin_notes, created_at")
      .order("created_at", { ascending: false }).limit(50),
    supabase.from("courses")
      .select("id, slug, title, summary, level, price_kes, published")
      .order("created_at", { ascending: false }).limit(50)
  ]);

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">EO</span><span>EMMANUEL OUKO</span></Link>
        <nav className="nav-links" aria-label="Administrator navigation">
          <Link href="/dashboard">Client view</Link><Link href="/learning">Learning</Link>
          <form action={signOut}><button type="submit">Sign out</button></form>
        </nav>
      </header>

      <section className="panel">
        <div className="eyebrow">ADMIN CONTROL CENTRE</div>
        <h1>Welcome, administrator.</h1>
        <p className="muted">Verified administrator: {email}</p>
        <div className="feature-grid">
          <article className="feature"><div className="eyebrow">REQUESTS</div><h2>{requests?.length ?? 0}</h2><p>Recent enquiries</p></article>
          <article className="feature"><div className="eyebrow">PROJECTS</div><h2>{projects?.length ?? 0}</h2><p>Tracked projects</p></article>
          <article className="feature"><div className="eyebrow">BOOKINGS</div><h2>{bookings?.length ?? 0}</h2><p>Session requests</p></article>
          <article className="feature"><div className="eyebrow">PAYMENTS</div><h2>{payments?.length ?? 0}</h2><p>References to verify</p></article>
          <article className="feature"><div className="eyebrow">COURSES</div><h2>{courses?.length ?? 0}</h2><p>Learning catalogue</p></article>
        </div>
        {params.updated || params.bookingUpdated || params.paymentUpdated || params.courseUpdated || params.courseCreated || params.projectCreated
          ? <div className="alert success" role="status">Your admin change has been saved.</div> : null}
        {params.error ? <div className="alert" role="alert">The action could not be completed. Check the details and try again.</div> : null}
      </section>

      <section className="panel">
        <div className="eyebrow">CLIENT INBOX</div><h2>Service requests</h2>
        {!requests?.length ? <p className="muted">No service requests yet.</p> : (
          <div className="request-list">{requests.map((request) => (
            <article className="feature" key={request.id}>
              <div className="row">
                <div><h3>{request.service}</h3><p className="form-note">{request.full_name} · {request.email ?? "No email"} · {new Date(request.created_at).toLocaleDateString("en-KE")}</p></div>
                <span className="pill">{requestLabels[request.status] ?? request.status}</span>
              </div>
              <p>{request.details}</p><p className="form-note">Client ID: {request.user_id}{request.budget ? ` · Budget: ${request.budget}` : ""}</p>
              <form className="form" action={updateServiceRequest}>
                <input type="hidden" name="requestId" value={request.id}/>
                <label>Status<select name="status" defaultValue={request.status}>
                  <option value="submitted">Submitted</option><option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option><option value="accepted">Accepted</option>
                  <option value="in_progress">In progress</option><option value="completed">Completed</option>
                  <option value="declined">Declined</option>
                </select></label>
                <label>Private admin notes<textarea name="adminNotes" rows={2} maxLength={2000} defaultValue={request.admin_notes ?? ""}/></label>
                <button type="submit">Save request update</button>
              </form>
            </article>
          ))}</div>
        )}
      </section>

      <section className="panel">
        <div className="eyebrow">PROJECT MANAGEMENT</div><h2>Create a client project</h2>
        <form className="form" action={createProject}>
          <label>Client account ID<input name="clientId" required maxLength={64}/></label>
          <label>Project title<input name="title" required minLength={3} maxLength={120}/></label>
          <label>Description<textarea name="description" rows={3} required minLength={10} maxLength={3000}/></label>
          <label>Target date (optional)<input name="dueDate" type="date"/></label>
          <button type="submit">Create project</button>
        </form>
        <h3>Recent projects</h3>
        {!projects?.length ? <p className="muted">No projects created.</p> : (
          <div className="request-list">{projects.map((project) => (
            <article className="feature" key={project.id}>
              <div className="row"><h3>{project.title}</h3><span className="pill">{project.status.replaceAll("_", " ")}</span></div>
              <p>{project.description}</p><p className="form-note">Client: {project.client_id} · Due: {project.due_date ?? "Not set"}</p>
            </article>
          ))}</div>
        )}
      </section>

      <section className="panel">
        <div className="eyebrow">BOOKING DESK</div><h2>Session requests</h2>
        {!bookings?.length ? <p className="muted">No session requests yet.</p> : (
          <div className="request-list">{bookings.map((booking) => (
            <article className="feature" key={booking.id}>
              <div className="row"><h3>{booking.topic}</h3><span className="pill">{bookingLabels[booking.status] ?? booking.status}</span></div>
              <p>{booking.full_name} · {booking.email ?? "No email"} · {booking.preferred_date} at {String(booking.preferred_time).slice(0,5)} ({booking.timezone})</p>
              {booking.notes ? <p>{booking.notes}</p> : null}
              <p className="form-note">Client ID: {booking.user_id}</p>
              <form className="form" action={updateBooking}>
                <input type="hidden" name="bookingId" value={booking.id}/>
                <label>Status<select name="status" defaultValue={booking.status}>
                  <option value="requested">Requested</option><option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                </select></label>
                <label>Private notes<textarea name="adminNotes" rows={2} maxLength={1500} defaultValue={booking.admin_notes ?? ""}/></label>
                <button type="submit">Save booking status</button>
              </form>
            </article>
          ))}</div>
        )}
      </section>

      <section className="panel">
        <div className="eyebrow">PAYMENT RECONCILIATION</div><h2>M-Pesa references</h2>
        <p className="muted">Confirm a payment only after matching the code, amount and sender against the actual Safaricom transaction record. This screen does not independently contact M-Pesa.</p>
        {!payments?.length ? <p className="muted">No payment submissions yet.</p> : (
          <div className="request-list">{payments.map((payment) => (
            <article className="feature" key={payment.id}>
              <div className="row"><h3>{payment.purpose}</h3><span className="pill">{paymentLabels[payment.status] ?? payment.status}</span></div>
              <p>KSh {Number(payment.amount_kes).toLocaleString("en-KE")} · {payment.payer_phone} · {payment.mpesa_reference}</p>
              <p className="form-note">Client ID: {payment.user_id} · Submitted {new Date(payment.created_at).toLocaleDateString("en-KE")}</p>
              <form className="form" action={reconcilePayment}>
                <input type="hidden" name="paymentId" value={payment.id}/>
                <label>Verification status<select name="status" defaultValue={payment.status === "submitted" ? "verifying" : payment.status}>
                  <option value="verifying">Verifying</option><option value="confirmed">Confirmed</option><option value="rejected">Rejected</option>
                </select></label>
                <label>Verification notes<textarea name="adminNotes" rows={2} maxLength={1500} defaultValue={payment.admin_notes ?? ""}/></label>
                <button type="submit">Save verification result</button>
              </form>
            </article>
          ))}</div>
        )}
      </section>

      <section className="panel">
        <div className="eyebrow">LEARNING CATALOGUE</div><h2>Create a course</h2>
        <form className="form" action={createCourse}>
          <label>Course title<input name="title" required minLength={3} maxLength={140}/></label>
          <label>URL slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={100}/></label>
          <label>Summary<textarea name="summary" rows={3} required minLength={10} maxLength={1200}/></label>
          <label>Level<select name="level" defaultValue="Beginner"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label>
          <label>Price in KSh (blank or 0 for free)<input name="priceKes" type="number" min="0" max="10000000" step="0.01"/></label>
          <button type="submit">Save as unpublished course</button>
        </form>
        <h3>Course catalogue</h3>
        {!courses?.length ? <p className="muted">No courses yet.</p> : (
          <div className="request-list">{courses.map((course) => (
            <article className="feature" key={course.id}>
              <div className="row"><h3>{course.title}</h3><span className="pill">{course.published ? "Published" : "Draft"}</span></div>
              <p>{course.summary}</p><p className="form-note">{course.level} · {course.price_kes === null || Number(course.price_kes) === 0 ? "Free" : `KSh ${Number(course.price_kes).toLocaleString("en-KE")}`} · {course.slug}</p>
              <form action={setCoursePublished}>
                <input type="hidden" name="courseId" value={course.id}/>
                <input type="hidden" name="published" value={String(!course.published)}/>
                <button type="submit">{course.published ? "Unpublish course" : "Publish course"}</button>
              </form>
            </article>
          ))}</div>
        )}
      </section>
    </main>
  );
}
