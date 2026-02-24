import { Router } from "express";
import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  res.json(users);
});

// Admin creates employee (returns credentials)
// If tempPassword not provided, default = 123456
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const { email, fullName } = req.body;
  if (!email || !fullName) return res.status(400).json({ message: "email & fullName required" });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const tempPassword = (req.body.tempPassword || "123456").toString();
  const passwordHash = await bcryptjs.hash(tempPassword, 10);
  const created = await User.create({
    ...req.body,
    role: "employee",
    email: email.toLowerCase(),
    passwordHash
  });

  res.json({ ok: true, id: created._id, username: created.email, password: tempPassword });
});

export default router;
