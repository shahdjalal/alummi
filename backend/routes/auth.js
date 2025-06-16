const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const sendEmail = require("../config/email");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();


// 📝 تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long, contain one uppercase letter and one number",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const confirmUrl = `http://localhost:8000/api/auth/verify/${token}`;
    await sendEmail(email, "Confirm Your Email", `Click here to verify your email: ${confirmUrl}`);

    res.status(201).json({ message: "User registered! Please check your email for verification." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 تأكيد البريد الإلكتروني
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    await user.save();

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// 🔑 تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Invalid email or not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🌟 رفع صورة بروفايل
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/upload-profile-image", authMiddleware, upload.single("profileImage"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profileImage = `http://localhost:8000/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: "Profile image uploaded successfully", profileImage: user.profileImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🏠 جلب وتحديث بيانات بروفايلك
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const postsCount = await Post.countDocuments({ user: req.user.id });
    res.json({ user, postsCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, profileImage, skills, jobTitle } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.profileImage = profileImage || user.profileImage;
    user.skills = skills || user.skills;
    user.jobTitle = jobTitle || user.jobTitle;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔍 اقتراحات متابعة
router.get('/suggestions', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const excludedUsers = [...user.following, userId];
    const suggestions = await User.find({ _id: { $nin: excludedUsers } }).limit(10);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const crypto = require("crypto");

// 🔹 Forgot Password: send reset link to email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

    await sendEmail(
      email,
      "Reset Your Password",
      `Click this link to reset your password: ${resetUrl}`
    );

    res.json({ message: "Reset email sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Reset Password: set new password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
