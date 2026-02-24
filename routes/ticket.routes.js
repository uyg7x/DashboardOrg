import { Router } from "express";
import Ticket from "../models/Ticket.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import Notification from "../models/Notification.js";
import { logAction } from "../utils/log.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  const { forUserId, ...rest } = req.body || {};
  // Employee creates for self, Admin can create for an employee using forUserId
  const ownerId = (req.user.role === "admin" && forUserId) ? forUserId : req.user.id;
  const created = await Ticket.create({ ...rest, raisedBy: ownerId, createdBy: req.user.id });
  try {
    await Notification.create({ userId: ownerId, title: "Ticket Created", body: created.title, type: "ticket", refId: String(created._id) });
  } catch {}
  await logAction({ actorId: req.user.id, targetUserId: ownerId, action: "TICKET_CREATE", message: `Ticket: ${created.title}`, meta: { ticketId: String(created._id) } });
  res.json(created);
});

router.get("/me", requireAuth, async (req, res) => {
  const rows = await Ticket.find({ raisedBy: req.user.id })
    .populate("assignedTo", "fullName")
    .sort({ createdAt: -1 });
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await Ticket.find()
    .populate("raisedBy", "fullName email department")
    .populate("assignedTo", "fullName email")
    .sort({ createdAt: -1 });
  res.json(rows);
});

router.patch("/:id/update", requireAuth, requireAdmin, async (req, res) => {
  const updated = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.post("/:id/message", requireAuth, async (req, res) => {
  const { text } = req.body;
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: "Ticket not found" });

  if (req.user.role !== "admin" && String(ticket.raisedBy) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not allowed" });
  }

  ticket.messages.push({ by: req.user.id, text });
  await ticket.save();
  const reloaded = await Ticket.findById(ticket._id)
    .populate("raisedBy", "fullName email department")
    .populate("assignedTo", "fullName email");
  res.json(reloaded);
});

export default router;
