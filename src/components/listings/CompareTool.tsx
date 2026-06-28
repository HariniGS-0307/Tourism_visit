"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CompareCheckboxProps {
  listingId: string;
}

export function CompareCheckbox({ listingId }: CompareCheckboxProps) {
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("compareIds");
    const ids: string[] = stored ? JSON.parse(stored) : [];
    setChecked(ids.includes(listingId));
    setMounted(true);
  }, [listingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);

    const stored = sessionStorage.getItem("compareIds");
    let ids: string[] = stored ? JSON.parse(stored) : [];

    if (isChecked) {
      if (!ids.includes(listingId) && ids.length < 3) {
        ids.push(listingId);
      }
    } else {
      ids = ids.filter((id) => id !== listingId);
    }

    sessionStorage.setItem("compareIds", JSON.stringify(ids));
    window.dispatchEvent(new Event("compare-updated"));
  };

  if (!mounted) return null;

  return (
    <label className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-gray-700 shadow-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="rounded text-emerald-600 focus:ring-emerald-500"
      />
      Compare
    </label>
  );
}

export function CompareFloatingBar() {
  const [mounted, setMounted] = useState(false);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      const stored = sessionStorage.getItem("compareIds");
      setIds(stored ? JSON.parse(stored) : []);
    };
    update();
    setMounted(true);
    window.addEventListener("compare-updated", update);
    return () => window.removeEventListener("compare-updated", update);
  }, []);

  if (!mounted || ids.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <Link
        href={`/compare?ids=${ids.join(",")}`}
        className="flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
      >
        ⇄ Compare {ids.length} listing{ids.length > 1 ? "s" : ""}
      </Link>
    </div>
  );
}
