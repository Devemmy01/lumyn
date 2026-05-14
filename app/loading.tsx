export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10  border-2 border-sage border-t-sage/30 animate-spin" />
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    </div>
  );
}
