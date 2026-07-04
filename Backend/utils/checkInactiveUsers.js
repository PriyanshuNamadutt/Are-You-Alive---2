import User from "../models/User.js";
import sendEmail from "./sendEmail.js";

const THRESHOLD_HOURS = Number(process.env.CHECKIN_THRESHOLD_HOURS) || 36;

const buildAlertEmail = (user) => {
  const lastSeen = new Date(user.lastCheckIn).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `Check-in alert: ${user.fullName || user.email} has not checked in`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border: 1px solid #d9e5df; border-radius: 12px;">
      <h2 style="color: #0E3B2E; margin-bottom: 4px;">Are You Alive</h2>
      <p style="color: #22A06B; font-weight: bold; margin-top: 0;">Check-in alert</p>
      <p>Hello,</p>
      <p>
        You are listed as an emergency contact for <strong>${user.fullName || user.email}</strong>.
        They have not confirmed they are okay in over ${THRESHOLD_HOURS} hours.
      </p>
      <p><strong>Last confirmed check-in:</strong> ${lastSeen}</p>
      <p>
        Please try reaching out to them directly. This is an automated message sent because
        their scheduled check-in window has passed.
      </p>
      <p style="color: #5C7A6E; font-size: 12px; margin-top: 32px;">
        This alert will not be sent again until ${user.fullName || "the user"} checks in again on the app.
      </p>
    </div>
  `;

  const text = `Are You Alive - Check-in alert\n\nYou are listed as an emergency contact for ${
    user.fullName || user.email
  }. They have not confirmed they are okay in over ${THRESHOLD_HOURS} hours.\nLast confirmed check-in: ${lastSeen}\n\nPlease try reaching out to them directly.`;

  return { subject, html, text };
};

/**
 * Finds every user whose lastCheckIn is older than the threshold and who
 * has not already been alerted (alertSent === false), emails all of their
 * emergency contacts once, then marks alertSent = true so we never spam.
 * alertSent is reset back to false whenever the user checks in again.
 */
const checkInactiveUsers = async () => {
  const thresholdDate = new Date(Date.now() - THRESHOLD_HOURS * 60 * 60 * 1000);

  const inactiveUsers = await User.find({
    lastCheckIn: { $lt: thresholdDate },
    alertSent: false,
    detailsCompleted: true,
    "emergencyContacts.0": { $exists: true },
  });

  if (inactiveUsers.length === 0) {
    return { checked: 0, alerted: 0 };
  }

  let alertedCount = 0;

  for (const user of inactiveUsers) {
    const recipients = user.emergencyContacts.map((c) => c.email).filter(Boolean);
    if (recipients.length === 0) continue;

    const { subject, html, text } = buildAlertEmail(user);

    try {
      await sendEmail({ to: recipients, subject, html, text });

      user.alertSent = true;
      user.alertSentAt = new Date();
      await user.save();

      alertedCount += 1;
      console.log(`Alert sent for user ${user.email} to ${recipients.length} contact(s).`);
    } catch (err) {
      // If email fails, we deliberately do NOT set alertSent, so it will retry next cron run.
      console.error(`Failed to send alert email for user ${user.email}:`, err.message);
    }
  }

  return { checked: inactiveUsers.length, alerted: alertedCount };
};

export default checkInactiveUsers;
