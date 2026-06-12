import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API, apiAuth } from "../utils/api";

// ─── Profile Page ───────────────────────────────────────────────────────────
// Read-only view of the user's profile. Provides navigation to Edit Profile,
// Home, and Logout.

const initials = (name) =>
  name?.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

export default function ProfilePage({ navigate }) {
  const { token, logout, isLoggedIn } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    const load = async () => {
      try {
        const res = await apiAuth(`${API}/profile`, token);
        if (!res.ok) throw new Error();
        setUser(await res.json());
      } catch {
        // Demo fallback so the page is fully explorable without a backend
        setUser({
          name: "Arjun Mehta",
          role: "Member",
          status: "Active",
          id: "USR-2847",
          dateOfBirth: "1991-03-12",
          age: 33,
          gender: "Male",
          bloodGroup: "B+",
          nationality: "Indian",
          occupation: "Senior Software Engineer",
          email: "arjun.mehta@example.com",
          phone: "+91 98765 43210",
          address: "42 Park Street, Kolkata, WB 700016",
          memberSince: "Jan 2024",
          medicalInfo: {
            allergies: "Penicillin, Peanuts",
            conditions: "Mild Hypertension",
            bloodPressure: "130/85 mmHg",
            organDonor: "Yes",
          },
          emergencyContacts: [
            { name: "Priya Mehta", relation: "Spouse", phone: "+91 91234 56789", email: "priya.mehta@example.com" },
            { name: "Rajesh Mehta", relation: "Father", phone: "+91 98001 23456", email: "rajesh.mehta@example.com" },
            { name: "Sunita Sharma", relation: "Sister", phone: "+91 87654 32109", email: "sunita.sharma@example.com" },
          ],
        });
      }
    };
    load();
  }, []);

  const InfoCard = ({ label, value, accent }) => (
    <div
      style={{ background: "#1e1e24", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", transition: "border-color 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(200,169,110,0.25)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}
    >
      <div style={{ fontSize: "0.72rem", letterSpacing: "0.8px", textTransform: "uppercase", color: "#7a7880", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: "1rem", fontWeight: 500, color: accent ? "#e8c98e" : "#f0ede8", wordBreak: "break-word" }}>{value || "—"}</div>
    </div>
  );

  const SectionLabel = ({ children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", color: "#c8a96e" }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
    </div>
  );

  if (!user)
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0f", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, color: "#7a7880", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ width: 36, height: 36, border: "2px solid rgba(255,255,255,.07)", borderTopColor: "#c8a96e", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <span>Loading profile…</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0f", color: "#f0ede8", fontFamily: "'DM Sans',sans-serif", padding: "40px 20px", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes pfadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", animation: "pfadeUp .7s ease both" }}>
        {/* Header */}
        <div style={{ background: "#16161a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "24px 24px 0 0", padding: 40, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", gap: 32, flexWrap: "wrap" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(200,169,110,.06),transparent 60%)", pointerEvents: "none" }} />

          <div style={{ flexShrink: 0, width: 100, height: 100, borderRadius: "50%", padding: 3, background: "conic-gradient(#c8a96e,#e8c98e,#c8a96e)", position: "relative", zIndex: 1 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#1e1e24", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "2.4rem", fontWeight: 700, color: "#c8a96e" }}>
              {initials(user.name)}
            </div>
          </div>

          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.5px", color: "#f0ede8", margin: "0 0 8px" }}>{user.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ background: "rgba(200,169,110,.15)", color: "#e8c98e", border: "1px solid rgba(200,169,110,.25)", borderRadius: 20, padding: "4px 12px", fontSize: "0.78rem", fontWeight: 500 }}>
                ⭑ {user.role || "Member"}
              </span>
              <span style={{ background: "rgba(92,207,160,.12)", color: "#5ccfa0", border: "1px solid rgba(92,207,160,.2)", borderRadius: 20, padding: "4px 12px", fontSize: "0.78rem", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5ccfa0", boxShadow: "0 0 6px #5ccfa0", display: "inline-block" }} />
                {user.status || "Active"}
              </span>
              <span style={{ fontSize: ".8rem", color: "#7a7880" }}>ID: {user.id || "—"}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 130, position: "relative", zIndex: 1 }}>
            {[
              { label: "Edit Profile", icon: "✏️", action: () => navigate("/edit-profile") },
              { label: "Home", icon: "🏠", action: () => navigate("/home") },
              { label: "Logout", icon: "🚪", action: () => { logout(); navigate("/auth"); } },
            ].map((b) => (
              <button
                key={b.label}
                onClick={b.action}
                style={{ padding: "9px 22px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)", background: "#1e1e24", color: "#f0ede8", fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, whiteSpace: "nowrap" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#c8a96e"; e.currentTarget.style.color = "#c8a96e"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#f0ede8"; }}
              >
                {b.icon} {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ background: "#16161a", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none", borderRadius: "0 0 24px 24px", padding: "0 40px 40px" }}>
          <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 36 }} />

          {/* Personal */}
          <div style={{ marginBottom: 40 }}>
            <SectionLabel>Personal Information</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
              <InfoCard label="Full Name" value={user.name} />
              <InfoCard label="Age" value={(user.age || "—") + " years"} />
              <InfoCard label="Date of Birth" value={user.dateOfBirth} />
              <InfoCard label="Gender" value={user.gender} />
              <InfoCard label="Blood Group" value={user.bloodGroup} accent />
              <InfoCard label="Nationality" value={user.nationality} />
              <InfoCard label="Occupation" value={user.occupation} />
              <InfoCard label="Member Since" value={user.memberSince} />
              <InfoCard label="Email" value={user.email} />
              <InfoCard label="Phone" value={user.phone} />
              <InfoCard label="Address" value={user.address} />
            </div>
          </div>

          {/* Medical */}
          <div style={{ marginBottom: 40 }}>
            <SectionLabel>Medical Information</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 16 }}>
              <InfoCard label="Allergies" value={user.medicalInfo?.allergies} accent />
              <InfoCard label="Conditions" value={user.medicalInfo?.conditions} />
              <InfoCard label="Blood Pressure" value={user.medicalInfo?.bloodPressure} />
              <InfoCard label="Organ Donor" value={user.medicalInfo?.organDonor} />
            </div>
          </div>

          {/* Emergency Contacts */}
          <div>
            <SectionLabel>Emergency Contacts</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(user.emergencyContacts || []).map((c, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 18, background: "#1e1e24", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px", transition: "all .2s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,169,110,.25)"; e.currentTarget.style.transform = "translateX(4px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateX(0)"; }}
                >
                  <div style={{ width: 46, height: 46, borderRadius: "50%", background: "rgba(200,169,110,.12)", border: "1px solid rgba(200,169,110,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display',serif", fontSize: "1.1rem", fontWeight: 700, color: "#c8a96e", flexShrink: 0 }}>
                    {initials(c.name)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: "0.95rem", marginBottom: 3 }}>{c.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#7a7880", marginBottom: 4 }}>{c.relation}</div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span style={{ color: "#e8c98e", fontSize: "0.82rem", fontWeight: 500 }}>📞 {c.phone || "—"}</span>
                      <span style={{ color: "#7a7880", fontSize: "0.82rem" }}>✉️ {c.email || "—"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
