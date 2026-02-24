import mongoose from "mongoose";

const AssetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    assetTag: { type: String, unique: true, required: true },
    status: { type: String, enum: ["available", "assigned", "repair"], default: "available" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedOn: String,
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model("Asset", AssetSchema);
