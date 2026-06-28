import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, ExternalLink, Ticket } from "lucide-react";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        ...(session.user.email ? [{ user: { email: session.user.email } }] : []),
      ],
    },
    include: {
      listing: { include: { destination: true } },
      slot: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 border-b border-gray-200 pb-5 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Adventures</h1>
          <p className="text-gray-500 mt-1">Manage your bookings and upcoming trips.</p>
        </div>
        <Link href="/explore" className="text-emerald-600 font-bold hover:text-emerald-800 text-sm flex items-center gap-1">
           Find new adventures <ExternalLink className="w-4 h-4" />
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h2>
          <p className="text-gray-500 mb-6">You haven't booked any adventures yet. Time to change that!</p>
          <Link href="/explore" className="inline-block bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors">
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isUpcoming = new Date(booking.slot.date) >= new Date();
            
            return (
              <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
                <img 
                  src={booking.listing.images[0] || "https://res.cloudinary.com/demo/image/upload/sample.jpg"}
                  alt={booking.listing.title}
                  className="w-full sm:w-48 h-48 sm:h-auto object-cover rounded-xl shrink-0"
                />
                
                <div className="flex-1 flex flex-col justify-between">
                   <div>
                     <div className="flex justify-between items-start mb-2">
                       <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{booking.listing.title}</h2>
                       <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                          booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                       }`}>
                         {booking.status}
                       </span>
                     </div>
                     
                     <div className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                       Ref: {booking.bookingReference}
                     </div>

                     <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium mb-4">
                       <div className="flex items-center gap-1.5">
                         <Calendar className="w-4 h-4 text-emerald-600" />
                         {new Date(booking.slot.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                       </div>
                       <div className="flex items-center gap-1.5">
                         <MapPin className="w-4 h-4 text-emerald-600" />
                         {booking.listing.destination.name}
                       </div>
                     </div>
                   </div>

                   <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                     <div className="text-sm">
                       <span className="text-gray-500">Total: </span>
                       <span className="font-bold text-gray-900">₹{booking.totalAmount}</span>
                       <span className="text-gray-500 text-xs ml-1">({booking.numberOfPeople} pax)</span>
                     </div>
                     <div className="flex gap-3">
                        <Link href={`/listings/${booking.listingId}`} className="text-sm font-bold text-emerald-600 hover:text-emerald-800">
                          View Listing
                        </Link>
                        {booking.status === 'CONFIRMED' && isUpcoming && (
                          <Link href={`/booking/confirmation/${booking.id}`} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 border-l border-gray-200 pl-3">
                            View Ticket
                          </Link>
                        )}
                        {booking.status === 'PENDING' && (
                          <Link href={`/booking/checkout?bookingId=${booking.id}`} className="text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 rounded-lg border-l border-gray-200 pl-3 transition-colors">
                            Pay Now
                          </Link>
                        )}
                     </div>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
