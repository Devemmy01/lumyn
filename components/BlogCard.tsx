import Link from "next/link";
import clsx from "clsx";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string;
  tags?: string[];
  readingTime?: number;
  createdAt: string | Date;
  coverImage?: string;
  variant?: "default" | "featured";
  index?: number;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  tags = [],
  readingTime,
  createdAt,
  variant = "default",
}: BlogCardProps) {
  return (
    <Link
      href={`/journal/${slug}`}
      className={clsx(
        "group flex h-full flex-col gap-5 overflow-hidden rounded-[1.6rem] border border-[color:var(--border-primary)] bg-[color:var(--bg-secondary)] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#7c6cf6]/50 sm:p-6",
        variant === "featured" && "min-h-[340px] justify-end md:p-10"
      )}
      aria-label={`Read: ${title}`}
    >
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full border border-[color:var(--border-primary)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--text-tertiary)]">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3
        className={clsx(
          "font-medium tracking-[-0.035em] text-[color:var(--text-primary)] transition-colors duration-200 group-hover:text-[#7c6cf6]",
          "leading-[1.05]",
          variant === "featured" ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"
        )}
      >
        {title}
      </h3>

      {/* Excerpt */}
      <p className="line-clamp-3 flex-1 text-sm leading-7 text-[color:var(--text-secondary)]">
        {excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 border-t border-[color:var(--border-primary)] pt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--text-tertiary)]">
        <time dateTime={new Date(createdAt).toISOString()}>
          {formatDate(createdAt)}
        </time>
        {readingTime && (
          <>
            <span aria-hidden="true">·</span>
            <span>{readingTime} min read</span>
          </>
        )}
        <span
          className="ml-auto flex items-center gap-1 text-[#7c6cf6] transition-all duration-200 group-hover:translate-x-1"
        >
          Read
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
