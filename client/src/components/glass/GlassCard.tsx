import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "elevated" | "subtle";
  glow?: boolean;
  hover?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow = false, hover = true, children, ...props }, ref) => {
    const variants = {
      default: "glass-card",
      elevated: "glass-card shadow-glass-lg",
      subtle: "glass-card bg-white/5",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          variants[variant],
          glow && "shadow-glow",
          hover && "transition-all duration-300",
          className
        )}
        whileHover={hover ? { 
          y: -4, 
          boxShadow: "0 16px 48px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.15)" 
        } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
