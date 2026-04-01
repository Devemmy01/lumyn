import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: "#F8F7F4",
          50: "#FDFCFA",
          100: "#F8F7F4",
          200: "#EEECEA",
        },
        charcoal: {
          DEFAULT: "#1F1F1F",
          light: "#3A3A3A",
          muted: "#6B6B6B",
        },
        sage: {
          DEFAULT: "#7C6CF6",
          light: "#A99EF9",
          dark: "#5E4EE0",
        },
        stone: {
          DEFAULT: "#D8D6CF",
          light: "#E8E7E2",
          dark: "#B8B5AD",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.375rem, 2.5vw, 1.875rem)", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
      },
      spacing: {
        "section": "clamp(5rem, 10vw, 9rem)",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(31,31,31,0.06)",
        "soft-md": "0 4px 30px rgba(31,31,31,0.08)",
        "soft-lg": "0 8px 50px rgba(31,31,31,0.1)",
        card: "0 2px 16px rgba(31,31,31,0.05), 0 1px 4px rgba(31,31,31,0.04)",
        "card-hover": "0 12px 48px rgba(31,31,31,0.09), 0 3px 10px rgba(31,31,31,0.05)",
        "violet-glow": "0 0 24px rgba(124,108,246,0.18)",
        "violet-glow-lg": "0 0 48px rgba(124,108,246,0.22)",
        "violet-glow-btn": "0 4px 20px rgba(124,108,246,0.24)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.svg')",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "700": "700ms",
      },
      animation: {
        "fade-up":  "fadeUp 0.6s ease-out forwards",
        "fade-in":  "fadeIn 0.5s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
        "marquee":  "marquee 28s linear infinite",
        "float-y":  "floatY 5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%":   { opacity: "0", transform: "translateX(-10px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floatY: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.5" },
          "50%":      { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
