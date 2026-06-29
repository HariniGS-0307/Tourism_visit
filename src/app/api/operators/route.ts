import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const operators = await prisma.operatorProfile.findMany({
      where: { isVerified: true },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { rating: "desc" },
    });
    return NextResponse.json(operators);
  } catch (error) {
    console.error("Error fetching operators:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
