import express from "express";
import jwt from "jsonwebtoken";
import User, { USERNAME_REGEX } from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const USERNAME_ERROR_MESSAGE =
  "Username must be 3-30 characters: letters, numbers, and special characters (! @ # $ % ^ & * ( ) _ - + = .) are allowed, no spaces.";

// @route   POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required." });
    }
    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({ message: USERNAME_ERROR_MESSAGE });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "That username is already taken." });
    }

    const user = await User.create({ username, email, password, lastCheckIn: new Date() });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0]?.message || "Invalid registration data.";
      return res.status(400).json({ message: firstError });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || "field";
      return res.status(409).json({ message: `That ${field} is already taken.` });
    }
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
});

// @route   GET /api/auth/me
router.get("/me", protect, async (req, res) => {
  res.json({ user: req.user });
});

export default router;