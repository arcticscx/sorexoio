import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Activity, Wifi, WifiOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GlassPill } from "./glass/GlassPill";
import { GlassCard } from "./glass/GlassCard";
import { TransactionCard } from "./TransactionCard";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { Transaction, PaymentMethod } from "@shared/schema";

interface TransactionFeedProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const filterOptions = [
  { value: "all", label: "All" },
  { value: "paypal", label: "PayPal" },
  { value: "card", label: "Card" },
  { value: "crypto", label: "Crypto" },
];

export function TransactionFeed({ transactions: initialTransactions, isLoading = false }: TransactionFeedProps) {
  const [filter, setFilter] = useState("all");
  const [isPaused, setIsPaused] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [liveTransactions, setLiveTransactions] = useState<Transaction[]>(initialTransactions);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: paymentMethods = [] } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  useEffect(() => {
    setLiveTransactions(initialTransactions);
  }, [initialTransactions]);

  const handleWebSocketMessage = useCallback((data: { type: string; data: Transaction }) => {
    if (data.type === "transaction") {
      setLiveTransactions((prev) => {
        const exists = prev.some((t) => t.id === data.data.id);
        if (exists) {
          return prev.map((t) => (t.id === data.data.id ? data.data : t));
        }
        return [data.data, ...prev];
      });
    }
  }, []);

  useWebSocket({
    onMessage: handleWebSocketMessage,
    onOpen: () => setIsConnected(true),
    onClose: () => setIsConnected(false),
    onError: () => setIsConnected(false),
  });

  const filteredTransactions = liveTransactions.filter((t) => {
    if (filter === "all") return true;
    const method = t.paymentMethod.toLowerCase();
    if (filter === "crypto") {
      return ["bitcoin", "ethereum", "crypto", "btc", "eth"].includes(method);
    }
    return method.includes(filter);
  });

  useEffect(() => {
    if (isPaused || !containerRef.current || filteredTransactions.length === 0) return;

    const container = containerRef.current;
    let animationId: number;
    let position = 0;

    const scroll = () => {
      position += 0.5;
      if (position >= container.scrollHeight - container.clientHeight) {
        position = 0;
      }
      container.scrollTop = position;
      animationId = requestAnimationFrame(scroll);
    };

    const timer = setTimeout(() => {
      animationId = requestAnimationFrame(scroll);
    }, 3000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
    };
  }, [isPaused, filteredTransactions.length]);

  return (
    <GlassCard 
      className="p-6" 
      hover={false}
      data-testid="transaction-feed"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">Live Transactions</h3>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                isConnected 
                  ? "bg-emerald-500/20 text-emerald-300" 
                  : "bg-amber-500/20 text-amber-300"
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    <span>Polling</span>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-white/50">Real-time exchange activity</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GlassPill
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </motion.div>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        data-testid="transaction-list"
      >
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <TransactionCard 
                key={transaction.id} 
                transaction={transaction}
                index={index}
                paymentMethods={paymentMethods}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Activity className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50">No transactions yet</p>
              <p className="text-white/30 text-sm mt-1">New exchanges will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
