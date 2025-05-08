const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");


const User = require("../models/User");

const mongoose = require("mongoose");
// 🟢 إعداد التخزين
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // تأكد إن مجلد uploads موجود
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ إرسال رسالة (نص + صورة اختيارية)
router.post("/send", auth, upload.single("file"), async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const fileUrl = req.file ? `http://localhost:8000/uploads/${req.file.filename}` : null;

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
      file: fileUrl,
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// جلب كل المحادثات

router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // الحصول على كل المحادثات التي تخص المستخدم (إما مرسل أو مستقبل)
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    // استخراج آخر رسالة لكل محادثة مع كل مستخدم مختلف
    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, msg);
      }
    }

    // تجهيز البيانات وإحضار معلومات المستخدمين
    const result = [];
    for (let [otherUserId, lastMessage] of conversationsMap) {
      const sender = await User.findById(lastMessage.sender).select("name profileImage");
      const receiver = await User.findById(lastMessage.receiver).select("name profileImage");
      result.push({ lastMessage, sender, receiver });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 جلب المحادثة مع مستخدم معين
router.get("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ createdAt: 1 });
    await Message.updateMany(
      { sender: userId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});








module.exports = router;
