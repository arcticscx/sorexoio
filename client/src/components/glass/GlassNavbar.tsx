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
  { href: "/exchange", label: "Exchange" },
];

export function GlassNavbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "glass-navbar transition-all duration-300",
        isScrolled && "shadow-lg"
      )}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2"
            data-testid="link-logo"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold prismatic-text">Prismatic</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location === link.href
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
                data-testid={`link-nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg overflow-hidden glass-button text-white px-3 py-1.5 text-sm gap-1.5"
              data-testid="button-admin"
            >
              Admin
            </Link>
            <Link
              href="/exchange"
              className="relative inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-400/30 shadow-glow px-3 py-1.5 text-sm gap-1.5"
              data-testid="button-start-exchange"
            >
              Start Exchange
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <motion.div
        className={cn(
          "md:hidden overflow-hidden",
          !isMobileMenuOpen && "pointer-events-none"
        )}
        initial={false}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-3 rounded-lg text-sm font-medium transition-all",
                location === link.href
                  ? "text-white bg-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid={`link-mobile-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <Link
              href="/admin"
              className="block w-full text-center glass-button text-white px-4 py-2.5 text-sm rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="button-mobile-admin"
            >
              Admin
            </Link>
            <Link
              href="/exchange"
              className="block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white border border-emerald-400/30 shadow-glow px-4 py-2.5 text-sm rounded-lg"
              onClick={() => setIsMobileMenuOpen(false)}
              data-testid="button-mobile-exchange"
            >
              Start Exchange
            </Link>
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
