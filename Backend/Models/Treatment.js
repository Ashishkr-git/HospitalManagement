const mongoose = require("mongoose");

// --- 1. Visit Schema (Subdocument) ---
const visitSchema = new mongoose.Schema(
  {
    visitNumber: { type: Number, required: true },
    date: { type: Date, default: null },
    title: { type: String, required: true },
    description: { type: String },

    cost: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Insurance", "Net Banking", "Other"],
      default: "Cash",
    },

    status: {
      type: String,
      enum: ["Ongoing", "Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { _id: false }
);

// --- 2. Middleware Function ---
const updatePatientRecord = async function (treatmentDoc) {
  if (!treatmentDoc) return;

  try {
    const User = mongoose.model("User");

    // Perform the update on the User collection
    await User.updateOne(
      { phone: treatmentDoc.patientPhone },
      {
        $set: {
          name: treatmentDoc.patientName,
          age: treatmentDoc.age,
          lastTreatmentUpdate: new Date(),
        },
      }
    );
    console.log(
      `🔄 Synced User record for patient: ${treatmentDoc.patientName}`
    );
  } catch (error) {
    console.error("Error updating User record after Treatment change:", error);
  }
};

// --- 3. Main Treatment Schema ---
const treatmentSchema = new mongoose.Schema(
  {
    treatmentId: { type: String, required: true },

    // FIX: Removed 'unique: true' to allow multiple roadmaps for the same patient
    patientPhone: { type: String, required: true },

    patientName: { type: String, required: true },
    age: { type: Number, required: true },

    diagnosis: { type: String, required: true },

    doctor: {
      doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: { type: String },
      department: { type: String },
    },

    treatmentStatus: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed", "Cancelled"],
      default: "Pending",
    },

    latestAppointmentDate: { type: Date },

    treatmentHistory: [visitSchema],
  },
  { timestamps: true }
);

// --- 4. Attach Middleware Hooks ---
treatmentSchema.post("save", updatePatientRecord);
treatmentSchema.post("findOneAndUpdate", updatePatientRecord);

module.exports = mongoose.model("Treatment", treatmentSchema);
