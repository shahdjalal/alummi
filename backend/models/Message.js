const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  file: {
    type: String,
  },  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: { type: Boolean, default: false }

});

module.exports = mongoose.model("Message", messageSchema);
