import { z } from "zod";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const operatorRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessName: z.string().min(2, "Business name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  description: z.string().min(10, "Description is required"),
  verificationDocUrl: z.string().url("Valid verification document URL is required"),
});

// ── Listings ──────────────────────────────────────────────────────────────────

export const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  categoryId: z.string().cuid("Invalid category ID"),
  destinationId: z.string().cuid("Invalid destination ID"),
  shortDescription: z.string().min(20, "Short description must be at least 20 characters"),
  fullDescription: z.string().min(50, "Full description must be at least 50 characters"),
  pricePerPerson: z.number().positive("Price must be positive"),
  discountPrice: z.number().positive("Discount price must be positive").optional(),
  groupSizeMin: z.number().int().min(1).default(1),
  groupSizeMax: z.number().int().min(1),
  difficultyLevel: z.string().optional(),
  durationHours: z.number().positive().optional(),
  durationDays: z.number().int().positive().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  thingsToCarry: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export const updateListingSchema = createListingSchema.partial();

// ── Bookings ──────────────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  slotId: z.string().cuid("Invalid slot ID"),
  numberOfPeople: z.number().int().min(1, "At least 1 person required"),
  couponCode: z.string().optional(),
  specialRequests: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().optional(),
});

// ── Reviews ───────────────────────────────────────────────────────────────────

export const createReviewSchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  bookingId: z.string().cuid("Invalid booking ID").optional(),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(1000, "Comment must be under 1000 characters").optional(),
});

// ── Chatbot ───────────────────────────────────────────────────────────────────

export const chatMessageSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
  history: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    )
    .optional(),
});

// ── Payments ──────────────────────────────────────────────────────────────────

export const createPaymentOrderSchema = z.object({
  bookingId: z.string().cuid("Invalid booking ID"),
});

// ── Type Exports ──────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type OperatorRegisterInput = z.infer<typeof operatorRegisterSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;
