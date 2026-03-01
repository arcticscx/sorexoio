export interface PageSeoConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalPath: string;
  priority: number;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  aiAnswer?: string;
  aiDefinition?: string;
  synonyms?: string[];
}

const BASE_URL = "https://sorexo.io";
const BRAND = "Sorexo";

export const seoConfig: Record<string, PageSeoConfig> = {
  "/": {
    title: "Buy Crypto with PayPal & Card | No KYC – Sorexo",
    description: "Buy crypto instantly with PayPal or card. Low fees, no KYC required, fast delivery. Trusted by 10,000+ users. Exchange Bitcoin, Ethereum, and more.",
    keywords: [
      "buy crypto with PayPal",
      "PayPal to Bitcoin",
      "card to crypto",
      "no KYC crypto exchange",
      "instant crypto exchange",
      "Sorexo crypto exchange",
      "buy Bitcoin no verification",
      "crypto without ID"
    ],
    ogTitle: "Buy Crypto Instantly with PayPal & Card – No KYC | Sorexo",
    ogDescription: "Buy crypto instantly with PayPal or card. Low fees, no KYC, fast delivery. Start exchanging in minutes!",
    canonicalPath: "/",
    priority: 1.0,
    changefreq: "daily",
    aiAnswer: "Sorexo is a cryptocurrency exchange that allows you to buy crypto with PayPal or card instantly without KYC verification. Transactions complete in minutes with low fees.",
    aiDefinition: "Sorexo is a no-KYC cryptocurrency exchange platform enabling instant purchases of Bitcoin, Ethereum, and other cryptocurrencies using PayPal or credit/debit cards.",
    synonyms: ["exchange", "swap", "convert", "purchase", "buy", "instant", "fast", "quick", "no verification", "anonymous"]
  },
  "/exchange": {
    title: "Exchange Fiat to Crypto Instantly | Sorexo",
    description: "Convert USD, EUR, GBP to Bitcoin, Ethereum, and 10+ cryptocurrencies. No KYC, instant delivery, competitive rates. Start your exchange now.",
    keywords: [
      "fiat to crypto exchange",
      "USD to Bitcoin",
      "EUR to crypto",
      "instant crypto exchange",
      "convert money to crypto",
      "Sorexo exchange"
    ],
    canonicalPath: "/exchange",
    priority: 0.9,
    changefreq: "daily",
    aiAnswer: "The Sorexo exchange allows you to convert fiat currencies like USD, EUR, and GBP into cryptocurrencies like Bitcoin and Ethereum instantly without requiring identity verification.",
    aiDefinition: "A fiat-to-cryptocurrency exchange service that converts traditional currency to digital assets without KYC requirements."
  },
  "/swap": {
    title: "Swap Crypto Instantly | 0.2% Fee | Sorexo",
    description: "Swap between cryptocurrencies instantly with just 0.2% fee. No registration, no KYC. Swap BTC, ETH, SOL, and more in seconds.",
    keywords: [
      "crypto swap",
      "swap Bitcoin",
      "crypto to crypto exchange",
      "instant crypto swap",
      "low fee crypto swap",
      "Sorexo swap"
    ],
    canonicalPath: "/swap",
    priority: 0.9,
    changefreq: "daily",
    aiAnswer: "Sorexo's crypto swap feature lets you exchange one cryptocurrency for another instantly with only a 0.2% fee. No account or KYC required.",
    aiDefinition: "A crypto-to-crypto swap service enabling instant exchanges between different cryptocurrencies at a flat 0.2% fee."
  },
  "/buy-crypto-with-paypal": {
    title: "Buy Crypto with PayPal | Instant, No KYC – Sorexo",
    description: "Buy Bitcoin, Ethereum, and more with PayPal instantly. No KYC verification, low fees, fast delivery. Trusted by thousands of users worldwide.",
    keywords: [
      "buy crypto with PayPal",
      "PayPal to Bitcoin",
      "PayPal to Ethereum",
      "PayPal crypto purchase",
      "no KYC PayPal crypto",
      "Sorexo PayPal to crypto"
    ],
    ogTitle: "Buy Crypto with PayPal – No KYC, Instant Delivery | Sorexo",
    ogDescription: "Convert your PayPal balance to Bitcoin, Ethereum, and more. No verification needed, instant delivery!",
    canonicalPath: "/buy-crypto-with-paypal",
    priority: 0.95,
    changefreq: "weekly",
    aiAnswer: "You can buy crypto with PayPal on Sorexo without KYC verification. Simply select your cryptocurrency, enter your PayPal details, and receive crypto in minutes.",
    aiDefinition: "PayPal-to-crypto service that enables instant cryptocurrency purchases using PayPal balance without identity verification requirements."
  },
  "/card-to-crypto": {
    title: "Buy Crypto with Credit Card | No KYC – Sorexo",
    description: "Purchase Bitcoin, Ethereum, and 10+ cryptocurrencies with your credit or debit card. No KYC, instant processing, secure transactions.",
    keywords: [
      "buy crypto with card",
      "credit card to Bitcoin",
      "debit card crypto",
      "card to crypto exchange",
      "no KYC card crypto",
      "Sorexo card purchase"
    ],
    ogTitle: "Buy Crypto with Credit/Debit Card – No KYC | Sorexo",
    ogDescription: "Purchase crypto instantly with your card. No verification, fast processing, secure transactions!",
    canonicalPath: "/card-to-crypto",
    priority: 0.95,
    changefreq: "weekly",
    aiAnswer: "Sorexo allows you to buy cryptocurrency with your credit or debit card without KYC verification. Transactions are processed instantly and securely.",
    aiDefinition: "A card-to-crypto service enabling instant cryptocurrency purchases via credit or debit card without identity verification."
  },
  "/crypto-swap": {
    title: "Crypto-to-Crypto Swap | Low Fees – Sorexo",
    description: "Swap between Bitcoin, Ethereum, Solana, and more. 0.2% flat fee, no registration, instant execution. Convert your crypto holdings seamlessly.",
    keywords: [
      "crypto to crypto swap",
      "swap Bitcoin to Ethereum",
      "crypto exchange",
      "instant crypto swap",
      "low fee swap",
      "Sorexo crypto swap"
    ],
    canonicalPath: "/crypto-swap",
    priority: 0.85,
    changefreq: "weekly",
    aiAnswer: "Sorexo's crypto swap service allows instant exchanges between cryptocurrencies like BTC, ETH, SOL with a flat 0.2% fee and no registration.",
    aiDefinition: "Cryptocurrency swap service for exchanging digital assets between different cryptocurrencies instantly."
  },
  "/no-kyc-crypto": {
    title: "Buy Crypto Without KYC | No ID Required – Sorexo",
    description: "Purchase cryptocurrency without identity verification. No documents, no selfies, no waiting. Start buying Bitcoin and more instantly.",
    keywords: [
      "no KYC crypto",
      "buy crypto without ID",
      "anonymous crypto exchange",
      "no verification crypto",
      "crypto without documents",
      "Sorexo no KYC"
    ],
    ogTitle: "Buy Crypto Without KYC or ID – Instant Access | Sorexo",
    ogDescription: "No documents, no selfies, no waiting. Buy crypto instantly without identity verification!",
    canonicalPath: "/no-kyc-crypto",
    priority: 0.95,
    changefreq: "weekly",
    aiAnswer: "Sorexo offers no-KYC cryptocurrency purchases. You can buy Bitcoin and other cryptocurrencies without providing ID documents, selfies, or undergoing verification.",
    aiDefinition: "No-KYC crypto exchange that enables cryptocurrency purchases without identity verification, documents, or waiting periods."
  },
  "/supported-coins": {
    title: "Supported Cryptocurrencies | 10+ Coins – Sorexo",
    description: "Trade Bitcoin, Ethereum, Solana, Litecoin, XRP, and more. View all supported cryptocurrencies with live prices and exchange rates.",
    keywords: [
      "supported cryptocurrencies",
      "Bitcoin exchange",
      "Ethereum exchange",
      "Solana exchange",
      "available crypto",
      "Sorexo coins"
    ],
    canonicalPath: "/supported-coins",
    priority: 0.7,
    changefreq: "weekly",
    aiAnswer: "Sorexo supports 10+ cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Litecoin (LTC), XRP, BNB, and stablecoins like USDT and USDC.",
    aiDefinition: "List of cryptocurrencies available for trading on Sorexo exchange including major coins and stablecoins."
  },
  "/fees": {
    title: "Exchange Fees & Rates | Transparent Pricing – Sorexo",
    description: "Clear, competitive pricing with no hidden fees. View our exchange rates, swap fees (0.2%), and payment method costs. Full transparency guaranteed.",
    keywords: [
      "crypto exchange fees",
      "Sorexo fees",
      "exchange rates",
      "crypto swap fees",
      "low crypto fees",
      "transparent pricing"
    ],
    canonicalPath: "/fees",
    priority: 0.6,
    changefreq: "weekly",
    aiAnswer: "Sorexo charges a 0.2% fee for crypto swaps. Exchange fees vary by payment method and amount. All fees are shown upfront with no hidden costs.",
    aiDefinition: "Transparent fee structure for cryptocurrency exchanges and swaps on the Sorexo platform."
  },
  "/faq": {
    title: "FAQ | Common Questions Answered – Sorexo",
    description: "Find answers to frequently asked questions about Sorexo. Learn about our exchange process, fees, security, supported coins, and more.",
    keywords: [
      "Sorexo FAQ",
      "crypto exchange questions",
      "how to buy crypto",
      "is Sorexo safe",
      "Sorexo help"
    ],
    canonicalPath: "/faq",
    priority: 0.5,
    changefreq: "monthly",
    aiAnswer: "The Sorexo FAQ covers common questions about buying crypto, payment methods, fees, security, and supported cryptocurrencies.",
    aiDefinition: "Frequently asked questions about using Sorexo cryptocurrency exchange platform."
  },
  "/verify": {
    title: "Verify Transaction | Track Your Order – Sorexo",
    description: "Track and verify your cryptocurrency transaction status. Enter your reference ID to check order progress and confirmation.",
    keywords: [
      "verify transaction",
      "track crypto order",
      "transaction status",
      "Sorexo order tracking"
    ],
    canonicalPath: "/verify",
    priority: 0.4,
    changefreq: "monthly"
  },
  "/sitemap": {
    title: "Sitemap | All Pages – Sorexo",
    description: "Navigate to all pages on Sorexo. Find information about buying crypto with PayPal, card payments, supported coins, and more.",
    keywords: [
      "Sorexo sitemap",
      "site navigation",
      "all pages"
    ],
    canonicalPath: "/sitemap",
    priority: 0.3,
    changefreq: "monthly"
  },
  "/sell": {
    title: "Sell Crypto for Cash | PayPal, Venmo, Gift Cards & More – Sorexo",
    description: "Sell your Bitcoin, Ethereum, and other cryptocurrencies for cash. Get paid via PayPal, Venmo, Cash App, Apple Pay, Gift Cards, Bank Transfer, Revolut, or Wise. 0.5% fee, $50,000 max, fast processing.",
    keywords: [
      "sell crypto",
      "sell Bitcoin",
      "sell Ethereum",
      "crypto to PayPal",
      "crypto to Venmo",
      "crypto to cash",
      "sell crypto for gift cards",
      "crypto to bank transfer",
      "crypto to Apple Pay",
      "crypto to Cash App",
      "Sorexo sell",
      "sell crypto no KYC"
    ],
    ogTitle: "Sell Crypto for Cash – 8 Payout Methods | Sorexo",
    ogDescription: "Convert your cryptocurrency to cash via PayPal, Venmo, Cash App, Apple Pay, Gift Cards, Bank Transfer, Revolut, or Wise. 0.5% fee, up to $50,000.",
    ogImage: "/sell-og-image.png",
    canonicalPath: "/sell",
    priority: 0.9,
    changefreq: "daily",
    aiAnswer: "Sorexo allows you to sell cryptocurrency and receive payment via 8 methods: PayPal, Venmo, Cash App, Apple Pay, Gift Cards, Bank Transfer, Revolut, or Wise. Only 0.5% fee with a $50,000 maximum transaction.",
    aiDefinition: "A cryptocurrency selling service that converts digital assets to cash through 8 payout methods including PayPal, Venmo, Cash App, Apple Pay, Gift Cards, Bank Transfer, Revolut, and Wise."
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: BRAND,
  alternateName: "Sorexo Crypto Exchange",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: "Sorexo is a privacy-focused cryptocurrency exchange enabling instant purchases of Bitcoin, Ethereum, and other cryptocurrencies using PayPal or credit cards without KYC verification.",
  foundingDate: "2024",
  slogan: "Instant Crypto, Zero Hassle",
  sameAs: [
    "https://discord.gg/sorexo",
    "https://twitter.com/sorexo_io"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English"],
    url: `${BASE_URL}/faq`
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Cryptocurrency Exchange",
    "Bitcoin",
    "Ethereum",
    "PayPal to Crypto",
    "No-KYC Crypto"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  name: BRAND,
  url: BASE_URL,
  description: "Buy and swap cryptocurrency instantly with PayPal or card. No KYC required.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/faq?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  },
  inLanguage: "en-US"
};

export const trustSignals = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "@id": `${BASE_URL}/#service`,
  name: "Sorexo Crypto Exchange",
  provider: { "@id": `${BASE_URL}/#organization` },
  serviceType: "Cryptocurrency Exchange",
  areaServed: "Worldwide",
  description: "Non-custodial, user-initiated cryptocurrency exchange service",
  termsOfService: `${BASE_URL}/terms`,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cryptocurrency Exchange Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "PayPal to Crypto Exchange"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Card to Crypto Exchange"
        }
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Crypto-to-Crypto Swap"
        }
      }
    ]
  }
};

export function getPageSeo(path: string): PageSeoConfig {
  return seoConfig[path] || seoConfig["/"];
}

export function generateSitemapEntries(): Array<{ loc: string; priority: number; changefreq: string; lastmod: string }> {
  const lastmod = new Date().toISOString().split("T")[0];
  return Object.entries(seoConfig)
    .filter(([path]) => !path.includes("admin") && !path.includes("verify"))
    .map(([path, config]) => ({
      loc: `${BASE_URL}${config.canonicalPath}`,
      priority: config.priority,
      changefreq: config.changefreq,
      lastmod
    }));
}
