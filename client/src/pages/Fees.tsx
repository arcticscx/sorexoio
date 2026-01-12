import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Percent, CheckCircle, TrendingDown, Shield, Zap } from "lucide-react";
import { GlassCard, GlassButton, PrismaticBackground, GlassNavbar } from "@/components/glass";

const feeStructure = [
  {
    service: "Card Purchase",
    fee: "5%",
    description: "Buy crypto with Visa or Mastercard",
    includes: ["Processing fees", "Network costs", "Instant delivery"],
  },
  {
    service: "PayPal Purchase",
    fee: "5%",
    description: "Buy crypto using PayPal balance",
    includes: ["PayPal processing", "Network costs", "Fast delivery"],
  },
  {
    service: "Crypto Swap",
    fee: "0.2%",
    description: "Exchange between cryptocurrencies",
    includes: ["Exchange fee", "Network costs included", "Best rates"],
  },
];

const comparison = [
  { exchange: "Prismatic", cardFee: "5%", swapFee: "0.2%", kyc: "No", speed: "Instant" },
  { exchange: "Competitor A", cardFee: "6-8%", swapFee: "0.5%", kyc: "Yes", speed: "1-3 days" },
  { exchange: "Competitor B", cardFee: "5.5%", swapFee: "0.3%", kyc: "Yes", speed: "Hours" },
  { exchange: "Competitor C", cardFee: "7%", swapFee: "0.4%", kyc: "Yes", speed: "1-7 days" },
];

const benefits = [
  {
    icon: Percent,
    title: "Transparent Pricing",
    description: "What you see is what you pay. No hidden fees or surprise charges.",
  },
  {
    icon: TrendingDown,
    title: "Competitive Rates",
    description: "Our fees are among the lowest in the industry for no-KYC exchanges.",
  },
  {
    icon: Shield,
    title: "All-Inclusive",
    description: "Network fees and processing costs are included in our quoted rates.",
  },
  {
    icon: Zap,
    title: "Real-Time Rates",
    description: "Exchange rates update in real-time for the most accurate pricing.",
  },
];

export default function Fees() {
  useEffect(() => {
    document.title = "Exchange Fees | Low-Cost Crypto Trading – Prismatic";
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
                <Percent className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/80">Transparent Pricing</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                Our{" "}
                <span className="prismatic-text">Fees</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 text-balance">
                Simple, transparent, and competitive. Know exactly what you'll pay before you trade. 
                No hidden charges, no surprises – just straightforward crypto exchange fees.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-start-trading">
                    Start Trading
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/faq">
                  <GlassButton variant="outline" size="lg" data-testid="button-fee-faq">
                    Fee FAQs
                  </GlassButton>
                </Link>
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
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Fee Structure
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  Our straightforward fee structure ensures you always know the cost upfront.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {feeStructure.map((item, index) => (
                  <motion.div
                    key={item.service}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6 h-full" variant="elevated" data-testid={`fee-card-${index}`}>
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold prismatic-text mb-2">{item.fee}</div>
                        <h3 className="text-xl font-semibold text-white">{item.service}</h3>
                        <p className="text-white/50 text-sm mt-2">{item.description}</p>
                      </div>
                      <div className="space-y-3">
                        {item.includes.map((inc) => (
                          <div key={inc} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span className="text-white/70 text-sm">{inc}</span>
                          </div>
                        ))}
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
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Why Our Fees Are Fair
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  We believe in value-based pricing that reflects the quality and convenience of our service.
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
                    How We Compare
                  </h2>
                  <p className="text-white/50 max-w-2xl mx-auto">
                    See how Prismatic stacks up against other cryptocurrency exchanges.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 text-white font-semibold">Exchange</th>
                        <th className="text-center py-4 px-4 text-white/60 font-medium">Card Fee</th>
                        <th className="text-center py-4 px-4 text-white/60 font-medium">Swap Fee</th>
                        <th className="text-center py-4 px-4 text-white/60 font-medium">KYC Required</th>
                        <th className="text-center py-4 px-4 text-white/60 font-medium">Speed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((row, index) => (
                        <tr
                          key={row.exchange}
                          className={`border-b border-white/5 ${index === 0 ? 'bg-emerald-500/10' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <span className={index === 0 ? 'text-emerald-400 font-semibold' : 'text-white'}>
                              {row.exchange}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-white/70">{row.cardFee}</td>
                          <td className="py-4 px-4 text-center text-white/70">{row.swapFee}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={row.kyc === 'No' ? 'text-emerald-400' : 'text-white/50'}>
                              {row.kyc}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-white/70">{row.speed}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              <GlassCard className="p-8" variant="subtle">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Understanding Our Fees
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">What's Included in the 5% Fee?</h3>
                    <p className="text-white/60 mb-4">
                      Our 5% fee for card and PayPal purchases covers all costs associated with your transaction:
                    </p>
                    <ul className="space-y-2 text-white/60">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Payment processor fees (typically 2-3%)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Blockchain network transaction fees
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Currency conversion costs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Platform service fee
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Why 0.2% for Swaps?</h3>
                    <p className="text-white/60 mb-4">
                      Crypto-to-crypto swaps have lower overhead costs, allowing us to offer a competitive 0.2% fee:
                    </p>
                    <ul className="space-y-2 text-white/60">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        No payment processor involved
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Direct blockchain transactions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Network fees included in rate
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        Optimized liquidity sourcing
                      </li>
                    </ul>
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
                  Ready to Trade with Fair Fees?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Experience transparent pricing with no hidden costs. Start your crypto journey today.
                </p>
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-cta-exchange">
                    Start Trading Now
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
              <Link href="/crypto-swap" className="text-white/50 hover:text-white transition-colors">
                Swap Crypto
              </Link>
              <Link href="/supported-coins" className="text-white/50 hover:text-white transition-colors">
                Supported Coins
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
