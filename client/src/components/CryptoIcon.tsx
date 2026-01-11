import btcIcon from "@assets/Copy_of_crypto_icons_-_btc_1768070926134.png";
import ethIcon from "@assets/Copy_of_crypto_icons_-_eth_1768070926134.png";
import ltcIcon from "@assets/ltc_1768174820231.png";
import solIcon from "@assets/Copy_of_crypto_icons_-_sol_1768070926134.png";
import usdtIcon from "@assets/Copy_of_crypto_icons_-_usdt_1768070926134.png";
import xrpIcon from "@assets/Copy_of_crypto_icons_-_btc_(2)_1768070926134.png";
import bnbIcon from "@assets/bnb_1768174820230.png";
import bchIcon from "@assets/btc_cash_1768174820230.png";
import usdcIcon from "@assets/usdc_1768174820231.png";
import rippleIcon from "@assets/ripple_1768174820231.png";
import tronIcon from "@assets/tron_1768174820231.png";

const cryptoIcons: Record<string, string> = {
  BTC: btcIcon,
  btc: btcIcon,
  bitcoin: btcIcon,
  ETH: ethIcon,
  eth: ethIcon,
  ethereum: ethIcon,
  LTC: ltcIcon,
  ltc: ltcIcon,
  litecoin: ltcIcon,
  SOL: solIcon,
  sol: solIcon,
  solana: solIcon,
  USDT: usdtIcon,
  usdt: usdtIcon,
  tether: usdtIcon,
  XRP: xrpIcon,
  xrp: xrpIcon,
  BNB: bnbIcon,
  bnb: bnbIcon,
  BCH: bchIcon,
  bch: bchIcon,
  "bitcoin cash": bchIcon,
  USDC: usdcIcon,
  usdc: usdcIcon,
  ripple: rippleIcon,
  Ripple: rippleIcon,
  TRX: tronIcon,
  trx: tronIcon,
  tron: tronIcon,
  TRON: tronIcon,
};

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
  const iconSrc = cryptoIcons[symbol] || cryptoIcons[symbol.toUpperCase()];
  
  if (!iconSrc) {
    return null;
  }

  return (
    <img
      src={iconSrc}
      alt={symbol}
      className={`${sizeClasses[size]} object-contain rounded ${className}`}
      draggable={false}
    />
  );
}

export function getCryptoIconSrc(symbol: string): string | null {
  return cryptoIcons[symbol] || cryptoIcons[symbol.toUpperCase()] || null;
}
