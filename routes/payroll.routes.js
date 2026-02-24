import { Router } from "express";
import PayrollSlip from "../models/PayrollSlip.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const slips = await PayrollSlip.find({ userId: req.user.id }).sort({ month: -1 });
  res.json(slips);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const slips = await PayrollSlip.find()
    .populate("userId", "fullName email department")
    .sort({ month: -1 });
  res.json(slips);
});

router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { userId, month, basic = 0, hra = 0, allowance = 0, deductions = 0, status = "generated" } = req.body;
  const netPay = (basic + hra + allowance) - deductions;

  const saved = await PayrollSlip.findOneAndUpdate(
    { userId, month },
    { userId, month, basic, hra, allowance, deductions, netPay, status },
    { upsert: true, new: true }
  );
  res.json(saved);
});

router.patch("/:id/paid", requireAuth, requireAdmin, async (req, res) => {
  const updated = await PayrollSlip.findByIdAndUpdate(req.params.id, { status: "paid" }, { new: true });
  res.json(updated);
});

export default router;
