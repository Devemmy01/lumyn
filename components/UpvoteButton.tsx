"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";

interface UpvoteButtonProps {
  postId: string;
  initialUpvotes: number;
}

export default function UpvoteButton({ postId, initialUpvotes }: UpvoteButtonProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const upvoted = localStorage.getItem(`upvoted-${postId}`);
    if (upvoted === "true") {
      setHasUpvoted(true);
    }
  }, [postId]);

  const handleUpvote = async () => {
    if (hasUpvoted) return;

    // Optimistic UI update
    setUpvotes((prev) => prev + 1);
    setHasUpvoted(true);
    setIsAnimating(true);
    localStorage.setItem(`upvoted-${postId}`, "true");

    setTimeout(() => setIsAnimating(false), 1000);

    try {
      const res = await fetch(`/api/posts/${postId}/upvote`, {
        method: "POST",
      });
      if (!res.ok) {
        // Revert on failure
        setUpvotes((prev) => prev - 1);
        setHasUpvoted(false);
        localStorage.removeItem(`upvoted-${postId}`);
      }
    } catch (error) {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
      localStorage.removeItem(`upvoted-${postId}`);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={hasUpvoted}
      className={clsx(
        "group flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300",
        hasUpvoted
          ? "border-sage bg-sage/10 text-sage cursor-default"
          : "border-stone/60 hover:border-sage hover:bg-sage/5 text-charcoal-muted hover:text-charcoal cursor-pointer"
      )}
      aria-label="Upvote this post"
    >
      <div className="relative flex items-center justify-center">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill={hasUpvoted ? "currentColor" : "none"}
          className={clsx(
            "transition-transform duration-300",
            hasUpvoted ? "scale-110" : "group-hover:scale-110 group-active:scale-90",
            isAnimating && "animate-bounce"
          )}
        >
          <path
            d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-medium">{upvotes}</span>
    </button>
  );
}
