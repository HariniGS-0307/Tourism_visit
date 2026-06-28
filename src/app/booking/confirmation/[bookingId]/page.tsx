import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Calendar, MapPin, Users, Ticket, ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function BookingConfirmationPage({ params }: { params: { bookingId: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      user: true,
      listing: { include: { destination: true } },
      slot: true
    }
  });

  if (!booking) {
    notFound();
  }

  const isBookingOwner = booking.userId === session.user.id;
  const isBookingOwnerByEmail =
    !isBookingOwner &&
    session.user.email &&
    booking.user?.email === session.user.email;

  if (!isBookingOwner && !isBookingOwnerByEmail) {
    notFound();
  }

  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className={`${isConfirmed ? "bg-emerald-600" : "bg-yellow-500"} text-center py-10 px-6 text-white relative`}>
             <div className="relative z-10">
               <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                 <CheckCircle className={`w-10 h-10 ${isConfirmed ? "text-emerald-600" : "text-yellow-500"}`} />
               </div>
               <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
                 {isConfirmed ? "Booking Confirmed!" : "Booking Pending Payment"}
               </h1>
               <p className={`text-lg font-medium ${isConfirmed ? "text-emerald-100" : "text-yellow-100"}`}>
                 {isConfirmed ? "Pack your bags! Your adventure awaits." : "Complete payment to confirm your spot."}
               </p>
             </div>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-6 gap-4">
              <div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Booking Reference</div>
                <div className="text-2xl font-black text-gray-900 tracking-widest">{booking.bookingReference}</div>
              </div>
              <div className="text-left md:text-right">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Status</div>
                <div className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${
                  booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                  booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {booking.status}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <img 
                src={booking.listing.images[0] || "https://res.cloudinary.com/demo/image/upload/sample.jpg"}
                alt={booking.listing.title}
                className="w-full md:w-48 h-32 object-cover rounded-xl shadow-sm"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{booking.listing.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium mt-4">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    {new Date(booking.slot.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    {booking.listing.destination.name}
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Users className="w-4 h-4 text-emerald-600" />
                    {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'Person' : 'People'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-gray-500" /> Payment Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Total Amount Paid</span>
                  <span className="font-semibold text-gray-900">₹{booking.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Payment Method</span>
                  <span className="font-medium text-gray-900">Razorpay</span>
                </div>
              </div>
            </div>

            {!isConfirmed && (
              <Link
                href={`/booking/checkout?bookingId=${booking.id}`}
                className="block w-full bg-yellow-500 text-white font-bold py-3.5 px-4 rounded-xl text-center hover:bg-yellow-600 transition-colors shadow-sm mb-4"
              >
                Complete Payment
              </Link>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
               <Link href="/dashboard/user" className="flex-1 bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl text-center hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                 View Dashboard <ArrowRight className="w-4 h-4" />
               </Link>
               <Link href="/explore" className="flex-1 bg-white text-gray-700 border border-gray-300 font-bold py-3.5 px-4 rounded-xl text-center hover:bg-gray-50 transition-colors">
                 Book Another Adventure
               </Link>
            </div>
            
            {isConfirmed && (
              <p className="text-center text-xs text-gray-400 font-medium mt-6">
                A confirmation email has been sent to your registered email address.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
