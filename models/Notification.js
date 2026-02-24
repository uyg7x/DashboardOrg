import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    body: { type: String, default: "" },
    type: { type: String, default: "info" }, // task,ticket,meeting,leave,announcement
    refId: { type: String, default: "" },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model("Notification", NotificationSchema);
