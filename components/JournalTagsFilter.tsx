"use client";

import { useState } from "react";
import Link from "next/link";

interface JournalTagsFilterProps {
  allTags: string[];
  currentTag?: string;
  currentQuery?: string;
}

export default function JournalTagsFilter({
  allTags,
  currentTag,
  currentQuery,
}: JournalTagsFilterProps) {
  const [showAllTags, setShowAllTags] = useState(false);
  const visibleCount = 5;
  const hasMoreTags = allTags.length > visibleCount;
  const visibleTags = showAllTags ? allTags : allTags.slice(0, visibleCount);

  return (
    <div className="card-flat rounded-2xl p-6" style={{
      backgroundColor: "var(--bg-primary)",
      borderColor: "var(--border-primary)",
      border: "1px solid var(--border-primary)"
    }}>
      <h2 className="font-semibold text-sm mb-4 tracking-tight flex items-center justify-between" style={{ color: "var(--text-primary)" }}>
        Browse by Topic
        {currentTag && (
          <Link href={`/journal${currentQuery ? `?q=${currentQuery}` : ''}`} className="text-xs text-sage font-medium hover:underline">
            Clear Tag
          </Link>
        )}
      </h2>
      <div className="flex flex-wrap gap-2">
        {visibleTags.sort().map((t) => {
          const isActive = currentTag === t;
          const tagParams = new URLSearchParams();
          if (currentQuery) tagParams.set("q", currentQuery);
          if (!isActive) tagParams.set("tag", t);
          
          return (
            <Link 
              key={t} 
              href={`/journal?${tagParams.toString()}`}
              className="rounded-full border border-[color:var(--border-primary)] px-3 py-2 text-xs transition-colors hover:border-[#7c6cf6] hover:bg-[#7c6cf6] hover:text-white"
              style={{
                backgroundColor: isActive ? "#7c6cf6" : "var(--bg-secondary)",
                color: isActive ? "white" : "var(--text-secondary)"
              }}
            >
              {t.replace(/-/g, " ")}
            </Link>
          );
        })}
        {hasMoreTags && (
          <button
            type="button"
            onClick={() => setShowAllTags((current) => !current)}
            className="cursor-pointer rounded-full border border-dashed border-[color:var(--border-primary)] px-3 py-2 text-xs transition-colors hover:border-[#7c6cf6] hover:text-[#7c6cf6]"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              borderStyle: "dashed"
            }}
          >
            {showAllTags ? "Show less" : `Show more (${allTags.length - visibleCount})`}
          </button>
        )}
      </div>
    </div>
  );
}
