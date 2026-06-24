"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteButtonProps = {
  endpoint: string;
  itemName: string;
  label?: string;
};

export default function DeleteButton({
  endpoint,
  itemName,
  label = "Delete",
}: DeleteButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function removeItem() {
    const confirmed = window.confirm(
      `Delete ${itemName}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "The item could not be deleted.");
      }

      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The item could not be deleted.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={removeItem}
        disabled={pending}
        className="inline-flex min-h-9 items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 text-xs font-semibold text-red-300 transition hover:border-red-500/40 hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-55"
      >
        {pending && (
          <span
            className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
        )}
        {pending ? "Deleting…" : label}
      </button>
      {error && (
        <span className="max-w-52 text-right text-[11px] text-red-300" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
