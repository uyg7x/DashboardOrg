import { Router } from "express";
import LeaveRequest from "../models/LeaveRequest.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { logAction } from "../utils/log.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const created = await LeaveRequest.create({ ...req.body, userId: req.user.id });
  const admins = await User.find({ role: "admin" }).select("_id");
  for (const a of admins) {
    try { await Notification.create({ userId: a._id, title: "Leave Request", body: `New leave request`, type: "leave", refId: String(created._id) }); } catch {}
  }
  await logAction({ actorId: req.user.id, action: "LEAVE_APPLY", message: "Leave applied", meta: { leaveId: String(created._id) } });
  res.json(created);
});

router.get("/me", requireAuth, async (req, res) => {
  const rows = await LeaveRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await LeaveRequest.find()
    .populate("userId", "fullName email department")
    .populate("approvedBy", "fullName")
    .sort({ createdAt: -1 });
  res.json(rows);
});

router.patch("/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body; // approved/rejected
  const updated = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    { status, approvedBy: req.user.id },
    { new: true }
  );
  if (updated?.userId) {
    try { await Notification.create({ userId: updated.userId, title: "Leave Updated", body: `Your leave is ${status}`, type: "leave", refId: String(updated._id) }); } catch {}
  }
  await logAction({ actorId: req.user.id, targetUserId: updated?.userId, action: "LEAVE_STATUS", message: `Leave ${status}`, meta: { leaveId: String(updated?._id) } });
  res.json(updated);
});

export default router;
