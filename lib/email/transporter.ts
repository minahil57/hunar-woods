import nodemailer from "nodemailer";

export function createGmailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
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
