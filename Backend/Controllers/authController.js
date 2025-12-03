const User = require("../Models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Use this exact syntax
const loginUser = async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      res.status(404);
      throw new Error("User not found.");
    }

    if (["admin", "doctor"].includes(user.role)) {
      if (!password) {
        res.status(400);
        throw new Error("Password is required.");
      }
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        res.status(401);
        throw new Error("Invalid Credentials.");
      }
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        phone: user.phone,
        department: user.department,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

const registerStaff = async (req, res, next) => {
  try {
    const { name, phone, password, role, department } = req.body;
    const userExists = await User.findOne({ phone });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({
      name,
      phone,
      password,
      role: role || "doctor",
      department,
    });
    res.status(201).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerStaff,
};
