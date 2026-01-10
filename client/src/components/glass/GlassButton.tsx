import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, keyof ButtonHTMLAttributes<HTMLButtonElement>>, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  shimmer?: boolean;
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = "default", size = "md", shimmer = false, children, disabled, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg overflow-hidden";
    
    const variants = {
      default: "glass-button text-white",
      primary: "liquid-glass-cta text-white",
      ghost: "bg-transparent hover:bg-white/10 text-white",
      outline: "bg-transparent border border-white/20 text-white hover:bg-white/10",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2.5",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled}
        {...props}
      >
        {shimmer && (
          <div 
            className="absolute inset-0 shimmer-effect pointer-events-none"
            style={{ opacity: 0.5 }}
          />
        )}
        {children}
      </motion.button>
    );
  }
);

GlassButton.displayName = "GlassButton";
