export interface PageSeoConfig {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  canonicalPath: string;
  priority: number;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  aiAnswer?: string;
  aiDefinition?: string;
  synonyms?: string[];
}

const BASE_URL = "https://prismatic.live";
const BRAND = "Prismatic";

export const seoConfig: Record<string, PageSeoConfig> = {
  "/": {
    title: "Buy Crypto with PayPal & Card | No KYC – Prismatic",
    description: "Buy crypto instantly with PayPal or card. Low fees, no KYC required, fast delivery. Trusted by 10,000+ users. Exchange Bitcoin, Ethereum, and more.",
    keywords: [
      "buy crypto with PayPal",
      "PayPal to Bitcoin",
      "card to crypto",
      "no KYC crypto exchange",
      "instant crypto exchange",
      "Prismatic crypto exchange",
      "buy Bitcoin no verification",
      "crypto without ID"
    ],
    ogTitle: "Buy Crypto Instantly with PayPal & Card – No KYC | Prismatic",
    ogDescription: "Buy crypto instantly with PayPal or card. Low fees, no KYC, fast delivery. Start exchanging in minutes!",
    canonicalPath: "/",
    priority: 1.0,
    changefreq: "daily",
    aiAnswer: "Prismatic is a cryptocurrency exchange that allows you to buy crypto with PayPal or card instantly without KYC verification. Transactions complete in minutes with low fees.",
    aiDefinition: "Prismatic is a no-KYC cryptocurrency exchange platform enabling instant purchases of Bitcoin, Ethereum, and other cryptocurrencies using PayPal or credit/debit cards.",
    synonyms: ["exchange", "swap", "convert", "purchase", "buy", "instant", "fast", "quick", "no verification", "anonymous"]
  },
  "/exchange": {
    title: "Exchange Fiat to Crypto Instantly | Prismatic",
    description: "Convert USD, EUR, GBP to Bitcoin, Ethereum, and 10+ cryptocurrencies. No KYC, instant delivery, competitive rates. Start your exchange now.",
    keywords: [
      "fiat to crypto exchange",
      "USD to Bitcoin",
      "EUR to crypto",
      "instant crypto exchange",
      "convert money to crypto",
      "Prismatic exchange"
    ],
    canonicalPath: "/exchange",
    priority: 0.9,
    changefreq: "daily",
    aiAnswer: "The Prismatic exchange allows you to convert fiat currencies like USD, EUR, and GBP into cryptocurrencies like Bitcoin and Ethereum instantly without requiring identity verification.",
    aiDefinition: "A fiat-to-cryptocurrency exchange service that converts traditional currency to digital assets without KYC requirements."
  },
  "/swap": {
    title: "Swap Crypto Instantly | 0.2% Fee | Prismatic",
    description: "Swap between cryptocurrencies instantly with just 0.2% fee. No registration, no KYC. Swap BTC, ETH, SOL, and more in seconds.",
    keywords: [
      "crypto swap",
      "swap Bitcoin",
      "crypto to crypto exchange",
      "instant crypto swap",
      "low fee crypto swap",
      "Prismatic swap"
    ],
    canonicalPath: "/swap",
    priority: 0.9,
    changefreq: "daily",
    aiAnswer: "Prismatic's crypto swap feature lets you exchange one cryptocurrency for another instantly with only a 0.2% fee. No account or KYC required.",
    aiDefinition: "A crypto-to-crypto swap service enabling instant exchanges between different cryptocurrencies at a flat 0.2% fee."
  },
  "/buy-crypto-with-paypal": {
    title: "Buy Crypto with PayPal | Instant, No KYC – Prismatic",
    description: "Buy Bitcoin, Ethereum, and more with PayPal instantly. No KYC verification, low fees, fast delivery. Trusted by thousands of users worldwide.",
    keywords: [
      "buy crypto with PayPal",
      "PayPal to Bitcoin",
      "PayPal to Ethereum",
      "PayPal crypto purchase",
      "no KYC PayPal crypto",
      "Prismatic PayPal to crypto"
    ],
    ogTitle: "Buy Crypto with PayPal – No KYC, Instant Delivery | Prismatic",
    ogDescription: "Convert your PayPal balance to Bitcoin, Ethereum, and more. No verification needed, instant delivery!",
    canonicalPath: "/buy-crypto-with-paypal",
    priority: 0.95,
    changefreq: "weekly",
    aiAnswer: "You can buy crypto with PayPal on Prismatic without KYC verification. Simply select your cryptocurrency, enter your PayPal details, and receive crypto in minutes.",
    aiDefinition: "PayPal-to-crypto service that enables instant cryptocurrency purchases using PayPal balance without identity verification requirements."
  },
  "/card-to-crypto": {
    title: "Buy Crypto with Credit Card | No KYC – Prismatic",
    description: "Purchase Bitcoin, Ethereum, and 10+ cryptocurrencies with your credit or debit card. No KYC, instant processing, secure transactions.",
    keywords: [
      "buy crypto with card",
      "credit card to Bitcoin",
      "debit card crypto",
      "card to crypto exchange",
      "no KYC card crypto",
      "Prismatic card purchase"
    ],
    ogTitle: "Buy Crypto with Credit/Debit Card – No KYC | Prismatic",
    ogDescription: "Purchase crypto instantly with your card. No verification, fast processing, secure transactions!",
    canonicalPath: "/card-to-crypto",
    priority: 0.95,
    changefreq: "weekly",
    aiAnswer: "Prismatic allows you to buy cryptocurrency with your credit or debit card without KYC verification. Transactions are processed instantly and securely.",
    aiDefinition: "A card-to-crypto service enabling instant cryptocurrency purchases via credit or debit card without identity verification."
  },
  "/crypto-swap": {
    title: "Crypto-to-Crypto Swap | Low Fees – Prismatic",
    description: "Swap between Bitcoin, Ethereum, Solana, and more. 0.2% flat fee, no registration, instant execution. Convert your crypto holdings seamlessly.",
    keywords: [
      "crypto to crypto swap",
      "swap Bitcoin to Ethereum",
      "crypto exchange",
      "instant crypto swap",
      "low fee swap",
      "Prismatic crypto swap"
    ],
    canonicalPath: "/crypto-swap",
    priority: 0.85,
    changefreq: "weekly",
    aiAnswer: "Prismatic's crypto swap service allows instant exchanges between cryptocurrencies like BTC, ETH, SOL with a flat 0.2% fee and no registration.",
    aiDefinition: "Cryptocurrency swap service for exchanging digital assets between different cryptocurrencies instantly."
  },
  "/no-kyc-crypto": {
    title: "Buy Crypto Without KYC | No ID Required – Prismatic",
    description: "Purchase cryptocurrency without identity verification. No documents, no selfies, no waiting. Start buying Bitcoin and more instantly.",
    keywords: [
      "no KYC crypto",
      "buy crypto without ID",
      "anonymous crypto exchange",
      "no verification crypto",
      "crypto without documents",
      "Prismatic no KYC"
    ],
    ogTitle: "Buy Crypto Without KYC or ID – Instant Access | Prismatic",
    ogDescription: "No documents, no selfies, no waiting. Buy crypto instantly without identity verification!",
    canonicalPath: "/no-kyc-crypto",
    priority: 0.95,
    changefreq: "weekly",
    aiAnswer: "Prismatic offers no-KYC cryptocurrency purchases. You can buy Bitcoin and other cryptocurrencies without providing ID documents, selfies, or undergoing verification.",
    aiDefinition: "No-KYC crypto exchange that enables cryptocurrency purchases without identity verification, documents, or waiting periods."
  },
  "/supported-coins": {
    title: "Supported Cryptocurrencies | 10+ Coins – Prismatic",
    description: "Trade Bitcoin, Ethereum, Solana, Litecoin, XRP, and more. View all supported cryptocurrencies with live prices and exchange rates.",
    keywords: [
      "supported cryptocurrencies",
      "Bitcoin exchange",
      "Ethereum exchange",
      "Solana exchange",
      "available crypto",
      "Prismatic coins"
    ],
    canonicalPath: "/supported-coins",
    priority: 0.7,
    changefreq: "weekly",
    aiAnswer: "Prismatic supports 10+ cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Solana (SOL), Litecoin (LTC), XRP, BNB, and stablecoins like USDT and USDC.",
    aiDefinition: "List of cryptocurrencies available for trading on Prismatic exchange including major coins and stablecoins."
  },
  "/fees": {
    title: "Exchange Fees & Rates | Transparent Pricing – Prismatic",
    description: "Clear, competitive pricing with no hidden fees. View our exchange rates, swap fees (0.2%), and payment method costs. Full transparency guaranteed.",
    keywords: [
      "crypto exchange fees",
      "Prismatic fees",
      "exchange rates",
      "crypto swap fees",
      "low crypto fees",
      "transparent pricing"
    ],
    canonicalPath: "/fees",
    priority: 0.6,
    changefreq: "weekly",
    aiAnswer: "Prismatic charges a 0.2% fee for crypto swaps. Exchange fees vary by payment method and amount. All fees are shown upfront with no hidden costs.",
    aiDefinition: "Transparent fee structure for cryptocurrency exchanges and swaps on the Prismatic platform."
  },
  "/faq": {
    title: "FAQ | Common Questions Answered – Prismatic",
    description: "Find answers to frequently asked questions about Prismatic. Learn about our exchange process, fees, security, supported coins, and more.",
    keywords: [
      "Prismatic FAQ",
      "crypto exchange questions",
      "how to buy crypto",
      "is Prismatic safe",
      "Prismatic help"
    ],
    canonicalPath: "/faq",
    priority: 0.5,
    changefreq: "monthly",
    aiAnswer: "The Prismatic FAQ covers common questions about buying crypto, payment methods, fees, security, and supported cryptocurrencies.",
    aiDefinition: "Frequently asked questions about using Prismatic cryptocurrency exchange platform."
  },
  "/verify": {
    title: "Verify Transaction | Track Your Order – Prismatic",
    description: "Track and verify your cryptocurrency transaction status. Enter your reference ID to check order progress and confirmation.",
    keywords: [
      "verify transaction",
      "track crypto order",
      "transaction status",
      "Prismatic order tracking"
    ],
    canonicalPath: "/verify",
    priority: 0.4,
    changefreq: "monthly"
  },
  "/sitemap": {
    title: "Sitemap | All Pages – Prismatic",
    description: "Navigate to all pages on Prismatic. Find information about buying crypto with PayPal, card payments, supported coins, and more.",
    keywords: [
      "Prismatic sitemap",
      "site navigation",
      "all pages"
    ],
    canonicalPath: "/sitemap",
    priority: 0.3,
    changefreq: "monthly"
  }
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: BRAND,
  alternateName: "Prismatic Crypto Exchange",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description: "Prismatic is a privacy-focused cryptocurrency exchange enabling instant purchases of Bitcoin, Ethereum, and other cryptocurrencies using PayPal or credit cards without KYC verification.",
  foundingDate: "2024",
  slogan: "Instant Crypto, Zero Hassle",
  sameAs: [
    "https://discord.gg/prismatics",
    "https://twitter.com/prismaticexchange"
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
  name: "Prismatic Crypto Exchange",
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
