import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["admin", "employee"], default: "employee" },

    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    fullName: { type: String, required: true },
    phone: String,
    department: { type: String, default: "General" },
    designation: { type: String, default: "Employee" },
    managerName: String,
    location: String,

    employeeId: { type: String, unique: true, sparse: true },
    joiningDate: Date,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    salary: { type: Number, default: 0 },

    leaveBalance: { type: Number, default: 12 },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    lastLoginAt: { type: Date, default: null },
    lastSeenAt: { type: Date, default: null },
    resetPasswordTokenHash: { type: String, default: "" },
    resetPasswordExpiresAt: { type: Date, default: null },
    avatarSeed: { type: String, default: "" },
    seenAnnouncements: [{ type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }],

    attendance: {
      presentDays: { type: Number, default: 0 },
      absentDays: { type: Number, default: 0 },
      lateDays: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
