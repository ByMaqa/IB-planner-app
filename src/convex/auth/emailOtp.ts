import { Email } from "@convex-dev/auth/providers/Email";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

// Declaring process tells TypeScript it exists in the runtime context
declare const process: { env: Record<string, string | undefined> };

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  // This function can be asynchronous
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        globalThis.crypto.getRandomValues(bytes as any);
      },
    };
    const alphabet = "0123456789";
    return generateRandomString(random, alphabet, 6);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    try {
      const response = await fetch("https://email.vly.ai/send_otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "vlytothemoon2025",
        },
        body: JSON.stringify({
          to: email,
          otp: token,
          appName: process.env.VLY_APP_NAME || "a vly.ai application",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send OTP: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});