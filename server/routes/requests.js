// server/routes/requests.js
const express = require("express");
const Request = require("../models/Request");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

// POST /api/requests  (create)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, details, serviceType, dueDate } = req.body;

    if (!title || !details) {
      return res.status(400).json({ message: "Title and details are required" });
    }

    const created = await Request.create({
      userId: req.session.userId,
      title,
      details,
      serviceType: serviceType || "",
      dueDate: dueDate || null,
    });

    return res.status(201).json({ request: created });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/requests  (list mine)
router.get("/", requireAuth, async (req, res) => {
  try {
    const requests = await Request.find({ userId: req.session.userId }).sort({
      createdAt: -1,
    });

    return res.json({ requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/requests/:id  (details, owner-only)
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const request = await Request.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.json({ request });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid request id" });
  }
});

module.exports = router;
