"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-600">Have questions about a booking or want to list your adventures? We are here to help.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[
              { icon: Mail, label: "Email", value: "support@maharashtra-adventures.com" },
              { icon: Phone, label: "Phone", value: "+91 98765 43210" },
              { icon: MapPin, label: "Location", value: "Pune, Maharashtra, India" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">{label}</div>
                  <div className="font-semibold text-gray-900">{value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <Send className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-600">We will get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input id="name" required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input id="email" required type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" required rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
                </div>
                <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
