import { Link } from "wouter";
import { Seo } from "@/components/Seo";
import { PrismaticBackground } from "@/components/glass/PrismaticBackground";
import { GlassNavbar } from "@/components/glass/GlassNavbar";
import { GlassCard } from "@/components/glass/GlassCard";
import { SeoFooter } from "@/components/SeoFooter";
import { Map, ArrowRight, Sparkles, CreditCard, RefreshCw, Shield, Coins, HelpCircle, DollarSign } from "lucide-react";

const siteLinks = [
  {
    category: "Main Pages",
    links: [
      { href: "/", label: "Home", description: "Buy crypto instantly with PayPal or card", icon: Sparkles },
      { href: "/exchange", label: "Exchange", description: "Convert fiat to cryptocurrency", icon: RefreshCw },
      { href: "/swap", label: "Swap", description: "Swap between cryptocurrencies", icon: RefreshCw }
    ]
  },
  {
    category: "Payment Methods",
    links: [
      { href: "/buy-crypto-with-paypal", label: "Buy Crypto with PayPal", description: "Use your PayPal balance", icon: DollarSign },
      { href: "/card-to-crypto", label: "Card to Crypto", description: "Pay with credit or debit card", icon: CreditCard },
      { href: "/crypto-swap", label: "Crypto Swap", description: "Exchange between coins", icon: RefreshCw }
    ]
  },
  {
    category: "Features",
    links: [
      { href: "/no-kyc-crypto", label: "No KYC Crypto", description: "Buy without identity verification", icon: Shield },
      { href: "/supported-coins", label: "Supported Coins", description: "View all available cryptocurrencies", icon: Coins },
      { href: "/fees", label: "Fees & Rates", description: "Transparent pricing information", icon: DollarSign }
    ]
  },
  {
    category: "Support",
    links: [
      { href: "/faq", label: "FAQ", description: "Frequently asked questions", icon: HelpCircle },
      { href: "/verify", label: "Verify Transaction", description: "Track your order status", icon: Shield }
    ]
  }
];

export default function Sitemap() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Seo />
      <PrismaticBackground />
      <GlassNavbar />

      <main className="relative z-10 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-6">
              <Map className="w-4 h-4" />
              <span>Site Navigation</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Sitemap
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Navigate to all pages on Sorexo. Find information about buying crypto, payment methods, and more.
            </p>
          </div>

          <div className="space-y-8">
            {siteLinks.map((section) => (
              <GlassCard key={section.category} className="p-6" hover={false}>
                <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/10 pb-2">
                  {section.category}
                </h2>
                <div className="grid gap-3">
                  {section.links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <link.icon className="w-5 h-5 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium group-hover:text-orange-400 transition-colors">
                            {link.label}
                          </h3>
                          <p className="text-white/50 text-sm truncate">
                            {link.description}
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm">
              Sorexo - Buy Crypto with PayPal & Card | No KYC Required
            </p>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
}
