import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, ArrowLeft, Check, Wallet, Mail, ArrowDownUp, Sparkles, DollarSign } from "lucide-react";
import { GlassCard, GlassButton, GlassInput, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { CryptoIcon } from "@/components/CryptoIcon";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Crypto, PaymentMethod, Setting } from "@shared/schema";

import cardIcon from "@assets/ARCTIC_1768071339190.png";
import paypalIcon from "@assets/ARCTIC_1768071353413.png";

type Step = "amount" | "payment" | "details" | "paypal_payment" | "confirm" | "success";

function PaymentMethodIcon({ type }: { type: string }) {
  const key = type.toLowerCase();
  
  if (key === "card") {
    return <img src={cardIcon} alt="Card" className="w-7 h-7 object-contain" />;
  }
  if (key === "paypal") {
    return <img src={paypalIcon} alt="PayPal" className="w-7 h-7 object-contain" />;
  }
  if (key === "bank") {
    return <Wallet className="w-7 h-7 text-emerald-400" />;
  }
  return <DollarSign className="w-7 h-7 text-emerald-400" />;
}

const fallbackPaymentMethods = [
  { id: "card", name: "Card", key: "card", description: "0 KYC", icon: null as string | null },
  { id: "paypal", name: "PayPal", key: "paypal", description: "Fast & secure", icon: null as string | null },
];

const defaultCryptos = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "SOL", name: "Solana" },
];

