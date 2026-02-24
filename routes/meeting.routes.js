import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Meeting from "../models/Meeting.js";
import Notification from "../models/Notification.js";
import { logAction } from "../utils/log.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const rows = await Meeting.find({ attendees: req.user.id })
    .sort({ start: 1 })
    .populate("createdBy", "fullName email")
    .populate("attendees", "fullName email");
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await Meeting.find()
    .sort({ start: 1 })
    .populate("createdBy", "fullName email")
    .populate("attendees", "fullName email");
  res.json(rows);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, start, end, location = "", description = "", attendees = [] } = req.body;
  if (!title || !start || !end) return res.status(400).json({ message: "title, start, end required" });

  const created = await Meeting.create({
    title,
    start,
    end,
    location,
    description,
    attendees,
    createdBy: req.user.id
  });

  // notify attendees
  for (const uid of attendees) {
    try { await Notification.create({ userId: uid, title: "Meeting Scheduled", body: title, type: "meeting", refId: String(created._id) }); } catch {}
  }
  await logAction({ actorId: req.user.id, action: "MEETING_CREATE", message: `Meeting: ${title}`, meta: { meetingId: String(created._id) } });
  res.json(created);
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const updated = await Meeting.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await Meeting.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
