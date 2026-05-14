"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
        className="w-full px-4 py-2.5 bg-[#050505] border border-[#222] rounded-xl focus:border-[#7c6cf6] outline-none transition-all text-sm text-white placeholder-neutral-600"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
