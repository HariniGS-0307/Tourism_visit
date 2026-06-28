import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { CreateListingInput, UpdateListingInput } from "@/lib/validators";

export interface ListingFilters {
  search?: string;
  destination?: string;
  category?: string;
  maxPrice?: number;
  difficulty?: string;
  sort?: string;
  limit?: number;
}

export async function getListings(filters: ListingFilters = {}) {
  const { search, destination, category, maxPrice, difficulty, sort, limit } = filters;

  const where: Prisma.ListingWhereInput = { status: "PUBLISHED" };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDescription: { contains: search, mode: "insensitive" } },
    ];
  }
  if (destination) where.destination = { slug: destination };
  if (category) where.category = { slug: category };
  if (maxPrice) where.pricePerPerson = { lte: maxPrice };
  if (difficulty) where.difficultyLevel = difficulty;

  const orderBy =
    sort === "rating"
      ? { avgRating: "desc" as const }
      : sort === "price_asc"
      ? { pricePerPerson: "asc" as const }
      : sort === "price_desc"
      ? { pricePerPerson: "desc" as const }
      : { createdAt: "desc" as const };

  return prisma.listing.findMany({
    where,
    include: { category: true, destination: true, operator: true },
    orderBy,
    take: limit,
  });
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      category: true,
      destination: true,
      operator: true,
      itineraryDays: { orderBy: { dayNumber: "asc" } },
      availabilitySlots: {
        where: { date: { gte: new Date() }, isActive: true },
        orderBy: { date: "asc" },
      },
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createListing(operatorId: string, data: CreateListingInput) {
  const slug =
    data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + `-${Date.now()}`;

  return prisma.listing.create({
    data: {
      title: data.title,
      slug,
      operatorId,
      categoryId: data.categoryId,
      destinationId: data.destinationId,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      pricePerPerson: data.pricePerPerson,
      discountPrice: data.discountPrice,
      groupSizeMin: data.groupSizeMin ?? 1,
      groupSizeMax: data.groupSizeMax,
      difficultyLevel: data.difficultyLevel,
      durationHours: data.durationHours,
      durationDays: data.durationDays,
      status: data.status ?? "DRAFT",
      inclusions: data.inclusions ?? ["Guide", "Safety Gear"],
      exclusions: data.exclusions ?? ["Transport"],
      thingsToCarry: data.thingsToCarry ?? ["Water Bottle", "Comfortable Shoes"],
      images: data.images ?? [
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      ],
    },
  });
}

export async function updateListing(id: string, data: UpdateListingInput) {
  return prisma.listing.update({
    where: { id },
    data: {
      title: data.title,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      pricePerPerson: data.pricePerPerson,
      discountPrice: data.discountPrice,
      categoryId: data.categoryId,
      destinationId: data.destinationId,
      groupSizeMin: data.groupSizeMin,
      groupSizeMax: data.groupSizeMax,
      difficultyLevel: data.difficultyLevel,
      durationHours: data.durationHours,
      durationDays: data.durationDays,
      status: data.status,
      inclusions: data.inclusions,
      exclusions: data.exclusions,
      thingsToCarry: data.thingsToCarry,
      images: data.images,
    },
  });
}
