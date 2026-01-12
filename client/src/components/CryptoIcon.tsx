const CRYPTO_SVGS: Record<string, string> = {
  BTC: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path d="M22.5 13.5c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.6-1.6-.4-.7 2.7c-.3-.1-.7-.2-1-.3v-.1l-2.2-.5-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 .1.1.1.1.2h-.1l-1.1 4.5c-.1.2-.3.5-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.1.5c.4.1.8.2 1.1.3l-.7 2.8 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.8c2.9.5 5.1.3 6-2.3.7-2.1-.1-3.3-1.5-4.1 1.1-.2 1.9-1 2.1-2.5zm-3.8 5.3c-.5 2.1-4 1-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.4c-.5 1.9-3.4.9-4.3.7l.8-3.3c.9.2 4 .6 3.5 2.6z" fill="#fff"/></svg>`,
  ETH: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path d="M16 4v8.9l7.5 3.3L16 4z" fill="#fff" fill-opacity=".6"/><path d="M16 4l-7.5 12.2L16 12.9V4z" fill="#fff"/><path d="M16 21.9v6.1l7.5-10.4-7.5 4.3z" fill="#fff" fill-opacity=".6"/><path d="M16 28v-6.1l-7.5-4.3L16 28z" fill="#fff"/><path d="M16 20.6l7.5-4.4L16 12.9v7.7z" fill="#fff" fill-opacity=".2"/><path d="M8.5 16.2l7.5 4.4v-7.7l-7.5 3.3z" fill="#fff" fill-opacity=".6"/></svg>`,
  LTC: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#345D9D"/><path d="M10 23.1l1.3-4.9-2 .8.5-2 2-.8 2.5-9.3h5l-1.8 6.8 2-.8-.5 2-2 .8-1 3.9h7.5l-.7 3.5H10z" fill="#fff"/></svg>`,
  SOL: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="url(#sol)"/><defs><linearGradient id="sol" x1="0" y1="32" x2="32" y2="0"><stop stop-color="#9945FF"/><stop offset="1" stop-color="#14F195"/></linearGradient></defs><path d="M9.5 19.5a.5.5 0 01.4-.2h12.7c.2 0 .4.3.2.5l-2.1 2.1a.5.5 0 01-.4.2H7.6c-.2 0-.4-.3-.2-.5l1.9-2.1h.2zm0-7a.5.5 0 01.4-.2h12.7c.2 0 .4.3.2.5l-2.1 2.1a.5.5 0 01-.4.2H7.6c-.2 0-.4-.3-.2-.5l1.9-2.1h.2zm12.8 3.3a.5.5 0 00-.4-.2H9.2c-.2 0-.4.3-.2.5l2.1 2.1c.1.1.2.2.4.2h12.7c.2 0 .4-.3.2-.5l-1.9-2.1h-.2z" fill="#fff"/></svg>`,
  USDT: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M17.9 17.1v-.1c-.1 0-.6 0-1.9 0s-1.7 0-1.9.1c-3.7.2-6.5 1-6.5 2s2.8 1.8 6.5 2c.2 0 .6 0 1.9 0s1.8 0 1.9-.1c3.7-.2 6.5-1 6.5-2 0-.9-2.8-1.7-6.5-1.9zm0-2.6V13H22v-3H10v3h4.1v1.5c-4.2.2-7.4 1.2-7.4 2.5s3.2 2.3 7.4 2.5v5.5h3.8v-5.5c4.2-.2 7.4-1.2 7.4-2.5s-3.2-2.3-7.4-2.5z" fill="#fff"/></svg>`,
  XRP: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#23292F"/><path d="M22.5 8h2.3l-5.4 5.3a4.8 4.8 0 01-6.8 0L7.2 8h2.3l4.1 4a2.7 2.7 0 003.8 0L22.5 8zM9.5 24H7.2l5.4-5.3a4.8 4.8 0 016.8 0l5.4 5.3h-2.3l-4.1-4a2.7 2.7 0 00-3.8 0l-5.1 4z" fill="#fff"/></svg>`,
  BNB: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path d="M12.1 14.1L16 10.2l3.9 3.9 2.3-2.3L16 5.5l-6.2 6.3 2.3 2.3zm-6.6 1.9l2.3-2.3 2.3 2.3-2.3 2.3-2.3-2.3zm6.6 1.9L16 21.8l3.9-3.9 2.3 2.3L16 26.5l-6.2-6.3 2.3-2.3zm8.8-1.9l2.3-2.3 2.3 2.3-2.3 2.3-2.3-2.3zM18.3 16L16 13.7 14.3 15.4l-.2.2-.4.4 2.3 2.3 2.3-2.3z" fill="#fff"/></svg>`,
  BCH: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#8DC351"/><path d="M22.1 13.5c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.6-.4-.7 2.6c-.4-.1-.9-.2-1.3-.3l.7-2.6-1.6-.4-.7 2.7c-.3-.1-.7-.2-1-.3v-.1l-2.2-.5-.4 1.7s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.2c0 .1.1.1.1.2h-.1l-1.1 4.5c-.1.2-.3.5-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.1.5c.4.1.8.2 1.1.3l-.7 2.8 1.6.4.7-2.7c.4.1.9.2 1.3.3l-.7 2.7 1.6.4.7-2.8c2.9.5 5.1.3 6-2.3.7-2.1-.1-3.3-1.5-4.1 1.1-.2 1.9-1 2.1-2.5zm-3.8 5.3c-.5 2.1-4 1-5.1.7l.9-3.7c1.1.3 4.7.8 4.2 3zm.5-5.4c-.5 1.9-3.4.9-4.3.7l.8-3.3c.9.2 4 .6 3.5 2.6z" fill="#fff"/></svg>`,
  USDC: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#2775CA"/><path d="M20.5 18.5c0-2-1.2-2.7-3.6-3-.7-.2-2.4-.2-2.4-1.3s.8-1.3 1.7-1.3 1.8.4 2.1 1.2l1.6-.7c-.4-1.2-1.6-2-3.1-2.2V9.5h-1.6v1.6c-1.8.3-2.9 1.4-2.9 2.9 0 2 1.2 2.6 3.2 2.9 1.5.2 2.8.4 2.8 1.5 0 .9-.8 1.4-2 1.4-1.3 0-2.2-.5-2.5-1.5l-1.7.6c.5 1.4 1.8 2.2 3.4 2.4V23h1.6v-1.6c2-.3 3.4-1.4 3.4-2.9z" fill="#fff"/><path d="M13 24.8a9 9 0 010-17.6V5.5a10.5 10.5 0 000 21v-1.7zm6 0v1.7a10.5 10.5 0 000-21v1.7a9 9 0 010 17.6z" fill="#fff"/></svg>`,
  TRX: `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#EF0027"/><path d="M22.8 10.2L9.5 7.5c-.2 0-.4 0-.4.2s0 .3.1.4l8.3 7.2-5.8 8.2c-.1.2-.1.4.1.5.1.1.2.1.3.1h.2l12.3-9.6c.2-.1.2-.3.1-.5l-1.9-3.8z" fill="#fff"/></svg>`,
};

