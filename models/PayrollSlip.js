import mongoose from "mongoose";

const PayrollSlipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: String, required: true }, // YYYY-MM
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    allowance: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netPay: { type: Number, default: 0 },
    status: { type: String, enum: ["generated", "paid"], default: "generated" }
  },
  { timestamps: true }
);

PayrollSlipSchema.index({ userId: 1, month: 1 }, { unique: true });
export default mongoose.model("PayrollSlip", PayrollSlipSchema);
