import { NextResponse } from "next/server";
import { registerUser } from "@/server/services/user.service";
import { registerSchema } from "@/lib/validators";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);
    const user = await registerUser(data);
    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
