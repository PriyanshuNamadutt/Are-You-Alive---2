import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { API, apiAuth } from "../utils/api";

// ─── Home Page ──────────────────────────────────────────────────────────────
// This is the "live demo" page. The big green "Click Me" button acts as the
// safety pulse check. If the user isn't logged in, it routes them to /auth.

export default function HomePage({ navigate }) {
  const { token, logout, isLoggedIn } = useAuth();
  const { show, el } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [lastClick, setLastClick] = useState(null);

  async function handlePulse() {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    try {
      const res = await apiAuth(`${API}/click`, token, { method: "PATCH" });
      const data = await res.json();
      setLastClick(data.time ? new Date(data.time).toLocaleString() : "now");
      setShowModal(true);
    } catch {
      setLastClick(new Date().toLocaleString());
      setShowModal(true);
    }
  }

  // Stable particle data
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    left: Math.random() * 100,
    dur: Math.random() * 12 + 8,
    delay: Math.random() * 10,
  }));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a2e1a",
        color: "#f0faf4",
        fontFamily: "'Outfit',sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        cursor: "default",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes floatUp{0%{transform:translateY(110vh) scale(0);opacity:0}10%{opacity:.6}90%{opacity:.3}100%{transform:translateY(-10vh) scale(1);opacity:0}}
        @keyframes pulseRing{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.4);opacity:0}}
        @keyframes drawLine{to{stroke-dashoffset:0}}
        @keyframes homeFadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes modalPop{from{opacity:0;transform:translate(-50%,-50%) scale(.8)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
      `}</style>

      {/* BG layers */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%,rgba(26,122,64,.55),transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(34,197,94,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,.04) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            borderRadius: "50%",
            background: "#22c55e",
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: 0,
            animation: `floatUp ${p.dur}s linear ${p.delay}s infinite`,
            zIndex: 0,
          }}
        />
      ))}

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          background: "rgba(10,46,26,0.7)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(34,197,94,0.1)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{ background: "none", border: "none", color: "#4ade80", fontFamily: "'Bebas Neue',sans-serif", fontSize: "1.3rem", cursor: "pointer", letterSpacing: "2px" }}
        >
          ARE YOU ALIVE?
        </button>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                style={{ background: "rgba(34,197,94,0.12)", color: "#bbf7d0", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Outfit',sans-serif" }}
              >
                👤 Profile
              </button>
              <button
                onClick={() => {
                  logout();
                  show("Logged out", "success");
                }}
                style={{ background: "rgba(192,57,43,0.12)", color: "#f87171", border: "1px solid rgba(192,57,43,0.25)", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: "'Outfit',sans-serif" }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              style={{ background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontWeight: 700, fontSize: "0.85rem", fontFamily: "'Outfit',sans-serif", boxShadow: "0 2px 12px rgba(34,197,94,0.35)" }}
            >
              Login / Register
            </button>
          )}
        </div>
      </nav>

      {el}

      {/* Main */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "20px", marginTop: 40 }}>
        {/* Logo */}
        <div style={{ width: 120, height: 120, margin: "0 auto 24px", position: "relative", animation: "homeFadeUp .8s cubic-bezier(0.175,0.885,.32,1.275) both" }}>
          <div style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "2px solid rgba(74,222,128,.4)", animation: "pulseRing 2s ease-out infinite" }} />
          <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: "1px solid rgba(74,222,128,.15)", animation: "pulseRing 2s ease-out .5s infinite" }} />
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "linear-gradient(135deg,#1a7a40,#22c55e)", boxShadow: "0 0 0 4px rgba(34,197,94,.2),0 0 40px rgba(34,197,94,.45)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            <svg viewBox="0 0 64 32" width="64" height="32" style={{ zIndex: 1 }}>
              <path d="M0,16 L10,16 L14,6 L20,26 L26,10 L30,20 L34,16 L64,16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="120" strokeDashoffset="120" style={{ animation: "drawLine 1.2s ease forwards .5s" }} />
            </svg>
          </div>
        </div>

        <p style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "5px", textTransform: "uppercase", color: "#4ade80", animation: "homeFadeUp .6s ease .7s both", marginBottom: 10 }}>
          Check your pulse
        </p>
        <h1 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "clamp(3.5rem,10vw,7rem)", lineHeight: .92, letterSpacing: "3px", color: "#f0faf4", textShadow: "0 0 60px rgba(74,222,128,.35)", animation: "homeFadeUp .7s ease .9s both", margin: 0 }}>
          Are You<br />
          <span style={{ color: "#4ade80", textShadow: "0 0 20px rgba(74,222,128,.8),0 0 60px rgba(74,222,128,.4)" }}>Alive?</span>
        </h1>
        <p style={{ fontSize: "1rem", fontWeight: 300, color: "rgba(187,247,208,.65)", letterSpacing: "1.5px", marginTop: 14, animation: "homeFadeUp .6s ease 1.1s both" }}>
          Your health. Your story. Your dashboard.
        </p>

        <div style={{ width: 160, height: 1, background: "linear-gradient(90deg,transparent,#22c55e,transparent)", margin: "36px auto", animation: "homeFadeUp .6s ease 1.3s both" }} />

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", animation: "homeFadeUp .6s ease 1.5s both" }}>
          <button
            onClick={handlePulse}
            style={{ position: "relative", padding: "15px 40px", borderRadius: 50, fontFamily: "'Outfit',sans-serif", fontSize: "1rem", fontWeight: 600, cursor: "pointer", border: "none", background: "linear-gradient(135deg,#22c55e,#16a34a)", color: "#fff", boxShadow: "0 4px 20px rgba(34,197,94,.5)", transition: "all .25s", display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}
          >
            ⚡ {isLoggedIn ? "I'm Alive!" : "Click Me"}
          </button>
          <button
            onClick={() => navigate("/profile")}
            style={{ padding: "15px 40px", borderRadius: 50, fontFamily: "'Outfit',sans-serif", fontSize: "1rem", fontWeight: 600, cursor: "pointer", background: "rgba(34,197,94,.08)", color: "#bbf7d0", border: "1.5px solid rgba(74,222,128,.45)", transition: "all .25s", display: "flex", alignItems: "center", gap: 10 }}
          >
            👤 View Profile
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(6,23,16,.75)", backdropFilter: "blur(4px)", zIndex: 99 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", zIndex: 100, background: "linear-gradient(135deg,#0d4a26,#0a2e1a)", border: "1px solid rgba(74,222,128,.35)", borderRadius: 24, padding: "48px 56px", textAlign: "center", boxShadow: "0 0 80px rgba(34,197,94,.3)", animation: "modalPop .35s cubic-bezier(0.175,.885,.32,1.275) both", maxWidth: "90vw" }}>
            <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: "3rem", color: "#4ade80", textShadow: "0 0 30px rgba(74,222,128,.6)", letterSpacing: "3px", marginBottom: 10 }}>YES, YOU ARE! 💚</h2>
            <p style={{ color: "rgba(187,247,208,.7)", fontSize: "0.95rem", marginBottom: 4 }}>Your heartbeat is registered.</p>
            {lastClick && <p style={{ color: "rgba(187,247,208,.45)", fontSize: "0.82rem", marginBottom: 28 }}>Last check-in: {lastClick}</p>}
            <button
              onClick={() => setShowModal(false)}
              style={{ padding: "10px 30px", borderRadius: 50, border: "1.5px solid rgba(74,222,128,.4)", background: "transparent", color: "#bbf7d0", fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </>
      )}

      <p style={{ position: "fixed", bottom: 28, fontSize: "0.75rem", color: "rgba(187,247,208,.3)", letterSpacing: "1px", zIndex: 1 }}>
        ARE YOU ALIVE · HEALTH PLATFORM
      </p>
    </div>
  );
}
