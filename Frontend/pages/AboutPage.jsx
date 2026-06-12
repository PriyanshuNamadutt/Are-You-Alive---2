import React from "react";
// ─── About Page ─────────────────────────────────────────────────────────────
// This is the landing page at "/". It introduces the project and links to
// the live demo (Home page).

const features = [
  {
    icon: "❤️",
    title: "Safety Check System",
    desc: "Automated monitoring that tracks your activity. If you don't respond to check-ins, emergency alerts are dispatched to your registered contacts instantly.",
  },
  {
    icon: "🔐",
    title: "Secure Authentication",
    desc: "JWT-based login and registration with encrypted credentials. Your health data stays protected and private at all times.",
  },
  {
    icon: "👥",
    title: "Contact Management",
    desc: "Register up to 5 emergency contacts with names, relationships, phone numbers, and emails — all editable from your profile.",
  },
  {
    icon: "📡",
    title: "Real-time Alerts",
    desc: "When a safety check fails, notifications are delivered to all emergency contacts through integrated alert workflows, minimizing response time.",
  },
  {
    icon: "🩺",
    title: "Medical Profile",
    desc: "Store allergies, medical conditions, blood type, and organ donor status — critical information first responders need in an emergency.",
  },
  {
    icon: "📋",
    title: "REST API Backend",
    desc: "Clean, documented REST endpoints for authentication, profile management, click-check logging, and contact notifications.",
  },
];

const tech = ["React", "Node.js", "Express", "MongoDB", "JWT Auth", "REST APIs"];

const stats = [
  ["5", "Emergency Contacts"],
  ["JWT", "Auth Security"],
  ["REST", "API Driven"],
  ["24/7", "Monitoring"],
];

export default function AboutPage({ navigate }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060d0a",
        color: "#e8f5ee",
        fontFamily: "'DM Sans',sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(6,13,10,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(74,222,128,0.1)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.3rem" }}>💚</span>
          <span style={{ fontWeight: 700, fontSize: "1rem", letterSpacing: "0.5px", color: "#4ade80" }}>
            Are You Alive?
          </span>
        </div>
        <button
          onClick={() => navigate("/home")}
          style={{
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "8px 20px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.88rem",
          }}
        >
          Live Demo →
        </button>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "90px 24px 60px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 70% 50% at 50% 0%,rgba(34,197,94,0.15),transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(74,222,128,0.3)",
            borderRadius: 20,
            padding: "6px 16px",
            fontSize: "0.78rem",
            color: "#4ade80",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: 28,
            fontWeight: 600,
          }}
        >
          Emergency Response Application
        </div>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(2.8rem,7vw,5.5rem)",
            fontWeight: 900,
            lineHeight: 1.05,
            margin: "0 0 24px",
            color: "#f0fdf4",
          }}
        >
          Are You <span style={{ color: "#4ade80", textShadow: "0 0 40px rgba(74,222,128,0.4)" }}>Alive?</span>
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(187,247,208,0.7)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.7,
          }}
        >
          An automated safety-check system that monitors your activity and alerts your emergency contacts when you
          go dark — because seconds matter.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => navigate("/home")}
            style={{
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              color: "#fff",
              border: "none",
              borderRadius: 50,
              padding: "14px 36px",
              fontWeight: 700,
              fontSize: "1rem",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(34,197,94,0.4)",
              letterSpacing: "0.3px",
            }}
          >
            ⚡ Live Demo
          </button>
          <a
            href="https://github.com"
            style={{
              background: "rgba(255,255,255,0.05)",
              color: "#bbf7d0",
              border: "1.5px solid rgba(74,222,128,0.3)",
              borderRadius: 50,
              padding: "14px 36px",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}
          >
            GitHub ↗
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 24px 70px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 16 }}>
          {stats.map(([num, label]) => (
            <div
              key={label}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(74,222,128,0.12)",
                borderRadius: 16,
                padding: "28px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#4ade80",
                  marginBottom: 6,
                }}
              >
                {num}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(187,247,208,0.55)", letterSpacing: "0.5px" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: "2rem",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 48,
            color: "#f0fdf4",
          }}
        >
          How It Works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
          {features.map((f) => (
            <div
              key={f.title}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(74,222,128,0.1)",
                borderRadius: 18,
                padding: "28px 24px",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(74,222,128,0.35)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(74,222,128,0.1)")}
            >
              <div style={{ fontSize: "2rem", marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#bbf7d0", marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: "0.87rem", color: "rgba(187,247,208,0.55)", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: "0 24px 80px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700, marginBottom: 32, color: "#f0fdf4" }}>
          Built With
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          {tech.map((t) => (
            <span
              key={t}
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(74,222,128,0.25)",
                color: "#4ade80",
                borderRadius: 20,
                padding: "7px 18px",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "60px 24px 80px", textAlign: "center", borderTop: "1px solid rgba(74,222,128,0.1)" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 700, marginBottom: 16, color: "#f0fdf4" }}>
          Ready to check in?
        </h2>
        <p style={{ color: "rgba(187,247,208,0.6)", marginBottom: 32, fontSize: "0.95rem" }}>
          Register once, and never go unnoticed in an emergency.
        </p>
        <button
          onClick={() => navigate("/home")}
          style={{
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: "15px 44px",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(34,197,94,0.4)",
          }}
        >
          Get Started →
        </button>
      </section>

      <footer
        style={{
          borderTop: "1px solid rgba(74,222,128,0.08)",
          padding: "24px",
          textAlign: "center",
          fontSize: "0.78rem",
          color: "rgba(187,247,208,0.25)",
          letterSpacing: "1px",
        }}
      >
        ARE YOU ALIVE · EMERGENCY RESPONSE PLATFORM · 2025
      </footer>

      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
