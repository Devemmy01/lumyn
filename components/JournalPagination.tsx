import Link from "next/link";
import clsx from "clsx";

interface JournalPaginationProps {
  currentPage: number;
  totalPages: number;
  queryParams: URLSearchParams;
}

export default function JournalPagination({
  currentPage,
  totalPages,
  queryParams,
}: JournalPaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", page.toString());
    return `/journal?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 border border-stone/60 rounded-lg text-sm font-medium hover:bg-stone/10 hover:border-stone transition-colors"
        >
          Previous
        </Link>
      ) : (
        <button disabled className="px-4 py-2 border border-stone/30 rounded-lg text-sm font-medium text-stone opacity-50 cursor-not-allowed">
          Previous
        </button>
      )}

      <div className="text-sm font-medium text-charcoal-muted mx-4">
        {currentPage} / {totalPages}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-stone/60 rounded-lg text-sm font-medium hover:bg-stone/10 hover:border-stone transition-colors"
        >
          Next
        </Link>
      ) : (
        <button disabled className="px-4 py-2 border border-stone/30 rounded-lg text-sm font-medium text-stone opacity-50 cursor-not-allowed">
          Next
        </button>
      )}
    </div>
  );
}
