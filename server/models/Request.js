// server/models/Request.js
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    details: { type: String, required: true, trim: true, maxlength: 4000 },
    serviceType: { type: String, trim: true, default: "" },
    dueDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
