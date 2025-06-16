const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');
const User = require('../models/User');

// 🟢 إرسال رسالة داخل جروب
router.post('/:groupId/send', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    // تحقق إذا المستخدم عضو في الجروب
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    const newMessage = new GroupMessage({
      group: group._id,
      sender: req.user.id,
      text: req.body.text,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send group message', error: err.message });
  }
});

// 🟢 جلب جميع الرسائل داخل جروب
router.get('/:groupId/messages', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });

    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You are not a member of this group' });
    }

    const messages = await GroupMessage.find({ group: group._id })
      .sort({ createdAt: 1 })
      .populate('sender', 'name profileImage');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
});

module.exports = router;
