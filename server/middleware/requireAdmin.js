// server/middleware/requireAdmin.js
const User = require("../models/User");

module.exports = async function requireAdmin(req, res, next) {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.session.userId).select("role");
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
