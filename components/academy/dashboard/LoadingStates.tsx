"use client";

export function LoadingSpinner() {
  return (
    <span
      className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
  );
}
export function DashboardLoading({ delayed = false }: { delayed?: boolean }) {
  return (
    <div className="min-h-screen bg-[#f2f1ed] dark:bg-[#08090c]">
      <header className="h-[72px] border-b border-black/[0.08] bg-white/60 dark:border-white/[0.08] dark:bg-[#0b0c10]" />
      <div className="mx-auto grid max-w-[1720px] lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100vh-72px)] border-r border-black/[0.08] p-6 dark:border-white/[0.08] lg:block">
          <div className="h-3 w-20 animate-pulse rounded bg-black/[0.08] dark:bg-white/[0.08]" />
          <div className="mt-6 space-y-3">
            {[0, 1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-11 animate-pulse rounded-xl bg-black/[0.05] dark:bg-white/[0.05]"
              />
            ))}
          </div>
        </aside>
        <main className="p-5 sm:p-8">
          {delayed && (
            <div className="mb-4 flex items-center gap-3 rounded-2xl border border-[#7c6cf6]/20 bg-[#7c6cf6]/[0.07] px-4 py-3 text-sm font-semibold text-[#6555db] dark:text-[#c8c1ff]">
              <LoadingSpinner />
              Preparing your Academy workspace…
            </div>
          )}
          <div className="h-52 animate-pulse rounded-[2rem] bg-black/[0.06] dark:bg-white/[0.06]" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-black/[0.05] dark:bg-white/[0.05]"
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
