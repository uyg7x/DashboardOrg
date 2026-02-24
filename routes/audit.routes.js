import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import AuditLog from "../models/AuditLog.js";

const router = Router();

// employee: see my timeline (actor or target)
router.get("/me", requireAuth, async (req, res) => {
  const rows = await AuditLog.find({
    $or: [{ actorId: req.user.id }, { targetUserId: req.user.id }]
  })
    .sort({ createdAt: -1 })
    .limit(60)
    .populate("actorId", "fullName role")
    .populate("targetUserId", "fullName role");
  res.json(rows);
});

// admin: all logs
router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .populate("actorId", "fullName role")
    .populate("targetUserId", "fullName role");
  res.json(rows);
});

export default router;
