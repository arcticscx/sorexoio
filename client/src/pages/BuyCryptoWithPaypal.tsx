import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Globe, CheckCircle, Sparkles, CreditCard, Clock, Lock } from "lucide-react";
import { GlassCard, GlassButton, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { Seo } from "@/components/Seo";

const benefits = [
  {
    icon: Zap,
    title: "Instant Delivery",
    description: "Receive your crypto within minutes after payment confirmation",
  },
  {
    icon: Shield,
    title: "No KYC Required",
    description: "Buy crypto without lengthy verification processes",
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    description: "PayPal's buyer protection keeps your purchases safe",
  },
  {
    icon: Globe,
    title: "Global Access",
    description: "Available in 150+ countries where PayPal operates",
  },
];

const supportedCoins = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "XRP", name: "Ripple" },
];

const steps = [
  { step: 1, title: "Enter Amount", description: "Choose how much crypto you want to purchase" },
  { step: 2, title: "Select PayPal", description: "Choose PayPal as your payment method" },
  { step: 3, title: "Complete Payment", description: "Securely pay through PayPal checkout" },
  { step: 4, title: "Receive Crypto", description: "Get your crypto delivered to your wallet" },
];

export default function BuyCryptoWithPaypal() {
  useEffect(() => {
    document.title = "Buy Crypto with PayPal Instantly | No KYC – ZengoSwap";
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
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/80">Fast & Secure Payment</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                Buy Crypto with{" "}
                <span className="zengo-text">PayPal</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 text-balance">
                Buy Bitcoin, Ethereum, and more with PayPal. Instant delivery, low fees, no KYC required. 
                Trusted by 10,000+ users worldwide for secure cryptocurrency purchases.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-buy-paypal">
                    Buy with PayPal Now
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/supported-coins">
                  <GlassButton variant="outline" size="lg" data-testid="button-view-coins">
                    View Supported Coins
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
                  Why Buy Crypto with PayPal?
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  PayPal offers one of the most convenient ways to purchase cryptocurrency, combining speed, 
                  security, and ease of use that millions of users already trust.
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
                    How PayPal to Crypto Works
                  </h2>
                  <p className="text-white/50 max-w-2xl mx-auto">
                    Purchasing cryptocurrency with PayPal at ZengoSwap is straightforward and takes just minutes. 
                    Our streamlined process ensures you get your crypto quickly and securely.
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
              <div className="grid lg:grid-cols-2 gap-8">
                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Supported Cryptocurrencies
                  </h2>
                  <p className="text-white/60 mb-6">
                    Purchase any of these popular cryptocurrencies using your PayPal account. All transactions 
                    are processed instantly with competitive exchange rates.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {supportedCoins.map((coin) => (
                      <div key={coin.symbol} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <div>
                          <div className="text-white font-medium">{coin.name}</div>
                          <div className="text-white/50 text-sm">{coin.symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/supported-coins">
                    <GlassButton variant="ghost" size="sm" className="mt-6" data-testid="link-all-coins">
                      View All Coins
                      <ArrowRight className="w-4 h-4" />
                    </GlassButton>
                  </Link>
                </GlassCard>

                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    PayPal Purchase Benefits
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Clock className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">5-Minute Processing</h3>
                        <p className="text-white/50 text-sm">Most PayPal transactions complete within 5 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Shield className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">Buyer Protection</h3>
                        <p className="text-white/50 text-sm">PayPal's security measures protect every transaction</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Globe className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">No Additional Fees</h3>
                        <p className="text-white/50 text-sm">Standard exchange fees apply, no extra PayPal charges</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Lock className="w-5 h-5 text-emerald-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">Privacy First</h3>
                        <p className="text-white/50 text-sm">No KYC verification required for purchases</p>
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
              <GlassCard className="p-8" variant="subtle">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Frequently Asked Questions About PayPal Crypto
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Is buying crypto with PayPal instant?</h3>
                    <p className="text-white/60">
                      Yes, most PayPal transactions are processed within 5 minutes. Once your payment is confirmed, 
                      your cryptocurrency will be sent directly to your wallet address.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">What are the limits for PayPal purchases?</h3>
                    <p className="text-white/60">
                      You can purchase between $30 and $50,000 worth of cryptocurrency per transaction using PayPal. 
                      There are no daily limits on the number of transactions you can make.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Is my PayPal account linked to my crypto wallet?</h3>
                    <p className="text-white/60">
                      No, your PayPal account is only used for payment. The cryptocurrency is sent to the external 
                      wallet address you provide, giving you full control over your assets.
                    </p>
                  </div>
                </div>
                <Link href="/faq">
                  <GlassButton variant="ghost" size="sm" className="mt-6" data-testid="link-faq">
                    View All FAQs
                    <ArrowRight className="w-4 h-4" />
                  </GlassButton>
                </Link>
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
                  Ready to Buy Crypto with PayPal?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Join thousands of users who trust ZengoSwap for fast, secure cryptocurrency purchases via PayPal.
                </p>
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-cta-exchange">
                    Start Your Purchase
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
              </GlassCard>
            </motion.div>
          </section>

          <section className="py-8">
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/card-to-crypto" className="text-white/50 hover:text-white transition-colors">
                Buy with Card
              </Link>
              <Link href="/crypto-swap" className="text-white/50 hover:text-white transition-colors">
                Swap Crypto
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
