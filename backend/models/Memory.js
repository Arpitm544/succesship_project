const mongoose = require("mongoose");
const SimpleMemorySchema = new mongoose.Schema({
  entity: {
    type: String,
    required: true,
  },
  entityType: {
    type: String,
    enum: ["supplier", "customer", "internal"], // ✅ only these allowed
    default: "supplier",
  },
  memoryType: {
    type: String,
    enum: ["interaction", "quality_issue", "payment", "contract", "escalation"],
    default: "interaction",
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  importance: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5,
  },
  tags: {
    type: [String],
    default: [],
  },
});

const Memory = mongoose.model("Memory", SimpleMemorySchema);
module.exports = Memory;