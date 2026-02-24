import AuditLog from "../models/AuditLog.js";

export async function logAction({ actorId, action, message = "", targetUserId = null, meta = {} }) {
  try {
    await AuditLog.create({ actorId, action, message, targetUserId, meta });
  } catch {
    // ignore
  }
}
