import { Router } from "express";
import Attendance from "../models/Attendance.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/today", requireAuth, async (req, res) => {
  const d = new Date();
  const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const row = await Attendance.findOne({ userId: req.user.id, date });
  res.json(row || null);
});



router.get("/me/month", requireAuth, async (req, res) => {
  const ym = (req.query.ym || "").toString();
  if (!/^\d{4}-\d{2}$/.test(ym)) return res.status(400).json({ message: "ym required format YYYY-MM" });
  const rows = await Attendance.find({ userId: req.user.id, date: { $regex: `^${ym}` } }).sort({ date: 1 });
  res.json(rows);
});

router.get("/me", requireAuth, async (req, res) => {
  const rows = await Attendance.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await Attendance.find()
    .populate("userId", "fullName email department designation")
    .sort({ date: -1 });
  res.json(rows);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { userId, date, status, checkIn, checkOut, notes } = req.body;
  const saved = await Attendance.findOneAndUpdate(
    { userId, date },
    { userId, date, status, checkIn, checkOut, notes },
    { upsert: true, new: true }
  );
  res.json(saved);
});

export default router;
