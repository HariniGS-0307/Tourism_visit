"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";



interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ href, label = "Back", className = "" }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors group ${className}`}
    >
      <span className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
        <ArrowLeft className="w-4 h-4" />
      </span>
      {label}
    </button>
  );
}

