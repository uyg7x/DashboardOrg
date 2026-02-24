import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    category: { type: String, default: "general" },
    fileUrl: { type: String, required: true }, // /uploads/...
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    access: { type: String, enum: ["private", "org"], default: "private" }
  },
  { timestamps: true }
);

export default mongoose.model("Document", DocumentSchema);
