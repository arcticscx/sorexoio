import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Shield, Zap, Globe, TrendingUp, Sparkles } from "lucide-react";
import { GlassCard, GlassButton, GlassPill, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { TransactionFeed } from "@/components/TransactionFeed";
import type { Transaction } from "@shared/schema";

const periodOptions = [
  { value: "24h", label: "24 Hours" },
  { value: "7d", label: "7 Days" },
  { value: "30d", label: "30 Days" },
  { value: "all", label: "All Time" },
];

const features = [
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Bank-grade encryption protects every transaction",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Complete exchanges in under 10 minutes",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Available in 150+ countries worldwide",
  },
  {
    icon: TrendingUp,
    title: "Best Rates",
    description: "Competitive rates updated in real-time",
  },
];

export default function Home() {
  const [period, setPeriod] = useState("24h");
  const [stats, setStats] = useState({
    totalVolume: 2847563,
    totalTransactions: 12847,
    activeUsers: 3249,
  });

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 1000),
        totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <PrismaticBackground intensity="medium" enableParallax />
      <GlassNavbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="text-center py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-pill mb-6">
                <span className="text-sm text-white/80">The Future of Crypto Exchange</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance" style={{ fontFamily: "Satoshi, var(--font-sans)" }}>
                Purchase Crypto with{" "}
                <span className="prismatic-text" style={{ fontFamily: "var(--font-logo)" }}>Crystal Clarity</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 text-balance">
                Experience the most seamless cryptocurrency exchange platform. 
                Fast, secure, and beautifully designed for the modern trader.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-hero-exchange">
                    Start Exchange
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <GlassButton variant="outline" size="lg" data-testid="button-learn-more">
                  Learn More
                </GlassButton>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-4 sm:p-6 text-center" hover={false}>
                <div className="text-2xl sm:text-3xl font-bold prismatic-text">
                  ${(stats.totalVolume / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">Volume (24h)</div>
              </GlassCard>
              <GlassCard className="p-4 sm:p-6 text-center" hover={false}>
                <div className="text-2xl sm:text-3xl font-bold prismatic-text">
                  {stats.totalTransactions.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">Transactions</div>
              </GlassCard>
              <GlassCard className="p-4 sm:p-6 text-center" hover={false}>
                <div className="text-2xl sm:text-3xl font-bold prismatic-text">
                  {stats.activeUsers.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">Active Users</div>
              </GlassCard>
            </motion.div>
          </section>

          <section className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Live Activity
                  </h2>
                  <p className="text-white/50">
                    Watch real-time transactions across the platform
                  </p>
                </div>
                <GlassPill
                  options={periodOptions}
                  value={period}
                  onChange={setPeriod}
                />
              </div>

              <TransactionFeed transactions={transactions} isLoading={isLoading} />
            </motion.div>
          </section>

          <section className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Why Choose Prismatic?
                </h2>
                <p className="text-white/50 max-w-xl mx-auto">
                  Built with cutting-edge technology for the best trading experience
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6 h-full" data-testid={`feature-card-${index}`}>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-white/50 text-sm">
                        {feature.description}
                      </p>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          <section className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <GlassCard className="p-8 sm:p-12 text-center" variant="elevated" glow>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Start Trading?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Join thousands of traders who trust Prismatic for their cryptocurrency exchanges.
                </p>
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-cta-exchange">
                    Create Your First Exchange
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
              </GlassCard>
            </motion.div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold prismatic-text">Prismatic</span>
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Prismatic Exchange. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
