import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : "Never";

const Home = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      const { data } = await api.get("/checkin/status");
      setStatus(data);
    } catch (err) {
      setError("Could not load your check-in status.");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError("");
    setMessage("");
    try {
      const { data } = await api.post("/checkin");
      setMessage(data.message);
      await fetchStatus();
    } catch (err) {
      setError(err.response?.data?.message || "Check-in failed. Please try again.");
    } finally {
      setCheckingIn(false);
    }
  };

  const hoursSince = status?.hoursSinceLastCheckIn ?? 0;
  const threshold = status?.thresholdHours ?? 36;
  const ratio = Math.min(hoursSince / threshold, 1);

  let statusLevel = "ok";
  if (ratio >= 1) statusLevel = "danger";
  else if (ratio >= 0.7) statusLevel = "warn";

  const statusCopy = {
    ok: { label: "You're all set", badgeClass: "badge-ok", dotClass: "dot-ok" },
    warn: { label: "Check-in window closing", badgeClass: "badge-warn", dotClass: "dot-warn" },
    danger: { label: "Contacts have been alerted", badgeClass: "badge-danger", dotClass: "dot-danger" },
  }[statusLevel];

  return (
    <div className="page" style={{ padding: "48px 24px" }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <h2>Hey{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""}.</h2>
        <p style={{ marginBottom: 32 }}>
          Tap the button below to let your emergency contacts know you're okay. If we don't hear
          from you for {threshold} hours, we'll email them automatically.
        </p>

        {error && <div className="error-banner">{error}</div>}
        {message && <div className="success-banner">{message}</div>}

        <div className="card" style={{ textAlign: "center", padding: "48px 32px" }}>
          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            aria-label="I'm alive - check in now"
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "none",
              background: "linear-gradient(160deg, #1E9E6B, #0E3B2E)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              cursor: checkingIn ? "not-allowed" : "pointer",
              boxShadow: "0 16px 40px rgba(14, 59, 46, 0.28)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
              opacity: checkingIn ? 0.7 : 1,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {checkingIn ? "Checking in..." : "I'm alive"}
          </button>

          <div style={{ marginTop: 32 }}>
            <span className={`badge ${statusCopy.badgeClass}`}>
              <span className={`dot ${statusCopy.dotClass}`} />
              {statusCopy.label}
            </span>
          </div>

          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left" }}>
            <div style={{ background: "var(--color-surface-alt)", borderRadius: "var(--radius-sm)", padding: "14px 18px" }}>
              <div className="hint">Last check-in</div>
              <div style={{ fontWeight: 600, color: "var(--color-primary-dark)" }}>
                {formatDate(status?.lastCheckIn)}
              </div>
            </div>
            <div style={{ background: "var(--color-surface-alt)", borderRadius: "var(--radius-sm)", padding: "14px 18px" }}>
              <div className="hint">Time since last check-in</div>
              <div style={{ fontWeight: 600, color: "var(--color-primary-dark)" }}>
                {status ? `${hoursSince} hours` : "—"}
              </div>
            </div>
          </div>

          <p className="hint" style={{ marginTop: 20 }}>
            Emergency contacts: {user?.emergencyContacts?.length || 0} / 5 &middot;{" "}
            <a href="/profile">manage contacts</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
