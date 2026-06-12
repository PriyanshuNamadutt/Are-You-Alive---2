import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { API, apiAuth } from "../utils/api";

// ─── Edit Profile Page ──────────────────────────────────────────────────────
// Used both for first-time profile setup (after register) and editing an
// existing profile (from the Profile page).

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  border: "1px solid #e2ddd5",
  borderRadius: 10,
  background: "#f9f7f3",
  color: "#1a1a1a",
  fontFamily: "'Outfit',sans-serif",
  fontSize: "0.92rem",
  outline: "none",
  transition: "border-color .2s,box-shadow .2s",
  boxSizing: "border-box",
};

const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.6px",
  textTransform: "uppercase",
  color: "#8a8078",
  marginBottom: 7,
  display: "block",
};

const focusInput = (e) => {
  e.target.style.borderColor = "#3d6b52";
  e.target.style.boxShadow = "0 0 0 3px rgba(61,107,82,.1)";
};
const blurInput = (e) => {
  e.target.style.borderColor = "#e2ddd5";
  e.target.style.boxShadow = "none";
};

const cardStyle = {
  background: "#fff",
  border: "1px solid #e2ddd5",
  borderRadius: 18,
  padding: 32,
  marginBottom: 20,
  boxShadow: "0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.05)",
};

const GENDER_OPTIONS = [
  ["", "Select gender"],
  ["Male", "Male"],
  ["Female", "Female"],
  ["Non-binary", "Non-binary"],
  ["Prefer not to say", "Prefer not to say"],
];

const BLOOD_GROUP_OPTIONS = [
  ["", "Select blood group"],
  ["A+", "A+"],
  ["A−", "A−"],
  ["B+", "B+"],
  ["B−", "B−"],
  ["AB+", "AB+"],
  ["AB−", "AB−"],
  ["O+", "O+"],
  ["O−", "O−"],
];

const PERSONAL_FIELDS = [
  ["Full Name*", "text", "name", "e.g. Arjun Mehta"],
  ["Date of Birth*", "date", "dateOfBirth", ""],
  ["Nationality", "text", "nationality", "e.g. Indian"],
  ["Occupation", "text", "occupation", "e.g. Software Engineer"],
  ["Email*", "email", "email", "email@example.com"],
  ["Phone", "tel", "phone", "+91 98765 43210"],
];

const MEDICAL_FIELDS = [
  ["Known Allergies", "allergies", "e.g. Penicillin, Peanuts"],
  ["Medical Conditions", "conditions", "e.g. Mild Hypertension"],
  ["Blood Pressure", "bloodPressure", "e.g. 120/80 mmHg"],
];

const CONTACT_FIELDS = [
  ["Full Name", "text", "name", "Contact name"],
  ["Relationship", "text", "relation", "e.g. Spouse"],
  ["Phone", "tel", "phone", "+91 XXXXX XXXXX"],
  ["Email ID", "email", "email", "contact@example.com"],
];

const emptyFields = {
  name: "", dateOfBirth: "", gender: "", bloodGroup: "", nationality: "", occupation: "",
  email: "", phone: "", address: "", allergies: "", conditions: "", bloodPressure: "", organDonor: false,
};

