import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import { logAction } from "../utils/log.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../utils/mailer.js";

const router = Router();

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const da = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${da}`;
}
function timeStr(){
  return new Date().toLocaleTimeString();
}


// Create admin ONCE (call once then keep admin)
router.post("/register-admin-once", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "email, password, fullName required" });
  }

  const existsAdmin = await User.findOne({ role: "admin" });
  if (existsAdmin) return res.status(400).json({ message: "Admin already exists" });

  const alreadyEmail = await User.findOne({ email: email.toLowerCase() });
  if (alreadyEmail) return res.status(400).json({ message: "Email already used" });

  const passwordHash = await bcryptjs.hash(password, 10);
  const admin = await User.create({
    role: "admin",
    email: email.toLowerCase(),
    passwordHash,
    fullName,
    department: "HR",
    designation: "Administrator"
  });

  res.json({ ok: true, id: admin._id });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcryptjs.compare(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  // AUTO ATTENDANCE + PRESENCE
  const date = todayStr();
  const nowTime = timeStr();
  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date(), lastSeenAt: new Date() });
  await Attendance.findOneAndUpdate(
    { userId: user._id, date },
    { $setOnInsert: { userId: user._id, date, status: "present" }, $set: { checkIn: nowTime } },
    { upsert: true, new: true }
  );
  await logAction({ actorId: user._id, action: "LOGIN", message: `User login ${date} ${nowTime}` });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: {
      id: user._id,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      department: user.department,
      designation: user.designation,
      leaveBalance: user.leaveBalance
    }
  });
});

router.post("/logout", async (req, res) => {
  // Optional: if token provided, we mark checkOut
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.json({ ok: true });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const date = todayStr();
    const nowTime = timeStr();
    await Attendance.findOneAndUpdate(
      { userId: payload.id, date },
      { $set: { checkOut: nowTime } },
      { upsert: true, new: true }
    );
    await User.findByIdAndUpdate(payload.id, { lastSeenAt: new Date() });
    await logAction({ actorId: payload.id, action: "LOGOUT", message: `User logout ${date} ${nowTime}` });
  } catch {}
  res.json({ ok: true });
});


// Admin: change password (logged in)
router.post("/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ message: "currentPassword & newPassword required" });

  const user = await User.findById(req.user.id);
  const ok = await bcryptjs.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Current password is wrong" });

  const passwordHash = await bcryptjs.hash(newPassword, 10);
  user.passwordHash = passwordHash;
  user.resetPasswordTokenHash = "";
  user.resetPasswordExpiresAt = null;
  await user.save();

  await logAction({ actorId: req.user.id, action: "PASSWORD_CHANGE", message: "Password changed" });
  res.json({ ok: true });
});

// Request reset (Admin only by email)
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "email required" });

  const user = await User.findOne({ email: email.toLowerCase().trim(), role: "admin" });
  // Always return ok to avoid leaking accounts
  if (!user) return res.json({ ok: true });

  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  user.resetPasswordTokenHash = tokenHash;
  user.resetPasswordExpiresAt = expires;
  await user.save();

  const appUrl = process.env.APP_URL || "http://localhost:5173";
  const link = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

  await sendMail({
    to: user.email,
    subject: "GITHRF Admin Password Reset",
    text: `Password reset requested.

Open this link to reset your admin password (valid 15 minutes):
${link}

If you did not request this, ignore this email.`
  });

  await logAction({ actorId: user._id, action: "PASSWORD_RESET_REQUEST", message: "Password reset email sent" });
  res.json({ ok: true });
});

// Reset using token
router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body || {};
  if (!email || !token || !newPassword) return res.status(400).json({ message: "email, token, newPassword required" });

  const user = await User.findOne({ email: email.toLowerCase().trim(), role: "admin" });
  if (!user || !user.resetPasswordTokenHash || !user.resetPasswordExpiresAt) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  if (new Date(user.resetPasswordExpiresAt).getTime() < Date.now()) {
    return res.status(400).json({ message: "Reset token expired" });
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  if (tokenHash !== user.resetPasswordTokenHash) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  user.passwordHash = await bcryptjs.hash(newPassword, 10);
  user.resetPasswordTokenHash = "";
  user.resetPasswordExpiresAt = null;
  await user.save();

  await logAction({ actorId: user._id, action: "PASSWORD_RESET", message: "Password reset completed" });
  res.json({ ok: true });
});

export default router;
