"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";



interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  defaultValue = "",
  placeholder = "Search treks, forts, beaches, safaris...",
  className = "",
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative group ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="block w-full rounded-2xl border-0 py-4 pl-12 pr-28 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 text-base shadow-sm"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        Search
      </button>
    </form>
  );
}

