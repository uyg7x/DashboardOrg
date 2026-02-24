import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

router.get("/tree", requireAuth, async (_req, res) => {
  const users = await User.find().select("_id fullName role department designation managerId").sort({ fullName: 1 });
  const byId = new Map(users.map((u) => [String(u._id), { ...u.toObject(), children: [] }]));
  const roots = [];

  for (const u of users) {
    const node = byId.get(String(u._id));
    if (u.managerId && byId.has(String(u.managerId))) {
      byId.get(String(u.managerId)).children.push(node);
    } else {
      roots.push(node);
    }
  }

  res.json(roots);
});

export default router;
