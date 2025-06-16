// 📁 routes/groups.js
const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const GroupMessage = require("../models/GroupMessage");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");

// ✅ إنشاء جروب دفعة (Admins Only)
router.post("/create", auth, async (req, res) => {
  const { batchYear } = req.body;
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    let group = await Group.findOne({ batchYear });
    if (group) return res.status(400).json({ message: "Group already exists" });

    group = new Group({ batchYear });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ إرسال طلب انضمام لجروب دفعة
router.post("/request/:batchYear", auth, async (req, res) => {
  try {
    const group = await Group.findOne({ batchYear: req.params.batchYear });
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.members.includes(req.user.id) || group.pendingRequests.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member or pending" });
    }

    group.pendingRequests.push(req.user.id);
    await group.save();
    res.json({ message: "Join request sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ قبول طلب انضمام (Admins Only)
router.put("/approve/:groupId/:userId", auth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Admins only" });
    }

    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.pendingRequests = group.pendingRequests.filter(
      (id) => id.toString() !== req.params.userId
    );
    group.members.push(req.params.userId);
    await group.save();
    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ إرسال رسالة داخل الجروب
router.post("/:groupId/message", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const message = new GroupMessage({
      groupId: req.params.groupId,
      sender: req.user.id,
      text,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ جلب رسائل الجروب
router.get("/:groupId/messages", auth, async (req, res) => {
  try {
    const messages = await GroupMessage.find({ groupId: req.params.groupId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ جلب معلومات الجروب (للعرض في صفحة الجروب)
router.get("/:groupId", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId)
      .populate("members", "name profileImage")
      .populate("pendingRequests", "name profileImage");
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ جلب جميع الجروبات (للطالب أو الأدمن - تحتوي على الأسماء)
router.get("/", auth, async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("members", "name profileImage")
      .populate("pendingRequests", "name profileImage")
      .sort({ batchYear: -1 });

    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ حذف جروب (Admins Only)
router.delete("/:groupId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const group = await Group.findByIdAndDelete(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
