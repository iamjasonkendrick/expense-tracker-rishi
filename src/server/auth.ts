import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import nodemailer from "nodemailer";
import { db } from "./db";
import * as schema from "./db/schema";

// Use Nodemailer's built-in Gmail service for maximum reliability
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,

    // This exact signature is required by Better Auth to register the route
    sendResetPassword: async ({ user, url, token }) => {
      console.log("🔥 RESET PASSWORD TRIGGERED FOR:", user.email);
      console.log("🔗 RESET URL:", url);

      try {
        await transporter.sendMail({
          from: `"Rupalytic Support" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: "Reset your Rupalytic password",
          html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
              <h2 style="color: #059669;">Rupalytic</h2>
              <p>Hello ${user.name || "User"},</p>
              <p>We received a request to reset your password. Click the button below to proceed:</p>
              <a href="${url}" style="display: inline-block; background-color: #059669; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
                Reset Password
              </a>
              <p style="font-size: 12px; color: #64748b;">If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
            </div>
          `,
        });
        console.log("✅ Email sent successfully!");
      } catch (error) {
        console.error("❌ Nodemailer Error:", error);
      }
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
