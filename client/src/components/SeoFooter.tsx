import { Link } from "wouter";
import { Sparkles } from "lucide-react";

const seoLinks = [
  { href: "/buy-crypto-with-paypal", label: "Buy Crypto with PayPal" },
  { href: "/card-to-crypto", label: "Card to Crypto" },
  { href: "/crypto-swap", label: "Crypto Swap" },
  { href: "/no-kyc-crypto", label: "No KYC Crypto" },
  { href: "/supported-coins", label: "Supported Coins" },
  { href: "/fees", label: "Fees" },
  { href: "/faq", label: "FAQ" },
];

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/exchange", label: "Buy Crypto" },
  { href: "/swap", label: "Swap" },
  { href: "/verify", label: "Verify Transaction" },
];

export function SeoFooter() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold prismatic-text">Prismatic</span>
            </div>
            <p className="text-white/50 text-sm">
              The most seamless cryptocurrency exchange platform. Buy crypto with PayPal or card, swap coins instantly, no KYC required.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {seoLinks.slice(0, 4).map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Information</h4>
            <ul className="space-y-2">
              {seoLinks.slice(4).map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Prismatic Exchange. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/faq" className="text-white/40 hover:text-white transition-colors">FAQ</Link>
            <Link href="/fees" className="text-white/40 hover:text-white transition-colors">Fees</Link>
            <Link href="/supported-coins" className="text-white/40 hover:text-white transition-colors">Coins</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
