import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// ✅ FIXED: imports now match your repo root folders: /routes (not /src/routes)
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import meetingRoutes from "./routes/meeting.routes.js";
import taskRoutes from "./routes/task.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import orgRoutes from "./routes/org.routes.js";
import communityRoutes from "./routes/community.routes.js";
import newsRoutes from "./routes/news.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import presenceRoutes from "./routes/presence.routes.js";
import attendanceRoutes from "./routes/attendance.routes.js";
import leaveRoutes from "./routes/leave.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import performanceRoutes from "./routes/performance.routes.js";
import documentRoutes from "./routes/document.routes.js";
import assetRoutes from "./routes/asset.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// serve uploaded docs
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// health check
app.get("/", (_req, res) => res.json({ ok: true, service: "GITHRF HR API" }));

// routes
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
    app.listen(port, () =>
      console.log(`✅ Server running on http://localhost:${port}`)
    );
  } catch (e) {
    console.error("❌ Start error:", e.message);
    process.exit(1);
  }
};

start();
