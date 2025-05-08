const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashedPassword = await bcrypt.hash("Admin123", 10);

  const admin = new User({
    name: "Admin User",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin",
    isVerified: true
  });

  await admin.save();
  console.log("✅ Admin created successfully!");
  mongoose.disconnect();
}).catch(err => console.error("❌ DB error:", err));
