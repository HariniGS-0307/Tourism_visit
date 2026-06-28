"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Destination {
  slug: string;
  name: string;
}

interface FilterSidebarProps {
  destinations?: Destination[];
}

export default function FilterSidebar({ destinations = [] }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [destination, setDestination] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPriceRange(searchParams.get("price") || "");
    setDifficulty(searchParams.get("difficulty") || "");
    setDestination(searchParams.get("destination") || "");
    setMounted(true);
  }, [searchParams]);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const clearAll = () => {
    setPriceRange("");
    setDifficulty("");
    setDestination("");
    const q = searchParams.get("q");
    router.push(q ? `?q=${encodeURIComponent(q)}` : "?");
  };

  const hasFilters = priceRange || difficulty || destination;

  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-96 animate-pulse" />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900">
          <span className="text-emerald-600" aria-hidden="true">⚙</span>
          Filters
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            ✕ Clear all
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Price Range</h3>
          <div className="space-y-2">
            {[
              { value: "", label: "Any Price" },
              { value: "under-1000", label: "Under ₹1,000" },
              { value: "1000-3000", label: "₹1,000 – ₹3,000" },
              { value: "3000-5000", label: "₹3,000 – ₹5,000" },
              { value: "over-5000", label: "Over ₹5,000" },
            ].map(({ value, label }) => (
              <label key={label} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                <input
                  type="radio"
                  name="price"
                  value={value}
                  checked={priceRange === value}
                  onChange={() => {
                    setPriceRange(value);
                    handleFilterChange("price", value);
                  }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span className={priceRange === value ? "font-semibold text-emerald-600" : ""}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t pt-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">Difficulty</h3>
          <div className="space-y-2">
            {[
              { value: "", label: "Any Difficulty" },
              { value: "EASY", label: "Easy" },
              { value: "MODERATE", label: "Moderate" },
              { value: "HARD", label: "Hard" },
            ].map(({ value, label }) => (
              <label key={label} className="flex items-center gap-2.5 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                <input
                  type="radio"
                  name="difficulty"
                  value={value}
                  checked={difficulty === value}
                  onChange={() => {
                    setDifficulty(value);
                    handleFilterChange("difficulty", value);
                  }}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                />
                <span className={difficulty === value ? "font-semibold text-emerald-600" : ""}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {destinations.length > 0 && (
          <div className="border-t pt-5">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Destination</h3>
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                handleFilterChange("destination", e.target.value);
              }}
              className="w-full rounded-xl border border-gray-200 py-2 px-3 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
            >
              <option value="">All Destinations</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
