import { Router } from "express";
import Asset from "../models/Asset.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const rows = await Asset.find({ assignedTo: req.user.id }).sort({ createdAt: -1 });
  res.json(rows);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const rows = await Asset.find()
    .populate("assignedTo", "fullName email department")
    .sort({ createdAt: -1 });
  res.json(rows);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const created = await Asset.create(req.body);
  res.json(created);
});

router.patch("/:id/assign", requireAuth, requireAdmin, async (req, res) => {
  const { assignedTo, assignedOn } = req.body;
  const updated = await Asset.findByIdAndUpdate(
    req.params.id,
    { status: "assigned", assignedTo, assignedOn },
    { new: true }
  );
  res.json(updated);
});

router.patch("/:id/unassign", requireAuth, requireAdmin, async (req, res) => {
  const updated = await Asset.findByIdAndUpdate(
    req.params.id,
    { status: "available", assignedTo: null, assignedOn: null },
    { new: true }
  );
  res.json(updated);
});

export default router;
