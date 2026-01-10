import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import cursorImage from "@/assets/cursor-prismatic.png";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasPointer, setHasPointer] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const isPointerDevice = window.matchMedia("(pointer: fine)").matches;
    setHasPointer(isPointerDevice);

    if (!isPointerDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!isMounted || !hasPointer) return null;

  return (
    <>
      <style>{`
        html, body, div, span, a, button, [role="button"] {
          cursor: none !important;
        }
        input, textarea, [contenteditable="true"] {
          cursor: text !important;
        }
        input[type="range"] {
          cursor: grab !important;
        }
        [data-resize], .resize-handle {
          cursor: ew-resize !important;
        }
      `}</style>
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      >
        <img
          src={cursorImage}
          alt=""
          className="w-8 h-8 object-contain drop-shadow-lg"
          draggable={false}
        />
      </motion.div>
    </>
  );
}
