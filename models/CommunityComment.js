import mongoose from "mongoose";

const CommunityCommentSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "CommunityPost", required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true }
  },
  { timestamps: true }
);

CommunityCommentSchema.index({ postId: 1, createdAt: 1 });
export default mongoose.model("CommunityComment", CommunityCommentSchema);
