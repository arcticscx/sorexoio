import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowRight, ArrowLeft, Check, Sparkles, Gift, Wallet, Copy } from "lucide-react";
import { GlassCard, GlassButton, GlassInput, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { CryptoIcon } from "@/components/CryptoIcon";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/components/Seo";
import type { SwapWallet } from "@shared/schema";

const SELL_FEE = 0.005; // 0.5% fee
const MIN_SELL_USD = 50;
const MAX_SELL_USD = 50000;

import paypalIcon from "@assets/ARCTIC_1768071353413.png";
import amazonIcon from "@assets/image_1770062250834.png";
import spotifyIcon from "@assets/image_1770062259498.png";
import fortniteIcon from "@assets/image_1770062268743.png";
import xboxIcon from "@assets/image_1770062274785.png";
import steamIcon from "@assets/image_1770062278808.png";
import playstationIcon from "@assets/image_1770062282872.png";
import twitchIcon from "@assets/image_1770062294308.png";
import appleIcon from "@assets/image_1770062297316.png";
import googlePlayIcon from "@assets/image_1770062300792.png";
import nintendoIcon from "@assets/image_1770062314419.png";
import paypalCardIcon from "@assets/image_1770062331582.png";
import venmoIcon from "@assets/image_1770062335458.png";
import bankIcon from "@assets/image_1770062340634.png";
import revolutIcon from "@assets/image_1770062343869.png";
import wiseIcon from "@assets/image_1770062347194.png";
import giftcardIcon from "@assets/image_1770063338671.png";
import cashappIcon from "@assets/Untitled_design_(55)_1770063708007.png";
import applepayIcon from "@assets/Untitled_design_(54)_1770063604072.png";

type Step = "crypto" | "payout" | "details" | "send";

const supportedCryptos = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "USDC", name: "USD Coin" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "TRX", name: "TRON" },
  { symbol: "POL", name: "Polygon" },
];

const payoutMethods = [
  { id: "paypal", name: "PayPal", icon: paypalCardIcon, description: "Receive funds via PayPal" },
  { id: "venmo", name: "Venmo", icon: venmoIcon, description: "Receive to Venmo" },
  { id: "cashapp", name: "Cash App", icon: cashappIcon, description: "Receive to Cash App" },
  { id: "applepay", name: "Apple Pay", icon: applepayIcon, description: "Receive to Apple Pay" },
  { id: "giftcards", name: "Gift Cards", icon: giftcardIcon, description: "Get popular gift cards" },
  { id: "bank", name: "Bank Transfer", icon: bankIcon, description: "SEPA / SWIFT / ACH" },
  { id: "revolut", name: "Revolut", icon: revolutIcon, description: "Receive to Revolut" },
  { id: "wise", name: "Wise", icon: wiseIcon, description: "Receive to Wise" },
];

const giftCardTypes = [
  { id: "amazon", name: "Amazon", icon: amazonIcon },
  { id: "steam", name: "Steam", icon: steamIcon },
  { id: "apple", name: "Apple", icon: appleIcon },
  { id: "googleplay", name: "Google Play", icon: googlePlayIcon },
  { id: "xbox", name: "Xbox", icon: xboxIcon },
  { id: "playstation", name: "PlayStation", icon: playstationIcon },
  { id: "spotify", name: "Spotify", icon: spotifyIcon },
  { id: "fortnite", name: "Fortnite", icon: fortniteIcon },
  { id: "twitch", name: "Twitch", icon: twitchIcon },
  { id: "nintendo", name: "Nintendo", icon: nintendoIcon },
];


