import { NextResponse } from "next/server";
import { getGeminiModel, MODEL_PRIORITY } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { chatMessageSchema } from "@/lib/validators";
import { z } from "zod";

// ── Rate limiting ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 120;        // 120 messages per window — feels unlimited
const RATE_WINDOW_MS = 60_000; // 1-minute window

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ── Listings context injection ────────────────────────────────────────────────
async function buildContext(message: string): Promise<string> {
  const lower = message.toLowerCase();
  const keywords = [
    "trek", "camp", "water", "safari", "cycl", "paraglid",
    "price", "cost", "cheap", "₹", "book", "available",
    "weekend", "lonavala", "bhandardara", "tarkarli", "tadoba",
    "adventure", "activity", "activities",
    "igatpuri", "pench", "vengurla", "harishchandragad",
    "trekking", "camping", "wildlife", "kayak", "scuba",
    "maharashtra", "sahyadri", "konkan", "vidarbha",
    "listing", "package", "tour", "trip",
  ];
  if (!keywords.some((k) => lower.includes(k))) return "";

  try {
    const categoryKeywords: Record<string, string> = {
      trek: "trekking",
      trekking: "trekking",
      camp: "camping",
      camping: "camping",
      water: "water-sports",
      safari: "wildlife-safari",
      wildlife: "wildlife-safari",
      cycl: "cycling",
      paraglid: "paragliding",
      kayak: "kayaking",
      scuba: "scuba-diving",
    };
    let categorySlug: string | undefined;
    for (const [k, slug] of Object.entries(categoryKeywords)) {
      if (lower.includes(k)) { categorySlug = slug; break; }
    }

    const listings = await prisma.listing.findMany({
      where: {
        status: "PUBLISHED",
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      include: { destination: true, category: true },
      orderBy: { avgRating: "desc" },
      take: 8,
    });

    if (listings.length === 0) return "";

    const summary = listings.map((l) => ({
      id: l.id,
      title: l.title,
      category: l.category.name,
      destination: l.destination.name,
      price: l.discountPrice ?? l.pricePerPerson,
      originalPrice: l.discountPrice ? l.pricePerPerson : null,
      duration: l.durationDays ? `${l.durationDays} days` : `${l.durationHours} hours`,
      difficulty: l.difficultyLevel,
      rating: l.avgRating.toFixed(1),
      link: `/listings/${l.id}`,
    }));

    return `\n\n[REAL LISTINGS DATA — use only these for pricing/recommendations]\n${JSON.stringify(summary, null, 0)}`;
  } catch {
    return "";
  }
}

// ── Quota/error helpers ───────────────────────────────────────────────────────
function isQuotaError(msg: string) {
  return (
    msg.includes("429") ||
    msg.includes("Too Many Requests") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("quota") ||
    msg.includes("Quota")
  );
}

function isKeyError(msg: string) {
  return (
    msg.includes("API_KEY_INVALID") ||
    msg.includes("API key not valid") ||
    msg.includes("401") ||
    msg.includes("403")
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const parsed = chatMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 }
      );
    }

    const { sessionId, message, history } = parsed.data;

    if (!checkRateLimit(sessionId)) {
      return NextResponse.json(
        { error: "Too many messages. Please wait a minute." },
        { status: 429 }
      );
    }

    const userId = session?.user?.id ?? null;

    // Persist user message (best-effort — don't block on DB errors)
    prisma.chatMessage
      .create({ data: { sessionId, userId, role: "USER", content: message.trim() } })
      .catch((e) => console.error("Failed to persist user message:", e));

    // Build DB context in parallel with model init
    const context = await buildContext(message);

    // Format history for Gemini (last 10 turns)
    const safeHistory = (Array.isArray(history) ? history : [])
      .slice(-10)
      .filter(
        (m): m is { role: string; content: string } =>
          typeof m?.role === "string" && typeof m?.content === "string"
      )
      .map((m) => ({
        role: m.role === "USER" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

    // Try models in priority order — gracefully degrade on quota errors
    let responseText: string | null = null;
    let lastError: string = "";

    for (const modelName of MODEL_PRIORITY) {
      const model = getGeminiModel(modelName);
      if (!model) {
        return NextResponse.json({
          response:
            "The AI concierge isn't configured yet. Browse our destinations at /explore or search at /search!",
        });
      }

      try {
        const chat = model.startChat({ history: safeHistory });
        const result = await chat.sendMessage(message + context);
        responseText = result.response.text();
        break; // success — stop trying
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        lastError = msg;
        if (isQuotaError(msg)) {
          // Try next model
          console.warn(`Quota exceeded for ${modelName}, trying next model...`);
          continue;
        }
        // Non-quota error — rethrow to outer catch
        throw e;
      }
    }

    // All models exhausted due to quota
    if (responseText === null) {
      if (isQuotaError(lastError)) {
        return NextResponse.json({
          response:
            "I'm catching my breath right now — our AI quota is temporarily exhausted 🙏 You can still browse adventures at [/explore](/explore) or search at [/search](/search). Try me again in a few minutes!",
          quotaExhausted: true,
        });
      }
      throw new Error(lastError);
    }

    // Persist assistant reply (best-effort)
    prisma.chatMessage
      .create({ data: { sessionId, userId, role: "ASSISTANT", content: responseText } })
      .catch((e) => console.error("Failed to persist assistant message:", e));

    return NextResponse.json({ response: responseText });
  } catch (error: unknown) {
    console.error("Chatbot error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Validation error" },
        { status: 400 }
      );
    }

    const msg = error instanceof Error ? error.message : "Unknown error";

    if (isKeyError(msg)) {
      return NextResponse.json(
        { error: "AI service configuration error. Please contact support." },
        { status: 503 }
      );
    }
    if (isQuotaError(msg)) {
      return NextResponse.json({
        response:
          "I'm catching my breath 🙏 Our AI quota is temporarily exhausted. Browse [/explore](/explore) or [/search](/search) in the meantime — try again in a few minutes!",
        quotaExhausted: true,
      });
    }

    return NextResponse.json(
      { response: "I hit a small snag. Let me try again — or browse [/explore](/explore) for adventures! 🏔️" },
      { status: 200 }
    );
  }
}
