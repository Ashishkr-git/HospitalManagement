const mongoose = require("mongoose");
const Appointment = require("../Models/Appointment");
const Treatment = require("../Models/Treatment");
const User = require("../Models/User");

// FIX: Transactions REMOVED to prevent "Transaction numbers only allowed on replica set" error.
exports.createAppointment = async (req, res, next) => {
  try {
    const { patient, phone, age, date, doctor, diagnosis } = req.body;

    // 1. Fetch Doctor Details
    const doctorRecord = await User.findById(doctor);
    if (!doctorRecord) {
      res.status(404);
      throw new Error("Selected doctor does not exist.");
    }

    // 2. Create Appointment
    // This is the simple appointment log
    const newAppointment = await Appointment.create({
      appointmentDate: new Date(date),
      patientName: patient,
      patientPhone: phone,
      age: Number(age),
      diagnosis: diagnosis,
      doctorId: doctorRecord._id,
      status: "Scheduled", // Capitalized to match Schema
    });

    // 3. Sync User (Patient Profile)
    // We update the existing patient or create a new one if they don't exist
    let user = await User.findOne({ phone: phone });

    if (!user) {
      await User.create({
        name: patient,
        phone: phone,
        age: Number(age),
        role: "patient",
        lastTreatmentUpdate: new Date(),
      });
    } else {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            name: patient,
            age: Number(age),
            lastTreatmentUpdate: new Date(),
          },
        },
      );
    }

    // 4. Create SEPARATE Treatment Roadmap
    // FIX: Always create a NEW Treatment record for every appointment.
    // We removed the logic that searched for existing treatments to append to.

    const newVisitEntry = {
      visitNumber: 1,
      date: new Date(date),
      title: diagnosis,
      description: "Initial appointment booking.",
      cost: 0,
      paidAmount: 0,
      paymentMethod: "Cash",
      status: "Scheduled", // Capitalized to match Schema
    };

    await Treatment.create({
      treatmentId: `TRT-${Date.now().toString().slice(-6)}`,
      patientName: patient,
      patientPhone: phone, // This phone is no longer unique in the Treatment schema
      age: Number(age),
      doctor: {
        doctorId: doctorRecord._id,
        name: doctorRecord.name,
        department: doctorRecord.department || "General Dentist",
      },
      diagnosis: diagnosis,
      treatmentStatus: "Pending",
      latestAppointmentDate: new Date(date),
      treatmentHistory: [newVisitEntry],
    });

    res.status(201).json({
      success: true,
      message: "Appointment booked and new roadmap created.",
      data: newAppointment,
    });
  } catch (error) {
    // Pass error to global handler
    next(error);
  }
};
