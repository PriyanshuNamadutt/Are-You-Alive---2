const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Parses "Name <email@example.com>" or a plain "email@example.com" string
 * into Brevo's { name, email } sender/recipient shape.
 */
const parseAddress = (raw) => {
  const match = raw.match(/^(.*)<(.+)>$/);
  if (match) {
    return { name: match[1].trim().replace(/^"|"$/g, ""), email: match[2].trim() };
  }
  return { email: raw.trim() };
};

const toRecipientList = (to) => {
  const list = Array.isArray(to) ? to : [to];
  return list.map((email) => ({ email }));
};

/**
 * Sends an email via Brevo's transactional email API.
 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {string} [options.text]
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set.");
  }

  const sender = parseAddress(process.env.EMAIL_FROM || "Are You Alive <no-reply@example.com>");

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender,
      to: toRecipientList(to),
      subject,
      htmlContent: html,
      textContent: text,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }

  return response.json();
};

export default sendEmail;
