export interface MemeToken {
  address: string;
  name: string;
  symbol: string;
  logoUrl?: string;
  price: number;
  priceChange1h?: number;
  priceChange6h?: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
  holders?: number;
  bscscanUrl: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  priceHistory?: PricePoint[];
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
  };
  priceChange: {
    h24: number;
  };
  liquidity?: {
    usd?: number;
  };
  fdv?: number;
  marketCap?: number;
  info?: {
    imageUrl?: string;
    websites?: { url: string }[];
    socials?: { type: string; url: string }[];
  };
}
