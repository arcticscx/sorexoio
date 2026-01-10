import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Wallet, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { CryptoIcon } from "./CryptoIcon";
import type { Transaction, PaymentMethod } from "@shared/schema";

import cardIcon from "@assets/ARCTIC_1768071339190.png";
import paypalIcon from "@assets/ARCTIC_1768071353413.png";

interface TransactionCardProps {
  transaction: Transaction;
  index?: number;
  paymentMethods?: PaymentMethod[];
}

const paymentLabels: Record<string, string> = {
  card: "Card",
  paypal: "PayPal",
  bank: "Bank",
};

function PaymentIcon({ type }: { type: string }) {
  const key = type.toLowerCase();
  
  if (key === "card") {
    return <img src={cardIcon} alt="Card" className="w-5 h-5 object-contain rounded" />;
  }
  if (key === "paypal") {
    return <img src={paypalIcon} alt="PayPal" className="w-5 h-5 object-contain rounded" />;
  }
  if (key === "bank") {
    return <Wallet className="w-5 h-5 text-emerald-400" />;
  }
  return <DollarSign className="w-5 h-5 text-emerald-400" />;
}

const statusStyles: Record<string, string> = {
  pending: "status-pending",
  completed: "status-completed",
  failed: "status-failed",
  processing: "status-processing",
};

function formatAmount(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatTimeAgo(date: Date | string | null): string {
  if (!date) return "Just now";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString();
}

export const TransactionCard = forwardRef<HTMLDivElement, TransactionCardProps>(
  function TransactionCard({ transaction, index = 0, paymentMethods = [] }, ref) {
    const paymentKey = transaction.paymentMethod.toLowerCase();
    const customPaymentMethod = paymentMethods.find(pm => pm.key === paymentKey);
    
    const icon = customPaymentMethod?.icon ? (
      <img src={customPaymentMethod.icon} alt={customPaymentMethod.name} className="w-5 h-5 object-cover rounded" />
    ) : (
      <PaymentIcon type={paymentKey} />
    );

    return (
      <motion.div
        ref={ref}
        className="glass-card p-4 flex items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.05,
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        whileHover={{ 
          y: -2, 
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" 
        }}
        layout
        data-testid={`transaction-card-${transaction.id}`}
      >
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-lg">
              {formatAmount(transaction.amount, transaction.currency)}
            </span>
            {transaction.cryptoAmount && transaction.cryptoType && (
              <span className="text-white/50 text-sm flex items-center gap-1">
                →
                <CryptoIcon symbol={transaction.cryptoType} size="sm" />
                {transaction.cryptoAmount.toFixed(6)} {transaction.cryptoType}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-white/50 text-sm">
              {paymentLabels[paymentKey] || transaction.paymentMethod}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-white/40 text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(transaction.createdAt)}
            </span>
          </div>
        </div>

        <div className={cn("status-badge", statusStyles[transaction.status] || statusStyles.pending)}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          <span className="capitalize">{transaction.status}</span>
        </div>
      </motion.div>
    );
  }
);
