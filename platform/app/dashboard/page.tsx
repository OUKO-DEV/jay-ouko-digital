import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { requireUser } from "@/lib/auth/guards";
import { submitServiceRequest } from "@/lib/requests/actions";

export const dynamic = "force-dynamic";

const requestErrors: Record<string, string> = {
  "invalid-request": "Complete the required fields and provide at least 10 characters of detail.",
  "request-failed": "Your request could not be saved. Please try again."
};
const statusLabels: Record<string, string> = {
  submitted: "Submitted", reviewing: "Under review", quoted: "Quote prepared",
  accepted: "Accepted", in_progress: "In progress", completed: "Completed", declined: "Declined"
};

export default async function DashboardPage({ searchParams }: {
  searchParams: Promise<{ error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  const { userId, email, supabase } = await requireUser();
  const [{ data: profile }, { data: requests }, { data: projects }] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", userId).maybeSingle(),
    supabase.from("service_requests").select("id, service, details, budget, status, created_at")
      .eq("user_id", userId).order("created_at", { ascending: false }).limit(10),
    supabase.from("projects").select("id, title, description, status, due_date, updated_at")
      .eq("client_id", userId).order("updated_at", { ascending: false }).limit(10)
  ]);

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">EO</span><span>EMMANUEL OUKO</span></Link>
        <nav className="nav-links" aria-label="Account navigation">
          <Link href="/learning">Learning</Link><Link href="/bookings">Bookings</Link><Link href="/payments">Payments</Link>
          {profile?.role === "admin" ? <Link href="/admin">Admin</Link> : null}
          <form action={signOut}><button type="submit">Sign out</button></form>
        </nav>
      </header>
      <section className="panel">
        <div className="eyebrow">YOUR CLIENT WORKSPACE</div>
        <div className="row"><h1>Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}.</h1><span className="pill">{profile?.role ?? "customer"}</span></div>
        <p className="muted">Signed in as {email}</p>
        <p className="muted">Submit a project enquiry and follow its progress from this workspace.</p>
      </section>
      <section className="panel">
        <div className="eyebrow">START A PROJECT</div><h2>Tell us what you need.</h2>
        {params.error ? <div className="alert" role="alert">{requestErrors[params.error] ?? "Something went wrong."}</div> : null}
        {params.sent ? <div className="alert success" role="status">Your request has been received. Track its status below.</div> : null}
        <form className="form" action={submitServiceRequest}>
          <label>Your name<input name="fullName" required minLength={2} maxLength={80} defaultValue={profile?.full_name ?? ""} /></label>
          <label>Service<select name="service" required defaultValue="">
            <option value="" disabled>Choose a service</option>
            <option>Web design &amp; development</option><option>Branding &amp; graphic design</option>
            <option>Digital marketing &amp; content</option><option>AI tools &amp; productivity</option>
            <option>Forex education</option><option>Digital tools and productivity learning</option>
            <option>Other / not sure yet</option>
          </select></label>
          <label>Estimated budget<select name="budget" defaultValue="Not sure yet">
            <option>Not sure yet</option><option>Below KSh 2,000</option><option>KSh 2,000–5,000</option>
            <option>KSh 5,000–10,000</option><option>KSh 10,000–20,000</option><option>Above KSh 20,000</option>
          </select></label>
          <label>Project details<textarea name="details" required minLength={10} maxLength={4000} rows={5} /></label>
          <button type="submit">Submit project request</button>
        </form>
      </section>
      <section className="panel">
        <div className="eyebrow">REQUEST HISTORY</div><h2>Your service requests</h2>
        {!requests?.length ? <p className="muted">You have not submitted any service requests yet.</p> : (
          <div className="request-list">{requests.map((request) => (
            <article className="feature" key={request.id}>
              <div className="row"><h3>{request.service}</h3><span className="pill">{statusLabels[request.status] ?? request.status}</span></div>
              <p>{request.details}</p>
              <p className="form-note">Submitted {new Date(request.created_at).toLocaleDateString("en-KE")}{request.budget ? ` · ${request.budget}` : ""}</p>
            </article>
          ))}</div>
        )}
      </section>
      <section className="panel">
        <div className="eyebrow">PROJECT TRACKING</div><h2>Active and completed projects</h2>
        {!projects?.length ? <p className="muted">Approved projects will appear here when the team creates them.</p> : (
          <div className="request-list">{projects.map((project) => (
            <article className="feature" key={project.id}>
              <div className="row"><h3>{project.title}</h3><span className="pill">{project.status.replaceAll("_", " ")}</span></div>
              <p>{project.description}</p>
              <p className="form-note">Due: {project.due_date ?? "To be agreed"} · Updated {new Date(project.updated_at).toLocaleDateString("en-KE")}</p>
            </article>
          ))}</div>
        )}
      </section>
    </main>
  );
}
