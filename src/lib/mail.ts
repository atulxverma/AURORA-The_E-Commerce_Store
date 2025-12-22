// lib/mail.ts
import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"Aurora Store" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email failed:", error);
    return false;
  }
};
