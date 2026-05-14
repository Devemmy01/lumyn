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
        "group flex flex-col gap-4 p-3 md:p-7 rounded-2xl h-full",
        "card transition-all duration-400 ease-out-expo hover:shadow-lg",
        variant === "featured" && "md:p-10"
      )}
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-primary)"
      }}
      aria-label={`Read: ${title}`}
    >
      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag text-xs p-2">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3
        className={clsx(
          "font-semibold tracking-tight group-hover:text-sage",
          "transition-colors duration-200 leading-snug",
          variant === "featured" ? "text-xl md:text-2xl" : "text-lg"
        )}
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>

      {/* Excerpt */}
      <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: "var(--text-secondary)" }}>
        {excerpt}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs pt-2 border-t" style={{ color: "var(--text-tertiary)", borderColor: "var(--border-secondary)" }}>
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
          className="ml-auto flex items-center gap-1 text-sage opacity-0 group-hover:opacity-100
                     transition-all duration-200 -translate-x-2 group-hover:translate-x-0 font-medium"
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