export default function EditProfilePage({ navigate }) {
  const { token, isLoggedIn } = useAuth();
  const { show, el } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(emptyFields);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }
    load();
  }, []);

  async function load() {
    try {
      const res = await apiAuth(`${API}/profile`, token);
      if (!res.ok) throw new Error();
      const d = await res.json();
      setFields({
        name: d.name || "", dateOfBirth: d.dateOfBirth || "", gender: d.gender || "", bloodGroup: d.bloodGroup || "",
        nationality: d.nationality || "", occupation: d.occupation || "", email: d.email || "", phone: d.phone || "",
        address: d.address || "", allergies: d.medicalInfo?.allergies || "", conditions: d.medicalInfo?.conditions || "",
        bloodPressure: d.medicalInfo?.bloodPressure || "", organDonor: !!d.medicalInfo?.organDonor,
      });
      setContacts([...(d.emergencyContacts || [])]);
    } catch {
      // New user — start with a blank form
      setFields(emptyFields);
      setContacts([]);
    }
  }

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFields((f) => ({ ...f, [k]: v }));
  };

  async function save(e) {
    e.preventDefault();
    if (!fields.name.trim()) return show("Name is required", "error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return show("Valid email required", "error");

    setLoading(true);
    const payload = {
      name: fields.name, dateOfBirth: fields.dateOfBirth, gender: fields.gender, bloodGroup: fields.bloodGroup,
      nationality: fields.nationality, occupation: fields.occupation, email: fields.email, phone: fields.phone, address: fields.address,
      medicalInfo: { allergies: fields.allergies, conditions: fields.conditions, bloodPressure: fields.bloodPressure, organDonor: fields.organDonor },
      emergencyContacts: contacts.filter((c) => c.name || c.phone),
    };

    try {
      const res = await apiAuth(`${API}/edit-profile`, token, { method: "PUT", body: JSON.stringify(payload) });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || "Server error");
      }
      show("Profile saved!", "success");
      setTimeout(() => navigate("/profile"), 800);
    } catch (err) {
      if (err.message.includes("fetch") || err.message.includes("Network")) {
        show("Saved (demo mode)", "success");
        setTimeout(() => navigate("/profile"), 800);
      } else show(err.message, "error");
    }
    setLoading(false);
  }

  const initials = fields.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";

  return (
    <div style={{ minHeight: "100vh", background: "#f4f1eb", color: "#1a1a1a", fontFamily: "'Outfit',sans-serif", padding: "40px 20px 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
        @keyframes epFadeIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      {el}
      <div style={{ maxWidth: 820, margin: "0 auto", animation: "epFadeIn .5s ease both" }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.4rem", fontWeight: 700, lineHeight: 1 }}>
            Edit <span style={{ color: "#3d6b52" }}>Profile</span>
          </h1>
          <button onClick={() => navigate("/profile")} style={{ background: "none", border: "none", color: "#8a8078", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6, fontFamily: "'Outfit',sans-serif" }}>
            ← Back to Profile
          </button>
        </div>

        {/* Avatar strip */}
        <div style={{ background: "#fff", border: "1px solid #e2ddd5", borderRadius: 18, padding: "28px 32px", display: "flex", alignItems: "center", gap: 28, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,.06),0 4px 16px rgba(0,0,0,.05)" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(61,107,82,.08)", border: "2px solid #e2ddd5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "2rem", fontWeight: 700, color: "#3d6b52", flexShrink: 0 }}>
            {initials}
          </div>
          <div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.35rem", fontWeight: 600, marginBottom: 4 }}>{fields.name || "Your Name"}</h3>
            <p style={{ fontSize: "0.82rem", color: "#8a8078" }}>Changes are saved to your account</p>
          </div>
        </div>

        <form onSubmit={save} noValidate>
          {/* Personal */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #e2ddd5" }}>
              <div style={{ width: 36, height: 36, background: "rgba(61,107,82,.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>👤</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 600 }}>Personal Information</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {PERSONAL_FIELDS.map(([label, type, key, ph]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} type={type} placeholder={ph} value={fields[key]} onChange={set(key)} onFocus={focusInput} onBlur={blurInput} />
                </div>
              ))}

              <div>
                <label style={labelStyle}>Gender</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={fields.gender} onChange={set("gender")} onFocus={focusInput} onBlur={blurInput}>
                  {GENDER_OPTIONS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Blood Group</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} value={fields.bloodGroup} onChange={set("bloodGroup")} onFocus={focusInput} onBlur={blurInput}>
                  {BLOOD_GROUP_OPTIONS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
                </select>
              </div>

              <div style={{ gridColumn: "1/-1" }}>
                <label style={labelStyle}>Address</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} placeholder="Street, City, State, PIN" value={fields.address} onChange={set("address")} onFocus={focusInput} onBlur={blurInput} />
              </div>
            </div>
          </div>

          {/* Medical */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #e2ddd5" }}>
              <div style={{ width: 36, height: 36, background: "rgba(61,107,82,.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🩺</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 600 }}>Medical Information</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {MEDICAL_FIELDS.map(([label, key, ph]) => (
                <div key={key}>
                  <label style={labelStyle}>{label}</label>
                  <input style={inputStyle} type="text" placeholder={ph} value={fields[key]} onChange={set(key)} onFocus={focusInput} onBlur={blurInput} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Organ Donor Status</label>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#f9f7f3", border: "1px solid #e2ddd5", borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: "0.92rem" }}>Registered Organ Donor</div>
                    <div style={{ fontSize: "0.78rem", color: "#8a8078" }}>Your decision is private</div>
                  </div>
                  <div
                    style={{ position: "relative", width: 42, height: 24, flexShrink: 0, cursor: "pointer" }}
                    onClick={() => setFields((f) => ({ ...f, organDonor: !f.organDonor }))}
                  >
                    <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: fields.organDonor ? "#3d6b52" : "#e2ddd5", transition: "background .2s" }} />
                    <div style={{ position: "absolute", width: 18, height: 18, background: "white", borderRadius: "50%", top: 3, left: fields.organDonor ? 21 : 3, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: "1px solid #e2ddd5" }}>
              <div style={{ width: 36, height: 36, background: "rgba(61,107,82,.08)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📞</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 600 }}>Emergency Contacts</h2>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "#8a8078", background: "#f9f7f3", border: "1px solid #e2ddd5", borderRadius: 20, padding: "3px 10px" }}>
                {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ border: "1px solid #e2ddd5", borderRadius: 14, background: "#f9f7f3", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", gap: 12, borderBottom: "1px solid #e2ddd5", background: "rgba(255,255,255,.6)" }}>
                    <span style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(61,107,82,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 600, color: "#3d6b52", flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>Contact {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setContacts((cs) => cs.filter((_, j) => j !== i))}
                      style={{ marginLeft: "auto", background: "none", border: "none", color: "#8a8078", cursor: "pointer", padding: 4, borderRadius: 6, fontSize: "1rem" }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = "#c0392b"; e.currentTarget.style.background = "rgba(192,57,43,.09)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = "#8a8078"; e.currentTarget.style.background = "none"; }}
                    >
                      🗑
                    </button>
                  </div>
                  <div style={{ padding: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {CONTACT_FIELDS.map(([label, type, key, ph]) => (
                      <div key={key}>
                        <label style={labelStyle}>{label}</label>
                        <input
                          style={inputStyle}
                          type={type}
                          placeholder={ph}
                          value={c[key] || ""}
                          onChange={(e) => {
                            const nc = [...contacts];
                            nc[i] = { ...nc[i], [key]: e.target.value };
                            setContacts(nc);
                          }}
                          onFocus={focusInput}
                          onBlur={blurInput}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                if (contacts.length >= 5) return show("Max 5 contacts", "error");
                setContacts((c) => [...c, { name: "", relation: "", phone: "", email: "" }]);
              }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 13, border: "1.5px dashed #e2ddd5", borderRadius: 14, background: "none", color: "#8a8078", fontFamily: "'Outfit',sans-serif", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", transition: "all .2s", marginTop: 14 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#3d6b52"; e.currentTarget.style.color = "#3d6b52"; e.currentTarget.style.background = "rgba(61,107,82,.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2ddd5"; e.currentTarget.style.color = "#8a8078"; e.currentTarget.style.background = "none"; }}
            >
              + Add Emergency Contact
            </button>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => { if (window.confirm("Discard changes?")) load(); }}
              style={{ padding: "12px 28px", borderRadius: 12, border: "1px solid #e2ddd5", background: "transparent", color: "#8a8078", fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: "12px 28px", borderRadius: 12, border: "none", background: "#3d6b52", color: "white", fontFamily: "'Outfit',sans-serif", fontSize: "0.9rem", fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 2px 8px rgba(61,107,82,.3)", opacity: loading ? .7 : 1, display: "flex", alignItems: "center", gap: 8 }}
            >
              {loading ? "Saving…" : "💾 Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
