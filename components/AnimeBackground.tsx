"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export default function AnimeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const wrapper = containerRef.current;
    
    // Create grid of dots
    const cols = 20;
    const rows = 10;
    
    wrapper.innerHTML = "";
    
    for (let i = 0; i < cols * rows; i++) {
        const d = document.createElement("div");
        d.classList.add("dot");
        // base styling
        d.style.width = "4px";
        d.style.height = "4px";
        d.style.backgroundColor = "rgba(124, 108, 246, 0.4)";
        d.style.borderRadius = "50%";
        wrapper.appendChild(d);
    }

    animate(".dot", {
      scale: [
        {to: 2, ease: 'inOutQuad', duration: 1200},
        {to: 1, ease: 'inOutSine', duration: 500}
      ],
      opacity: [
        {to: 1, ease: 'inOutQuad', duration: 1200},
        {to: 0.1, ease: 'inOutSine', duration: 500}
      ],
      delay: stagger(200, {grid: [cols, rows], from: 'center'}),
      loop: true,
      alternate: true
    });

  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-50 mix-blend-screen">
      <div 
        ref={containerRef} 
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(20, 1fr)",
            gap: "40px",
        }}
      />
    </div>
  );
}
