import axios from 'axios';
import { DexScreenerPair, MemeToken } from '@/types';
import { getChineseMemeTokenAddresses, getTokenInfoByAddress } from './chinese-meme-tokens';

const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

// 从中文 meme 币配置获取地址
const POPULAR_MEME_TOKENS = getChineseMemeTokenAddresses();

// 中文 meme 币关键词
const CHINESE_MEME_KEYWORDS = [
  'babydog', 'floki', 'shib', 'doge', 'pepe',
  'babydoge', 'kishu', 'akita', 'hokkaido'
];

export async function fetchBNBMemeTokens(): Promise<MemeToken[]> {
  try {
    // Fetch trending tokens from BNB Chain
    const response = await axios.get(`${DEXSCREENER_API}/search?q=BSC`);

    if (!response.data || !response.data.pairs) {
      return [];
    }

    const pairs: DexScreenerPair[] = response.data.pairs;

    // Filter for BNB Chain (BSC) tokens and convert to MemeToken format
    const tokens: MemeToken[] = pairs
      .filter((pair: DexScreenerPair) => pair.chainId === 'bsc')
      .filter((pair: DexScreenerPair) => pair.priceUsd) // Only tokens with price data
      .slice(0, 50) // Limit to top 50
      .map((pair: DexScreenerPair) => convertPairToToken(pair));

    return tokens;
  } catch (error) {
    console.error('Error fetching meme tokens:', error);
    return [];
  }
}

export async function fetchTokenByAddress(address: string): Promise<MemeToken | null> {
  try {
    const response = await axios.get(`${DEXSCREENER_API}/tokens/${address}`);

    if (!response.data || !response.data.pairs || response.data.pairs.length === 0) {
      return null;
    }

    const pair: DexScreenerPair = response.data.pairs[0];
    return convertPairToToken(pair);
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
}

export async function fetchTrendingBSCTokens(): Promise<MemeToken[]> {
  try {
    console.log('Starting to fetch BSC tokens with hybrid strategy...');

    // 使用混合 API 策略
    const { fetchChineseMemeTokens, searchBSCMemeTokens } = await import('./hybrid-api');

    // Method 1: 获取配置的中文 meme 币（优先使用 PancakeSwap）
    const popularTokens = await fetchChineseMemeTokens();
    console.log(`Fetched ${popularTokens.length} configured tokens`);

    // Method 2: 搜索热门 meme 币关键词
    const searchTokens = await searchBSCMemeTokens(CHINESE_MEME_KEYWORDS);
    console.log(`Fetched ${searchTokens.length} search tokens`);

    // Combine and deduplicate
    const allTokens = [...popularTokens, ...searchTokens];
    const uniqueTokens = Array.from(
      new Map(allTokens.map(t => [t.address.toLowerCase(), t])).values()
    );

    console.log(`Total unique tokens: ${uniqueTokens.length}`);

    // If no tokens found, return demo data
    if (uniqueTokens.length === 0) {
      console.log('No tokens found, returning demo data');
      return getDemoTokens();
    }

    return uniqueTokens.slice(0, 30);
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return getDemoTokens();
  }
}

function getDemoTokens(): MemeToken[] {
  return [
    {
      address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
      name: 'SHIBA INU',
      symbol: 'SHIB',
      price: 0.00000856,
      priceChange24h: 2.45,
      marketCap: 5045000000,
      volume24h: 123000000,
      liquidity: 45000000,
      bscscanUrl: 'https://bscscan.com/token/0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
    },
    {
      address: '0xfb5B838b6cfEEdC2873aB27866079AC55363D37E',
      name: 'FLOKI',
      symbol: 'FLOKI',
      price: 0.00004123,
      priceChange24h: -1.23,
      marketCap: 394000000,
      volume24h: 34000000,
      liquidity: 12000000,
      bscscanUrl: 'https://bscscan.com/token/0xfb5B838b6cfEEdC2873aB27866079AC55363D37E',
    },
    {
      address: '0xc748673057861a797275CD8A068AbB95A902e8de',
      name: 'Baby Doge Coin',
      symbol: 'BabyDoge',
      price: 0.0000000024,
      priceChange24h: 5.67,
      marketCap: 158000000,
      volume24h: 8500000,
      liquidity: 3500000,
      bscscanUrl: 'https://bscscan.com/token/0xc748673057861a797275CD8A068AbB95A902e8de',
    },
  ];
}

function convertPairToToken(pair: DexScreenerPair): MemeToken {
  const token = pair.baseToken;
  const price = parseFloat(pair.priceUsd || '0');
  const priceChange24h = pair.priceChange?.h24 || 0;
  const marketCap = pair.marketCap || pair.fdv || 0;
  const volume24h = pair.volume?.h24 || 0;
  const liquidity = pair.liquidity?.usd || 0;

  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    logoUrl: pair.info?.imageUrl,
    price,
    priceChange24h,
    marketCap,
    volume24h,
    liquidity,
    bscscanUrl: `https://bscscan.com/token/${token.address}`,
    website: pair.info?.websites?.[0]?.url,
    twitter: pair.info?.socials?.find(s => s.type === 'twitter')?.url,
    telegram: pair.info?.socials?.find(s => s.type === 'telegram')?.url,
  };
}

export function formatNumber(num: number): string {
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  return `$${num.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  if (price < 0.000001) {
    return `$${price.toExponential(2)}`;
  }
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  }
  if (price < 1) {
    return `$${price.toFixed(4)}`;
  }
  return `$${price.toFixed(2)}`;
}
