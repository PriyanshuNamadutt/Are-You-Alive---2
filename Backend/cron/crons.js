const cron = require("node-cron");
const { checkInactiveUsers } = require("../services/inactive");

cron.schedule("0 * * * *", () => {
  console.log("⏰ Running cron...");
  checkInactiveUsers();
});