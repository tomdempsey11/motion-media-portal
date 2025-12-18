// server/routes/admin.js
const express = require("express");
const Request = require("../models/Request");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

// Admin: get ALL requests
router.get("/requests", requireAdmin, async (req, res) => {
  try {
    const requests = await Request.find({})
      .sort({ createdAt: -1 })
      .select("_id userId title serviceType dueDate status details createdAt")
      // ✅ ADD THIS
      .populate("userId", "name email firstName lastName");

    return res.json({ requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Admin: get ONE request
router.get("/requests/:id", requireAdmin, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .select("_id userId title serviceType dueDate status details createdAt")
      // ✅ ADD THIS
      .populate("userId", "name email firstName lastName");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.json({ request });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid request id" });
  }
});

// Admin: update request status
router.patch("/requests/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["Pending", "In Progress", "Delivered"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    return res.json({ request: updated });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Invalid request id" });
  }
});

module.exports = router;
