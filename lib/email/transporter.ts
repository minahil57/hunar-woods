import nodemailer from "nodemailer";

export function createGmailTransporter() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");

  if (!user || !pass || pass === "your-16-char-app-password") {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export function getFromAddress(): string {
  const user = process.env.GMAIL_USER;
  const name = process.env.ORDER_FROM_NAME ?? "Hunar Woods";

  if (user) {
    return `"${name}" <${user}>`;
  }

  return process.env.ORDER_FROM_EMAIL ?? "Hunar Woods <onboarding@resend.dev>";
}
