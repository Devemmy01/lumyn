"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function AdminSearch({ placeholder = "Search..." }: { placeholder?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // Debounce search update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("q", searchTerm);
        params.delete("page"); // Reset to page 1 on search
      } else {
        params.delete("q");
      }
      router.push(`?${params.toString()}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, router]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full px-4 py-2 bg-ivory-200/50 border border-stone/60 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage 
                 transition-all text-sm placeholder-stone-400"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
