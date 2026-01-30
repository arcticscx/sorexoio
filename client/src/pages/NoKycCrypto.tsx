import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Lock, Eye, EyeOff, CheckCircle, Sparkles, Zap, Globe, UserX } from "lucide-react";
import { GlassCard, GlassButton, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { Seo } from "@/components/Seo";

const benefits = [
  {
    icon: UserX,
    title: "No Identity Verification",
    description: "Purchase crypto without submitting ID documents or selfies",
  },
  {
    icon: Zap,
    title: "Instant Access",
    description: "Start trading immediately without waiting for approval",
  },
  {
    icon: EyeOff,
    title: "Privacy Protected",
    description: "Your personal data stays private and secure",
  },
  {
    icon: Globe,
    title: "Available Worldwide",
    description: "Access from anywhere without geographical restrictions",
  },
];

const comparisonPoints = [
  { feature: "Identity Verification", kyc: "Required", noKyc: "Not Required" },
  { feature: "Document Upload", kyc: "Yes", noKyc: "No" },
  { feature: "Waiting Time", kyc: "1-7 days", noKyc: "Instant" },
  { feature: "Purchase Limits", kyc: "Higher", noKyc: "$10 - $50,000" },
  { feature: "Privacy Level", kyc: "Low", noKyc: "High" },
  { feature: "Account Required", kyc: "Yes", noKyc: "No" },
];

const privacyFeatures = [
  {
    title: "No Personal Data Stored",
    description: "We don't collect or store your personal information. Only your email is needed for transaction notifications.",
  },
  {
    title: "No Account Creation",
    description: "Use our exchange without creating an account. Each transaction is independent and anonymous.",
  },
  {
    title: "No Third-Party Sharing",
    description: "Your transaction data is never shared with marketing companies or data brokers.",
  },
];

export default function NoKycCrypto() {
  useEffect(() => {
    document.title = "No KYC Crypto Exchange | Buy Crypto Anonymously – ZengoSwap";
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
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-white/80">Privacy First</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                No KYC{" "}
                <span className="zengo-text">Crypto Exchange</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 text-balance">
                Buy Bitcoin, Ethereum, and other cryptocurrencies without identity verification. 
                No documents, no selfies, no waiting. Instant access to the crypto market with complete privacy.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-buy-nokyc">
                    Buy Crypto Anonymously
                    <ArrowRight className="w-5 h-5" />
                  </GlassButton>
                </Link>
                <Link href="/faq">
                  <GlassButton variant="outline" size="lg" data-testid="button-learn-privacy">
                    Learn About Privacy
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
                  Why Choose No KYC?
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  Traditional exchanges require extensive verification that takes days and exposes your personal data. 
                  We believe in your right to financial privacy.
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
                    KYC vs No-KYC Comparison
                  </h2>
                  <p className="text-white/50 max-w-2xl mx-auto">
                    See how ZengoSwap's no-KYC approach compares to traditional exchanges that require identity verification.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-4 px-4 text-white font-semibold">Feature</th>
                        <th className="text-center py-4 px-4 text-white/60 font-medium">KYC Exchanges</th>
                        <th className="text-center py-4 px-4 text-emerald-400 font-medium">ZengoSwap (No KYC)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonPoints.map((point, index) => (
                        <tr key={point.feature} className="border-b border-white/5">
                          <td className="py-4 px-4 text-white">{point.feature}</td>
                          <td className="py-4 px-4 text-center text-white/50">{point.kyc}</td>
                          <td className="py-4 px-4 text-center text-emerald-400">{point.noKyc}</td>
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
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Your Privacy Matters
                </h2>
                <p className="text-white/50 max-w-2xl mx-auto">
                  We've built ZengoSwap with privacy as a core principle, not an afterthought.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {privacyFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6 h-full" data-testid={`privacy-card-${index}`}>
                      <Shield className="w-8 h-8 text-emerald-400 mb-4" />
                      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/50 text-sm">{feature.description}</p>
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
                    What We Don't Require
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-lg">X</span>
                      </div>
                      <span className="text-white">Government ID or Passport</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-lg">X</span>
                      </div>
                      <span className="text-white">Selfie Verification</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-lg">X</span>
                      </div>
                      <span className="text-white">Proof of Address</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-lg">X</span>
                      </div>
                      <span className="text-white">Social Security Number</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                        <span className="text-red-400 text-lg">X</span>
                      </div>
                      <span className="text-white">Account Registration</span>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    What We Need
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                      <div>
                        <span className="text-white">Email Address</span>
                        <p className="text-white/50 text-sm">For transaction notifications only</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                      <div>
                        <span className="text-white">Wallet Address</span>
                        <p className="text-white/50 text-sm">Where you want to receive your crypto</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                      <div>
                        <span className="text-white">Payment Method</span>
                        <p className="text-white/50 text-sm">Card or PayPal for your purchase</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm mt-6">
                    That's it. No personal documents, no verification delays, no privacy concerns.
                  </p>
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
                  Ready to Buy Crypto Privately?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Join thousands of users who value their privacy. No KYC, no delays, no compromises.
                </p>
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-cta-exchange">
                    Start Anonymous Purchase
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
