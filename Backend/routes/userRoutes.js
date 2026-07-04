import express from "express";
import protect from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();
router.use(protect);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const sanitizeContacts = (contacts = []) => {
  if (!Array.isArray(contacts)) return { error: "emergencyContacts must be an array." };
  if (contacts.length > 5) return { error: "You can add a maximum of 5 emergency contacts." };

  const cleaned = [];
  for (const c of contacts) {
    if (!c.name || !c.email) {
      return { error: "Each emergency contact needs at least a name and an email." };
    }
    if (!isValidEmail(c.email)) {
      return { error: `"${c.email}" is not a valid email address.` };
    }
    cleaned.push({
      name: c.name.trim(),
      email: c.email.trim().toLowerCase(),
      phone: c.phone ? c.phone.trim() : "",
      relation: c.relation ? c.relation.trim() : "",
    });
  }
  return { cleaned };
};

// @route   GET /api/user/profile
router.get("/profile", async (req, res) => {
  res.json({ user: req.user });
});

// @route   PUT /api/user/details
// Used right after registration (and any time later) to fill/update
// personal details AND emergency contacts (max 5) in a single request.
router.put("/details", async (req, res) => {
  try {
    const {
      fullName,
      phone,
      dateOfBirth,
      address,
      bloodGroup,
      notes,
      emergencyContacts,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found." });

    if (fullName !== undefined) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (address !== undefined) user.address = address;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (notes !== undefined) user.notes = notes;

    if (emergencyContacts !== undefined) {
      const { error, cleaned } = sanitizeContacts(emergencyContacts);
      if (error) return res.status(400).json({ message: error });
      user.emergencyContacts = cleaned;
    }

    user.detailsCompleted = true;

    await user.save();

    res.json({ message: "Details saved.", user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Failed to save details.", error: err.message });
  }
});

// @route   GET /api/user/contacts
router.get("/contacts", async (req, res) => {
  res.json({ emergencyContacts: req.user.emergencyContacts });
});

// @route   PUT /api/user/contacts
// Bulk replace all emergency contacts (max 5). Simplest, safest way for a
// dynamic add/remove form on the frontend to save state.
router.put("/contacts", async (req, res) => {
  try {
    const { emergencyContacts } = req.body;
    const { error, cleaned } = sanitizeContacts(emergencyContacts);
    if (error) return res.status(400).json({ message: error });

    const user = await User.findById(req.user._id);
    user.emergencyContacts = cleaned;
    await user.save();

    res.json({ message: "Emergency contacts updated.", emergencyContacts: user.emergencyContacts });
  } catch (err) {
    res.status(500).json({ message: "Failed to update contacts.", error: err.message });
  }
});

export default router;
