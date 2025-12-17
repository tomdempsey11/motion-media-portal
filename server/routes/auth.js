const express = require("express");
console.log("✅ auth routes loaded");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();
router.get("/ping", (req, res) => {
  res.json({ ok: true, message: "auth router reachable" });
});


// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, passwordHash });

    req.session.userId = user._id;

    return res.json({
      message: "User created",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    req.session.userId = user._id;

    return res.json({
      message: "Logged in",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("motionmedia.sid");
    res.json({ message: "Logged out" });
  });
});

console.log(
  "🧾 auth router routes:",
  router.stack
    .filter((l) => l.route)
    .map((l) => `${Object.keys(l.route.methods)[0].toUpperCase()} ${l.route.path}`)
);


module.exports = router;
