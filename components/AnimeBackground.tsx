"use client";

import { useEffect, useRef } from "react";

const COLUMNS = 20;
const ROWS = 10;
const DOT_COUNT = COLUMNS * ROWS;

export default function AnimeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const centerColumn = (COLUMNS - 1) / 2;
    const centerRow = (ROWS - 1) / 2;
    const animations = Array.from(containerRef.current.children).map((dot, index) => {
      const column = index % COLUMNS;
      const row = Math.floor(index / COLUMNS);
      const distance = Math.hypot(column - centerColumn, row - centerRow);

      return dot.animate(
        [
          { transform: "scale(1)", opacity: 0.12 },
          { transform: "scale(2)", opacity: 1, offset: 0.7 },
          { transform: "scale(1)", opacity: 0.12 },
        ],
        {
          duration: 2600,
          delay: distance * 85,
          iterations: Infinity,
          easing: "ease-in-out",
        }
      );
    });

    return () => animations.forEach((animation) => animation.cancel());

  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-50 mix-blend-screen">
      <div
        ref={containerRef}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
          gap: "40px",
        }}
      >
        {Array.from({ length: DOT_COUNT }, (_, index) => (
          <span
            key={index}
            className="h-1 w-1 rounded-full bg-[#7c6cf6]/40"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
