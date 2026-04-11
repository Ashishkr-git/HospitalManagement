const jwt = require("jsonwebtoken");
const User = require("../Models/User");

// 1. Protect Routes (Verify Token)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Format: "Bearer <token>")
      token = req.headers.authorization.split(" ")[1];
      console.log("Raw token received by backend:", token);
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token ID & attach to request object
      // We exclude password for security
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401); // Unauthorized
      next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized, no token provided"));
  }
};

// 2. Role Authorization (Admin Only)
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403); // Forbidden
    next(new Error("Not authorized as an admin"));
  }
};

// 3. Doctor Authorization (Doctor Only)
const doctor = (req, res, next) => {
  if (req.user && (req.user.role === "doctor" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403);
    next(new Error("Not authorized as medical staff"));
  }
};

module.exports = { protect, admin, doctor };
