import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, HelpCircle, ChevronDown, Search } from "lucide-react";
import { GlassCard, GlassButton, GlassInput, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { Seo } from "@/components/Seo";

const faqs = [
  {
    category: "PayPal Payments",
    questions: [
      {
        q: "Is PayPal crypto instant?",
        a: "Yes, most PayPal transactions are processed within 5 minutes. Once your payment is confirmed through PayPal, your cryptocurrency is sent directly to your wallet address. The exact time depends on blockchain network congestion."
      },
      {
        q: "Can I buy Bitcoin with PayPal?",
        a: "Absolutely! You can buy Bitcoin (BTC) and 9 other cryptocurrencies using your PayPal account. Simply select PayPal as your payment method during checkout, complete the payment, and receive your Bitcoin in minutes."
      },
      {
        q: "Are there any PayPal-specific fees?",
        a: "No additional PayPal-specific fees are charged. Our standard 5% fee covers all payment processing costs, including PayPal fees, network costs, and instant delivery."
      },
      {
        q: "Which countries support PayPal purchases?",
        a: "PayPal purchases are available in all countries where PayPal operates, which includes over 200 countries and territories. If you can send money with PayPal, you can buy crypto on Sorexo."
      },
    ]
  },
  {
    category: "Card Payments",
    questions: [
      {
        q: "What cards are supported?",
        a: "We accept Visa and Mastercard, both credit and debit cards. This includes virtual cards and prepaid cards from most issuers worldwide. Maestro cards are also supported in many regions."
      },
      {
        q: "Is card payment secure?",
        a: "Yes, all card payments are processed through PCI DSS compliant payment processors with 3D Secure authentication. Your card details are encrypted and never stored on our servers."
      },
      {
        q: "Why was my card declined?",
        a: "Card declines can occur for several reasons: insufficient funds, card not enabled for international purchases, daily spending limits, or bank security blocks. We recommend contacting your bank if the issue persists."
      },
      {
        q: "How fast are card transactions?",
        a: "Card transactions typically complete within 2-5 minutes. The 3D Secure verification happens instantly, and once confirmed, your crypto is sent immediately to your wallet."
      },
    ]
  },
  {
    category: "KYC & Privacy",
    questions: [
      {
        q: "Is KYC required?",
        a: "No, KYC (Know Your Customer) verification is not required to use Sorexo. You can buy and swap cryptocurrency without submitting ID documents, selfies, or proof of address."
      },
      {
        q: "What information do you collect?",
        a: "We only collect the minimum information necessary: your email address (for transaction notifications) and wallet address (to send your crypto). We do not store personal identification documents."
      },
      {
        q: "Is my data shared with third parties?",
        a: "No, we never share your transaction data with marketing companies or data brokers. Payment information is only shared with payment processors as required to complete your transaction."
      },
      {
        q: "Can I use Sorexo anonymously?",
        a: "While you need an email to receive transaction updates, you can use any email address. Combined with cryptocurrency's pseudonymous nature, Sorexo offers a high level of privacy."
      },
    ]
  },
  {
    category: "Crypto Swaps",
    questions: [
      {
        q: "What is the swap fee?",
        a: "Our crypto-to-crypto swap fee is just 0.2% of the transaction value. This is one of the lowest rates in the industry for no-KYC exchanges. Network fees are included in the quoted rate."
      },
      {
        q: "What are the swap limits?",
        a: "Minimum swap value is $50 USD equivalent, and maximum is $1,000,000 USD equivalent per transaction. There are no daily limits on the number of swaps you can make."
      },
      {
        q: "How long do swaps take?",
        a: "Most swaps complete within 10-30 minutes, depending on blockchain confirmation times. Bitcoin swaps may take longer during periods of network congestion."
      },
      {
        q: "Can I swap any cryptocurrency pair?",
        a: "Yes, you can swap between any of our 10 supported cryptocurrencies. Popular pairs include BTC/ETH, ETH/USDT, SOL/BTC, and many more."
      },
    ]
  },
  {
    category: "Supported Cryptocurrencies",
    questions: [
      {
        q: "Which cryptocurrencies can I buy?",
        a: "We support 10 cryptocurrencies: Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Tether (USDT), Litecoin (LTC), XRP, BNB, Bitcoin Cash (BCH), USD Coin (USDC), and TRON (TRX)."
      },
      {
        q: "Will you add more cryptocurrencies?",
        a: "Yes, we regularly evaluate new cryptocurrencies based on user demand, security, and liquidity. Sign up for our newsletter to be notified when new coins are added."
      },
      {
        q: "What networks do you support for each coin?",
        a: "We support the native networks for each cryptocurrency. For example, BTC on Bitcoin mainnet, ETH on Ethereum mainnet, SOL on Solana, etc. Multi-chain support may be added in the future."
      },
    ]
  },
  {
    category: "Fees & Limits",
    questions: [
      {
        q: "What are the purchase fees?",
        a: "Card and PayPal purchases have a 5% fee, which includes all processing costs and network fees. Crypto swaps have a 0.2% fee. There are no hidden charges."
      },
      {
        q: "What are the purchase limits?",
        a: "Minimum purchase is $30 USD, and maximum is $50,000 USD per transaction. For larger amounts, please contact our support team for assistance."
      },
      {
        q: "Are network fees included?",
        a: "Yes, blockchain network fees are included in our quoted rates. The price you see is the amount of crypto you'll receive, with no additional deductions."
      },
    ]
  },
];

export default function Faq() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "FAQ | Crypto Exchange Questions Answered – Sorexo";
  }, []);

  const toggleQuestion = (id: string) => {
    const newOpen = new Set(openQuestions);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenQuestions(newOpen);
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const totalQuestions = faqs.reduce((acc, cat) => acc + cat.questions.length, 0);

  return (
    <div className="min-h-screen">
      <Seo />
      <PrismaticBackground intensity="medium" enableParallax />
      <GlassNavbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <section className="text-center py-16 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-pill mb-6">
                <HelpCircle className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-white/80">{totalQuestions}+ Questions Answered</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                Frequently Asked{" "}
                <span className="sorexo-text">Questions</span>
              </h1>

              <p className="text-lg sm:text-xl text-white/60 max-w-3xl mx-auto mb-10 text-balance">
                Find answers to common questions about buying crypto with PayPal and cards, 
                cryptocurrency swaps, fees, and our no-KYC policy.
              </p>

              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <GlassInput
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12"
                    data-testid="input-faq-search"
                  />
                </div>
              </div>
            </motion.div>
          </section>

          <section className="py-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {filteredFaqs.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <p className="text-white/60">No questions found matching "{searchQuery}"</p>
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                    data-testid="button-clear-search"
                  >
                    Clear Search
                  </GlassButton>
                </GlassCard>
              ) : (
                <div className="space-y-8">
                  {filteredFaqs.map((category, categoryIndex) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                    >
                      <h2 className="text-xl font-bold text-white mb-4">{category.category}</h2>
                      <GlassCard className="overflow-hidden" hover={false}>
                        <div className="divide-y divide-white/10">
                          {category.questions.map((faq, questionIndex) => {
                            const id = `${categoryIndex}-${questionIndex}`;
                            const isOpen = openQuestions.has(id);
                            
                            return (
                              <div key={id} className="group">
                                <button
                                  onClick={() => toggleQuestion(id)}
                                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                                  data-testid={`faq-question-${id}`}
                                  aria-expanded={isOpen}
                                >
                                  <span className="text-white font-medium pr-8">{faq.q}</span>
                                  <ChevronDown
                                    className={`w-5 h-5 text-white/50 flex-shrink-0 transition-transform duration-200 ${
                                      isOpen ? 'rotate-180' : ''
                                    }`}
                                  />
                                </button>
                                <AnimatePresence>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="px-5 pb-5 text-white/60">
                                        {faq.a}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </div>
              )}
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
                  Quick Links
                </h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Link href="/buy-crypto-with-paypal">
                    <GlassButton variant="outline" className="w-full justify-start" data-testid="link-paypal-guide">
                      PayPal Guide
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </GlassButton>
                  </Link>
                  <Link href="/card-to-crypto">
                    <GlassButton variant="outline" className="w-full justify-start" data-testid="link-card-guide">
                      Card Payment Guide
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </GlassButton>
                  </Link>
                  <Link href="/crypto-swap">
                    <GlassButton variant="outline" className="w-full justify-start" data-testid="link-swap-guide">
                      Swap Guide
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </GlassButton>
                  </Link>
                  <Link href="/no-kyc-crypto">
                    <GlassButton variant="outline" className="w-full justify-start" data-testid="link-nokyc-guide">
                      No KYC Info
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </GlassButton>
                  </Link>
                  <Link href="/supported-coins">
                    <GlassButton variant="outline" className="w-full justify-start" data-testid="link-coins-guide">
                      Supported Coins
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </GlassButton>
                  </Link>
                  <Link href="/fees">
                    <GlassButton variant="outline" className="w-full justify-start" data-testid="link-fees-guide">
                      Fee Structure
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </GlassButton>
                  </Link>
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
                  Still Have Questions?
                </h2>
                <p className="text-white/60 max-w-xl mx-auto mb-8">
                  Can't find what you're looking for? Start an exchange and our support team will assist you.
                </p>
                <Link href="/exchange">
                  <GlassButton variant="primary" size="lg" shimmer data-testid="button-cta-exchange">
                    Start Exchange
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
