import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    status: { type: String, enum: ["present", "absent", "late", "halfday"], default: "present" },
    checkIn: String,
    checkOut: String,
    notes: String
  },
  { timestamps: true }
);

AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
export default mongoose.model("Attendance", AttendanceSchema);
