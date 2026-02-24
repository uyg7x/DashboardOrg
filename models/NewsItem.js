import mongoose from "mongoose";

const NewsItemSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, default: "general" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

NewsItemSchema.index({ createdAt: -1 });
export default mongoose.model("NewsItem", NewsItemSchema);
