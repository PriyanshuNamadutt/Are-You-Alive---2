const About = () => {
  return (
    <div className="page" style={{ padding: "48px 24px" }}>
      <div className="container" style={{ maxWidth: 720 }}>
        <h2>About Are You Alive</h2>
        <p>
          Are You Alive is a simple safety check-in app. It's built for anyone who lives alone,
          travels often, or just wants peace of mind for the people who care about them.
        </p>

        <div className="card" style={{ marginTop: 24 }}>
          <h3>How it works</h3>
          <ol style={{ color: "var(--color-text-secondary)", lineHeight: 1.8, paddingLeft: 20 }}>
            <li>Create an account and add up to 5 emergency contacts.</li>
            <li>Tap the "I'm alive" button whenever you want to reset your clock.</li>
            <li>
              If 36 hours pass without a check-in, we automatically email every emergency contact
              you've added, once.
            </li>
            <li>
              As soon as you check in again, the alert clears and won't be sent again until
              another 36-hour window passes without activity.
            </li>
          </ol>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3>Why it exists</h3>
          <p style={{ marginBottom: 0 }}>
            Most safety apps are heavy, expensive, or require constant location tracking. Are You
            Alive does one thing well: it notices when you've gone quiet and lets the people who
            care about you know, without watching your every move.
          </p>
        </div>

        <div className="card" style={{ marginTop: 20 }}>
          <h3>Privacy</h3>
          <p style={{ marginBottom: 0 }}>
            We only store what's needed to run check-ins and contact your emergency contacts: your
            profile details, your contact list, and the timestamp of your last check-in. We never
            track your location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
