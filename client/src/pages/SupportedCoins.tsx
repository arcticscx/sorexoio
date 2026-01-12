import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Clock, Shield, Zap } from "lucide-react";
import { GlassCard, GlassButton, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { CryptoIcon } from "@/components/CryptoIcon";

const coins = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    description: "The original cryptocurrency and largest by market cap. Bitcoin pioneered decentralized digital currency and remains the gold standard of the crypto world. Perfect for long-term investment and store of value.",
    features: ["Largest Market Cap", "Most Liquid", "Widely Accepted"],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    description: "The leading smart contract platform powering DeFi, NFTs, and Web3 applications. Ethereum's ecosystem hosts thousands of decentralized applications and continues to evolve with regular upgrades.",
    features: ["Smart Contracts", "DeFi Leader", "NFT Standard"],
  },
  {
    symbol: "SOL",
    name: "Solana",
    description: "High-performance blockchain known for incredibly fast transaction speeds and low fees. Solana has become a favorite for DeFi applications and NFT marketplaces seeking scalability.",
    features: ["Fast Transactions", "Low Fees", "Growing Ecosystem"],
  },
  {
    symbol: "USDT",
    name: "Tether",
    description: "The most widely used stablecoin, pegged 1:1 to the US Dollar. USDT provides stability in volatile markets and is essential for trading pairs across all major exchanges.",
    features: ["Dollar Pegged", "High Liquidity", "Trading Standard"],
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    description: "Often called the silver to Bitcoin's gold, Litecoin offers faster transaction confirmation and a different hashing algorithm. It's a proven and reliable cryptocurrency since 2011.",
    features: ["Fast Confirmation", "Low Fees", "Established Since 2011"],
  },
  {
    symbol: "XRP",
    name: "XRP",
    description: "Designed for fast, low-cost international money transfers. XRP enables near-instant cross-border payments and is used by financial institutions worldwide for liquidity.",
    features: ["Cross-Border Payments", "Bank Partnerships", "Fast Settlements"],
  },
  {
    symbol: "BNB",
    name: "BNB",
    description: "The native token of the Binance ecosystem and BNB Chain. BNB offers utility across multiple platforms including reduced trading fees, DeFi applications, and NFT marketplaces.",
    features: ["Exchange Utility", "DeFi Access", "Smart Chain"],
  },
  {
    symbol: "BCH",
    name: "Bitcoin Cash",
    description: "A fork of Bitcoin focused on being a peer-to-peer electronic cash system. Bitcoin Cash offers larger block sizes for faster, cheaper transactions suitable for everyday payments.",
    features: ["Larger Blocks", "Lower Fees", "P2P Payments"],
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    description: "A fully-backed, regulated stablecoin pegged to the US Dollar. USDC is known for its transparency with regular attestations and is widely used in DeFi protocols.",
    features: ["Regulated", "Transparent", "DeFi Compatible"],
  },
  {
    symbol: "TRX",
    name: "TRON",
    description: "A blockchain platform focused on content sharing and entertainment. TRON offers high throughput and is particularly popular for USDT transfers due to low fees.",
    features: ["Content Platform", "High Throughput", "Low Transfer Fees"],
  },
];

export default function SupportedCoins() {
  useEffect(() => {
    document.title = "Supported Cryptocurrencies | BTC, ETH, SOL & More – Prismatic";
  }, []);

  return (
    <div className="min-h-screen">
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
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/80">10 Cryptocurrencies</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                Supported{" "}
                <span className="prismatic-text">Cryptocurrencies</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 text-balance">
                Buy and swap between the most popular cryptocurrencies. From Bitcoin to stablecoins, 
                we support the tokens that matter most to traders and investors.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-buy-crypto">
                    Start Trading
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/crypto-swap">
                  <GlassButton variant="outline" size="lg" data-testid="button-swap-crypto">
                    Swap Crypto
                  </GlassButton>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-4 text-center" hover={false}>
                <Zap className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-white/50">Instant Delivery</div>
              </GlassCard>
              <GlassCard className="p-4 text-center" hover={false}>
                <Shield className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-white/50">No KYC Required</div>
              </GlassCard>
              <GlassCard className="p-4 text-center" hover={false}>
                <Clock className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-white/50">24/7 Trading</div>
              </GlassCard>
              <GlassCard className="p-4 text-center" hover={false}>
                <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-white/50">Best Rates</div>
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
              <div className="grid gap-6">
                {coins.map((coin, index) => (
                  <motion.div
                    key={coin.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <GlassCard className="p-6" data-testid={`coin-card-${coin.symbol.toLowerCase()}`}>
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex items-center gap-4 md:w-48 flex-shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center overflow-hidden">
                            <CryptoIcon symbol={coin.symbol} size="lg" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">{coin.name}</h3>
                            <p className="text-emerald-400 font-medium">{coin.symbol}</p>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-white/60 mb-4">{coin.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {coin.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-sm"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 md:flex-col md:w-32 flex-shrink-0">
                          <Link href="/exchange" className="flex-1 md:flex-none">
                            <GlassButton variant="primary" size="sm" className="w-full" data-testid={`buy-${coin.symbol.toLowerCase()}`}>
                              Buy
                            </GlassButton>
                          </Link>
                          <Link href="/swap" className="flex-1 md:flex-none">
                            <GlassButton variant="outline" size="sm" className="w-full" data-testid={`swap-${coin.symbol.toLowerCase()}`}>
                              Swap
                            </GlassButton>
                          </Link>
                        </div>
                      </div>
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
              <GlassCard className="p-8" variant="subtle">
                <h2 className="text-2xl font-bold text-white mb-6">
                  How We Select Cryptocurrencies
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Market Liquidity</h3>
                    <p className="text-white/60">
                      We only list cryptocurrencies with sufficient trading volume and liquidity 
                      to ensure you always get the best rates and fast execution.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Security Track Record</h3>
                    <p className="text-white/60">
                      Each cryptocurrency undergoes thorough security review. We prioritize tokens 
                      with proven security and established blockchain infrastructure.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">User Demand</h3>
                    <p className="text-white/60">
                      We listen to our users and add the cryptocurrencies they want most. 
                      Our selection reflects the needs of real traders and investors.
                    </p>
                  </div>
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
              <GlassCard className="p-8 sm:p-12 text-center" variant="elevated" glow>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Ready to Start Trading?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Buy any of our supported cryptocurrencies with PayPal or card. No KYC required, instant delivery.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/exchange">
                    <GlassButton variant="primary" size="lg" shimmer data-testid="button-cta-buy">
                      Buy Crypto Now
                      <ArrowRight className="w-5 h-5" />
                    </GlassButton>
                  </Link>
                  <Link href="/swap">
                    <GlassButton variant="outline" size="lg" data-testid="button-cta-swap">
                      Swap Crypto
                    </GlassButton>
                  </Link>
                </div>
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
              <Link href="/crypto-swap" className="text-white/50 hover:text-white transition-colors">
                Crypto Swap
              </Link>
              <Link href="/no-kyc-crypto" className="text-white/50 hover:text-white transition-colors">
                No KYC Exchange
              </Link>
              <Link href="/fees" className="text-white/50 hover:text-white transition-colors">
                Our Fees
              </Link>
            </div>
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
