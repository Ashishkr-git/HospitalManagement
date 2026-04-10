const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db"); // Your DB connection
const apiRoutes = require("./Routes/api"); // Your unified routes
const errorHandler = require("./middleware/errorHandlers"); // Your error handler
const helmet = require("helmet");
// 1. Load Environment Variables
dotenv.config();

// 2. Connect to Database
// (This handles the MongoDB connection logic defined in config/db.js)
connectDB();

// 3. Initialize Express App
const app = express();
app.use(helmet());

// 4. Middlewares
// CORS: Allows your React Frontend to talk to this Backend
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true, // Allows cookies/headers if needed
  })
);

// Body Parser: Allows backend to read JSON data from req.body
app.use(express.json());

// 5. Mount Routes
// All your API routes will be prefixed with /api
// Example: http://localhost:5000/api/auth/login
app.use("/api", apiRoutes);

// Health Check Route (To test if server is on)
app.get("/", (req, res) => {
  res.send("✅ Dental Clinic API is running...");
});

// 6. Error Handling
// Catch 404 (Route Not Found) - If user types a wrong URL
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global Error Handler (Must be the last middleware)
app.use(errorHandler);

// 7. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});
