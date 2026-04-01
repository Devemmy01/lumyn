export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-ivory">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-stone border-t-sage animate-spin" />
        <p className="text-sm text-charcoal-muted">Loading...</p>
      </div>
    </div>
  );
}
