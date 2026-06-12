import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { API, apiFetch } from "../utils/api";

// ─── Auth Page (Login / Register) ──────────────────────────────────────────
export default function AuthPage({ navigate }) {
  const { login } = useAuth();
  const { show, el } = useToast();
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function register() {
    if (!form.email || !form.password) return show("Fill in all fields", "error");
    setLoading(true);
    try {
      const res = await apiFetch(`${API}/register`, { method: "POST", body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Registration failed");
      login(data.token);
      show("Account created! Set up your profile.", "success");
      setTimeout(() => navigate("/edit-profile"), 800);
    } catch (e) {
      show(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function doLogin() {
    if (!form.email || !form.password) return show("Fill in all fields", "error");
    setLoading(true);
    try {
      const res = await apiFetch(`${API}/login`, { method: "POST", body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Login failed");
      login(data.token);
      show("Welcome back!", "success");
      setTimeout(() => navigate("/home"), 600);
    } catch (e) {
      show(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const inp = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(74,222,128,0.2)",
    background: "rgba(255,255,255,0.04)",
    color: "#e8f5ee",
    fontFamily: "'DM Sans',sans-serif",
    fontSize: "0.92rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#060d0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "radial-gradient(ellipse 60% 60% at 50% 50%,rgba(34,197,94,0.08),transparent)",
          pointerEvents: "none",
        }}
      />
      {el}
      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "1.5rem",
              boxShadow: "0 0 40px rgba(34,197,94,0.3)",
            }}
          >
            💚
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 900, color: "#f0fdf4", margin: 0 }}>
            Are You Alive?
          </h1>
          <p style={{ color: "rgba(187,247,208,0.5)", fontSize: "0.85rem", marginTop: 6 }}>Emergency Response Platform</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: 20, padding: "32px 28px" }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 4, marginBottom: 28, gap: 4 }}>
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "9px",
                  border: "none",
                  borderRadius: 8,
                  fontFamily: "'DM Sans',sans-serif",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: tab === t ? "linear-gradient(135deg,#22c55e,#16a34a)" : "transparent",
                  color: tab === t ? "#fff" : "rgba(187,247,208,0.5)",
                  boxShadow: tab === t ? "0 2px 12px rgba(34,197,94,0.35)" : "none",
                }}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input
              style={inp}
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={handle("email")}
              onFocus={(e) => (e.target.style.borderColor = "rgba(74,222,128,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(74,222,128,0.2)")}
            />
            <input
              style={inp}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handle("password")}
              onFocus={(e) => (e.target.style.borderColor = "rgba(74,222,128,0.5)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(74,222,128,0.2)")}
              onKeyDown={(e) => e.key === "Enter" && (tab === "login" ? doLogin() : register())}
            />
            <button
              onClick={tab === "login" ? doLogin : register}
              disabled={loading}
              style={{
                padding: "13px",
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontFamily: "'DM Sans',sans-serif",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 20px rgba(34,197,94,0.35)",
                marginTop: 4,
              }}
            >
              {loading ? "…" : tab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "rgba(187,247,208,0.35)" }}>
            {tab === "login" ? "No account? " : "Already registered? "}
            <button
              onClick={() => setTab(tab === "login" ? "register" : "login")}
              style={{ background: "none", border: "none", color: "#4ade80", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem", padding: 0 }}
            >
              {tab === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.78rem", color: "rgba(187,247,208,0.25)" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "rgba(187,247,208,0.35)", cursor: "pointer", fontSize: "0.78rem" }}>
            ← About this project
          </button>
        </p>
      </div>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
