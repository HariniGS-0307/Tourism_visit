import { prisma } from "@/lib/prisma";

export async function getDestinations() {
  return prisma.destination.findMany({
    include: {
      _count: { select: { listings: { where: { status: "PUBLISHED" } } } },
    },
    orderBy: { name: "asc" },
  });
}

export async function getDestinationBySlug(slug: string) {
  return prisma.destination.findUnique({
    where: { slug },
    include: {
      listings: {
        where: { status: "PUBLISHED" },
        include: { category: true, operator: true },
        orderBy: { avgRating: "desc" },
      },
    },
  });
}
