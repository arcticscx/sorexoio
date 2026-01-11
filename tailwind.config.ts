import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "1.125rem",
        md: "0.75rem",
        sm: "0.375rem",
        xl: "1.5rem",
        "2xl": "1.75rem",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)",
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.10)",
          border: "rgba(255, 255, 255, 0.18)",
          highlight: "rgba(255, 255, 255, 0.25)",
          dark: "rgba(0, 0, 0, 0.20)",
          "dark-border": "rgba(255, 255, 255, 0.08)",
        },
        prismatic: {
          emerald: "hsl(162 85% 35%)",
          teal: "hsl(174 72% 40%)",
          lime: "hsl(84 65% 50%)",
          cyan: "hsl(186 80% 42%)",
        },
      },
      fontFamily: {
        sans: ["Questrial", "sans-serif"],
        display: ["Questrial", "sans-serif"],
        serif: ["Questrial", "sans-serif"],
        mono: ["Questrial", "sans-serif"],
        questrial: ["Questrial", "sans-serif"],
      },
      backdropBlur: {
        glass: "18px",
      },
      backdropSaturate: {
        glass: "160%",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "blob-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -50px) scale(1.05)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.95)" },
          "75%": { transform: "translate(-30px, -30px) scale(1.02)" },
        },
        "blob-drift-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(-40px, 30px) scale(0.98)" },
          "50%": { transform: "translate(50px, -20px) scale(1.03)" },
          "75%": { transform: "translate(20px, 40px) scale(0.97)" },
        },
        "blob-drift-3": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-25px, -40px) scale(1.04)" },
          "66%": { transform: "translate(35px, 25px) scale(0.96)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-indicator": {
          "0%": { transform: "translateX(var(--from-x))" },
          "100%": { transform: "translateX(var(--to-x))" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "blob-drift": "blob-drift 25s ease-in-out infinite",
        "blob-drift-2": "blob-drift-2 30s ease-in-out infinite",
        "blob-drift-3": "blob-drift-3 35s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "slide-indicator": "slide-indicator 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
        "glass-lg": "0 16px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        glow: "0 0 40px rgba(16, 185, 129, 0.3)",
        "glow-lg": "0 0 60px rgba(16, 185, 129, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
