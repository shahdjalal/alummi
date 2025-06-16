const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");

// 🟢 Get all events (for users)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟢 Get event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("attendees", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔴 Create event (admin only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const { title, date, location, description } = req.body;
    const newEvent = new Event({ title, date, location, description });
    await newEvent.save();
    res.status(201).json({ message: "Event created", newEvent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🟡 Update event (admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated", event });
  } catch (error) {ش
    res.status(500).json({ error: error.message });
  }
});

// 🔴 Delete event (admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Unauthorized" });

    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Register for event (user)
router.post("/register/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ message: "You are already registered" });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.json({ message: "Registered successfully", attendees: event.attendees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
