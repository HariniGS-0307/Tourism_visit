import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getListingImage } from "@/lib/images";
import BookingForm from "@/components/booking/BookingForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BookingPage({ params }: { params: { listingId: string } }) {
  const session = await getServerSession(authOptions);
  
  // We allow unauthenticated users to see the booking page, but the API will require auth,
  // or we can enforce login here. Let's redirect to login if not authenticated later, 
  // or let the API handle it. For UX, better to let them see it and prompt login on submit.

  const listing = await prisma.listing.findUnique({
    where: { id: params.listingId },
    include: {
      category: true,
      destination: true,
      availabilitySlots: {
        where: { date: { gte: new Date() }, isActive: true },
        orderBy: { date: "asc" }
      }
    }
  });

  if (!listing) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Review & Book</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Booking Form */}
          <div className="flex-grow order-2 lg:order-1">
             <BookingForm listing={listing} user={session?.user} />
          </div>

          {/* Listing Summary Sidebar */}
          <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <img
                  src={getListingImage(listing.images, listing.category.slug, listing.destination.slug)}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.title}</h3>
                <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-4">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium text-gray-900">{listing.avgRating.toFixed(1)}</span>
                  <span>({listing.category.name})</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 shrink-0">📍</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-500">{listing.destination.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 shrink-0">⏱</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">Duration</div>
                      <div className="text-sm text-gray-500">
                        {listing.durationDays ? `${listing.durationDays} Days` : `${listing.durationHours} Hours`}
                      </div>
                    </div>
                  </div>
                </div>

             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
