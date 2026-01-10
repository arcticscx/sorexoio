import { forwardRef, InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, error, success, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "glass-input",
            error && "border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]",
            success && "border-emerald-500/50 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.15)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = "GlassInput";
