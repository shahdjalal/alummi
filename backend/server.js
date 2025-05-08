const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




