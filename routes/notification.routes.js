import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Notification from "../models/Notification.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const rows = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50);
  res.json(rows);
});

router.get("/me/unread-count", requireAuth, async (req, res) => {
  const n = await Notification.countDocuments({ userId: req.user.id, readAt: null });
  res.json({ unread: n });
});

router.post("/:id/read", requireAuth, async (req, res) => {
  const updated = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { readAt: new Date() },
    { new: true }
  );
  res.json(updated || { ok: true });
});

export default router;