export default function Exchange() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>("amount");
  const [formData, setFormData] = useState({
    amount: "",
    currency: "USD",
    cryptoType: "BTC",
    paymentMethod: "",
    email: "",
    walletAddress: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: cryptos } = useQuery<Crypto[]>({
    queryKey: ["/api/cryptos"],
  });

  const { data: dbPaymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  const { data: prices } = useQuery<Record<string, number>>({
    queryKey: ["/api/prices"],
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: settings = [] } = useQuery<Setting[]>({
    queryKey: ["/api/settings"],
  });

  // Get setting value by key
  const getSetting = (key: string, defaultValue: string = ""): string => {
    const setting = settings.find((s) => s.key === key);
    return setting?.value || defaultValue;
  };

  // Generate a unique reference code for the transaction
  const generateReferenceCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `PRS-${timestamp}-${random}`;
  };

  const [referenceCode] = useState(generateReferenceCode);

  // Get price for selected crypto (with fallbacks)
  const getCryptoRate = (symbol: string) => {
    if (prices && prices[symbol]) {
      return prices[symbol];
    }
    // Fallback prices if API fails
    const fallbacks: Record<string, number> = { BTC: 97000, ETH: 3300, SOL: 140, USDT: 1 };
    return fallbacks[symbol] || 1;
  };

  const paymentMethods = (dbPaymentMethods && dbPaymentMethods.length > 0) 
    ? dbPaymentMethods.filter(pm => pm.isActive).map(pm => ({
        id: pm.key,
        name: pm.name,
        key: pm.key,
        icon: pm.icon,
        description: pm.description || ""
      }))
    : fallbackPaymentMethods;

  const createTransaction = useMutation({
    mutationFn: async () => {
      // Use live crypto rate with 5% fee
      const rate = getCryptoRate(formData.cryptoType);
      const cryptoAmount = (parseFloat(formData.amount) * 0.95) / rate;
      
      const res = await apiRequest("POST", "/api/transactions", {
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        cryptoType: formData.cryptoType,
        cryptoAmount,
        paymentMethod: formData.paymentMethod,
        email: formData.email,
        walletAddress: formData.walletAddress,
        status: "pending",
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setStep("success");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === "amount") {
      const amount = parseFloat(formData.amount);
      if (!formData.amount || isNaN(amount)) {
        newErrors.amount = "Please enter a valid amount";
      } else if (amount < 10) {
        newErrors.amount = "Minimum amount is $10";
      } else if (amount > 50000) {
        newErrors.amount = "Maximum amount is $50,000";
      }
    }

    if (currentStep === "payment") {
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = "Please select a payment method";
      }
    }

    if (currentStep === "details") {
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.walletAddress || formData.walletAddress.length < 26) {
        newErrors.walletAddress = "Please enter a valid wallet address";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;

    // Dynamic step flow - insert paypal_payment step if PayPal is selected
    const isPayPal = formData.paymentMethod.toLowerCase() === "paypal";
    const steps: Step[] = isPayPal 
      ? ["amount", "payment", "details", "paypal_payment", "confirm"]
      : ["amount", "payment", "details", "confirm"];
    
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    } else if (step === "confirm") {
      createTransaction.mutate();
    }
  };

  const handleBack = () => {
    const isPayPal = formData.paymentMethod.toLowerCase() === "paypal";
    const steps: Step[] = isPayPal 
      ? ["amount", "payment", "details", "paypal_payment", "confirm"]
      : ["amount", "payment", "details", "confirm"];
    
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const handleReset = () => {
    setStep("amount");
    setFormData({
      amount: "",
      currency: "USD",
      cryptoType: "BTC",
      paymentMethod: "",
      email: "",
      walletAddress: "",
    });
    setErrors({});
  };

  // Dynamic step indicators based on payment method
  const isPayPalSelected = formData.paymentMethod.toLowerCase() === "paypal";
  const steps = isPayPalSelected
    ? [
        { id: "amount", label: "Amount", number: 1 },
        { id: "payment", label: "Payment", number: 2 },
        { id: "details", label: "Details", number: 3 },
        { id: "paypal_payment", label: "Pay", number: 4 },
        { id: "confirm", label: "Confirm", number: 5 },
      ]
    : [
        { id: "amount", label: "Amount", number: 1 },
        { id: "payment", label: "Payment", number: 2 },
        { id: "details", label: "Details", number: 3 },
        { id: "confirm", label: "Confirm", number: 4 },
      ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  const cryptoList = cryptos?.length ? cryptos : defaultCryptos;
  // Use live crypto rate from API with 5% fee applied
  const cryptoRate = getCryptoRate(formData.cryptoType);
  const estimatedCrypto = formData.amount ? ((parseFloat(formData.amount) * 0.95) / cryptoRate).toFixed(8) : "0.00000000";

  return (
    <div className="min-h-screen">
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
                Create Exchange
              </h1>
              <p className="text-white/50">
                Complete the steps below to exchange your cryptocurrency
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
                {step === "amount" && (
                  <motion.div
                    key="amount"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-6">
                      How much would you like to exchange?
                    </h2>

                    <div className="space-y-6">
                      <div className="relative">
                        <GlassInput
                          label="Amount"
                          type="number"
                          placeholder="100.00"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          error={errors.amount}
                          data-testid="input-amount"
                        />
                        <div className="absolute right-4 top-9 text-white/50 text-sm">
                          {formData.currency}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Select Cryptocurrency
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {cryptoList.map((crypto) => (
                            <button
                              key={crypto.symbol}
                              onClick={() =>
                                setFormData({ ...formData, cryptoType: crypto.symbol })
                              }
                              className={`p-3 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
                                formData.cryptoType === crypto.symbol
                                  ? "bg-emerald-500/20 border-emerald-500/50 text-white"
                                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                              }`}
                              data-testid={`button-crypto-${crypto.symbol}`}
                            >
                              <CryptoIcon symbol={crypto.symbol} size="sm" />
                              <span className="font-semibold">{crypto.symbol}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {formData.amount && (
                        <GlassCard className="p-4 bg-emerald-500/10" hover={false}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/60">
                              <ArrowDownUp className="w-4 h-4" />
                              <span>You will receive</span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-white">
                                {estimatedCrypto} {formData.cryptoType}
                              </div>
                              <div className="text-xs text-white/40">
                                Rate: 1 {formData.cryptoType} = ${cryptoRate.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </GlassCard>
                      )}
                    </div>
                  </motion.div>
                )}

                {step === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-6">
                      Select Payment Method
                    </h2>

                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() =>
                            setFormData({ ...formData, paymentMethod: method.id })
                          }
                          className={`w-full p-5 rounded-xl border flex items-center gap-4 transition-all duration-200 ${
                            formData.paymentMethod === method.id
                              ? "bg-emerald-500/20 border-emerald-500/50"
                              : "bg-white/5 border-white/10 hover:bg-white/10"
                          }`}
                          data-testid={`button-payment-${method.id}`}
                        >
                          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                            {method.icon ? (
                              <img src={method.icon} alt={method.name} className="w-full h-full object-cover" />
                            ) : (
                              <PaymentMethodIcon type={method.key} />
                            )}
                          </div>
                          <div className="text-left flex-1">
                            <span className="text-white font-semibold block">{method.name}</span>
                            <span className="text-white/50 text-sm">{method.description}</span>
                          </div>
                          {formData.paymentMethod === method.id && (
                            <div className="ml-auto">
                              <Check className="w-5 h-5 text-emerald-400" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {errors.paymentMethod && (
                      <p className="mt-3 text-sm text-red-400">{errors.paymentMethod}</p>
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
                      Enter Your Details
                    </h2>

                    <div className="space-y-5">
                      <GlassInput
                        label="Email Address"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        error={errors.email}
                        data-testid="input-email"
                      />

                      <GlassInput
                        label={`${formData.cryptoType} Wallet Address`}
                        type="text"
                        placeholder="Enter your wallet address"
                        value={formData.walletAddress}
                        onChange={(e) =>
                          setFormData({ ...formData, walletAddress: e.target.value })
                        }
                        error={errors.walletAddress}
                        data-testid="input-wallet"
                      />

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <Wallet className="w-5 h-5 text-amber-400 mt-0.5" />
                        <p className="text-sm text-amber-200/80">
                          Make sure your wallet address is correct. Transactions sent to wrong
                          addresses cannot be recovered.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "paypal_payment" && (
                  <motion.div
                    key="paypal_payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-xl font-semibold text-white mb-6">
                      PayPal Payment Instructions
                    </h2>

                    <div className="space-y-5">
                      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/50 text-sm mb-2">Send payment to:</div>
                        <div className="text-xl font-semibold text-white break-all">
                          {getSetting("paypalEmail", "payment@example.com")}
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/50 text-sm mb-2">Amount to send:</div>
                        <div className="text-xl font-semibold text-white">
                          ${parseFloat(formData.amount).toLocaleString()} {formData.currency}
                        </div>
                      </div>

                      <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                        <div className="text-emerald-400 text-sm mb-2 font-medium">Add this note when sending:</div>
                        <div className="text-lg font-mono font-semibold text-white bg-black/30 p-3 rounded-lg select-all">
                          {referenceCode}
                        </div>
                        <p className="text-emerald-300/70 text-xs mt-2">
                          Copy and paste this code into the PayPal payment note
                        </p>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <div className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-amber-200 mb-1">
                            Important: Send as "Friends and Family"
                          </p>
                          <p className="text-sm text-amber-200/70">
                            You must select "Sending to a friend" or "Friends and Family" option when making the payment. 
                            Payments sent as "Goods and Services" will be refunded and your order cancelled.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3 p-5 rounded-xl bg-white/5 border border-white/10 mt-6" data-testid="status-pending">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" data-testid="spinner-pending" />
                        <span className="text-lg font-medium text-white" data-testid="text-pending">Pending</span>
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
                      Confirm Your Exchange
                    </h2>

                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-white/5 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/50">Amount</span>
                          <span className="text-white font-medium">
                            ${parseFloat(formData.amount).toLocaleString()} {formData.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">You Receive</span>
                          <span className="text-white font-medium">
                            {estimatedCrypto} {formData.cryptoType}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Payment Method</span>
                          <span className="text-white font-medium capitalize">
                            {formData.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Email</span>
                          <span className="text-white font-medium">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Wallet</span>
                          <span className="text-white font-medium text-sm truncate max-w-[200px]">
                            {formData.walletAddress}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <Mail className="w-5 h-5 text-emerald-400 mt-0.5" />
                        <p className="text-sm text-emerald-200/80">
                          You will receive confirmation and payment instructions via email.
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
                      Exchange Created!
                    </h2>
                    <p className="text-white/60 mb-8">
                      Check your email for payment instructions
                    </p>

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
                        data-testid="button-new-exchange"
                      >
                        Create Another Exchange
                      </GlassButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {step !== "success" && step !== "paypal_payment" && (
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
                  {step !== "amount" && (
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
                    disabled={createTransaction.isPending}
                    shimmer
                    data-testid="button-next"
                  >
                    {createTransaction.isPending ? (
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
                        Confirm Exchange
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
