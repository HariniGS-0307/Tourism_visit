import { Suspense } from "react";
import CheckoutClient from "./CheckoutClient";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CheckoutPage({ searchParams }: { searchParams: { bookingId?: string } }) {
  const bookingId = searchParams.bookingId;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  if (!bookingId) {
    redirect("/explore");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      listing: true,
      slot: true,
    }
  });

  const isOwner = booking?.userId === session.user.id;
  const isOwnerByEmail = !isOwner && session.user.email && booking?.user?.email === session.user.email;

  if (!booking || (!isOwner && !isOwnerByEmail)) {
    redirect("/explore");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-gray-500 font-medium">Loading checkout...</div>
        </div>
      }
    >
      <CheckoutClient booking={booking} />
    </Suspense>
  );
}
