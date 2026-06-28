import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = schema.parse(body);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token. Please request a new one." },
        { status: 400 }
      );
    }

    if (resetToken.expires < new Date()) {
      await prisma.passwordResetToken.delete({ where: { token } });
      return NextResponse.json(
        { error: "This reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({ where: { token } }),
    ]);

    return NextResponse.json({ message: "Password reset successfully. You can now log in." });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
