import mongoose from "mongoose";

const LeaveRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["casual", "sick", "paid", "unpaid"], default: "casual" },
    from: { type: String, required: true },
    to: { type: String, required: true },
    reason: String,
    days: { type: Number, default: 1 },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default mongoose.model("LeaveRequest", LeaveRequestSchema);
