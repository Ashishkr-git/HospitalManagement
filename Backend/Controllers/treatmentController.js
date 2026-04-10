const Treatment = require("../models/Treatment");
const mongoose = require("mongoose");

// --- GET: Fetch Appointments for Dashboard ---
exports.getDashboardAppointments = async (req, res, next) => {
  try {
    const { role, userId } = req.query;

    console.log(`🔍 [GET /treatments] Request: Role=${role}, UserID=${userId}`);

    let query = {};

    if (role === "doctor" && userId) {
      try {
        const doctorObjectId = new mongoose.Types.ObjectId(userId);
        query = { "doctor.doctorId": doctorObjectId };
      } catch (err) {
        query = { "doctor.doctorId": userId };
      }
    }

    const treatments = await Treatment.find(query).sort({ updatedAt: -1 });

    const formattedData = treatments.map((t) => ({
      id: t._id,
      patient: t.patientName,
      patientId: t.patientPhone,
      age: t.age,
      phone: t.patientPhone,
      doctor: t.doctor?.name || "Unassigned",
      diagnosis: t.diagnosis,
      lastVisit: t.latestAppointmentDate
        ? new Date(t.latestAppointmentDate).toISOString().split("T")[0]
        : "-",
      status: t.treatmentStatus,
      treatmentHistory: t.treatmentHistory,
    }));

    res.json(formattedData);
  } catch (error) {
    next(error);
  }
};

// --- PUT: Update Roadmap & Auto-Update Status ---
exports.updateRoadmap = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { treatmentHistory } = req.body;

    const treatment = await Treatment.findById(id);

    if (!treatment) {
      res.status(404);
      throw new Error("Treatment record not found");
    }

    // 1. Update History
    treatment.treatmentHistory = treatmentHistory;

    // 2. Update Dates
    const latestDate = treatmentHistory.reduce((max, current) => {
      if (!current.date) return max;
      return current.date > max ? current.date : max;
    }, treatment.latestAppointmentDate);
    treatment.latestAppointmentDate = latestDate;

    // 3. AUTO-CALCULATE STATUS
    const allCompleted =
      treatmentHistory.length > 0 &&
      treatmentHistory.every((visit) => visit.status === "Completed");
    const anyInProgress = treatmentHistory.some(
      (visit) => visit.status === "Completed"
    );

    if (allCompleted) {
      treatment.treatmentStatus = "Completed";
    } else if (anyInProgress && treatment.treatmentStatus === "Pending") {
      treatment.treatmentStatus = "Ongoing";
    } else if (treatmentHistory.length === 0) {
      treatment.treatmentStatus = "Pending";
    }

    await treatment.save();

    res.json({
      success: true,
      message: "Roadmap updated successfully",
      data: treatment,
    });
  } catch (error) {
    next(error);
  }
};

// --- PATCH: Update Overall Status ---
exports.updateTreatmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const treatment = await Treatment.findByIdAndUpdate(
      id,
      { treatmentStatus: status },
      { new: true }
    );

    res.json({ success: true, data: treatment });
  } catch (error) {
    next(error);
  }
}; // <--- FIX: Added closing brace here to close updateTreatmentStatus

// --- GET: Track Treatment (Moved Outside) ---
exports.trackTreatment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Search by the custom string ID (e.g., "TRT-123456") NOT the _id
    const treatment = await Treatment.findOne({ treatmentId: id });

    if (!treatment) {
      res.status(404);
      throw new Error("Treatment ID not found.");
    }

    // Return only safe, public data
    const publicData = {
      treatmentId: treatment.treatmentId,
      patientName: treatment.patientName,
      doctorName: treatment.doctor?.name || "Unassigned", // Added safety check
      status: treatment.treatmentStatus,
      diagnosis: treatment.diagnosis,
      nextVisit: treatment.latestAppointmentDate,
      history: treatment.treatmentHistory.map((h) => ({
        visit: h.visitNumber,
        date: h.date,
        title: h.title,
        status: h.status,
      })),
    };

    res.json({ success: true, data: publicData });
  } catch (error) {
    next(error);
  }
};

exports.trackTreatment = async (req, res, next) => {
  try {
    const { id } = req.params;

    let treatment;

    // 1. Logic to handle "INV-" format
    if (id.startsWith("INV-")) {
      const shortCode = id.split("-")[1];

      const treatments = await Treatment.aggregate([
        {
          $addFields: {
            tempIdString: { $toString: "$_id" },
          },
        },
        {
          $match: {
            tempIdString: { $regex: `${shortCode}$`, $options: "i" },
          },
        },
      ]);

      treatment = treatments[0];
    } else {
      treatment = await Treatment.findById(id).populate("doctor", "name");
    }

    if (!treatment) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const publicData = {
      treatmentId: `INV-${treatment._id.toString().slice(-4).toUpperCase()}`, // Re-generate the INV format
      patientName: treatment.patientName,
      doctorName: treatment.doctor?.name || "Dr. Staff", // Handle population safely
      status: treatment.treatmentStatus,
      diagnosis: treatment.diagnosis,
      nextVisit: treatment.latestAppointmentDate,
      history: treatment.treatmentHistory || [],
    };

    res.json({ success: true, data: publicData });
  } catch (error) {
    console.error("Tracking Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
