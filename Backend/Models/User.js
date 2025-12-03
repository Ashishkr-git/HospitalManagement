const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    // Primary ID for your system
    phone: { type: String, required: true, unique: false },

    // New Field for the Table

    // Password is now optional in schema, but required by controller logic for staff
    password: { type: String, required: false, default: null },
    age: { type: Number, default: null },

    // Role handling
    role: {
      type: String,
      enum: ["admin", "doctor", "patient", "editor", "viewer"],
      default: "patient",
    },

    department: { type: String, required: false, default: null },

    // --- NEW FIELDS FOR ADMIN TABLE ---
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    lastTreatmentUpdate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// --- FIX: Removed 'next' argument and next() calls to use the Promise-based async hook ---
userSchema.pre("save", async function () {
  // We only proceed if the password is provided and modified
  if (!this.isModified("password") || !this.password) {
    return; // Just return for Promise-style hook
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Mongoose will implicitly proceed when this async function resolves
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
