"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ListingFormProps {
  categories: { id: string; name: string; slug: string }[];
  destinations: { id: string; name: string; slug: string }[];
  operatorId: string;
  listing?: {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    pricePerPerson: number;
    categoryId: string;
    destinationId: string;
    groupSizeMin: number;
    groupSizeMax: number;
    difficultyLevel?: string | null;
    status: string;
  };
}

export default function ListingForm({ categories, destinations, operatorId, listing }: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get("title"),
      shortDescription: form.get("shortDescription"),
      fullDescription: form.get("fullDescription"),
      pricePerPerson: Number(form.get("pricePerPerson")),
      categoryId: form.get("categoryId"),
      destinationId: form.get("destinationId"),
      groupSizeMin: Number(form.get("groupSizeMin")),
      groupSizeMax: Number(form.get("groupSizeMax")),
      difficultyLevel: form.get("difficultyLevel"),
      operatorId,
      status: form.get("status") || "DRAFT",
    };

    try {
      const url = listing ? `/api/listings/${listing.id}` : "/api/listings";
      const method = listing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save listing");

      router.push("/dashboard/operator");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm border border-red-100">{error}</div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-1">Title</label>
        <input id="title" name="title" required defaultValue={listing?.title}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
      </div>

      <div>
        <label htmlFor="shortDescription" className="block text-sm font-semibold text-gray-900 mb-1">Short Description</label>
        <input id="shortDescription" name="shortDescription" required defaultValue={listing?.shortDescription}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
      </div>

      <div>
        <label htmlFor="fullDescription" className="block text-sm font-semibold text-gray-900 mb-1">Full Description</label>
        <textarea id="fullDescription" name="fullDescription" required rows={4} defaultValue={listing?.fullDescription}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-900 mb-1">Category</label>
          <select id="categoryId" name="categoryId" required defaultValue={listing?.categoryId}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="destinationId" className="block text-sm font-semibold text-gray-900 mb-1">Destination</label>
          <select id="destinationId" name="destinationId" required defaultValue={listing?.destinationId}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600">
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="pricePerPerson" className="block text-sm font-semibold text-gray-900 mb-1">Price (₹)</label>
          <input id="pricePerPerson" name="pricePerPerson" type="number" required min={100} defaultValue={listing?.pricePerPerson || 1500}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
        </div>
        <div>
          <label htmlFor="groupSizeMin" className="block text-sm font-semibold text-gray-900 mb-1">Min Group</label>
          <input id="groupSizeMin" name="groupSizeMin" type="number" required min={1} defaultValue={listing?.groupSizeMin || 1}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
        </div>
        <div>
          <label htmlFor="groupSizeMax" className="block text-sm font-semibold text-gray-900 mb-1">Max Group</label>
          <input id="groupSizeMax" name="groupSizeMax" type="number" required min={1} defaultValue={listing?.groupSizeMax || 20}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="difficultyLevel" className="block text-sm font-semibold text-gray-900 mb-1">Difficulty</label>
          <select id="difficultyLevel" name="difficultyLevel" required defaultValue={listing?.difficultyLevel || "MODERATE"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600">
            <option value="EASY">Easy</option>
            <option value="MODERATE">Moderate</option>
            <option value="DIFFICULT">Difficult</option>
          </select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-1">Status</label>
          <select id="status" name="status" defaultValue={listing?.status || "DRAFT"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70">
        {loading ? "Saving..." : listing ? "Update Listing" : "Create Listing"}
      </button>
    </form>
  );
}
