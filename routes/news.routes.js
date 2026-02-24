import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import NewsItem from "../models/NewsItem.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { logAction } from "../utils/log.js";

const router = Router();

router.get("/active", requireAuth, async (_req, res) => {
  const rows = await NewsItem.find({ active: true }).sort({ createdAt: -1 }).limit(30).populate("createdBy", "fullName");
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await NewsItem.find().sort({ createdAt: -1 }).populate("createdBy", "fullName");
  res.json(rows);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, body, category = "general", active = true } = req.body || {};
  if (!title || !body) return res.status(400).json({ message: "title & body required" });
  const created = await NewsItem.create({ createdBy: req.user.id, title, body, category, active });

  // notify employees
  const users = await User.find({ role: "employee" }).select("_id");
  for (const u of users) {
    try { await Notification.create({ userId: u._id, title: "News Update", body: title, type: "news", refId: String(created._id) }); } catch {}
  }
  await logAction({ actorId: req.user.id, action: "NEWS_CREATE", message: `News: ${title}`, meta: { newsId: String(created._id) } });
  res.json(created);
});

router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  const updated = await NewsItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await NewsItem.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
