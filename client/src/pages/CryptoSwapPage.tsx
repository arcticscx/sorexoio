import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDownUp, Shield, Zap, CheckCircle, Sparkles, Clock, TrendingUp, Percent } from "lucide-react";
import { GlassCard, GlassButton, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { Seo } from "@/components/Seo";

const benefits = [
  {
    icon: Percent,
    title: "0.2% Fee Only",
    description: "Industry-leading low fees on all crypto-to-crypto swaps",
  },
  {
    icon: Zap,
    title: "Instant Swaps",
    description: "Exchange between cryptocurrencies in seconds",
  },
  {
    icon: Shield,
    title: "No Registration",
    description: "Swap without creating an account or KYC",
  },
  {
    icon: TrendingUp,
    title: "Best Rates",
    description: "Real-time rates from top liquidity providers",
  },
];

const supportedPairs = [
  { from: "BTC", to: "ETH", name: "Bitcoin to Ethereum" },
  { from: "ETH", to: "USDT", name: "Ethereum to Tether" },
  { from: "BTC", to: "SOL", name: "Bitcoin to Solana" },
  { from: "LTC", to: "BTC", name: "Litecoin to Bitcoin" },
  { from: "XRP", to: "ETH", name: "Ripple to Ethereum" },
  { from: "BNB", to: "USDC", name: "BNB to USD Coin" },
];

const steps = [
  { step: 1, title: "Select Pair", description: "Choose which cryptocurrencies to exchange" },
  { step: 2, title: "Enter Amount", description: "Specify how much you want to swap" },
  { step: 3, title: "Provide Address", description: "Enter your receiving wallet address" },
  { step: 4, title: "Send & Receive", description: "Send crypto and receive your swap" },
];

export default function CryptoSwapPage() {
  useEffect(() => {
    document.title = "Crypto Swap | Exchange Bitcoin, Ethereum & More – ZengoSwap";
  }, []);

  return (
    <div className="min-h-screen">
      <Seo />
      <PrismaticBackground intensity="medium" enableParallax />
      <GlassNavbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="text-center py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-pill mb-6">
                <ArrowDownUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/80">0.2% Fee Only</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                Swap Crypto{" "}
                <span className="zengo-text">Instantly</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 text-balance">
                Exchange Bitcoin, Ethereum, Solana, and more with our instant crypto-to-crypto swap service. 
                Just 0.2% fee, $50-$1M limits, and no registration required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/swap">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-swap-now">
                    Start Swapping
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/supported-coins">
                  <GlassButton variant="outline" size="lg" data-testid="button-view-pairs">
                    View All Coins
                  </GlassButton>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mt-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-4 sm:p-6 text-center" hover={false}>
                <div className="text-2xl sm:text-3xl font-bold zengo-text">0.2%</div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">Swap Fee</div>
              </GlassCard>
              <GlassCard className="p-4 sm:p-6 text-center" hover={false}>
                <div className="text-2xl sm:text-3xl font-bold zengo-text">$50</div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">Minimum Swap</div>
              </GlassCard>
              <GlassCard className="p-4 sm:p-6 text-center" hover={false}>
                <div className="text-2xl sm:text-3xl font-bold zengo-text">$1M</div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">Maximum Swap</div>
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
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Why Swap with ZengoSwap?
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  Our crypto swap service offers the lowest fees, fastest execution, and widest selection 
                  of trading pairs in the industry.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6 h-full" data-testid={`benefit-card-${index}`}>
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-white/50 text-sm">
                        {benefit.description}
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
              <GlassCard className="p-8 sm:p-12" variant="elevated">
                <div className="text-center mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    How Crypto Swap Works
                  </h2>
                  <p className="text-white/50 max-w-2xl mx-auto">
                    Swapping cryptocurrencies on ZengoSwap is simple and straightforward. Follow these 
                    four easy steps to complete your exchange.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((item, index) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-white/50 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
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
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Popular Trading Pairs
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  Swap between any of our supported cryptocurrencies. Here are some of the most popular pairs.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {supportedPairs.map((pair, index) => (
                  <motion.div
                    key={`${pair.from}-${pair.to}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <GlassCard className="p-4" data-testid={`pair-card-${index}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-white font-bold">{pair.from}</span>
                            <ArrowRight className="w-4 h-4 text-emerald-400" />
                            <span className="text-white font-bold">{pair.to}</span>
                          </div>
                        </div>
                        <Link href="/swap">
                          <GlassButton variant="ghost" size="sm" data-testid={`swap-pair-${index}`}>
                            Swap
                          </GlassButton>
                        </Link>
                      </div>
                      <p className="text-white/50 text-sm mt-2">{pair.name}</p>
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
              <div className="grid lg:grid-cols-2 gap-8">
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Swap Limits & Fees
                  </h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Minimum Swap</span>
                      <span className="text-white font-medium">$50 USD equivalent</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Maximum Swap</span>
                      <span className="text-white font-medium">$1,000,000 USD equivalent</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Swap Fee</span>
                      <span className="text-emerald-400 font-medium">0.2% only</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                      <span className="text-white/60">Network Fees</span>
                      <span className="text-white font-medium">Included in rate</span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Swap Advantages
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">No Account Required</h3>
                        <p className="text-white/50 text-sm">Start swapping immediately without registration</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">Fixed Rates Available</h3>
                        <p className="text-white/50 text-sm">Lock in your rate for 15 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">10+ Cryptocurrencies</h3>
                        <p className="text-white/50 text-sm">Swap between all major cryptocurrencies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">24/7 Availability</h3>
                        <p className="text-white/50 text-sm">Swap anytime, anywhere in the world</p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
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
                  Ready to Swap Your Crypto?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Exchange between cryptocurrencies instantly with the lowest fees in the industry.
                </p>
                <Link href="/swap">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-cta-swap">
                    Start Swapping Now
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
              </GlassCard>
            </motion.div>
          </section>

          <section className="py-8">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/buy-crypto-with-paypal" className="text-white/50 hover:text-white transition-colors">
                Buy with PayPal
              </Link>
              <Link href="/card-to-crypto" className="text-white/50 hover:text-white transition-colors">
                Buy with Card
              </Link>
              <Link href="/no-kyc-crypto" className="text-white/50 hover:text-white transition-colors">
                No KYC Exchange
              </Link>
              <Link href="/fees" className="text-white/50 hover:text-white transition-colors">
                Our Fees
              </Link>
              <Link href="/faq" className="text-white/50 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold zengo-text">ZengoSwap</span>
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} ZengoSwap Exchange. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
