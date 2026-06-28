import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Users, Star, CheckCircle2, ShieldCheck } from "lucide-react";
import MobileBookBar from "@/components/listings/MobileBookBar";
import MapEmbed from "@/components/shared/MapEmbed";
import WeatherWidget from "@/components/shared/WeatherWidget";
import { getListingImage } from "@/lib/images";
import { fetchWeather } from "@/lib/weather";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      destination: true,
      operator: true,
      itineraryDays: { orderBy: { dayNumber: "asc" } },
      reviews: { include: { user: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!listing) {
    notFound();
  }

  const imageUrl = getListingImage(
    listing.images,
    listing.category.slug,
    listing.destination.slug
  );
  const displayPrice = listing.discountPrice || listing.pricePerPerson;

  const weather =
    listing.destination.latitude && listing.destination.longitude
      ? await fetchWeather(listing.destination.latitude, listing.destination.longitude)
      : null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Image */}
      <div className="w-full h-[50vh] min-h-[400px] relative bg-gray-900">
        <img src={imageUrl} alt={listing.title} className="w-full h-full object-cover opacity-80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {listing.category.name}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {listing.destination.name}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center gap-1.5 font-medium text-gray-900">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  {listing.avgRating.toFixed(1)} <span className="text-gray-500 font-normal">({listing.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-5 h-5 text-gray-400" />
                  {listing.durationDays ? `${listing.durationDays} Days` : `${listing.durationHours} Hours`}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-5 h-5 text-gray-400" />
                  {listing.groupSizeMin}-{listing.groupSizeMax} People
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                   {listing.difficultyLevel}
                </div>
              </div>

              <div className="prose max-w-none text-gray-600">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Overview</h3>
                <p className="leading-relaxed whitespace-pre-wrap">{listing.fullDescription}</p>
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col md:flex-row gap-8">
               <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Inclusions</h3>
                  <ul className="space-y-3">
                    {listing.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Exclusions</h3>
                  <ul className="space-y-3">
                    {listing.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <div className="w-5 h-5 rounded-full border-2 border-red-200 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2.5 h-0.5 bg-red-400 rounded-full" />
                        </div>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
               </div>
            </div>
            
            {/* Itinerary */}
            {listing.itineraryDays.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                 <h3 className="text-xl font-bold text-gray-900 mb-6">Itinerary</h3>
                 <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                   {listing.itineraryDays.map((day, idx) => (
                     <div key={day.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-100 text-emerald-600 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                         {day.dayNumber}
                       </div>
                       <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                         <h4 className="font-bold text-gray-900 mb-1">{day.title}</h4>
                         <p className="text-sm text-gray-600 mb-3">{day.description}</p>
                         {day.activities.length > 0 && (
                           <div className="flex flex-wrap gap-2">
                             {day.activities.map(act => (
                               <span key={act} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                                 {act}
                               </span>
                             ))}
                           </div>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {/* Things to Carry */}
            {listing.thingsToCarry.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Things to Carry</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.thingsToCarry.map((item) => (
                    <span key={item} className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-medium border border-amber-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Weather */}
            {listing.destination.latitude && listing.destination.longitude && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location & Weather</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-48 rounded-xl overflow-hidden border border-gray-200">
                    <MapEmbed
                      latitude={listing.destination.latitude}
                      longitude={listing.destination.longitude}
                      name={listing.destination.name}
                    />
                  </div>
                  <WeatherWidget weather={weather} />
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Reviews ({listing.reviews.length})</h3>
              {listing.reviews.length > 0 ? (
                <div className="space-y-6">
                  {listing.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{review.user.name || "Anonymous"}</span>
                      </div>
                      {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-6 space-y-6">
                
                {/* Booking Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                   <div className="mb-4">
                     {listing.discountPrice ? (
                       <div className="flex items-end gap-2">
                         <span className="text-3xl font-extrabold text-gray-900">₹{listing.discountPrice}</span>
                         <span className="text-lg text-gray-400 line-through mb-1">₹{listing.pricePerPerson}</span>
                       </div>
                     ) : (
                       <div className="text-3xl font-extrabold text-gray-900">₹{listing.pricePerPerson}</div>
                     )}
                     <div className="text-sm text-gray-500 font-medium">per person</div>
                   </div>
                   
                   <Link 
                     href={`/booking/${listing.id}`}
                     className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm mb-3"
                   >
                     Check Availability & Book
                   </Link>
                   <p className="text-xs text-center text-gray-500 font-medium">No hidden fees • Instant Confirmation</p>
                </div>
                
                {/* Operator Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                   <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Operated By</h4>
                   <img 
                     src={listing.operator.logoUrl || "https://res.cloudinary.com/demo/image/upload/sample.jpg"} 
                     alt={listing.operator.businessName}
                     className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-emerald-50"
                   />
                   <h3 className="text-lg font-bold text-gray-900 mb-1">{listing.operator.businessName}</h3>
                   {listing.operator.isVerified && (
                     <div className="flex justify-center items-center gap-1 text-emerald-600 text-xs font-semibold mb-3">
                       <ShieldCheck className="w-4 h-4" /> Verified Operator
                     </div>
                   )}
                   <div className="flex justify-center items-center gap-4 text-sm text-gray-600">
                     <div className="flex flex-col"><span className="font-bold text-gray-900">{listing.operator.totalBookings}</span> Bookings</div>
                     <div className="w-px h-8 bg-gray-200"></div>
                     <div className="flex flex-col"><span className="font-bold text-gray-900 flex items-center justify-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400"/> {listing.operator.rating.toFixed(1)}</span> Rating</div>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </div>
      <MobileBookBar listingId={listing.id} price={displayPrice} />
    </div>
  );
}
