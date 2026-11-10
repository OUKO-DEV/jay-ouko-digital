import Link from "next/link";

const features = [
  {
    title: "Client workspace",
    description: "A secure place for clients to manage enquiries, projects and updates."
  },
  {
    title: "Digital services",
    description: "Professional web, branding and digital support with clear project scope."
  },
  {
    title: "Learning centre",
    description: "Practical digital skills and Forex education with transparent risk guidance."
  }
];

export default function HomePage() {
  return (
    <main className="shell">
      <header className="topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">EO</span>
          <span>EMMANUEL OUKO</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/login">Sign in</Link>
          <Link className="button" href="/sign-up">Create account</Link>
        </nav>
      </header>

      <section className="hero">
        <div>
          <div className="eyebrow">A trusted digital experience</div>
          <h1>Make your next move <span>count.</span></h1>
          <p className="lede">
            A growing digital platform for professional services, practical learning
            and clear collaboration — built around security, transparency and useful work.
          </p>
          <div className="actions">
            <Link className="button" href="/sign-up">Get started</Link>
            <Link className="button secondary" href="/login">Client sign in</Link>
          </div>
        </div>
        <div className="glass-card">
          <div className="orb">EO</div>
          <div className="mini-label">DIGITAL SERVICES · LEARNING · CLIENT CARE</div>
        </div>
      </section>

      <section className="feature-grid" aria-label="Platform features">
        {features.map((feature) => (
          <article className="feature" key={feature.title}>
            <div className="eyebrow">PLATFORM</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} Emmanuel Ouko. Built for clarity and trust.
      </footer>
    </main>
  );
}
