const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 دقيقة
  max: 5, // 5 محاولات فقط في الدقيقة
  message: "Too many login attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

//  فقط على راوت تسجيل الدخول
app.use("/api/auth/login", loginLimiter);

// استيراد المسارات
app.use("/api/auth", require("./routes/auth"));
const userRoutes = require("./routes/user");
app.use("/api/users", userRoutes);

const postRoutes = require("./routes/posts");
app.use("/api/posts", postRoutes);

const jobRoutes = require("./routes/jobs");
app.use("/api/jobs", jobRoutes);

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const messageRoutes = require("./routes/messages");
app.use("/api/messages", messageRoutes);


const groupMessagesRoutes = require('./routes/groupMessages');
app.use('/api/group-messages', groupMessagesRoutes);

const groupRoutes = require('./routes/groups');
app.use("/api/groups", groupRoutes);




const eventRoutes = require("./routes/eventRoutes");
app.use("/api/events", eventRoutes);


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
