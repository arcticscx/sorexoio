import { useEffect, useState, useRef, useMemo } from "react";
import { motion } from "framer-motion";

interface PrismaticBackgroundProps {
  enableParallax?: boolean;
  intensity?: "low" | "medium" | "high";
}

function useDeviceCapabilities() {
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    setIsMobile(mobileQuery.matches);
    setPrefersReducedMotion(motionQuery.matches);

    const handleMobileChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mobileQuery.addEventListener("change", handleMobileChange);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      mobileQuery.removeEventListener("change", handleMobileChange);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return { isMobile, prefersReducedMotion };
}

export function PrismaticBackground({ 
  enableParallax = true, 
  intensity = "medium" 
}: PrismaticBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, prefersReducedMotion } = useDeviceCapabilities();

  const shouldUseSimpleMode = isMobile || prefersReducedMotion;

  const parallaxMultiplier = {
    low: 10,
    medium: 20,
    high: 30,
  }[intensity];

  const blobOpacity = {
    low: 0.15,
    medium: 0.25,
    high: 0.35,
  }[intensity];

  const allParticles = useMemo(() => {
    const colors = [
      "hsl(0 0% 60%)",
      "hsl(0 0% 70%)",
      "hsl(0 0% 80%)",
      "hsl(0 0% 50%)",
      "hsl(0 0% 65%)",
    ];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      driftX: Math.random() * 60 - 30,
      driftY: Math.random() * -100 - 50,
      glowSize: Math.random() * 8 + 4,
    }));
  }, []);

  const particles = shouldUseSimpleMode ? allParticles.slice(0, 5) : allParticles;

  useEffect(() => {
    if (!enableParallax || shouldUseSimpleMode) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [enableParallax, shouldUseSimpleMode]);

  const effectiveParallax = enableParallax && !shouldUseSimpleMode;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1, background: "hsl(0 0% 2%)" }}
      data-testid="prismatic-background"
    >
      <div 
        className="absolute inset-0" 
        style={{ 
          background: "radial-gradient(ellipse at 50% 0%, hsl(0 0% 8%) 0%, hsl(0 0% 2%) 60%, hsl(0 0% 0%) 100%)" 
        }} 
      />
      
      <motion.div
        className="absolute rounded-full"
        style={{
          width: shouldUseSimpleMode ? "60vw" : "80vw",
          height: shouldUseSimpleMode ? "60vw" : "80vw",
          maxWidth: shouldUseSimpleMode ? "600px" : "1200px",
          maxHeight: shouldUseSimpleMode ? "600px" : "1200px",
          background: "radial-gradient(circle, hsl(0 0% 15%), transparent 60%)",
          top: "-20%",
          left: "-15%",
          opacity: 0.12,
          filter: shouldUseSimpleMode ? "blur(40px)" : "blur(80px)",
          willChange: shouldUseSimpleMode ? "auto" : "transform",
        }}
        animate={shouldUseSimpleMode ? {} : {
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
        className="absolute rounded-full"
        style={{
          width: shouldUseSimpleMode ? "50vw" : "70vw",
          height: shouldUseSimpleMode ? "50vw" : "70vw",
          maxWidth: shouldUseSimpleMode ? "500px" : "1000px",
          maxHeight: shouldUseSimpleMode ? "500px" : "1000px",
          background: "radial-gradient(circle, hsl(0 0% 18%), transparent 55%)",
          top: "30%",
          left: "25%",
          opacity: 0.1,
          filter: shouldUseSimpleMode ? "blur(30px)" : "blur(80px)",
          willChange: shouldUseSimpleMode ? "auto" : "transform",
        }}
        animate={shouldUseSimpleMode ? {} : {
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
        className="absolute rounded-full"
        style={{
          width: shouldUseSimpleMode ? "40vw" : "60vw",
          height: shouldUseSimpleMode ? "40vw" : "60vw",
          maxWidth: shouldUseSimpleMode ? "400px" : "900px",
          maxHeight: shouldUseSimpleMode ? "400px" : "900px",
          background: "radial-gradient(circle, hsl(0 0% 12%), transparent 55%)",
          bottom: "-10%",
          right: "-10%",
          opacity: 0.08,
          filter: shouldUseSimpleMode ? "blur(30px)" : "blur(80px)",
          willChange: shouldUseSimpleMode ? "auto" : "transform",
        }}
        animate={shouldUseSimpleMode ? {} : {
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

      <motion.div
        className="gradient-blob"
        style={{
          width: shouldUseSimpleMode ? "50vw" : "60vw",
          height: shouldUseSimpleMode ? "50vw" : "60vw",
          maxWidth: shouldUseSimpleMode ? "400px" : "800px",
          maxHeight: shouldUseSimpleMode ? "400px" : "800px",
          background: "radial-gradient(circle, hsl(0 0% 20% / 0.5), transparent 70%)",
          top: "10%",
          left: "5%",
          opacity: blobOpacity * 0.6,
          x: effectiveParallax ? mousePosition.x * parallaxMultiplier : 0,
          y: effectiveParallax ? mousePosition.y * parallaxMultiplier : 0,
          willChange: effectiveParallax ? "transform" : "auto",
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <motion.div
        className="gradient-blob"
        style={{
          width: shouldUseSimpleMode ? "40vw" : "50vw",
          height: shouldUseSimpleMode ? "40vw" : "50vw",
          maxWidth: shouldUseSimpleMode ? "350px" : "700px",
          maxHeight: shouldUseSimpleMode ? "350px" : "700px",
          background: "radial-gradient(circle, hsl(0 0% 22% / 0.4), transparent 70%)",
          top: "40%",
          right: "10%",
          opacity: blobOpacity * 0.5,
          x: effectiveParallax ? -mousePosition.x * parallaxMultiplier * 0.8 : 0,
          y: effectiveParallax ? -mousePosition.y * parallaxMultiplier * 0.8 : 0,
          willChange: effectiveParallax ? "transform" : "auto",
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <motion.div
        className="gradient-blob"
        style={{
          width: shouldUseSimpleMode ? "35vw" : "45vw",
          height: shouldUseSimpleMode ? "35vw" : "45vw",
          maxWidth: shouldUseSimpleMode ? "300px" : "600px",
          maxHeight: shouldUseSimpleMode ? "300px" : "600px",
          background: "radial-gradient(circle, hsl(0 0% 25% / 0.35), transparent 70%)",
          bottom: "5%",
          left: "25%",
          opacity: blobOpacity * 0.5,
          x: effectiveParallax ? mousePosition.x * parallaxMultiplier * 0.6 : 0,
          y: effectiveParallax ? -mousePosition.y * parallaxMultiplier * 0.6 : 0,
          willChange: effectiveParallax ? "transform" : "auto",
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />

      <motion.div
        className="gradient-blob"
        style={{
          width: shouldUseSimpleMode ? "20vw" : "30vw",
          height: shouldUseSimpleMode ? "20vw" : "30vw",
          maxWidth: shouldUseSimpleMode ? "200px" : "400px",
          maxHeight: shouldUseSimpleMode ? "200px" : "400px",
          background: "radial-gradient(circle, hsl(0 0% 30% / 0.3), transparent 70%)",
          top: "60%",
          left: "60%",
          opacity: blobOpacity * 0.4,
          willChange: prefersReducedMotion ? "auto" : "transform, opacity",
        }}
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.1, 1],
          opacity: [blobOpacity * 0.4, blobOpacity * 0.6, blobOpacity * 0.4],
        }}
        transition={{
          duration: shouldUseSimpleMode ? 12 : 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {!prefersReducedMotion && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            background: particle.color,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: `0 0 ${particle.glowSize}px ${particle.color}, 0 0 ${particle.glowSize * 2}px ${particle.color}`,
            willChange: "transform, opacity",
          }}
          animate={{
            y: [0, particle.driftY, 0],
            x: [0, particle.driftX, 0],
            opacity: [0, 0.6, 0],
            scale: [0.3, 1.2, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}


      {!shouldUseSimpleMode && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: "100px",
              height: "100px",
              background: "radial-gradient(circle, hsl(0 0% 40% / 0.15), transparent 70%)",
              top: "15%",
              right: "20%",
              filter: "blur(20px)",
              willChange: "transform, opacity",
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
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
              background: "radial-gradient(circle, hsl(0 0% 45% / 0.12), transparent 70%)",
              bottom: "25%",
              left: "15%",
              filter: "blur(15px)",
              willChange: "transform, opacity",
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.15, 0.35, 0.15],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </>
      )}

      <div className="noise-overlay" />
    </div>
  );
}
