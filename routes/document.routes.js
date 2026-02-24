import { Router } from "express";
import Document from "../models/Document.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = Router();

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  const { title, category = "general", access = "private" } = req.body;
  if (!req.file) return res.status(400).json({ message: "file required" });
  if (!title) return res.status(400).json({ message: "title required" });

  const fileUrl = `/uploads/${req.file.filename}`;

  const doc = await Document.create({
    userId: req.user.id,
    title,
    category,
    access,
    fileUrl,
    uploadedBy: req.user.id
  });

  res.json(doc);
});

router.post("/upload-org", requireAuth, requireAdmin, upload.single("file"), async (req, res) => {
  const { title, category = "policy" } = req.body;
  if (!req.file) return res.status(400).json({ message: "file required" });
  if (!title) return res.status(400).json({ message: "title required" });

  const fileUrl = `/uploads/${req.file.filename}`;

  const doc = await Document.create({
    title,
    category,
    access: "org",
    fileUrl,
    uploadedBy: req.user.id
  });

  res.json(doc);
});

router.get("/me", requireAuth, async (req, res) => {
  const docs = await Document.find({ $or: [{ access: "org" }, { userId: req.user.id }] })
    .sort({ createdAt: -1 });
  res.json(docs);
});

router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const docs = await Document.find()
    .populate("userId", "fullName email")
    .populate("uploadedBy", "fullName")
    .sort({ createdAt: -1 });
  res.json(docs);
});

export default router;
