const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const Application = require("../models/Application");


const multer = require('multer');
const path = require('path');

// إعداد التخزين للـ CV
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs/'); // تأكدي إن المجلد موجود
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// ➕ إضافة وظيفة (Admins only)
router.post("/add", auth, isAdmin, async (req, res) => {
  try {
    const { title, description, company, location, applyLink } = req.body;

    const job = new Job({
      title,
      description,
      company,
      location,
      applyLink,
      postedBy: req.user._id,
    });

    await job.save();
    res.status(201).json({ message: "Job added successfully", job });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 👨‍💼 عرض كل المتقدمين لوظيفة معينة (Admins only)
router.get("/applications/:jobId", auth, isAdmin, async (req, res) => {
    try {
      const jobId = req.params.jobId;
  
      const applications = await Application.find({ job: jobId })
        .populate("applicant", "email") // نعرض إيميل المتقدم
        .sort({ appliedAt: -1 });
  
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 👀 عرض وظيفة واحدة بناءً على ID
router.get("/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


  // 🗑️ حذف وظيفة (Admins only)
router.delete("/delete/:jobId", auth, isAdmin, async (req, res) => {
    try {
      const job = await Job.findByIdAndDelete(req.params.jobId);
  
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ✏️ تعديل وظيفة (Admins only)
router.put("/edit/:jobId", auth, isAdmin, async (req, res) => {
    try {
      const { title, description, company, location, applyLink } = req.body;
  
      const job = await Job.findByIdAndUpdate(
        req.params.jobId,
        { title, description, company, location, applyLink },
        { new: true }
      );
  
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
  
      res.json({ message: "Job updated successfully", job });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

// 👀 عرض كل الوظائف
router.get("/", async (req, res) => {
    try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // 📨 تقديم على وظيفة
  router.post("/apply/:jobId", auth, upload.single('cv'), async (req, res) => {
    try {
      const { phone, message } = req.body;
      const jobId = req.params.jobId;
      const user = req.user;
  
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }
  
      const alreadyApplied = await Application.findOne({ job: jobId, applicant: user._id });
      if (alreadyApplied) {
        return res.status(400).json({ message: "You have already applied to this job." });
      }
  
      const application = new Application({
        job: jobId,
        applicant: user._id,
        name: user.name,
        phone,
        message,
        cv: req.file ? req.file.path : null  // ✅ تخزين مسار الـ CV
      });
  
      await application.save();
      res.status(201).json({ message: "Application submitted successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  

module.exports = router;

