import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

router.post("/ping", requireAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { lastSeenAt: new Date() });
  res.json({ ok: true });
});

router.get("/users", requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  const now = Date.now();
  const rows = users.map((u) => {
    const last = u.lastSeenAt ? new Date(u.lastSeenAt).getTime() : 0;
    const online = last && (now - last) <= 60_000;
    return { ...u.toObject(), online };
  });
  res.json(rows);
});

export default router;
