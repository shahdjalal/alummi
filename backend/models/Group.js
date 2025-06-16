const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  batchYear: {
    type: String,
    required: true, // مثال: "2023"
    unique: true    // دفعة واحدة فقط لكل سنة
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  pendingRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
