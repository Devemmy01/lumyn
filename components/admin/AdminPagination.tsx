import Link from "next/link";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams: URLSearchParams;
}

export default function AdminPagination({
  currentPage,
  totalPages,
  baseUrl,
  queryParams,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(queryParams.toString());
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
      <div className="text-xs sm:text-sm text-gray-500 font-medium order-2 sm:order-1">
        Page <span className="text-charcoal font-semibold">{currentPage}</span> of{" "}
        <span className="text-charcoal font-semibold">{totalPages}</span>
      </div>
      <div className="flex items-center gap-2 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        {currentPage > 1 ? (
          <Link
            href={createPageUrl(currentPage - 1)}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-stone/40 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory-200 transition-all text-center"
          >
            Previous
          </Link>
        ) : (
          <button disabled className="flex-1 sm:flex-none px-4 py-2 border border-stone/20 rounded-xl text-sm font-medium text-stone-400 cursor-not-allowed text-center">
            Previous
          </button>
        )}

        {currentPage < totalPages ? (
          <Link
            href={createPageUrl(currentPage + 1)}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-stone/40 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory-200 transition-all text-center"
          >
            Next
          </Link>
        ) : (
          <button disabled className="flex-1 sm:flex-none px-4 py-2 border border-stone/20 rounded-xl text-sm font-medium text-stone-400 cursor-not-allowed text-center">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
