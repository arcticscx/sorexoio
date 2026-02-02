import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowRight, ArrowLeft, Check, DollarSign, Sparkles, CreditCard, Smartphone, Gift, Building, Wallet, Copy } from "lucide-react";
import { GlassCard, GlassButton, GlassInput, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { CryptoIcon } from "@/components/CryptoIcon";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/components/Seo";

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

type Step = "crypto" | "payout" | "details" | "confirm" | "success";

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
  { id: "paypal", name: "PayPal", icon: "paypal", description: "Receive funds via PayPal" },
  { id: "applepay", name: "Apple Pay", icon: "applepay", description: "Receive to your Apple Pay" },
  { id: "giftcards", name: "Gift Cards", icon: "giftcards", description: "Get popular gift cards" },
  { id: "cashapp", name: "Cash App", icon: "cashapp", description: "Receive to Cash App" },
  { id: "bank", name: "Bank Transfer", icon: "bank", description: "Direct bank deposit" },
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

function PayoutMethodIcon({ type }: { type: string }) {
  const key = type.toLowerCase();
  
  if (key === "paypal") {
    return <img src={paypalIcon} alt="PayPal" className="w-7 h-7 object-contain" />;
  }
  if (key === "applepay") {
    return <Smartphone className="w-7 h-7 text-emerald-400" />;
  }
  if (key === "giftcards") {
    return <Gift className="w-7 h-7 text-emerald-400" />;
  }
  if (key === "cashapp") {
    return <DollarSign className="w-7 h-7 text-emerald-400" />;
  }
  if (key === "bank") {
    return <Building className="w-7 h-7 text-emerald-400" />;
  }
  return <CreditCard className="w-7 h-7 text-emerald-400" />;
}

export default function Sell() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("crypto");
  const [formData, setFormData] = useState({
    cryptoType: "BTC",
    cryptoAmount: "",
    payoutMethod: "",
    paypalEmail: "",
    applePayPhone: "",
    giftCardType: "",
    giftCardEmail: "",
    cashTag: "",
    bankName: "",
    accountHolder: "",
    routingNumber: "",
    accountNumber: "",
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

  const cryptoRate = getCryptoRate(formData.cryptoType);
  const cryptoAmount = parseFloat(formData.cryptoAmount) || 0;
  const usdValue = cryptoAmount * cryptoRate;
  const userReceives = usdValue * 0.95;
  const platformFee = usdValue * 0.05;

  const createSellOrder = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sell-orders", {
        cryptoType: formData.cryptoType,
        cryptoAmount: parseFloat(formData.cryptoAmount),
        payoutMethod: formData.payoutMethod,
        paypalEmail: formData.paypalEmail || null,
        applePayPhone: formData.applePayPhone || null,
        giftCardType: formData.giftCardType || null,
        giftCardEmail: formData.giftCardEmail || null,
        cashTag: formData.cashTag || null,
        bankName: formData.bankName || null,
        accountHolder: formData.accountHolder || null,
        routingNumber: formData.routingNumber || null,
        accountNumber: formData.accountNumber || null,
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
      setStep("success");
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
    { id: "confirm", label: "Confirm", number: 4 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === "crypto") {
      if (!formData.cryptoAmount || cryptoAmount <= 0) {
        newErrors.cryptoAmount = "Please enter a valid amount";
      } else if (usdValue < 50) {
        newErrors.cryptoAmount = `Minimum sell value is $50 (current: $${usdValue.toFixed(2)})`;
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
      
      if (method === "cashapp") {
        if (!formData.cashTag || !formData.cashTag.startsWith("$")) {
          newErrors.cashTag = "Please enter a valid $cashtag (must start with $)";
        }
      }
      
      if (method === "bank") {
        if (!formData.bankName || formData.bankName.length < 2) {
          newErrors.bankName = "Please enter your bank name";
        }
        if (!formData.accountHolder || formData.accountHolder.length < 2) {
          newErrors.accountHolder = "Please enter account holder name";
        }
        if (!formData.routingNumber || !/^\d{9}$/.test(formData.routingNumber)) {
          newErrors.routingNumber = "Routing number must be exactly 9 digits (numeric only)";
        }
        if (!formData.accountNumber || !/^\d{8,17}$/.test(formData.accountNumber)) {
          newErrors.accountNumber = "Account number must be 8-17 digits (numeric only)";
        }
      }
    }

    // Final validation at confirm step
    if (currentStep === "confirm") {
      if (cryptoAmount <= 0) {
        newErrors.cryptoAmount = "Invalid crypto amount";
      }
      if (usdValue < 50) {
        newErrors.cryptoAmount = "Minimum sell value is $50";
      }
      if (!formData.payoutMethod) {
        newErrors.payoutMethod = "Payout method is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    const stepOrder: Step[] = ["crypto", "payout", "details", "confirm"];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    } else if (step === "confirm") {
      handleSubmit();
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["crypto", "payout", "details", "confirm"];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    if (!validateStep("confirm")) return;
    createSellOrder.mutate();
  };

  const handleReset = () => {
    setStep("crypto");
    setFormData({
      cryptoType: "BTC",
      cryptoAmount: "",
      payoutMethod: "",
      paypalEmail: "",
      applePayPhone: "",
      giftCardType: "",
      giftCardEmail: "",
      cashTag: "",
      bankName: "",
      accountHolder: "",
      routingNumber: "",
      accountNumber: "",
    });
    setErrors({});
    setSellOrderResponse(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const getPayoutDetailsDisplay = () => {
    const method = formData.payoutMethod;
    if (method === "paypal") return formData.paypalEmail;
    if (method === "applepay") return formData.applePayPhone;
    if (method === "giftcards") return `${giftCardTypes.find(g => g.id === formData.giftCardType)?.name} - ${formData.giftCardEmail}`;
    if (method === "cashapp") return formData.cashTag;
    if (method === "bank") return `${formData.bankName} - ${formData.accountHolder}`;
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

            {step !== "success" && (
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
                              <span className="text-white/60">Platform Fee (5%)</span>
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

                    <div className="space-y-3">
                      {payoutMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() =>
                            setFormData({ ...formData, payoutMethod: method.id })
                          }
                          className={`w-full p-5 rounded-xl border flex items-center gap-4 transition-all duration-200 ${
                            formData.payoutMethod === method.id
                              ? "bg-emerald-500/20 border-emerald-500/50"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                          data-testid={`button-payout-${method.id}`}
                        >
                          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                            <PayoutMethodIcon type={method.icon} />
                          </div>
                          <div className="text-left flex-1">
                            <span className="text-white font-semibold block">{method.name}</span>
                            <span className="text-white/50 text-sm">{method.description}</span>
                          </div>
                          {formData.payoutMethod === method.id && (
                            <div className="ml-auto">
                              <Check className="w-5 h-5 text-emerald-400" />
                            </div>
                          )}
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
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              {giftCardTypes.map((card) => (
                                <button
                                  key={card.id}
                                  onClick={() =>
                                    setFormData({ ...formData, giftCardType: card.id })
                                  }
                                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                                    formData.giftCardType === card.id
                                      ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105"
                                      : "border-white/10 hover:border-white/30"
                                  }`}
                                  data-testid={`select-giftcard-${card.id}`}
                                >
                                  <img 
                                    src={card.icon} 
                                    alt={card.name} 
                                    className="w-full h-16 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-1">
                                    <span className="text-white text-xs font-medium drop-shadow-lg">{card.name}</span>
                                  </div>
                                  {formData.giftCardType === card.id && (
                                    <div className="absolute top-1 right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                  )}
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

                      {formData.payoutMethod === "bank" && (
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

                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Confirm Your Sell Order
                    </h2>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/50">Selling</span>
                          <span className="text-white font-medium flex items-center gap-2">
                            <CryptoIcon symbol={formData.cryptoType} size="sm" />
                            {formData.cryptoAmount} {formData.cryptoType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Value</span>
                          <span className="text-white font-medium" data-testid="text-confirm-value">
                            ${usdValue.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Platform Fee (5%)</span>
                          <span className="text-amber-400 font-medium">
                            -${platformFee.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-2">
                          <span className="text-white font-medium">You Receive</span>
                          <span className="text-lg font-semibold text-emerald-400" data-testid="text-confirm-receive">
                            ${userReceives.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Payout Method</span>
                          <span className="text-white font-medium capitalize">
                            {payoutMethods.find(m => m.id === formData.payoutMethod)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Payout Details</span>
                          <span className="text-white font-medium text-sm truncate max-w-[200px]" data-testid="text-payout-details">
                            {getPayoutDetailsDisplay()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Reference</span>
                          <span className="text-white font-mono text-sm" data-testid="text-reference-code">
                            {referenceCode}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Wallet className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <p className="text-sm text-emerald-200/80">
                          After confirmation, you will receive a wallet address to send your crypto. Your payout will be processed once the transaction is confirmed on the blockchain.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-glow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <Check className="w-10 h-10 text-white" />
                    </motion.div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                      Sell Order Created!
                    </h2>
                    <p className="text-white/60 mb-6">
                      Send your crypto to the address below
                    </p>

                    <div className="p-5 rounded-xl bg-white/5 border border-white/10 mb-6">
                      <div className="text-white/50 text-sm mb-2">Send {formData.cryptoAmount} {formData.cryptoType} to:</div>
                      <div className="p-4 rounded-lg bg-black/30 mb-3">
                        {sellOrderResponse?.walletAddress ? (
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-emerald-400 font-mono text-sm break-all text-left" data-testid="text-wallet-address">
                              {sellOrderResponse.walletAddress}
                            </p>
                            <button
                              onClick={() => copyToClipboard(sellOrderResponse.walletAddress!)}
                              className="flex-shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                              data-testid="button-copy-address"
                            >
                              <Copy className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-amber-400 font-medium text-sm" data-testid="text-wallet-address">
                            Platform wallet address will be provided after review
                          </p>
                        )}
                      </div>
                      <p className="text-white/40 text-xs">
                        Reference: <span className="font-mono" data-testid="text-success-reference">{sellOrderResponse?.referenceId || referenceCode}</span>
                      </p>
                    </div>

                    <GlassCard className="p-4 bg-emerald-500/10 mb-6" hover={false}>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">You will receive</span>
                        <span className="text-lg font-semibold text-emerald-400" data-testid="text-success-receive">
                          ${userReceives.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-white/40 text-right mt-1">
                        via {payoutMethods.find(m => m.id === formData.payoutMethod)?.name}
                      </div>
                    </GlassCard>

                    <div className="space-y-3">
                      <GlassButton 
                        variant="primary" 
                        size="lg" 
                        className="w-full" 
                        onClick={() => setLocation("/")}
                        data-testid="button-back-home"
                      >
                        Back to Home
                      </GlassButton>
                      <GlassButton 
                        variant="outline" 
                        size="lg" 
                        className="w-full" 
                        onClick={handleReset}
                        data-testid="button-new-sell"
                      >
                        Create Another Sell Order
                      </GlassButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step !== "success" && (
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
                    ) : step === "confirm" ? (
                      <>
                        Confirm Sell Order
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
