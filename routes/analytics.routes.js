import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import LeaveRequest from "../models/LeaveRequest.js";
import Ticket from "../models/Ticket.js";

const router = Router();

function monthPrefix(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}



router.get("/me", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const myTicketsAgg = await Ticket.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$status", value: { $sum: 1 } } }
  ]);

  const myLeaveAgg = await LeaveRequest.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: "$status", value: { $sum: 1 } } }
  ]);

  const prefix = monthPrefix();
  const myAttendanceAgg = await Attendance.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $regex: `^${prefix}` } } },
    { $group: { _id: "$status", value: { $sum: 1 } } }
  ]);

  // simple KPI numbers
  const ticketsTotal = myTicketsAgg.reduce((a, x) => a + x.value, 0);
  const leavesTotal = myLeaveAgg.reduce((a, x) => a + x.value, 0);
  const presentDays = myAttendanceAgg.find(x => x._id === "present")?.value || 0;

  res.json({
    kpis: { ticketsTotal, leavesTotal, presentDaysThisMonth: presentDays },
    ticketPie: myTicketsAgg.map(x => ({ name: x._id, value: x.value })),
    leavePie: myLeaveAgg.map(x => ({ name: x._id, value: x.value })),
    attendancePie: myAttendanceAgg.map(x => ({ name: x._id, value: x.value }))
  });
});

router.get("/overview", requireAuth, requireAdmin, async (_req, res) => {
  const total = await User.countDocuments({ role: "employee" });
  const active = await User.countDocuments({ role: "employee", status: "active" });
  const inactive = await User.countDocuments({ role: "employee", status: "inactive" });

  const deptAgg = await User.aggregate([
    { $match: { role: "employee" } },
    { $group: { _id: "$department", value: { $sum: 1 } } },
    { $sort: { value: -1 } }
  ]);

  const leaveAgg = await LeaveRequest.aggregate([
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $sort: { value: -1 } }
  ]);

  const ticketAgg = await Ticket.aggregate([
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $sort: { value: -1 } }
  ]);

  const attAgg = await Attendance.aggregate([
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $sort: { value: -1 } }
  ]);

  res.json({
    kpis: { total, active, inactive },
    departmentPie: deptAgg.map(d => ({ name: d._id || "Unknown", value: d.value })),
    leavePie: leaveAgg.map(d => ({ name: d._id, value: d.value })),
    ticketPie: ticketAgg.map(d => ({ name: d._id, value: d.value })),
    attendancePie: attAgg.map(d => ({ name: d._id, value: d.value }))
  });
});

export default router;
