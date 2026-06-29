import Link from "next/link";
import { Mountain, MapPin, Shield, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About | MahaAdventures",
  description: "Learn about Maharashtra Adventures — your platform to discover and book adventure experiences across Maharashtra.",
};

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold mb-4">About Maharashtra Adventures</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            We connect adventure seekers with verified local operators across Maharashtra — from Sahyadri treks to Konkan water sports.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            Maharashtra Adventures makes it easy to discover, compare, and book authentic adventure experiences across the state.
            Whether you are planning a weekend trek to Lonavala, camping at Bhandardara, or scuba diving in Tarkarli,
            we help you find the right operator at the right price — with secure online booking and instant confirmation.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: MapPin, title: "10+ Destinations", desc: "Real Maharashtra locations with maps, weather, and local listings." },
            { icon: Shield, title: "Verified Operators", desc: "Every operator is reviewed and verified before listing adventures." },
            { icon: Users, title: "Built for Groups", desc: "Book for solo trips or groups up to 20 with transparent pricing." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </section>

        <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <Mountain className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to explore?</h2>
          <p className="text-gray-600 mb-6">Browse destinations, compare activities, and book your next adventure today.</p>
          <Link
            href="/explore"
            className="inline-block bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-colors"
          >
            Start Exploring
          </Link>
        </section>
      </div>
    </div>
  );
}
