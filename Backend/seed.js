const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Treatment = require("./models/Treatment"); // Import Treatment to wipe it
const Appointment = require("./models/Appointment"); // Import Appointment to wipe it
const connectDB = require("./Config/db"); // Ensure this matches your 'Config' folder case

dotenv.config();
connectDB();

const importData = async () => {
  try {
    console.log("⏳ Clearing Database...");

    // 1. Clear ALL existing data from all collections
    // This ensures a completely fresh start
    await User.deleteMany();
    await Treatment.deleteMany();
    await Appointment.deleteMany();

    console.log(
      "✅ Database Cleared (Users, Treatments, Appointments removed)."
    );

    // 2. Create the Master Admin
    await User.create({
      name: "Super Admin",
      phone: "9999999999",
      password: "admin456",
      role: "admin",
    });

    // 3. Create a Demo Doctor
    await User.create({
      name: "Dr. Sarah Wilson",
      phone: "9876543210",
      password: "doctor123",
      role: "doctor",
      department: "Endodontist",
    });

    console.log("✅ Fresh Data Imported (Admin & Doctor created)!");
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
