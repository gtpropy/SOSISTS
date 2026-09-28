import { roboWorkshop } from "@/lib/data";

// Plain, no-JS-required content for the poster/QR-code link. Whenever a new
// event replaces RobotoShop as "current", point this import at that event's
// data (or swap the import below) — the markup here is generic enough to
// keep working as long as the shape matches `roboWorkshop`.
export default function CurrentEventPage() {
  const w = roboWorkshop;

  return (
    <div className="wrap">
      <span className="eyebrow">{w.status}</span>
      <h1>{w.title}</h1>
      <p className="tagline">{w.tagline}</p>
      <p className="hook">{w.hook}</p>

      <a className="btn" href={w.registration.url} target="_blank" rel="noopener noreferrer">
        Register Now →
      </a>
      <p className="note">{w.registration.note}</p>

      <ul className="facts">
        {w.quickFacts.map((f) => (
          <li key={f.label}>
            {f.label}: <b>{f.value}</b>
          </li>
        ))}
      </ul>

      <h2>What You&apos;ll Learn</h2>
      <ul className="plain">
        {w.whatYoullLearn.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Schedule</h2>
      {w.days.map((day) => (
        <div className="day" key={day.day}>
          <p className="when">
            {day.day} · {day.date}
          </p>
          <p className="title">{day.title}</p>
          <ul className="plain">
            {day.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Fun &amp; Prizes</h2>
      <ul className="plain">
        {w.funStuff.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>What to Bring</h2>
      <ul className="plain">
        {w.whatToBring.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <div className="register-block">
        <h2>Seats Are Limited</h2>
        <p>{w.registration.note}</p>
        <a className="btn" href={w.registration.url} target="_blank" rel="noopener noreferrer">
          Register Now →
        </a>
      </div>

      <p className="note" style={{ marginTop: 16 }}>
        Questions? Reach out to the {w.contact.name}.
      </p>

      <footer className="site-link">
        ISTS — Innovation, Science &amp; Technology Society ·{" "}
        <a href={`/${w.slug}`}>Full event page →</a>
      </footer>
    </div>
  );
}
