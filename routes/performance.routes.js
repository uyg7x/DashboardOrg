import { Router } from "express";
import PerformanceReview from "../models/PerformanceReview.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const rows = await PerformanceReview.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await PerformanceReview.find()
    .populate("userId", "fullName email department")
    .populate("reviewedBy", "fullName")
    .sort({ createdAt: -1 });
  res.json(rows);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { userId, period, rating, goals = [], feedback = "" } = req.body;

  const saved = await PerformanceReview.findOneAndUpdate(
    { userId, period },
    { userId, period, rating, goals, feedback, reviewedBy: req.user.id },
    { upsert: true, new: true }
  );
  res.json(saved);
});

export default router;
