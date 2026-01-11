import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, CheckCircle, XCircle, Clock, ArrowLeft, Shield } from "lucide-react";
import { GlassCard, GlassButton, GlassInput, PrismaticBackground, GlassNavbar } from "@/components/glass";
import { CryptoIcon } from "@/components/CryptoIcon";
import type { Transaction } from "@shared/schema";

export default function Verify() {
  const [searchId, setSearchId] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const { data: transaction, isLoading, isError } = useQuery<Transaction>({
    queryKey: ["/api/transactions", submittedId],
    queryFn: async () => {
      const res = await fetch(`/api/transactions/${submittedId}`);
      if (!res.ok) {
        throw new Error("Transaction not found");
      }
      return res.json();
    },
    enabled: !!submittedId,
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setSubmittedId(searchId.trim());
    }
  };

  const handleClear = () => {
    setSearchId("");
    setSubmittedId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case "pending":
        return <Clock className="w-6 h-6 text-amber-400" />;
      case "failed":
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Clock className="w-6 h-6 text-white/50" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30";
      case "pending":
        return "text-amber-400 bg-amber-500/20 border-amber-500/30";
      case "failed":
        return "text-red-400 bg-red-500/20 border-red-500/30";
      default:
        return "text-white/50 bg-white/10 border-white/20";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen relative">
      <PrismaticBackground />
      <GlassNavbar />

      <main className="relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Verify Transaction
              </h1>
              <p className="text-white/60">
                Enter a transaction ID to verify it's legitimate
              </p>
            </div>

            <GlassCard className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <GlassInput
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Paste transaction ID here..."
                    className="pr-12"
                    data-testid="input-transaction-id"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    data-testid="button-search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                <GlassButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={!searchId.trim() || isLoading}
                  shimmer
                  data-testid="button-verify"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Verify Transaction
                    </>
                  )}
                </GlassButton>
              </form>

              <AnimatePresence mode="wait">
                {submittedId && !isLoading && (
                  <motion.div
                    key={submittedId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    {isError || !transaction ? (
                      <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-red-400 mb-1">
                          Transaction Not Found
                        </h3>
                        <p className="text-red-300/70 text-sm mb-4">
                          No transaction exists with this ID. It may be invalid or fake.
                        </p>
                        <GlassButton
                          variant="ghost"
                          onClick={handleClear}
                          data-testid="button-try-again"
                        >
                          Try Another ID
                        </GlassButton>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                          <div>
                            <h3 className="text-emerald-400 font-semibold">
                              Verified Transaction
                            </h3>
                            <p className="text-emerald-300/70 text-sm">
                              This transaction exists in our system
                            </p>
                          </div>
                        </div>

                        <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-4" data-testid="transaction-details">
                          <div className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Status</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Amount</span>
                            <span className="text-white font-semibold">
                              ${transaction.amount?.toLocaleString()} {transaction.currency}
                            </span>
                          </div>

                          {transaction.cryptoAmount && transaction.cryptoType && (
                            <div className="flex items-center justify-between">
                              <span className="text-white/50 text-sm">Crypto</span>
                              <div className="flex items-center gap-2">
                                <CryptoIcon symbol={transaction.cryptoType} className="w-5 h-5" />
                                <span className="text-white font-semibold">
                                  {transaction.cryptoAmount.toFixed(8)} {transaction.cryptoType}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-white/50 text-sm">Payment Method</span>
                            <span className="text-white capitalize">
                              {transaction.paymentMethod}
                            </span>
                          </div>

                          {transaction.createdAt && (
                            <div className="flex items-center justify-between">
                              <span className="text-white/50 text-sm">Date</span>
                              <span className="text-white">
                                {formatDate(transaction.createdAt)}
                              </span>
                            </div>
                          )}

                          <div className="pt-3 border-t border-white/10">
                            <div className="text-white/50 text-xs mb-1">Transaction ID</div>
                            <div className="text-white/80 font-mono text-sm break-all">
                              {transaction.id}
                            </div>
                          </div>
                        </div>

                        <GlassButton
                          variant="ghost"
                          onClick={handleClear}
                          className="w-full"
                          data-testid="button-verify-another"
                        >
                          Verify Another Transaction
                        </GlassButton>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>

            <div className="mt-6 text-center">
              <Link href="/">
                <GlassButton variant="ghost" data-testid="link-back-home">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
