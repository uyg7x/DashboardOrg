import nodemailer from "nodemailer";

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

export async function sendMail({ to, subject, text }) {
  const transport = getTransport();
  if (!transport) {
    // If SMTP not configured, do not fail server. Log the email content instead.
    console.log("⚠️ SMTP not configured. Email would have been sent:");
    console.log({ to, subject, text });
    return { ok: false, reason: "SMTP_NOT_CONFIGURED" };
  }

  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  await transport.sendMail({ from, to, subject, text });
  return { ok: true };
}
