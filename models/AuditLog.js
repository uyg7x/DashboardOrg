import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    action: { type: String, required: true }, // e.g. 'USER_CREATE','TASK_ASSIGN'
    message: { type: String, default: "" },
    meta: { type: Object, default: {} }
  },
  { timestamps: true }
);

AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ targetUserId: 1, createdAt: -1 });
export default mongoose.model("AuditLog", AuditLogSchema);
