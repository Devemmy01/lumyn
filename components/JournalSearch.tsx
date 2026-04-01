"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function JournalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("q", searchTerm);
        params.delete("page");
      } else {
        params.delete("q");
      }
      router.push(`/journal?${params.toString()}`, { scroll: false });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, router]);

  return (
    <div className="relative mb-6">
      <input
        type="text"
        className="w-full px-4 py-3 bg-white border border-stone/60 rounded-xl focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage text-sm text-charcoal shadow-sm transition-all"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg className="w-4 h-4 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
