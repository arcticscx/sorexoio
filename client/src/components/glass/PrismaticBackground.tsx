import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface PrismaticBackgroundProps {
  enableParallax?: boolean;
  intensity?: "low" | "medium" | "high";
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
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

  const particles = useMemo(() => {
    const colors = [
      "hsl(162 85% 50%)",
      "hsl(174 72% 55%)",
      "hsl(84 65% 55%)",
      "hsl(186 80% 52%)",
    ];
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      driftX: Math.random() * 40 - 20,
      driftY: -80,
    }));
  }, []);

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

      {/* Floating particles for lively feel */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            filter: "blur(1px)",
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            y: [0, particle.driftY, 0],
            x: [0, particle.driftX, 0],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Shimmer light rays */}
      <motion.div
        className="absolute"
        style={{
          width: "200%",
          height: "2px",
          background: "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)",
          top: "30%",
          left: "-50%",
          transform: "rotate(-15deg)",
        }}
        animate={{
          x: ["-100%", "100%"],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 4,
        }}
      />

      <motion.div
        className="absolute"
        style={{
          width: "150%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.25), transparent)",
          top: "60%",
          left: "-25%",
          transform: "rotate(10deg)",
        }}
        animate={{
          x: ["-100%", "100%"],
          opacity: [0, 0.4, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
          repeatDelay: 5,
        }}
      />

      {/* Pulsing glow spots */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, hsl(162 85% 50% / 0.15), transparent 70%)",
          top: "15%",
          right: "20%",
          filter: "blur(20px)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: "80px",
          height: "80px",
          background: "radial-gradient(circle, hsl(84 65% 55% / 0.12), transparent 70%)",
          bottom: "25%",
          left: "15%",
          filter: "blur(15px)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="noise-overlay" />
    </div>
  );
}
