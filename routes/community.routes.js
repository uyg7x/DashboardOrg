import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import CommunityPost from "../models/CommunityPost.js";
import CommunityComment from "../models/CommunityComment.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { logAction } from "../utils/log.js";

const router = Router();

router.get("/posts", requireAuth, async (_req, res) => {
  const posts = await CommunityPost.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("authorId", "fullName department role");
  res.json(posts);
});

router.post("/posts", requireAuth, async (req, res) => {
  const { title, body, tags = [] } = req.body || {};
  if (!title || !body) return res.status(400).json({ message: "title & body required" });

  const created = await CommunityPost.create({ authorId: req.user.id, title, body, tags });
  await logAction({ actorId: req.user.id, action: "COMMUNITY_POST", message: `Post: ${title}`, meta: { postId: String(created._id) } });
  res.json(created);
});

router.get("/posts/:id/comments", requireAuth, async (req, res) => {
  const rows = await CommunityComment.find({ postId: req.params.id })
    .sort({ createdAt: 1 })
    .populate("authorId", "fullName department role");
  res.json(rows);
});

router.post("/posts/:id/comments", requireAuth, async (req, res) => {
  const { text } = req.body || {};
  if (!text?.trim()) return res.status(400).json({ message: "text required" });

  const created = await CommunityComment.create({ postId: req.params.id, authorId: req.user.id, text: text.trim() });

  // notify post author (if not same)
  try {
    const post = await CommunityPost.findById(req.params.id).select("authorId title");
    if (post && String(post.authorId) !== String(req.user.id)) {
      await Notification.create({ userId: post.authorId, title: "New comment on your post", body: post.title, type: "community", refId: String(post._id) });
    }
  } catch {}

  await logAction({ actorId: req.user.id, action: "COMMUNITY_COMMENT", message: "Comment added", meta: { postId: String(req.params.id) } });
  res.json(created);
});

router.delete("/posts/:id", requireAuth, requireAdmin, async (req, res) => {
  await CommunityPost.findByIdAndDelete(req.params.id);
  await CommunityComment.deleteMany({ postId: req.params.id });
  res.json({ ok: true });
});

export default router;
