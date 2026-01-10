import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface PrismaticBackgroundProps {
  enableParallax?: boolean;
  intensity?: "low" | "medium" | "high";
}

export function PrismaticBackground({ 
  enableParallax = true, 
  intensity = "medium" 
}: PrismaticBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const parallaxMultiplier = {
    low: 10,
    medium: 20,
    high: 30,
  }[intensity];

  const blobOpacity = {
    low: 0.25,
    medium: 0.4,
    high: 0.55,
  }[intensity];

  useEffect(() => {
    if (!enableParallax) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableParallax]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1 }}
      data-testid="prismatic-background"
    >
      <div className="absolute inset-0 prismatic-gradient" />
      
      {/* Ultra-soft depth layers (Apple-style) - 6-10% opacity with slow drift */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "80vw",
          height: "80vw",
          maxWidth: "1200px",
          maxHeight: "1200px",
          background: "radial-gradient(circle, hsl(162 85% 40%), transparent 60%)",
          top: "-20%",
          left: "-15%",
          opacity: 0.08,
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.05, 0.98, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "70vw",
          height: "70vw",
          maxWidth: "1000px",
          maxHeight: "1000px",
          background: "radial-gradient(circle, hsl(174 72% 45%), transparent 55%)",
          top: "30%",
          left: "25%",
          opacity: 0.07,
        }}
        animate={{
          x: [-30, 50, -20, -30],
          y: [20, -40, 30, 20],
          scale: [1, 0.95, 1.03, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "900px",
          maxHeight: "900px",
          background: "radial-gradient(circle, hsl(84 65% 50%), transparent 55%)",
          bottom: "-10%",
          right: "-10%",
          opacity: 0.06,
        }}
        animate={{
          x: [20, -40, 30, 20],
          y: [-20, 40, -30, -20],
          scale: [1, 1.04, 0.97, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Primary gradient blobs with parallax */}
      <motion.div
        className="gradient-blob animate-blob-drift"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: "800px",
          maxHeight: "800px",
          background: "radial-gradient(circle, hsl(162 85% 35% / 0.6), transparent 70%)",
          top: "10%",
          left: "5%",
          opacity: blobOpacity,
          x: enableParallax ? mousePosition.x * parallaxMultiplier : 0,
          y: enableParallax ? mousePosition.y * parallaxMultiplier : 0,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <motion.div
        className="gradient-blob animate-blob-drift-2"
        style={{
          width: "50vw",
          height: "50vw",
          maxWidth: "700px",
          maxHeight: "700px",
          background: "radial-gradient(circle, hsl(174 72% 40% / 0.5), transparent 70%)",
          top: "40%",
          right: "10%",
          opacity: blobOpacity,
          x: enableParallax ? -mousePosition.x * parallaxMultiplier * 0.8 : 0,
          y: enableParallax ? -mousePosition.y * parallaxMultiplier * 0.8 : 0,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <motion.div
        className="gradient-blob animate-blob-drift-3"
        style={{
          width: "45vw",
          height: "45vw",
          maxWidth: "600px",
          maxHeight: "600px",
          background: "radial-gradient(circle, hsl(84 65% 45% / 0.4), transparent 70%)",
          bottom: "5%",
          left: "25%",
          opacity: blobOpacity * 0.8,
          x: enableParallax ? mousePosition.x * parallaxMultiplier * 0.6 : 0,
          y: enableParallax ? -mousePosition.y * parallaxMultiplier * 0.6 : 0,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <motion.div
        className="gradient-blob"
        style={{
          width: "30vw",
          height: "30vw",
          maxWidth: "400px",
          maxHeight: "400px",
          background: "radial-gradient(circle, hsl(186 80% 42% / 0.35), transparent 70%)",
          top: "60%",
          left: "60%",
          opacity: blobOpacity * 0.6,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [blobOpacity * 0.6, blobOpacity * 0.8, blobOpacity * 0.6],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="noise-overlay" />
    </div>
  );
}
