import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, Copy, Check, AlertCircle, ChevronDown, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/glass/GlassCard";
import { GlassButton } from "@/components/glass/GlassButton";
import { GlassInput } from "@/components/glass/GlassInput";
import { GlassNavbar } from "@/components/glass/GlassNavbar";
import { PrismaticBackground } from "@/components/glass/PrismaticBackground";
import { CryptoIcon } from "@/components/CryptoIcon";
import { useToast } from "@/hooks/use-toast";
import type { SwapWallet } from "@shared/schema";

interface PriceData {
  [key: string]: number;
}

const SWAP_FEE = 0.002; // 0.2% fee
const MIN_SWAP_USD = 50; // Minimum $50 swap
const MAX_SWAP_USD = 1000000; // Maximum $1,000,000 swap

export default function Swap() {
  const { toast } = useToast();
  const [fromCrypto, setFromCrypto] = useState<SwapWallet | null>(null);
  const [toCrypto, setToCrypto] = useState<SwapWallet | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [receiveAddress, setReceiveAddress] = useState("");
  const [copied, setCopied] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [step, setStep] = useState<"select" | "address" | "confirm" | "send">("select");

  const { data: swapWallets = [], isLoading: walletsLoading } = useQuery<SwapWallet[]>({
    queryKey: ["/api/swap-wallets"],
  });

  const { data: prices = {}, isLoading: pricesLoading } = useQuery<PriceData>({
    queryKey: ["/api/prices"],
    refetchInterval: 60000,
  });

  const activeWallets = useMemo(() => 
    swapWallets.filter(w => w.isActive), 
    [swapWallets]
  );

  const getPrice = (symbol: string): number => {
    return prices[symbol.toUpperCase()] || 0;
  };

  const fromPrice = fromCrypto ? getPrice(fromCrypto.cryptoSymbol) : 0;
  const toPrice = toCrypto ? getPrice(toCrypto.cryptoSymbol) : 0;

  const fromAmountNum = parseFloat(fromAmount) || 0;
  const fromValueUsd = fromAmountNum * fromPrice;
  const feeUsd = fromValueUsd * SWAP_FEE;
  const netValueUsd = fromValueUsd - feeUsd;
  const toAmount = toPrice > 0 ? netValueUsd / toPrice : 0;

  const handleCopy = async () => {
    if (!fromCrypto) return;
    try {
      await navigator.clipboard.writeText(fromCrypto.walletAddress);
      setCopied(true);
      toast({ title: "Address copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const swapCryptos = () => {
    const temp = fromCrypto;
    setFromCrypto(toCrypto);
    setToCrypto(temp);
    setFromAmount("");
  };

  const canProceed = fromCrypto && toCrypto && fromCrypto.id !== toCrypto.id && fromAmountNum > 0 && fromValueUsd >= MIN_SWAP_USD && fromValueUsd <= MAX_SWAP_USD;
  const belowMinimum = fromAmountNum > 0 && fromValueUsd < MIN_SWAP_USD;
  const aboveMaximum = fromAmountNum > 0 && fromValueUsd > MAX_SWAP_USD;

  const renderCryptoSelector = (
    selected: SwapWallet | null,
    onSelect: (w: SwapWallet) => void,
    showDropdown: boolean,
    setShowDropdown: (show: boolean) => void,
    exclude: SwapWallet | null,
    label: string,
    testIdPrefix: string
  ) => (
    <div className="relative">
      <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full flex items-center justify-between gap-3 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all"
        data-testid={`${testIdPrefix}-selector`}
      >
        {selected ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center overflow-hidden">
              <CryptoIcon symbol={selected.cryptoSymbol} size="md" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">{selected.cryptoName}</div>
              <div className="text-white/50 text-sm">{selected.cryptoSymbol}</div>
            </div>
          </div>
        ) : (
          <span className="text-white/50">Select cryptocurrency</span>
        )}
        <ChevronDown className={`w-5 h-5 text-white/50 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-20 w-full mt-2 rounded-xl bg-gray-900/95 border border-white/20 backdrop-blur-xl overflow-hidden shadow-2xl"
          >
            <div className="max-h-64 overflow-y-auto">
              {activeWallets
                .filter(w => !exclude || w.id !== exclude.id)
                .map(wallet => (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => {
                      onSelect(wallet);
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-white/10 transition-all"
                    data-testid={`${testIdPrefix}-option-${wallet.cryptoSymbol.toLowerCase()}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center overflow-hidden">
                      <CryptoIcon symbol={wallet.cryptoSymbol} size="md" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-white">{wallet.cryptoName}</div>
                      <div className="text-white/50 text-sm">{wallet.cryptoSymbol}</div>
                    </div>
                    {getPrice(wallet.cryptoSymbol) > 0 && (
                      <div className="text-white/50 text-sm">
                        ${getPrice(wallet.cryptoSymbol).toLocaleString()}
                      </div>
                    )}
                  </button>
                ))}
              {activeWallets.filter(w => !exclude || w.id !== exclude.id).length === 0 && (
                <div className="p-4 text-center text-white/50">No cryptocurrencies available</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (walletsLoading || pricesLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <PrismaticBackground />
        <GlassNavbar />
        <div className="relative z-10 pt-24 pb-12 px-4">
          <div className="max-w-lg mx-auto flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-white/50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PrismaticBackground />
      <GlassNavbar />
      
      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Swap Crypto
            </h1>
            <p className="text-white/60">
              Exchange between cryptocurrencies with just 0.2% fee
            </p>
          </motion.div>

          {activeWallets.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Swap Not Available</h3>
              <p className="text-white/60">
                Crypto swapping is currently unavailable. Please check back later.
              </p>
            </GlassCard>
          ) : (
            <AnimatePresence mode="wait">
              {step === "select" && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <GlassCard className="p-6" hover={false}>
                    <div className="space-y-4">
                      {renderCryptoSelector(
                        fromCrypto,
                        setFromCrypto,
                        showFromDropdown,
                        setShowFromDropdown,
                        toCrypto,
                        "You Send",
                        "from"
                      )}

                      <div>
                        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                          Amount
                        </label>
                        <GlassInput
                          type="number"
                          placeholder="0.00"
                          value={fromAmount}
                          onChange={(e) => setFromAmount(e.target.value)}
                          className="text-xl"
                          data-testid="input-from-amount"
                        />
                        {fromPrice > 0 && fromAmountNum > 0 && (
                          <p className="text-white/50 text-sm mt-2">
                            ≈ ${fromValueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                          </p>
                        )}
                        {belowMinimum && (
                          <p className="text-red-400 text-sm mt-2">
                            Minimum swap amount is ${MIN_SWAP_USD} USD
                          </p>
                        )}
                        {aboveMaximum && (
                          <p className="text-red-400 text-sm mt-2">
                            Maximum swap amount is ${MAX_SWAP_USD.toLocaleString()} USD
                          </p>
                        )}
                      </div>

                      <div className="flex justify-center py-2">
                        <button
                          type="button"
                          onClick={swapCryptos}
                          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
                          disabled={!fromCrypto || !toCrypto}
                          data-testid="button-swap-direction"
                        >
                          <ArrowDownUp className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {renderCryptoSelector(
                        toCrypto,
                        setToCrypto,
                        showToDropdown,
                        setShowToDropdown,
                        fromCrypto,
                        "You Receive",
                        "to"
                      )}

                      {canProceed && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="rounded-xl bg-white/5 p-4 space-y-2"
                        >
                          <div className="flex justify-between text-sm">
                            <span className="text-white/50">Exchange Rate</span>
                            <span className="text-white">
                              1 {fromCrypto?.cryptoSymbol} = {(toPrice > 0 ? (fromPrice / toPrice).toFixed(6) : '0')} {toCrypto?.cryptoSymbol}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/50">Fee (0.2%)</span>
                            <span className="text-amber-400">
                              ${feeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-semibold border-t border-white/10 pt-2 mt-2">
                            <span className="text-white/70">You'll receive</span>
                            <span className="text-emerald-400">
                              ≈ {toAmount.toFixed(8)} {toCrypto?.cryptoSymbol}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      <GlassButton
                        variant="primary"
                        className="w-full mt-4"
                        disabled={!canProceed}
                        onClick={() => setStep("address")}
                        data-testid="button-continue-swap"
                      >
                        Continue
                      </GlassButton>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {step === "address" && toCrypto && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-semibold text-white mb-2 text-center">
                      Your {toCrypto.cryptoSymbol} Address
                    </h3>
                    <p className="text-white/50 text-sm text-center mb-6">
                      Enter the wallet address where you want to receive your {toCrypto.cryptoName}
                    </p>
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center overflow-hidden">
                          <CryptoIcon symbol={toCrypto.cryptoSymbol} size="md" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{toCrypto.cryptoName}</p>
                          <p className="text-emerald-400 text-sm">≈ {toAmount.toFixed(8)} {toCrypto.cryptoSymbol}</p>
                        </div>
                      </div>

                      <GlassInput
                        label={`Your ${toCrypto.cryptoSymbol} Wallet Address`}
                        placeholder={`Enter your ${toCrypto.cryptoSymbol} address`}
                        value={receiveAddress}
                        onChange={(e) => setReceiveAddress(e.target.value)}
                        data-testid="input-receive-address"
                      />

                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-amber-300 font-medium mb-1">Double-check your address</p>
                            <p className="text-white/70">
                              Make sure this is a valid {toCrypto.cryptoSymbol} address. Sending to an incorrect address may result in permanent loss of funds.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <GlassButton
                          variant="ghost"
                          className="flex-1"
                          onClick={() => setStep("select")}
                          data-testid="button-back-select"
                        >
                          Back
                        </GlassButton>
                        <GlassButton
                          variant="primary"
                          className="flex-1"
                          disabled={!receiveAddress.trim()}
                          onClick={() => setStep("confirm")}
                          data-testid="button-continue-confirm"
                        >
                          Continue
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <GlassCard className="p-6" hover={false}>
                    <h3 className="text-lg font-semibold text-white mb-6 text-center">Confirm Swap Details</h3>
                    
                    <div className="space-y-4">
                      <div className="rounded-xl bg-white/5 p-4">
                        <div className="text-center mb-4">
                          <p className="text-white/50 text-sm">You're sending</p>
                          <p className="text-2xl font-bold text-white mt-1">
                            {fromAmountNum} {fromCrypto?.cryptoSymbol}
                          </p>
                          <p className="text-white/40 text-sm">
                            ≈ ${fromValueUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
                          </p>
                        </div>
                        
                        <div className="flex justify-center py-2">
                          <ArrowDownUp className="w-6 h-6 text-emerald-400" />
                        </div>
                        
                        <div className="text-center">
                          <p className="text-white/50 text-sm">You'll receive</p>
                          <p className="text-2xl font-bold text-emerald-400 mt-1">
                            ≈ {toAmount.toFixed(8)} {toCrypto?.cryptoSymbol}
                          </p>
                          <p className="text-white/40 text-sm">
                            After 0.2% fee
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/5 p-4">
                        <div className="text-sm">
                          <p className="text-white/50 mb-1">Your {toCrypto?.cryptoSymbol} will be sent to:</p>
                          <code className="text-emerald-400 font-mono text-xs break-all">{receiveAddress}</code>
                        </div>
                      </div>

                      <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="text-amber-300 font-medium mb-1">Important</p>
                            <p className="text-white/70">
                              You'll need to send your {fromCrypto?.cryptoSymbol} to the address shown in the next step. 
                              Once received, we'll send your {toCrypto?.cryptoSymbol} to the address above.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <GlassButton
                          variant="ghost"
                          className="flex-1"
                          onClick={() => setStep("address")}
                          data-testid="button-back-address"
                        >
                          Back
                        </GlassButton>
                        <GlassButton
                          variant="primary"
                          className="flex-1"
                          onClick={() => setStep("send")}
                          data-testid="button-proceed-send"
                        >
                          Proceed
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {step === "send" && fromCrypto && (
                <motion.div
                  key="send"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <GlassCard className="p-6" hover={false}>
                    <div className="flex items-center justify-center gap-3 mb-4">
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
                        Send exactly <span className="text-emerald-400 font-semibold">{fromAmountNum} {fromCrypto.cryptoSymbol}</span> to the address below
                      </p>
                    </motion.div>
                    
                    <div className="space-y-6">
                      {fromCrypto.qrCodeImage && (
                        <div className="flex justify-center">
                          <motion.div 
                            className="bg-white p-4 rounded-xl relative"
                            animate={{ boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0)", "0 0 0 8px rgba(16, 185, 129, 0.2)", "0 0 0 0 rgba(16, 185, 129, 0)"] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <img 
                              src={fromCrypto.qrCodeImage} 
                              alt={`${fromCrypto.cryptoSymbol} QR Code`}
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
                          Send {fromCrypto.cryptoSymbol} to this address
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-black/30 rounded-lg p-3 text-sm text-white font-mono break-all">
                            {fromCrypto.walletAddress}
                          </code>
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={handleCopy}
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
                          <span className="text-white font-semibold">{fromAmountNum} {fromCrypto.cryptoSymbol}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/50">You'll receive</span>
                          <span className="text-emerald-400 font-semibold">≈ {toAmount.toFixed(8)} {toCrypto?.cryptoSymbol}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/50">Fee</span>
                          <span className="text-amber-400">${feeUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })} (0.2%)</span>
                        </div>
                      </div>

                      <div className="rounded-xl bg-white/5 p-4">
                        <p className="text-white/50 text-xs mb-1">Your {toCrypto?.cryptoSymbol} will be sent to:</p>
                        <code className="text-emerald-400 font-mono text-sm break-all">{receiveAddress}</code>
                      </div>

                      <div className="rounded-xl bg-blue-500/10 border border-blue-500/30 p-4">
                        <p className="text-sm text-blue-300">
                          After sending, please allow up to 30 minutes for confirmation. 
                          Your {toCrypto?.cryptoSymbol} will be sent to the address above once the transaction is verified.
                        </p>
                      </div>

                      <GlassButton
                        variant="ghost"
                        className="w-full"
                        onClick={() => {
                          setStep("select");
                          setFromCrypto(null);
                          setToCrypto(null);
                          setFromAmount("");
                          setReceiveAddress("");
                        }}
                        data-testid="button-new-swap"
                      >
                        Start New Swap
                      </GlassButton>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
