import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import meetingRoutes from "./src/routes/meeting.routes.js";
import taskRoutes from "./src/routes/task.routes.js";
import announcementRoutes from "./src/routes/announcement.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import orgRoutes from "./src/routes/org.routes.js";
import communityRoutes from "./src/routes/community.routes.js";
import newsRoutes from "./src/routes/news.routes.js";
import auditRoutes from "./src/routes/audit.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import presenceRoutes from "./src/routes/presence.routes.js";

import attendanceRoutes from "./src/routes/attendance.routes.js";
import leaveRoutes from "./src/routes/leave.routes.js";
import payrollRoutes from "./src/routes/payroll.routes.js";
import performanceRoutes from "./src/routes/performance.routes.js";
import documentRoutes from "./src/routes/document.routes.js";
import assetRoutes from "./src/routes/asset.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded docs
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_, res) => res.json({ ok: true, service: "GITHRF HR API" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/presence", presenceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/news", newsRoutes);

app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/tickets", ticketRoutes);

const start = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI in .env");
    if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
  } catch (e) {
    console.error("❌ Start error:", e.message);
    process.exit(1);
  }
};

start();
