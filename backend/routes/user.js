const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

// 👤 متابعة مستخدم
router.put("/follow/:id", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    if (!currentUser.following.includes(targetUser._id)) {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
      await currentUser.save();
      await targetUser.save();
      res.json({ message: "Followed successfully" });
    } else {
      res.status(400).json({ message: "Already following this user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while following the user." });
  }
});

// 🚫 إلغاء متابعة مستخدم
router.put("/unfollow/:id", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await targetUser.save();
    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong while unfollowing the user." });
  }
});

// 👥 جلب متابعين مستخدم
router.get("/:id/followers", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers", "name email profileImage");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.followers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch followers." });
  }
});

// 👥 جلب قائمة من يتابعهم المستخدم
router.get("/:id/following", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("following", "name email profileImage");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch following list." });
  }
});

// 🔍 Search users by name or email
router.get("/search", authMiddleware, async (req, res) => {
  const { q } = req.query;

  try {
    // نبحث بالاسم أو الإيميل (case-insensitive)
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    }).select("name email profileImage");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});

// 👤 جلب بروفايل مستخدم معين
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile." });
  }
});

// 👤 جلب بروفايل مستخدم معين + منشوراته
// 👤 جلب بروفايل مستخدم معين ومنشوراته
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.userId).select("-password");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = targetUser.followers.includes(req.user.id); // ✅ هل المستخدم الحالي متابع؟

    const userPosts = await Post.find({ user: req.params.userId })
      .populate("user", "name profileImage")
      .populate("comments.user", "name profileImage");

    res.json({ user: targetUser, posts: userPosts, isFollowing }); // ✅ رجعنا isFollowing + posts
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});






module.exports = router;
