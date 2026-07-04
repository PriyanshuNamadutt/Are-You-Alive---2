const MAX_CONTACTS = 5;

const emptyContact = () => ({ name: "", email: "", phone: "", relation: "" });

const EmergencyContactsEditor = ({ contacts, setContacts }) => {
  const updateContact = (index, field, value) => {
    const next = [...contacts];
    next[index] = { ...next[index], [field]: value };
    setContacts(next);
  };

  const addContact = () => {
    if (contacts.length >= MAX_CONTACTS) return;
    setContacts([...contacts, emptyContact()]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ marginBottom: 4 }}>Emergency contacts</h3>
        <span className="hint">{contacts.length} / {MAX_CONTACTS}</span>
      </div>
      <p className="hint" style={{ marginTop: 0, marginBottom: 16 }}>
        These people get emailed automatically if you don't check in for 36 hours.
      </p>

      {contacts.map((contact, index) => (
        <div
          key={index}
          className="card"
          style={{
            padding: 20,
            marginBottom: 14,
            background: "var(--color-surface-alt)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <strong style={{ color: "var(--color-primary-dark)", fontSize: 14 }}>
              Contact {index + 1}
            </strong>
            <button
              type="button"
              onClick={() => removeContact(index)}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-danger)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Remove
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Full name *</label>
              <input
                type="text"
                value={contact.name}
                onChange={(e) => updateContact(index, "name", e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Email *</label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => updateContact(index, "email", e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Phone</label>
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateContact(index, "phone", e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Relationship</label>
              <input
                type="text"
                value={contact.relation}
                onChange={(e) => updateContact(index, "relation", e.target.value)}
                placeholder="Sister, friend, colleague..."
              />
            </div>
          </div>
        </div>
      ))}

      {contacts.length < MAX_CONTACTS && (
        <button type="button" onClick={addContact} className="btn btn-outline" style={{ width: "100%" }}>
          + Add emergency contact
        </button>
      )}
    </div>
  );
};

export default EmergencyContactsEditor;
