import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { enrollInCourse } from "@/lib/learning/actions";

export const dynamic = "force-dynamic";

export default async function LearningPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string; enrolled?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const [{ data: courses }, { data: claims }] = await Promise.all([
    supabase.from("courses").select("id, slug, title, summary, level, price_kes")
      .eq("published", true).order("created_at", { ascending: false }),
    supabase.auth.getClaims()
  ]);
  const userId = claims?.claims?.sub;
  let enrolled = new Set<string>();
  if (typeof userId === "string") {
    const { data } = await supabase.from("course_enrollments")
      .select("course_id").eq("user_id", userId);
    enrolled = new Set((data ?? []).map((item) => item.course_id));
  }

  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/"><span className="brand-mark">EO</span><span>EMMANUEL OUKO</span></Link>
        <nav className="nav-links" aria-label="Learning navigation">
          <Link href="/">Home</Link><Link href="/dashboard">Dashboard</Link>
          {typeof userId === "string" ? <Link href="/bookings">Bookings</Link> : <Link href="/login">Sign in</Link>}
        </nav>
      </header>
      <section className="panel">
        <div className="eyebrow">LEARNING CENTRE</div>
        <h1>Build practical skills.</h1>
        <p className="muted">Structured learning in digital tools, responsible AI use and Forex market foundations. Forex content is educational only; trading carries risk and returns are never guaranteed.</p>
      </section>
      {params.enrolled ? <div className="alert success" role="status">Your enrolment request has been received.</div> : null}
      {params.error ? <div className="alert" role="alert">We could not complete that enrolment. Sign in and try again.</div> : null}
      <section className="feature-grid">
        {!courses?.length ? <article className="feature"><h3>Courses are being prepared</h3><p className="muted">Published courses will appear here after the team reviews their lesson content and pricing.</p></article> : courses.map((course) => (
          <article className="feature" key={course.id}>
            <div className="eyebrow">{course.level.toUpperCase()}</div>
            <h3>{course.title}</h3><p>{course.summary}</p>
            <p className="form-note">{course.price_kes === null || Number(course.price_kes) === 0 ? "Free" : `KSh ${Number(course.price_kes).toLocaleString("en-KE")}`}</p>
            {enrolled.has(course.id) ? <span className="pill">Enrolment requested</span> : typeof userId === "string" ? (
              <form action={enrollInCourse}><input type="hidden" name="courseId" value={course.id}/><button type="submit">Request enrolment</button></form>
            ) : <Link className="button" href="/login">Sign in to enrol</Link>}
          </article>
        ))}
      </section>
      <footer className="footer">Learning content is educational and does not guarantee employment, income or trading results.</footer>
    </main>
  );
}
