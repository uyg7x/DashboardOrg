import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: { type: String, enum: ["it", "hr", "admin", "payroll", "other"], default: "other" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages: [
      { by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String, at: { type: Date, default: Date.now } }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", TicketSchema);
