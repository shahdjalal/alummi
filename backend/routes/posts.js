const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const multer = require("multer");
const path = require("path");

// 🔹 إعداد تخزين الملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


// 🟢 عرض جميع المنشورات
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name profileImage")
      .populate("comments.user", "name profileImage");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ إنشاء منشور جديد مع دعم رفع صورة
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { text } = req.body;
    const imageUrl = req.file ? `http://localhost:8000/uploads/${req.file.filename}` : "";

    const newPost = new Post({
      user: req.user.id,
      text,
      image: imageUrl,
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id).populate("user", "name profileImage");

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔥 لايك أو إزالة لايك
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
      await post.save();
      return res.json({ message: "Post unliked", post });
    }

    post.likes.push(userId);
    await post.save();
    res.json({ message: "Post liked", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 💬 إضافة تعليق
router.post("/comment/:id", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = {
      user: req.user.id,
      text,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    const userPosts = await Post.find({ user: req.params.userId })
    .populate("user", "name profileImage")   // ✅ هذا للسحب من User لكل بوست
    .populate("comments.user", "name profileImage");  // ✅ هذا للتعليقات
  
    res.json({ message: "Comment added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✏️ تعديل منشور مع دعم رفع صورة جديدة
router.put("/edit/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.text = req.body.text || post.text;

    if (req.file) {
      post.image = `http://localhost:8000/uploads/${req.file.filename}`;
    }

    await post.save();

    res.json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🗑️ حذف منشور
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