const CRYPTO_ALIASES: Record<string, string> = {
  btc: 'BTC', bitcoin: 'BTC',
  eth: 'ETH', ethereum: 'ETH',
  ltc: 'LTC', litecoin: 'LTC',
  sol: 'SOL', solana: 'SOL',
  usdt: 'USDT', tether: 'USDT',
  xrp: 'XRP', ripple: 'XRP', Ripple: 'XRP',
  bnb: 'BNB',
  bch: 'BCH', 'bitcoin cash': 'BCH',
  usdc: 'USDC',
  trx: 'TRX', tron: 'TRX', TRON: 'TRX',
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
  const normalizedSymbol = CRYPTO_ALIASES[symbol] || CRYPTO_ALIASES[symbol.toLowerCase()] || symbol.toUpperCase();
  const svgContent = CRYPTO_SVGS[normalizedSymbol];
  
  if (!svgContent) {
    return null;
  }

  return (
    <div
      className={`${sizeClasses[size]} ${className}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export function getCryptoIconSrc(symbol: string): string | null {
  const normalizedSymbol = CRYPTO_ALIASES[symbol] || CRYPTO_ALIASES[symbol.toLowerCase()] || symbol.toUpperCase();
  const svgContent = CRYPTO_SVGS[normalizedSymbol];
  
  if (!svgContent) {
    return null;
  }
  
  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
}
