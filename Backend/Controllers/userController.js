const User = require("../Models/User");

// Helper to format "Last Active" (e.g., "2 hours ago")
const timeAgo = (date) => {
  if (!date) return "Never";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";

  return "Just now";
};

// --- GET ALL USERS ---
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });

    const formattedUsers = users.map((user) => {
      // Generate Initials (e.g., Sarah Johnson -> SJ)
      const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      return {
        id: user._id,
        initials: initials,
        name: user.name,
        email: user.email || "No email", // Handle missing email
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1), // capitalize
        status: user.status,
        lastActive: timeAgo(user.lastLogin),
        phone: user.phone,
        department: user.department || "-", // Added if you need it later
      };
    });

    res.json(formattedUsers);
  } catch (error) {
    next(error);
  }
};

// --- UPDATE USER ROLE ---
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { role: role.toLowerCase() }, // Convert "Admin" -> "admin"
      { new: true },
    );

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({ success: true, message: "Role updated" });
  } catch (error) {
    next(error);
  }
};
