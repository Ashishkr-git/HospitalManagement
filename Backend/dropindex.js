const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");

dotenv.config();
connectDB();

const dropIndex = async () => {
  try {
    console.log("⏳ Connecting to database...");

    // Access the native MongoDB driver
    const db = mongoose.connection;

    // Wait for connection to open
    db.once("open", async () => {
      console.log("✅ Connected. Attempting to drop index...");

      try {
        // Drop the specific index on the 'treatments' collection
        await db.collection("treatments").dropIndex("patientPhone_1");
        console.log("🎉 Success! Index 'patientPhone_1' dropped.");
      } catch (err) {
        if (err.code === 27) {
          console.log("ℹ️ Index not found (It might be already deleted).");
        } else {
          console.error("❌ Error dropping index:", err.message);
        }
      }
      process.exit();
    });
  } catch (error) {
    console.error(`❌ Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
dropIndex();
