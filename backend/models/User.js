const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: { type: [String], default: [] },
  profileImage: { type: String, default: "" },
  jobTitle: { type: String, default: "" }, // ✅ أضفناها هون
  isVerified: { type: Boolean, default: false },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  role: { type: String, enum: ["user", "admin"], default: "user" },
   resetToken: { type: String },
  resetTokenExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
