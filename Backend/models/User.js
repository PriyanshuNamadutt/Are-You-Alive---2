import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const emergencyContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    relation: { type: String, trim: true },
  },
  { _id: true, timestamps: false }
);

// 3-30 characters: letters, numbers, and ! @ # $ % ^ & * ( ) _ - + = . — no spaces.
export const USERNAME_REGEX = /^[A-Za-z0-9!@#$%^&*()_\-+=.]{3,30}$/;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: (value) => USERNAME_REGEX.test(value),
        message:
          "Username must be 3-30 characters: letters, numbers, and special characters (! @ # $ % ^ & * ( ) _ - + = .) are allowed, no spaces.",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },

    // Profile details, filled in right after registration
    fullName: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true, default: "" },
    bloodGroup: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },

    detailsCompleted: { type: Boolean, default: false },

    emergencyContacts: {
      type: [emergencyContactSchema],
      validate: {
        validator: function (contacts) {
          return contacts.length <= 5;
        },
        message: "You can add a maximum of 5 emergency contacts.",
      },
      default: [],
    },

    // Check-in tracking
    lastCheckIn: { type: Date, default: Date.now },
    alertSent: { type: Boolean, default: false },
    alertSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;