export default function Sell() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("crypto");
  const [formData, setFormData] = useState({
    cryptoType: "BTC",
    cryptoAmount: "",
    payoutMethod: "",
    paypalEmail: "",
    venmoUsername: "",
    cashTag: "",
    applePayPhone: "",
    giftCardType: "",
    giftCardEmail: "",
    bankName: "",
    accountHolder: "",
    routingNumber: "",
    accountNumber: "",
    iban: "",
    bankType: "us" as "us" | "iban",
    revolutTag: "",
    wiseEmail: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sellOrderResponse, setSellOrderResponse] = useState<{
    transactionId: string;
    referenceId: string;
    walletAddress: string | null;
  } | null>(null);

  const { data: prices } = useQuery<Record<string, number>>({
    queryKey: ["/api/prices"],
    refetchInterval: 60000,
  });

  const generateReferenceCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SELL-${timestamp}-${random}`;
  };

  const [referenceCode] = useState(generateReferenceCode);

  const getCryptoRate = (symbol: string) => {
    if (prices && prices[symbol]) {
      return prices[symbol];
    }
    const fallbacks: Record<string, number> = { 
      BTC: 97000, ETH: 3300, SOL: 180, USDT: 1, LTC: 100, 
      BNB: 600, USDC: 1, TRX: 0.25, POL: 0.5
    };
    return fallbacks[symbol] || 1;
  };

  // Fetch swap wallets for addresses and QR codes
  const { data: swapWallets = [] } = useQuery<SwapWallet[]>({
    queryKey: ["/api/swap-wallets"],
  });

  const cryptoRate = getCryptoRate(formData.cryptoType);
  const cryptoAmount = parseFloat(formData.cryptoAmount) || 0;
  const usdValue = cryptoAmount * cryptoRate;
  const userReceives = usdValue * (1 - SELL_FEE);
  const platformFee = usdValue * SELL_FEE;
  const [copied, setCopied] = useState(false);

  // Get wallet for selected crypto
  const selectedWallet = swapWallets.find(w => w.cryptoSymbol === formData.cryptoType && w.isActive);

  const createSellOrder = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sell-orders", {
        cryptoType: formData.cryptoType,
        cryptoAmount: parseFloat(formData.cryptoAmount),
        payoutMethod: formData.payoutMethod,
        paypalEmail: formData.paypalEmail || null,
        venmoUsername: formData.venmoUsername || null,
        cashTag: formData.cashTag || null,
        applePayPhone: formData.applePayPhone || null,
        giftCardType: formData.giftCardType || null,
        giftCardEmail: formData.giftCardEmail || null,
        bankName: formData.bankName || null,
        accountHolder: formData.accountHolder || null,
        routingNumber: formData.routingNumber || null,
        accountNumber: formData.accountNumber || null,
        iban: formData.iban || null,
        bankType: formData.bankType || null,
        revolutTag: formData.revolutTag || null,
        wiseEmail: formData.wiseEmail || null,
        referenceId: referenceCode,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setSellOrderResponse({
        transactionId: data.transactionId,
        referenceId: data.referenceId,
        walletAddress: data.walletAddress,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setStep("send");
      toast({
        title: "Sell Order Created",
        description: "Please send your crypto to the provided wallet address.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create sell order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const steps = [
    { id: "crypto", label: "Crypto", number: 1 },
    { id: "payout", label: "Payout", number: 2 },
    { id: "details", label: "Details", number: 3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === "crypto") {
      if (!formData.cryptoAmount || cryptoAmount <= 0) {
        newErrors.cryptoAmount = "Please enter a valid amount";
      } else if (usdValue < MIN_SELL_USD) {
        newErrors.cryptoAmount = `Minimum sell value is $${MIN_SELL_USD} (current: $${usdValue.toFixed(2)})`;
      } else if (usdValue > MAX_SELL_USD) {
        newErrors.cryptoAmount = `Maximum sell value is $${MAX_SELL_USD.toLocaleString()} (current: $${usdValue.toFixed(2)})`;
      }
    }

    if (currentStep === "payout") {
      if (!formData.payoutMethod) {
        newErrors.payoutMethod = "Please select a payout method";
      }
    }

    if (currentStep === "details") {
      const method = formData.payoutMethod;
      
      if (method === "paypal") {
        if (!formData.paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
          newErrors.paypalEmail = "Please enter a valid email address";
        }
      }
      
      if (method === "venmo") {
        if (!formData.venmoUsername || formData.venmoUsername.length < 1) {
          newErrors.venmoUsername = "Please enter your Venmo username";
        }
      }
      
      if (method === "cashapp") {
        if (!formData.cashTag || !formData.cashTag.startsWith("$")) {
          newErrors.cashTag = "Please enter a valid $cashtag (must start with $)";
        }
      }
      
      if (method === "applepay") {
        if (!formData.applePayPhone || formData.applePayPhone.length < 10) {
          newErrors.applePayPhone = "Please enter a valid phone number";
        }
      }
      
      if (method === "giftcards") {
        if (!formData.giftCardType) {
          newErrors.giftCardType = "Please select a gift card type";
        }
        if (!formData.giftCardEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.giftCardEmail)) {
          newErrors.giftCardEmail = "Please enter a valid email for delivery";
        }
      }
      
      if (method === "revolut") {
        if (!formData.revolutTag || formData.revolutTag.length < 1) {
          newErrors.revolutTag = "Please enter your Revolut @tag";
        }
      }
      
      if (method === "wise") {
        if (!formData.wiseEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.wiseEmail)) {
          newErrors.wiseEmail = "Please enter a valid email address";
        }
      }
      
      if (method === "bank") {
        if (!formData.accountHolder || formData.accountHolder.length < 2) {
          newErrors.accountHolder = "Please enter account holder name";
        }
        
        if (formData.bankType === "iban") {
          // IBAN validation (2 letters + 2 digits + up to 30 alphanumeric)
          if (!formData.iban || !/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/.test(formData.iban.toUpperCase().replace(/\s/g, ''))) {
            newErrors.iban = "Please enter a valid IBAN";
          }
        } else {
          // US Bank validation
          if (!formData.bankName || formData.bankName.length < 2) {
            newErrors.bankName = "Please enter your bank name";
          }
          if (!formData.routingNumber || !/^\d{9}$/.test(formData.routingNumber)) {
            newErrors.routingNumber = "Routing number must be exactly 9 digits (numeric only)";
          }
          if (!formData.accountNumber || !/^\d{8,17}$/.test(formData.accountNumber)) {
            newErrors.accountNumber = "Account number must be 8-17 digits (numeric only)";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    const stepOrder: Step[] = ["crypto", "payout", "details"];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    } else if (step === "details") {
      // Submit and go to send step
      handleSubmit();
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["crypto", "payout", "details"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    if (!validateStep("details")) return;
    createSellOrder.mutate();
  };

  const handleReset = () => {
    setStep("crypto");
    setFormData({
      cryptoType: "BTC",
      cryptoAmount: "",
      payoutMethod: "",
      paypalEmail: "",
      venmoUsername: "",
      cashTag: "",
      applePayPhone: "",
      giftCardType: "",
      giftCardEmail: "",
      bankName: "",
      accountHolder: "",
      routingNumber: "",
      accountNumber: "",
      iban: "",
      bankType: "us",
      revolutTag: "",
      wiseEmail: "",
    });
    setErrors({});
    setSellOrderResponse(null);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({ title: "Address copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const getPayoutDetailsDisplay = () => {
    const method = formData.payoutMethod;
    if (method === "paypal") return formData.paypalEmail;
    if (method === "venmo") return `@${formData.venmoUsername}`;
    if (method === "cashapp") return formData.cashTag;
    if (method === "applepay") return formData.applePayPhone;
    if (method === "giftcards") return `${giftCardTypes.find(g => g.id === formData.giftCardType)?.name} - ${formData.giftCardEmail}`;
    if (method === "bank") {
      if (formData.bankType === "iban") {
        return `IBAN: ${formData.iban} - ${formData.accountHolder}`;
      }
      return `${formData.bankName} - ${formData.accountHolder}`;
    }
    if (method === "revolut") return `@${formData.revolutTag}`;
    if (method === "wise") return formData.wiseEmail;
    return "";
  };

  return (
    <div className="min-h-screen">
      <Seo path="/sell" />
      <PrismaticBackground intensity="medium" enableParallax />
      <GlassNavbar />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Sell Crypto
              </h1>
              <p className="text-white/50">
                Convert your cryptocurrency to cash or gift cards
              </p>
            </div>

            {step !== "send" && (
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                          i <= currentStepIndex
                            ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-glow"
                            : "bg-white/10 text-white/40"
                        }`}
                        data-testid={`step-indicator-${s.id}`}
                      >
                        {i < currentStepIndex ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          s.number
                        )}
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className={`w-16 sm:w-24 h-0.5 mx-2 transition-all duration-300 ${
                            i < currentStepIndex ? "bg-emerald-500" : "bg-white/10"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
                  {steps.map((s) => (
                    <span
                      key={s.id}
                      className="text-xs text-white/40 hidden sm:block"
                    >
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <GlassCard className="p-6 sm:p-8" hover={false}>
              <AnimatePresence mode="wait">
                {step === "crypto" && (
                  <motion.div
                    key="crypto"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Select cryptocurrency to sell
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Select Cryptocurrency
                        </label>
                        <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-2">
                          {supportedCryptos.map((crypto) => (
                            <button
                              key={crypto.symbol}
                              onClick={() =>
                                setFormData({ ...formData, cryptoType: crypto.symbol })
                              }
                              className={`p-2 sm:p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center gap-1 sm:gap-1.5 ${
                                formData.cryptoType === crypto.symbol
                                  ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                              }`}
                              data-testid={`button-crypto-${crypto.symbol}`}
                            >
                              <CryptoIcon symbol={crypto.symbol} size="sm" />
                              <span className="font-semibold text-xs sm:text-sm">{crypto.symbol}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <GlassInput
                          label={`Amount (${formData.cryptoType})`}
                          type="number"
                          placeholder="0.00"
                          value={formData.cryptoAmount}
                          onChange={(e) =>
                            setFormData({ ...formData, cryptoAmount: e.target.value })
                          }
                          error={errors.cryptoAmount}
                          data-testid="input-crypto-amount"
                        />
                        <div className="absolute right-4 top-9 text-white/50 text-sm">
                          {formData.cryptoType}
                        </div>
                      </div>

                      {formData.cryptoAmount && cryptoAmount > 0 && (
                        <GlassCard className="p-4 bg-emerald-500/10" hover={false}>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-white/60">Value (USD)</span>
                              <span className="text-white font-medium" data-testid="text-usd-value">
                                ${usdValue.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-white/60">Platform Fee (0.5%)</span>
                              <span className="text-amber-400 font-medium" data-testid="text-platform-fee">
                                -${platformFee.toFixed(2)}
                              </span>
                            </div>
                            <div className="border-t border-white/10 pt-2">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">You Receive</span>
                                <span className="text-lg font-semibold text-emerald-400" data-testid="text-user-receives">
                                  ${userReceives.toFixed(2)}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-white/40 text-right">
                              Rate: 1 {formData.cryptoType} = ${cryptoRate.toLocaleString()}
                            </div>
                          </div>
                        </GlassCard>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === "payout" && (
                  <motion.div
                    key="payout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Select Payout Method
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {payoutMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() =>
                            setFormData({ ...formData, payoutMethod: method.id })
                          }
                          className="flex flex-col items-center gap-2 group"
                          data-testid={`button-payout-${method.id}`}
                        >
                          <div className={`relative w-full aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                            formData.payoutMethod === method.id
                              ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105"
                              : "border-white/10 group-hover:border-white/30"
                          }`}>
                            {method.icon ? (
                              <img 
                                src={method.icon} 
                                alt={method.name} 
                                loading="eager"
                                decoding="sync"
                                className="w-full h-full object-cover brightness-110 bg-white/5"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 flex items-center justify-center">
                                <Gift className="w-10 h-10 text-emerald-400" />
                              </div>
                            )}
                            {formData.payoutMethod === method.id && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </div>
                          <span className={`text-sm font-medium transition-colors ${
                            formData.payoutMethod === method.id ? "text-white" : "text-white/60 group-hover:text-white"
                          }`}>{method.name}</span>
                        </button>
                      ))}
                    </div>

                    {errors.payoutMethod && (
                      <p className="mt-3 text-sm text-red-400">{errors.payoutMethod}</p>
                    )}
                  </motion.div>
                )}

                {step === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Enter Payout Details
                    </h2>

                    <div className="space-y-5">
                      {formData.payoutMethod === "paypal" && (
                        <GlassInput
                          label="PayPal Email Address"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.paypalEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, paypalEmail: e.target.value })
                          }
                          error={errors.paypalEmail}
                          data-testid="input-paypal-email"
                        />
                      )}

                      {formData.payoutMethod === "venmo" && (
                        <GlassInput
                          label="Venmo Username"
                          type="text"
                          placeholder="@username"
                          value={formData.venmoUsername}
                          onChange={(e) =>
                            setFormData({ ...formData, venmoUsername: e.target.value })
                          }
                          error={errors.venmoUsername}
                          data-testid="input-venmo-username"
                        />
                      )}

                      {formData.payoutMethod === "cashapp" && (
                        <GlassInput
                          label="Cash App $Cashtag"
                          type="text"
                          placeholder="$yourcashtag"
                          value={formData.cashTag}
                          onChange={(e) =>
                            setFormData({ ...formData, cashTag: e.target.value })
                          }
                          error={errors.cashTag}
                          data-testid="input-cashtag"
                        />
                      )}

                      {formData.payoutMethod === "applepay" && (
                        <GlassInput
                          label="Apple Pay Phone Number"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.applePayPhone}
                          onChange={(e) =>
                            setFormData({ ...formData, applePayPhone: e.target.value })
                          }
                          error={errors.applePayPhone}
                          data-testid="input-applepay-phone"
                        />
                      )}

                      {formData.payoutMethod === "giftcards" && (
                        <>
                          <div>
                            <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                              Select Gift Card Type
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                              {giftCardTypes.map((card) => (
                                <button
                                  key={card.id}
                                  onClick={() =>
                                    setFormData({ ...formData, giftCardType: card.id })
                                  }
                                  className="flex flex-col items-center gap-2 group"
                                  data-testid={`select-giftcard-${card.id}`}
                                >
                                  <div className={`relative w-full aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                                    formData.giftCardType === card.id
                                      ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105"
                                      : "border-white/10 group-hover:border-white/30"
                                  }`}>
                                    <img 
                                      src={card.icon} 
                                      alt={card.name} 
                                      loading="eager"
                                      decoding="sync"
                                      className="w-full h-full object-cover brightness-110 bg-white/5"
                                    />
                                    {formData.giftCardType === card.id && (
                                      <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <span className={`text-sm font-medium transition-colors ${
                                    formData.giftCardType === card.id ? "text-white" : "text-white/60 group-hover:text-white"
                                  }`}>{card.name}</span>
                                </button>
                              ))}
                            </div>
                            {errors.giftCardType && (
                              <p className="mt-1.5 text-xs text-red-400">{errors.giftCardType}</p>
                            )}
                          </div>
                          <GlassInput
                            label="Email for Gift Card Delivery"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.giftCardEmail}
                            onChange={(e) =>
                              setFormData({ ...formData, giftCardEmail: e.target.value })
                            }
                            error={errors.giftCardEmail}
                            data-testid="input-giftcard-email"
                          />
                        </>
                      )}

                      {formData.payoutMethod === "revolut" && (
                        <GlassInput
                          label="Revolut @Tag"
                          type="text"
                          placeholder="@yourtag"
                          value={formData.revolutTag}
                          onChange={(e) =>
                            setFormData({ ...formData, revolutTag: e.target.value })
                          }
                          error={errors.revolutTag}
                          data-testid="input-revolut-tag"
                        />
                      )}

                      {formData.payoutMethod === "wise" && (
                        <GlassInput
                          label="Wise Email Address"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.wiseEmail}
                          onChange={(e) =>
                            setFormData({ ...formData, wiseEmail: e.target.value })
                          }
                          error={errors.wiseEmail}
                          data-testid="input-wise-email"
                        />
                      )}

                      {formData.payoutMethod === "bank" && (
                        <>
                          <div className="mb-4">
                            <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                              Bank Type
                            </label>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, bankType: "us" })}
                                className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                                  formData.bankType === "us"
                                    ? "bg-emerald-500/20 border-emerald-500 text-white"
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                }`}
                                data-testid="button-bank-type-us"
                              >
                                US Bank (ACH)
                              </button>
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, bankType: "iban" })}
                                className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                                  formData.bankType === "iban"
                                    ? "bg-emerald-500/20 border-emerald-500 text-white"
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                }`}
                                data-testid="button-bank-type-iban"
                              >
                                IBAN (International)
                              </button>
                            </div>
                          </div>

                          <GlassInput
                            label="Account Holder Name"
                            type="text"
                            placeholder="Full name on account"
                            value={formData.accountHolder}
                            onChange={(e) =>
                              setFormData({ ...formData, accountHolder: e.target.value })
                            }
                            error={errors.accountHolder}
                            data-testid="input-account-holder"
                          />

                          {formData.bankType === "us" ? (
                            <>
                              <GlassInput
                                label="Bank Name"
                                type="text"
                                placeholder="e.g., Chase, Bank of America"
                                value={formData.bankName}
                                onChange={(e) =>
                                  setFormData({ ...formData, bankName: e.target.value })
                                }
                                error={errors.bankName}
                                data-testid="input-bank-name"
                              />
                              <GlassInput
                                label="Routing Number"
                                type="text"
                                placeholder="9-digit routing number"
                                value={formData.routingNumber}
                                onChange={(e) =>
                                  setFormData({ ...formData, routingNumber: e.target.value.replace(/\D/g, "").slice(0, 9) })
                                }
                                error={errors.routingNumber}
                                data-testid="input-routing-number"
                              />
                              <GlassInput
                                label="Account Number"
                                type="text"
                                placeholder="Your account number"
                                value={formData.accountNumber}
                                onChange={(e) =>
                                  setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, "") })
                                }
                                error={errors.accountNumber}
                                data-testid="input-account-number"
                              />
                            </>
                          ) : (
                            <GlassInput
                              label="IBAN"
                              type="text"
                              placeholder="e.g., DE89370400440532013000"
                              value={formData.iban}
                              onChange={(e) =>
                                setFormData({ ...formData, iban: e.target.value.toUpperCase().replace(/\s/g, '') })
                              }
                              error={errors.iban}
                              data-testid="input-iban"
                            />
                          )}
                        </>
                      )}

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Wallet className="w-5 h-5 text-amber-400 mt-0.5" />
                        <p className="text-sm text-amber-200/80">
                          Make sure your payout details are correct. Funds sent to incorrect accounts cannot be recovered.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "send" && (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center gap-3 mb-6 justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full"
                      />
                      <h3 className="text-lg font-semibold text-white">
                        Awaiting Payment
                      </h3>
                    </div>
                    
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-center mb-6"
                    >
                      <p className="text-white/70 text-sm">
                        Send exactly <span className="text-emerald-400 font-semibold">{formData.cryptoAmount} {formData.cryptoType}</span> to the address below
                      </p>
                    </motion.div>
                    
                    <div className="space-y-6">
                      {selectedWallet?.qrCodeImage && (
                        <div className="flex justify-center">
                          <motion.div 
                            className="bg-white p-4 rounded-xl relative"
                            animate={{ boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0)", "0 0 0 8px rgba(16, 185, 129, 0.2)", "0 0 0 0 rgba(16, 185, 129, 0)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <img 
                              src={selectedWallet.qrCodeImage} 
                              alt={`${formData.cryptoType} QR Code`}
                              className="w-48 h-48 object-contain"
                            />
                          </motion.div>
                        </div>
                      )}

                      <motion.div 
                        className="rounded-xl bg-white/5 p-4 border border-emerald-500/30"
                        animate={{ borderColor: ["rgba(16, 185, 129, 0.3)", "rgba(16, 185, 129, 0.6)", "rgba(16, 185, 129, 0.3)"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Send {formData.cryptoType} to this address
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-black/30 rounded-lg p-3 text-sm text-white font-mono break-all">
                            {selectedWallet?.walletAddress || sellOrderResponse?.walletAddress || "Loading..."}
                          </code>
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(selectedWallet?.walletAddress || sellOrderResponse?.walletAddress || "")}
                            data-testid="button-copy-address"
                          >
                            {copied ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </GlassButton>
                        </div>
                      </motion.div>

                      <div className="rounded-xl bg-white/5 p-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/50">Amount to send</span>
                          <span className="text-white font-semibold">{formData.cryptoAmount} {formData.cryptoType}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/50">You'll receive</span>
                          <span className="text-emerald-400 font-semibold">${userReceives.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/50">Fee</span>
                          <span className="text-amber-400">${platformFee.toFixed(2)} (0.5%)</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Payout to</span>
                          <span className="text-white">{payoutMethods.find(m => m.id === formData.payoutMethod)?.name}</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-white/50 text-xs mb-1">Payout details:</p>
                        <code className="text-emerald-400 font-mono text-sm break-all">{getPayoutDetailsDisplay()}</code>
                      </div>

                      <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-white/50 text-xs mb-1">Reference ID:</p>
                        <code className="text-white font-mono text-sm" data-testid="text-reference-code">{sellOrderResponse?.referenceId || referenceCode}</code>
                      </div>

                      <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4">
                        <p className="text-sm text-blue-300">
                          After sending, please allow up to 30 minutes for confirmation. 
                          Your payout will be processed once the transaction is verified on the blockchain.
                        </p>
                      </div>

                      <GlassButton
                        variant="ghost"
                        className="w-full"
                        onClick={handleReset}
                        data-testid="button-new-sell"
                      >
                        Start New Sell Order
                      </GlassButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step !== "send" && (
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
                  {step !== "crypto" && (
                    <GlassButton
                      variant="ghost"
                      onClick={handleBack}
                      data-testid="button-back"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </GlassButton>
                  )}
                  <GlassButton
                    variant="primary"
                    className="ml-auto"
                    onClick={handleNext}
                    disabled={createSellOrder.isPending}
                    shimmer
                    data-testid="button-next"
                  >
                    {createSellOrder.isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Processing...
                      </>
                    ) : step === "details" ? (
                      <>
                        Create Sell Order
                        <Check className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </GlassButton>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
