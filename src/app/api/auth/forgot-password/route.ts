import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    // Always return 200 even if user doesn't exist (security: don't leak account existence)
    const user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // Delete any existing tokens for this email
      await prisma.passwordResetToken.deleteMany({ where: { email } });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.create({
        data: { email, token, expires },
      });

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      await sendPasswordResetEmail(email, token, baseUrl);
    }

    return NextResponse.json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
