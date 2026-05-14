import Link from "next/link";


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
          className="px-4 py-2  text-sm font-medium hover:opacity-80 transition-all"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-primary)"
          }}
        >
          Previous
        </Link>
      ) : (
        <button disabled className="px-4 py-2  text-sm font-medium opacity-50 cursor-not-allowed" style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-secondary)",
          color: "var(--text-tertiary)",
          border: "1px solid var(--border-secondary)"
        }}>
          Previous
        </button>
      )}

      <div className="text-sm font-medium mx-4" style={{ color: "var(--text-secondary)" }}>
        {currentPage} / {totalPages}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2  text-sm font-medium hover:opacity-80 transition-all"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-primary)"
          }}
        >
          Next
        </Link>
      ) : (
        <button disabled className="px-4 py-2  text-sm font-medium opacity-50 cursor-not-allowed" style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border-secondary)",
          color: "var(--text-tertiary)",
          border: "1px solid var(--border-secondary)"
        }}>
          Next
        </button>
      )}
    </div>
  );
}
