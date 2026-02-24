import mongoose from "mongoose";

const PerformanceReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    period: { type: String, required: true }, // 2026-Q1 / 2026
    rating: { type: Number, min: 1, max: 5, default: 3 },
    goals: [{ title: String, status: { type: String, enum: ["todo", "done"], default: "todo" } }],
    feedback: String,
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

PerformanceReviewSchema.index({ userId: 1, period: 1 }, { unique: true });
export default mongoose.model("PerformanceReview", PerformanceReviewSchema);
