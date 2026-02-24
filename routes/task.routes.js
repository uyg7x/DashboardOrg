import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import { logAction } from "../utils/log.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const rows = await Task.find({ assignedTo: req.user.id })
    .sort({ createdAt: -1 })
    .populate("assignedBy", "fullName email");
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await Task.find()
    .sort({ createdAt: -1 })
    .populate("assignedTo", "fullName email department")
    .populate("assignedBy", "fullName email");
  res.json(rows);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { title, assignedTo, dueDate, description = "" } = req.body;
  if (!title || !assignedTo) return res.status(400).json({ message: "title & assignedTo required" });

  const created = await Task.create({
    title,
    description,
    dueDate: dueDate ? new Date(dueDate) : undefined,
    assignedTo,
    assignedBy: req.user.id
  });

  await Notification.create({ userId: assignedTo, title: "New Task Assigned", body: title, type: "task", refId: String(created._id) });
  await logAction({ actorId: req.user.id, targetUserId: assignedTo, action: "TASK_ASSIGN", message: `Task assigned: ${title}`, meta: { taskId: String(created._id) } });
  res.json(created);
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (req.user.role !== "admin" && String(task.assignedTo) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  if (status) task.status = status;
  await task.save();
  res.json(task);
});

export default router;
