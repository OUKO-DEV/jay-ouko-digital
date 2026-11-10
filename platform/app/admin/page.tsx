import Link from "next/link";
import { signOut } from "@/lib/auth/actions";
import { requireAdmin } from "@/lib/auth/guards";
import { createProject, updateServiceRequest } from "@/lib/requests/actions";

export const dynamic = "force-dynamic";
const labels: Record<string, string> = {
  submitted: "Submitted", reviewing: "Reviewing", quoted: "Quoted",
  accepted: "Accepted", in_progress: "In progress", completed: "Completed", declined: "Declined"
};

export default async function AdminPage({ searchParams }: {
  searchParams: Promise<{ error?: string; updated?: string; projectCreated?: string }>;
}) {
  const params = await searchParams;
  const { email, supabase } = await requireAdmin();
  const [{ data: requests }, { data: projects }] = await Promise.all([
    supabase.from("service_requests")
      .select("id, user_id, full_name, email, service, budget, details, status, admin_notes, created_at")
      .order("created_at", { ascending: false }).limit(50),
    supabase.from("projects").select("id, client_id, title, description, status, due_date")
      .order("updated_at", { ascending: false }).limit(50)
  ]);

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">EO</span><span>EMMANUEL OUKO</span></Link>
        <nav className="nav-links" aria-label="Administrator navigation">
          <Link href="/dashboard">Client view</Link><form action={signOut}><button type="submit">Sign out</button></form>
        </nav>
      </header>
      <section className="panel">
        <div className="eyebrow">ADMIN CONTROL CENTRE</div><h1>Welcome, administrator.</h1>
        <p className="muted">Verified administrator: {email}</p>
        <div className="feature-grid">
          <article className="feature"><div className="eyebrow">REQUESTS</div><h2>{requests?.length ?? 0}</h2><p>Latest requests</p></article>
          <article className="feature"><div className="eyebrow">PROJECTS</div><h2>{projects?.length ?? 0}</h2><p>Tracked projects</p></article>
        </div>
        {params.updated ? <div className="alert success" role="status">Request updated.</div> : null}
        {params.projectCreated ? <div className="alert success" role="status">Project created.</div> : null}
        {params.error ? <div className="alert" role="alert">The action could not be completed. Check the details and try again.</div> : null}
      </section>
      <section className="panel">
        <div className="eyebrow">CLIENT INBOX</div><h2>Service requests</h2>
        {!requests?.length ? <p className="muted">No requests have been submitted yet.</p> : (
          <div className="request-list">{requests.map((request) => (
            <article className="feature" key={request.id}>
              <div className="row">
                <div><h3>{request.service}</h3><p className="form-note">{request.full_name} · {request.email ?? "No email"} · {new Date(request.created_at).toLocaleDateString("en-KE")}</p></div>
                <span className="pill">{labels[request.status] ?? request.status}</span>
              </div>
              <p>{request.details}</p><p className="form-note">Client ID: {request.user_id}{request.budget ? ` · Budget: ${request.budget}` : ""}</p>
              <form className="form" action={updateServiceRequest}>
                <input type="hidden" name="requestId" value={request.id} />
                <label>Request status<select name="status" defaultValue={request.status}>
                  <option value="submitted">Submitted</option><option value="reviewing">Reviewing</option>
                  <option value="quoted">Quoted</option><option value="accepted">Accepted</option>
                  <option value="in_progress">In progress</option><option value="completed">Completed</option>
                  <option value="declined">Declined</option>
                </select></label>
                <label>Internal admin notes<textarea name="adminNotes" rows={2} maxLength={2000} defaultValue={request.admin_notes ?? ""} /></label>
                <button type="submit">Save request update</button>
              </form>
            </article>
          ))}</div>
        )}
      </section>
      <section className="panel">
        <div className="eyebrow">PROJECT MANAGEMENT</div><h2>Create a client project</h2>
        <p className="muted">Use the client account ID shown on a service request to assign an approved project.</p>
        <form className="form" action={createProject}>
          <label>Client account ID<input name="clientId" required maxLength={64} /></label>
          <label>Project title<input name="title" required minLength={3} maxLength={120} /></label>
          <label>Description<textarea name="description" rows={3} required minLength={10} maxLength={3000} /></label>
          <label>Target date (optional)<input name="dueDate" type="date" /></label>
          <button type="submit">Create project</button>
        </form>
      </section>
      <section className="panel">
        <div className="eyebrow">PROJECT REGISTER</div><h2>Recent projects</h2>
        {!projects?.length ? <p className="muted">No projects have been created.</p> : (
          <div className="request-list">{projects.map((project) => (
            <article className="feature" key={project.id}>
              <div className="row"><h3>{project.title}</h3><span className="pill">{project.status.replaceAll("_", " ")}</span></div>
              <p>{project.description}</p><p className="form-note">Client: {project.client_id} · Due: {project.due_date ?? "Not set"}</p>
            </article>
          ))}</div>
        )}
      </section>
    </main>
  );
}
