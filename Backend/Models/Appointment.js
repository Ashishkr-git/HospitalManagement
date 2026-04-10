const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    appointmentDate: {
      type: Date,
      required: true,
    },

    patientName: { type: String, required: true, trim: true },
    patientPhone: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    diagnosis: { type: String, required: true, trim: true },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["Ongoing", "Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
