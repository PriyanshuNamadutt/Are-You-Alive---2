import express from "express";
import protect from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();
router.use(protect);

const THRESHOLD_HOURS = Number(process.env.CHECKIN_THRESHOLD_HOURS) || 36;

// @route   POST /api/checkin
// This is the "I'm alive" button. Resets the clock and clears any alert
// flag so the next missed-window alert can fire again in the future.
router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.lastCheckIn = new Date();
    user.alertSent = false;
    user.alertSentAt = null;
    await user.save();

    res.json({
      message: "Check-in recorded. Glad you're okay!",
      lastCheckIn: user.lastCheckIn,
    });
  } catch (err) {
    res.status(500).json({ message: "Check-in failed.", error: err.message });
  }
});

// @route   GET /api/checkin/status
router.get("/status", async (req, res) => {
  const user = req.user;
  const hoursSince = (Date.now() - new Date(user.lastCheckIn).getTime()) / (1000 * 60 * 60);

  res.json({
    lastCheckIn: user.lastCheckIn,
    hoursSinceLastCheckIn: Math.round(hoursSince * 10) / 10,
    thresholdHours: THRESHOLD_HOURS,
    alertSent: user.alertSent,
    alertSentAt: user.alertSentAt,
  });
});

export default router;
