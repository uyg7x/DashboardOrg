import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = Router();

router.get("/conversations", requireAuth, async (req, res) => {
  const rows = await Conversation.find({ participants: req.user.id })
    .sort({ lastMessageAt: -1, updatedAt: -1 })
    .populate("participants", "fullName email role department");
  res.json(rows);
});

router.post("/conversations", requireAuth, async (req, res) => {
  const { participantId } = req.body;
  if (!participantId) return res.status(400).json({ message: "participantId required" });
  if (String(participantId) === String(req.user.id)) return res.status(400).json({ message: "Cannot chat with yourself" });

  const other = await User.findById(participantId).select("_id");
  if (!other) return res.status(404).json({ message: "User not found" });

  let convo = await Conversation.findOne({
    participants: { $all: [req.user.id, participantId] },
    $expr: { $eq: [{ $size: "$participants" }, 2] }
  }).populate("participants", "fullName email role department");

  if (!convo) {
    convo = await Conversation.create({ participants: [req.user.id, participantId], lastMessageAt: new Date() });
    convo = await Conversation.findById(convo._id).populate("participants", "fullName email role department");
  }

  res.json(convo);
});

router.get("/conversations/:id/messages", requireAuth, async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ message: "Conversation not found" });

  if (!convo.participants.map(String).includes(String(req.user.id))) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const rows = await Message.find({ conversationId: convo._id })
    .sort({ createdAt: 1 })
    .populate("from", "fullName email role");
  res.json(rows);
});

router.post("/conversations/:id/messages", requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: "text required" });

  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ message: "Conversation not found" });

  if (!convo.participants.map(String).includes(String(req.user.id))) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const msg = await Message.create({ conversationId: convo._id, from: req.user.id, text: text.trim() });
  await Conversation.findByIdAndUpdate(convo._id, { lastMessageAt: new Date() });

  const populated = await Message.findById(msg._id).populate("from", "fullName email role");
  res.json(populated);
});

export default router;
