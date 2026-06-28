import Link from "next/link";

interface MobileBookBarProps {
  listingId: string;
  price: number;
}

export default function MobileBookBar({ listingId, price }: MobileBookBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 flex items-center justify-between lg:hidden shadow-lg">
      <div>
        <div className="text-xs text-gray-500 font-medium">From</div>
        <div className="text-xl font-extrabold text-gray-900">₹{price}</div>
      </div>
      <Link
        href={`/booking/${listingId}`}
        className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors"
      >
        Book Now
      </Link>
    </div>
  );
}
