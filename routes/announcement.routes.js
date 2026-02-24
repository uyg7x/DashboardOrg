import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Announcement from "../models/Announcement.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { logAction } from "../utils/log.js";

const router = Router();

router.get("/active", requireAuth, async (req, res) => {
  const me = await User.findById(req.user.id).select("seenAnnouncements");
  const seen = me?.seenAnnouncements || [];

  const rows = await Announcement.find({ active: true, _id: { $nin: seen } })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("createdBy", "fullName");
  res.json(rows);
});

router.post("/:id/seen", requireAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { $addToSet: { seenAnnouncements: req.params.id } });
  res.json({ ok: true });
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await Announcement.find().sort({ createdAt: -1 }).populate("createdBy", "fullName");
  res.json(rows);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, message, priority = "normal", active = true } = req.body;
  if (!title || !message) return res.status(400).json({ message: "title & message required" });

  const created = await Announcement.create({ title, message, priority, active, createdBy: req.user.id });
  // notify all employees (lightweight)
  const users = await User.find({ role: "employee" }).select("_id");
  for (const u of users) {
    try { await Notification.create({ userId: u._id, title: "New Announcement", body: title, type: "announcement", refId: String(created._id) }); } catch {}
  }
  await logAction({ actorId: req.user.id, action: "ANNOUNCEMENT_CREATE", message: `Announcement: ${title}`, meta: { announcementId: String(created._id) } });
  res.json(created);
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
