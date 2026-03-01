import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, CreditCard, CheckCircle, Sparkles, Clock, Globe, Lock } from "lucide-react";
import { GlassCard, GlassButton, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { Seo } from "@/components/Seo";

const benefits = [
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Card payments are processed immediately with instant crypto delivery",
  },
  {
    icon: Shield,
    title: "3D Secure",
    description: "All transactions protected with bank-level 3D Secure authentication",
  },
  {
    icon: CreditCard,
    title: "All Cards Accepted",
    description: "Visa, Mastercard, and major debit cards supported worldwide",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Works with cards from banks in 150+ countries",
  },
];

const supportedCards = [
  { name: "Visa", description: "Credit & Debit" },
  { name: "Mastercard", description: "Credit & Debit" },
  { name: "Maestro", description: "Debit Cards" },
  { name: "Virtual Cards", description: "Prepaid & Virtual" },
];

const steps = [
  { step: 1, title: "Choose Crypto", description: "Select the cryptocurrency you want to buy" },
  { step: 2, title: "Enter Card Details", description: "Securely input your card information" },
  { step: 3, title: "Verify Payment", description: "Complete 3D Secure verification" },
  { step: 4, title: "Receive Instantly", description: "Crypto sent directly to your wallet" },
];

export default function CardToCrypto() {
  useEffect(() => {
    document.title = "Card to Crypto | Buy Bitcoin with Debit or Credit Card – Sorexo";
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
                <CreditCard className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-white/80">Visa & Mastercard Accepted</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                Buy Crypto with{" "}
                <span className="sorexo-text">Card</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 text-balance">
                Purchase Bitcoin, Ethereum, and other cryptocurrencies instantly using your debit or credit card. 
                Secure 3D authentication, competitive rates, and delivery within minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-buy-card">
                    Buy with Card Now
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/fees">
                  <GlassButton variant="outline" size="lg" data-testid="button-view-fees">
                    View Our Fees
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
                  Why Buy Crypto with Your Card?
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  Card payments offer the fastest and most convenient way to purchase cryptocurrency. 
                  No bank transfers, no waiting - just instant access to the crypto market.
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                        <benefit.icon className="w-6 h-6 text-orange-400" />
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
                    How Card to Crypto Works
                  </h2>
                  <p className="text-white/50 max-w-2xl mx-auto">
                    Our streamlined process makes buying cryptocurrency with your card simple and secure. 
                    Complete your purchase in under 5 minutes.
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
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
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
                    Supported Card Types
                  </h2>
                  <p className="text-white/60 mb-6">
                    We accept a wide range of payment cards from banks worldwide. Whether you have a credit card, 
                    debit card, or prepaid card, you can use it to purchase cryptocurrency instantly.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {supportedCards.map((card) => (
                      <div key={card.name} className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                        <CheckCircle className="w-5 h-5 text-orange-400" />
                        <div>
                          <div className="text-white font-medium">{card.name}</div>
                          <div className="text-white/50 text-sm">{card.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Card Purchase Benefits
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <Clock className="w-5 h-5 text-orange-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">2-Minute Processing</h3>
                        <p className="text-white/50 text-sm">Most card transactions complete within 2 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Shield className="w-5 h-5 text-orange-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">3D Secure Protection</h3>
                        <p className="text-white/50 text-sm">Enhanced security with bank verification</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Globe className="w-5 h-5 text-orange-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">$30 - $50,000 Limits</h3>
                        <p className="text-white/50 text-sm">Flexible purchase limits for all needs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Lock className="w-5 h-5 text-orange-400 mt-1" />
                      <div>
                        <h3 className="text-white font-medium">No KYC Required</h3>
                        <p className="text-white/50 text-sm">Purchase without identity verification</p>
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
                  Card Payment Security
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">PCI DSS Compliant</h3>
                    <p className="text-white/60">
                      Our payment processing meets the highest industry standards for card data security. 
                      Your card details are encrypted and never stored on our servers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">3D Secure 2.0</h3>
                    <p className="text-white/60">
                      All transactions are verified through your bank's 3D Secure system, adding an extra 
                      layer of protection against unauthorized use.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Fraud Prevention</h3>
                    <p className="text-white/60">
                      Advanced fraud detection systems monitor every transaction in real-time, protecting 
                      both you and the platform from suspicious activity.
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
                  Ready to Buy Crypto with Your Card?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Use your Visa or Mastercard to purchase cryptocurrency in minutes. No verification required.
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
              <Link href="/buy-crypto-with-paypal" className="text-white/50 hover:text-white transition-colors">
                Buy with PayPal
              </Link>
              <Link href="/crypto-swap" className="text-white/50 hover:text-white transition-colors">
                Swap Crypto
              </Link>
              <Link href="/no-kyc-crypto" className="text-white/50 hover:text-white transition-colors">
                No KYC Exchange
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
            <Sparkles className="w-5 h-5 text-orange-400" />
            <span className="font-semibold sorexo-text">Sorexo</span>
          </div>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Sorexo Exchange. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
