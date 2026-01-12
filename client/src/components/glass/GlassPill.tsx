import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassPillOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface GlassPillProps {
  options: GlassPillOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function GlassPill({ options, value, onChange, className }: GlassPillProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    
    const activeIndex = options.findIndex(opt => opt.value === value);
    const buttons = containerRef.current.querySelectorAll("button");
    
    if (buttons[activeIndex]) {
      const button = buttons[activeIndex] as HTMLButtonElement;
      setIndicatorStyle({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    }
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex p-1 glass-pill",
        className
      )}
      data-testid="glass-pill-container"
    >
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-white/15 backdrop-blur-sm"
        animate={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "relative z-10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200 flex items-center gap-1.5 sm:gap-2",
            value === option.value
              ? "text-white"
              : "text-white/50 hover:text-white/80"
          )}
          data-testid={`pill-option-${option.value}`}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  );
}
