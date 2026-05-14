"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Option {
  label: string;
  value: string;
}

export default function AdminFilter({
  paramName,
  options,
  defaultLabel = "All",
}: {
  paramName: string;
  options: Option[];
  defaultLabel?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedValue, setSelectedValue] = useState(
    searchParams.get(paramName) || ""
  );

  useEffect(() => {
    setSelectedValue(searchParams.get(paramName) || "");
  }, [searchParams, paramName]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedValue(val);

    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set(paramName, val);
    } else {
      params.delete(paramName);
    }
    params.delete("page"); // Reset to page 1 on filter
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={selectedValue}
        onChange={handleChange}
        className="block w-full pl-4 pr-10 py-2.5 border border-[#222] bg-[#050505] text-white rounded-xl focus:border-[#7c6cf6] focus:outline-none focus:ring-1 focus:ring-[#7c6cf6] sm:text-sm appearance-none cursor-pointer transition-colors"
      >
        <option value="">{defaultLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
