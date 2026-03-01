import { Bitcoin, Coins, CircleDollarSign } from "lucide-react";

interface CryptoIconProps {
  symbol: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function CryptoIcon({ symbol, size = "md", className = "" }: CryptoIconProps) {
  const s = symbol.toLowerCase();
  
  if (s === "btc" || s === "bitcoin") {
    return <Bitcoin className={`${sizeClasses[size]} text-orange-400 ${className}`} />;
  }

  if (s === "usdt" || s === "usdc") {
    return <CircleDollarSign className={`${sizeClasses[size]} text-emerald-400 ${className}`} />;
  }
  
  return <Coins className={`${sizeClasses[size]} text-purple-400 ${className}`} />;
}

export function getCryptoIconSrc(symbol: string): string | null {
  return null;
}
