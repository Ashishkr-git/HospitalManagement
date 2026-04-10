const express = require("express");
const router = express.Router();

// FIX: Assuming 'middleware' and 'controllers' folders are capitalized if 'Config' and 'Routes' are.
const { protect, doctor, admin } = require("../middleware/authMiddleware");

const { loginUser, registerStaff } = require("../Controllers/authController");
const { getDoctorsList } = require("../Controllers/doctorController");
const {
  getDashboardAppointments,
  updateRoadmap,
  updateTreatmentStatus,
  trackTreatment,
} = require("../Controllers/treatmentController");
const { createAppointment } = require("../Controllers/appointmentController");
const {
  getAllUsers,
  updateUserRole,
} = require("../Controllers/userController");

// 3. Check for Import Errors (Debugging)
if (!loginUser)
  console.error("❌ ERROR: loginUser is undefined. Check authController.js");
if (!createAppointment)
  console.error(
    "❌ ERROR: createAppointment is undefined. Check appointmentController.js"
  );

// 4. Define Routes
// Public
router.post("/auth/login", loginUser);
router.post("/appointments", createAppointment);
router.get("/treatments/track/:id", trackTreatment);

// Protected
router.get("/doctors/list", protect, getDoctorsList);
router.get("/treatments", protect, doctor, getDashboardAppointments);
router.put("/treatments/:id/roadmap", protect, doctor, updateRoadmap);
router.patch("/treatments/:id/status", protect, doctor, updateTreatmentStatus);
router.post("/auth/register-staff", protect, admin, registerStaff);
router.get("/users", protect, admin, getAllUsers); // Only Admins see this table
router.patch("/users/:id/role", protect, admin, updateUserRole);

module.exports = router;
