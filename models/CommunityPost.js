import mongoose from "mongoose";

const CommunityPostSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

CommunityPostSchema.index({ createdAt: -1 });
export default mongoose.model("CommunityPost", CommunityPostSchema);
