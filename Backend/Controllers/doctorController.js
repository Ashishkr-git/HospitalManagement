const User = require("../models/User");

// --- GET DOCTORS LIST ---
// Route: GET /api/doctors/list
// Description: Fetches all users with role "doctor" for the frontend dropdown
exports.getDoctorsList = async (req, res, next) => {
  try {
    // 1. Find users where role is "doctor"
    // 2. .select() -> Only return specific fields to make the request fast
    const doctors = await User.find({ role: "doctor" }).select(
      "name _id department"
    );

    res.json(doctors);
  } catch (error) {
    next(error);
  }
};
