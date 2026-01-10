import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/exchange", label: "Buy Crypto" },
];

export function GlassNavbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-4 left-1/2 z-50"
        initial={{ opacity: 0, y: -20, x: "-50%" }}
        animate={{ opacity: 1, y: 0, x: "-50%" }}
        transition={{ 
          duration: 0.6, 
          ease: [0.23, 1, 0.32, 1],
          delay: 0.1 
        }}
        data-testid="navbar"
      >
        <div className="apple-glass-hotbar">
          <div className="apple-glass-inner">
            <Link
              href="/"
              className="flex items-center gap-2 pr-4 border-r border-white/10"
              data-testid="link-logo"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-semibold prismatic-text hidden sm:block font-questrial">
                Prismatic
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-item-glass",
                    location === link.href && "nav-item-glass-active"
                  )}
                  data-testid={`link-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className={cn(
                  "nav-item-glass",
                  location === "/admin" && "nav-item-glass-active"
                )}
                data-testid="link-nav-admin"
              >
                Admin
              </Link>
            </div>

            <div className="hidden md:block pl-2 border-l border-white/10">
              <Link
                href="/exchange"
                className="get-started-glass"
                data-testid="button-get-started"
              >
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          !isMobileMenuOpen && "pointer-events-none"
        )}
        initial={false}
        animate={{
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <motion.div
          className="absolute top-20 left-4 right-4 apple-glass-hotbar"
          initial={false}
          animate={{
            opacity: isMobileMenuOpen ? 1 : 0,
            y: isMobileMenuOpen ? 0 : -10,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-5 py-4 rounded-xl text-base font-medium transition-all duration-200",
                  location === link.href
                    ? "text-white bg-white/15"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`link-mobile-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className={cn(
                "block px-5 py-4 rounded-xl text-base font-medium transition-all duration-200",
                location === "/admin"
                  ? "text-white bg-white/15"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="link-mobile-admin"
            >
              Admin
            </Link>
            <div className="pt-3">
              <Link
                href="/exchange"
                className="block w-full text-center liquid-glass-cta py-4 text-base font-semibold"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="button-mobile-get-started"
              >
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
