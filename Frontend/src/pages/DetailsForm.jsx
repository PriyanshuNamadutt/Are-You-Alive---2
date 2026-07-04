import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import EmergencyContactsEditor from "../components/EmergencyContactsEditor";

const DetailsForm = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ""
  );
  const [address, setAddress] = useState(user?.address || "");
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || "");
  const [notes, setNotes] = useState(user?.notes || "");
  const [contacts, setContacts] = useState(
    user?.emergencyContacts?.length
      ? user.emergencyContacts
      : [{ name: "", email: "", phone: "", relation: "" }]
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validContacts = contacts.filter((c) => c.name.trim() && c.email.trim());
    if (validContacts.length === 0) {
      setError("Please add at least one emergency contact with a name and email.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put("/user/details", {
        fullName,
        phone,
        dateOfBirth: dateOfBirth || undefined,
        address,
        bloodGroup,
        notes,
        emergencyContacts: validContacts,
      });
      setUser(data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ padding: "40px 24px" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h2>Complete your profile</h2>
        <p style={{ marginBottom: 28 }}>
          Tell us a bit about yourself and who we should reach out to if you go quiet. You can
          always update this later from your profile.
        </p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: 24 }}>
            <h3>Your details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="field">
                <label>Full name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="field">
                <label>Phone number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" />
              </div>
              <div className="field">
                <label>Date of birth</label>
                <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
              <div className="field">
                <label>Blood group</label>
                <input type="text" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} placeholder="e.g. O+" />
              </div>
            </div>
            <div className="field">
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, city, country" />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, medical conditions, anything your contacts should know"
              />
            </div>
          </div>

          <div className="card" style={{ marginBottom: 28 }}>
            <EmergencyContactsEditor contacts={contacts} setContacts={setContacts} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
            {loading ? "Saving..." : "Save and continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DetailsForm;
