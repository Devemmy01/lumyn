"use client";

import { useEffect, useState } from "react";

const POSITIONS = [
  { top: "6%", left: "6%" },
  { top: "6%", right: "6%" },
  { bottom: "10%", right: "6%" },
  { bottom: "10%", left: "6%" },
];

export function WatermarkOverlay({ text }: { text: string }) {
  const [positionIndex, setPositionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositionIndex((current) => (current + 1) % POSITIONS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]"
    >
      <span
        className="absolute rounded-full bg-black/35 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white/70 backdrop-blur-sm transition-all duration-1000 ease-in-out"
        style={POSITIONS[positionIndex]}
      >
        {text}
      </span>
    </div>
  );
}
