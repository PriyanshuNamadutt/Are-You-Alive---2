import cron from "node-cron";
import checkInactiveUsers from "./checkInactiveUsers.js";

const startCronJob = () => {
  const schedule = process.env.CRON_SCHEDULE || "*/15 * * * *";

  cron.schedule(schedule, async () => {
    try {
      const result = await checkInactiveUsers();
      if (result.checked > 0) {
        console.log(
          `[cron] Checked ${result.checked} inactive user(s), sent ${result.alerted} alert(s).`
        );
      }
    } catch (err) {
      console.error("[cron] Error while checking inactive users:", err.message);
    }
  });

  console.log(`Cron job scheduled with pattern: ${schedule}`);
};

export default startCronJob;
